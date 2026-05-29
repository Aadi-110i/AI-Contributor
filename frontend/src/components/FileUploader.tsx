'use client';

import { useRef, useState } from 'react';
import { Upload, File } from 'lucide-react';

interface Props {
    onUpload: (file: File) => Promise<void>;
    accept?: string;
    maxSizeMB?: number;
}

export default function FileUploader({ onUpload, accept = '.zip', maxSizeMB = 50 }: Props) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleFile = async (file: globalThis.File) => {
        if (file.size > maxSizeMB * 1024 * 1024) {
            alert(`File too large. Max ${maxSizeMB}MB.`);
            return;
        }
        setFileName(file.name);
        setUploading(true);
        try { await onUpload(file); }
        catch (err) { alert(err instanceof Error ? err.message : 'Upload failed'); }
        finally { setUploading(false); }
    };

    return (
        <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
            style={{
                border: `1px dashed ${isDragging ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 'var(--radius)',
                padding: '40px 24px',
                textAlign: 'center',
                cursor: 'pointer',
                background: isDragging ? 'var(--accent-muted)' : 'var(--bg)',
                transition: 'all 0.25s ease',
            }}
        >
            <input ref={fileRef} type="file" accept={accept} onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} style={{ display: 'none' }} />
            {uploading ? (
                <>
                    <div className="spinner" style={{ margin: '0 auto 12px' }} />
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>Uploading {fileName}...</p>
                </>
            ) : (
                <>
                    <Upload size={24} style={{ color: 'var(--text-muted)', margin: '0 auto 12px', display: 'block' }} />
                    <p style={{ color: 'var(--text-white)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '4px' }}>
                        Drop your ZIP here
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>or click to browse • Max {maxSizeMB}MB</p>
                </>
            )}
        </div>
    );
}
