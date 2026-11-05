/**
 * ZIP File Security Scanner (CommonJS)
 */

const DEFAULT_SECURITY_LIMITS = {
    maxFileSize: 50 * 1024 * 1024,             // 50 MB compressed
    maxUncompressedSize: 250 * 1024 * 1024,    // 250 MB max total expansion
    maxCompressionRatio: 25,                   // Maximum 25:1 ratio
    maxFileCount: 5000,                        // Maximum 5,000 files
    disallowedExtensions: [
        '.exe', '.bat', '.cmd', '.com', '.vbs', '.vbe', '.sh', '.bash',
        '.dll', '.so', '.dylib', '.scr', '.pif', '.msi', '.bin',
        '.zip', '.tar', '.gz', '.bz2', '.7z', '.rar'
    ],
};

function validateZipSecurity(buffer, customLimits = {}) {
    const limits = { ...DEFAULT_SECURITY_LIMITS, ...customLimits };

    if (!buffer || buffer.length === 0) {
        return { safe: false, error: 'Empty file received' };
    }
    if (buffer.length > limits.maxFileSize) {
        return { safe: false, error: `File size exceeds the security limit of 50 MB.` };
    }

    if (buffer.length < 22) {
        return { safe: false, error: 'Corrupt archive: file is too small.' };
    }

    const isZip = (buffer[0] === 0x50 && buffer[1] === 0x4b && buffer[2] === 0x03 && buffer[3] === 0x04) ||
                  (buffer[0] === 0x50 && buffer[1] === 0x4b && buffer[2] === 0x05 && buffer[3] === 0x06);
    if (!isZip) {
        return { safe: false, error: 'Security rejection: file magic bytes do not match ZIP format (PK).' };
    }

    let eocdOffset = -1;
    const maxSearch = Math.min(buffer.length - 22, 65557);
    for (let i = buffer.length - 22; i >= buffer.length - maxSearch; i--) {
        if (buffer[i] === 0x50 && buffer[i + 1] === 0x4b && buffer[i + 2] === 0x05 && buffer[i + 3] === 0x06) {
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
        return { safe: false, error: `Archive contains ${totalEntries} entries (max: ${limits.maxFileCount}).` };
    }

    let p = cdOffset;
    let totalUncompressedSize = 0;
    let entryCount = 0;

    while (p + 46 <= cdOffset + cdSize) {
        const signature = buffer.readUInt32LE(p);
        if (signature !== 0x02014b50) break;

        entryCount++;
        if (entryCount > limits.maxFileCount) {
            return { safe: false, error: `Security block: archive contains excessive entries.` };
        }

        const uncompressedSize = buffer.readUInt32LE(p + 24);
        const fileNameLength = buffer.readUInt16LE(p + 28);
        const extraFieldLength = buffer.readUInt16LE(p + 30);
        const commentLength = buffer.readUInt16LE(p + 32);

        const fileName = buffer.toString('utf-8', p + 46, p + 46 + fileNameLength);
        const normalized = fileName.replace(/\\/g, '/');

        if (
            normalized.startsWith('/') ||
            normalized.startsWith('../') ||
            normalized.includes('/../') ||
            normalized.endsWith('/..') ||
            /^[a-zA-Z]:/.test(normalized)
        ) {
            return { safe: false, error: `Zip Slip path traversal detected in "${fileName}".` };
        }

        const lower = fileName.toLowerCase();
        for (const ext of limits.disallowedExtensions) {
            if (lower.endsWith(ext)) {
                return { safe: false, error: `Security violation: dangerous file type ${ext} not allowed.` };
            }
        }

        totalUncompressedSize += uncompressedSize;
        p += 46 + fileNameLength + extraFieldLength + commentLength;
    }

    if (totalUncompressedSize > limits.maxUncompressedSize) {
        return { safe: false, error: `Potential Zip Bomb rejected: uncompressed size exceeds threshold.` };
    }

    const compressionRatio = buffer.length > 0 ? (totalUncompressedSize / buffer.length) : 0;
    if (compressionRatio > limits.maxCompressionRatio) {
        return { safe: false, error: `Potential Zip Bomb rejected: abnormal expansion ratio of ${compressionRatio.toFixed(1)}:1.` };
    }

    return { safe: true, fileCount: entryCount, totalUncompressedSize };
}

module.exports = { validateZipSecurity, DEFAULT_SECURITY_LIMITS };
