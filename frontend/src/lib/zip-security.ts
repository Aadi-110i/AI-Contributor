/**
 * ZIP File Security Scanner
 * 
 * Protects against:
 * 1. Zip Bombs / Decompression Bombs (excessive expansion ratio, recursive bombs)
 * 2. Zip Slip / Path Traversal attacks (../, absolute paths, system directories)
 * 3. File System Exhaustion (millions of small files, inode saturation)
 * 4. Dangerous / Executable Payloads (.exe, .bat, .cmd, .sh, .dll, etc.)
 * 5. Spoofed / Corrupt Archives (magic byte verification)
 */

export interface ZipSecurityLimits {
    maxFileSize: number;              // Max compressed file size (bytes)
    maxUncompressedSize: number;      // Max total expanded size across all files (bytes)
    maxCompressionRatio: number;      // Max allowed uncompressed/compressed ratio
    maxFileCount: number;             // Max number of files inside the archive
    disallowedExtensions: string[];   // Blacklisted dangerous file extensions
}

export const DEFAULT_SECURITY_LIMITS: ZipSecurityLimits = {
    maxFileSize: 50 * 1024 * 1024,             // 50 MB compressed
    maxUncompressedSize: 250 * 1024 * 1024,    // 250 MB max total expansion
    maxCompressionRatio: 25,                   // Maximum 25:1 ratio (zip bombs often reach 1000:1+)
    maxFileCount: 5000,                        // Maximum 5,000 files in a single module
    disallowedExtensions: [
        '.exe', '.bat', '.cmd', '.com', '.vbs', '.vbe', '.sh', '.bash',
        '.dll', '.so', '.dylib', '.scr', '.pif', '.msi', '.bin',
        // Disallow nested archives to prevent recursive zip bomb attacks
        '.zip', '.tar', '.gz', '.bz2', '.7z', '.rar'
    ],
};

export interface ZipValidationResult {
    safe: boolean;
    error?: string;
    details?: {
        fileCount: number;
        compressedSize: number;
        totalUncompressedSize: number;
        compressionRatio: number;
    };
}

export function validateZipSecurity(
    buffer: Buffer,
    customLimits?: Partial<ZipSecurityLimits>
): ZipValidationResult {
    const limits: ZipSecurityLimits = { ...DEFAULT_SECURITY_LIMITS, ...customLimits };

    // 1. File size check
    if (buffer.length === 0) {
        return { safe: false, error: 'Empty file received' };
    }
    if (buffer.length > limits.maxFileSize) {
        const mb = (limits.maxFileSize / (1024 * 1024)).toFixed(0);
        return {
            safe: false,
            error: `File size exceeds the security limit of ${mb} MB.`
        };
    }

    // 2. Magic bytes check (PK\x03\x04 or PK\x05\x06)
    if (buffer.length < 22) {
        return { safe: false, error: 'Corrupt archive: file is too small to be a valid ZIP.' };
    }
    const isZip = (buffer[0] === 0x50 && buffer[1] === 0x4b && buffer[2] === 0x03 && buffer[3] === 0x04) ||
                  (buffer[0] === 0x50 && buffer[1] === 0x4b && buffer[2] === 0x05 && buffer[3] === 0x06);
    if (!isZip) {
        return {
            safe: false,
            error: 'Security rejection: file magic bytes do not match standard ZIP format (PK).'
        };
    }

    // 3. Locate End of Central Directory (EOCD) from the end of the file
    // The EOCD record signature is 0x06054b50
    let eocdOffset = -1;
    const maxSearch = Math.min(buffer.length - 22, 65557); // 65KB max comment length
    for (let i = buffer.length - 22; i >= buffer.length - maxSearch; i--) {
        if (
            buffer[i] === 0x50 &&
            buffer[i + 1] === 0x4b &&
            buffer[i + 2] === 0x05 &&
            buffer[i + 3] === 0x06
        ) {
            eocdOffset = i;
            break;
        }
    }

    if (eocdOffset === -1) {
        return { safe: false, error: 'Invalid ZIP archive: End of Central Directory not found.' };
    }

    const totalEntries = buffer.readUInt16LE(eocdOffset + 10);
    const cdSize = buffer.readUInt32LE(eocdOffset + 12);
    const cdOffset = buffer.readUInt32LE(eocdOffset + 16);

    if (totalEntries > limits.maxFileCount) {
        return {
            safe: false,
            error: `Archive contains ${totalEntries} entries, exceeding the maximum allowed limit of ${limits.maxFileCount} files.`
        };
    }

    if (cdOffset + cdSize > buffer.length) {
        return { safe: false, error: 'Malformed ZIP archive: Central directory extends beyond file bounds.' };
    }

    // 4. Iterate through Central Directory records without decompressing
    let p = cdOffset;
    let totalUncompressedSize = 0;
    let entryCount = 0;

    while (p + 46 <= cdOffset + cdSize) {
        const signature = buffer.readUInt32LE(p);
        if (signature !== 0x02014b50) {
            break; // End of entries or unknown signature
        }

        entryCount++;
        if (entryCount > limits.maxFileCount) {
            return {
                safe: false,
                error: `Security block: archive contains excessive entries (max: ${limits.maxFileCount}).`
            };
        }

        const compressedSize = buffer.readUInt32LE(p + 20);
        const uncompressedSize = buffer.readUInt32LE(p + 24);
        const fileNameLength = buffer.readUInt16LE(p + 28);
        const extraFieldLength = buffer.readUInt16LE(p + 30);
        const commentLength = buffer.readUInt16LE(p + 32);

        if (p + 46 + fileNameLength > buffer.length) {
            return { safe: false, error: 'Malformed ZIP record: entry filename exceeds buffer bounds.' };
        }

        const fileName = buffer.toString('utf-8', p + 46, p + 46 + fileNameLength);

        // 5. Zip Slip / Path Traversal Check
        const normalized = fileName.replace(/\\/g, '/');
        if (
            normalized.startsWith('/') ||
            normalized.startsWith('../') ||
            normalized.includes('/../') ||
            normalized.endsWith('/..') ||
            /^[a-zA-Z]:/.test(normalized) // Windows drive letter (e.g. C:/)
        ) {
            return {
                safe: false,
                error: `Zip Slip attack detected in entry "${fileName}". Absolute and relative path escapes (../) are forbidden.`
            };
        }

        // 6. Dangerous Executables Check
        const lowerName = fileName.toLowerCase();
        for (const ext of limits.disallowedExtensions) {
            if (lowerName.endsWith(ext)) {
                return {
                    safe: false,
                    error: `Security violation: entry "${fileName}" contains dangerous file type (${ext}). Only source code files are permitted.`
                };
            }
        }

        // Accumulate uncompressed size
        totalUncompressedSize += uncompressedSize;

        // Advance to next entry
        p += 46 + fileNameLength + extraFieldLength + commentLength;
    }

    // 7. Zip Bomb Decompression Checks
    if (totalUncompressedSize > limits.maxUncompressedSize) {
        const maxMb = (limits.maxUncompressedSize / (1024 * 1024)).toFixed(0);
        const actualMb = (totalUncompressedSize / (1024 * 1024)).toFixed(1);
        return {
            safe: false,
            error: `Potential Zip Bomb rejected: uncompressed size (${actualMb} MB) exceeds maximum allowed threshold of ${maxMb} MB.`
        };
    }

    const compressionRatio = buffer.length > 0 ? (totalUncompressedSize / buffer.length) : 0;
    if (compressionRatio > limits.maxCompressionRatio) {
        return {
            safe: false,
            error: `Potential Zip Bomb rejected: abnormal expansion ratio of ${compressionRatio.toFixed(1)}:1 exceeds safety limit (${limits.maxCompressionRatio}:1).`
        };
    }

    return {
        safe: true,
        details: {
            fileCount: entryCount,
            compressedSize: buffer.length,
            totalUncompressedSize,
            compressionRatio: Math.round(compressionRatio * 10) / 10,
        }
    };
}
