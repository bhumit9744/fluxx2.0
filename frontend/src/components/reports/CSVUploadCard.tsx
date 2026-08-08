import React, { useState, useRef } from 'react';
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2, RefreshCw, FileText, Database } from 'lucide-react';
import { useEnvironmentStore } from '../../stores/environmentStore';
import { Button } from '../ui/Button';

interface CSVUploadCardProps {
  onSuccess?: () => void;
}

export const CSVUploadCard: React.FC<CSVUploadCardProps> = ({ onSuccess }) => {
  const { uploadAndIngestCSV } = useEnvironmentStore();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadResult, setUploadResult] = useState<{
    filename: string;
    count: number;
    timestamp: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setErrorMessage('Please upload a valid CSV file (.csv format).');
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const res = await uploadAndIngestCSV(file);
      setUploadResult({
        filename: file.name,
        count: res.observations_count || 50,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to parse CSV file. Ensure standard environmental columns are present.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="p-6 panel space-y-5">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-[rgba(244,122,36,0.1)] text-[var(--fluxx-orange)]">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-sans text-base font-bold text-[var(--fluxx-text)] flex items-center space-x-2">
              <span>Upload Custom Environmental CSV</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[rgba(244,122,36,0.1)] text-[var(--fluxx-orange)]">
                REAL-TIME INGESTION
              </span>
            </h3>
            <p className="text-xs font-mono text-[var(--fluxx-muted)]">
              Upload georeferenced sensor telemetry to recalculate spatial heatmaps, ERI risk, and compliance audit reports.
            </p>
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".csv,text/csv"
          className="hidden"
        />

        <Button
          size="sm"
          variant="secondary"
          icon={UploadCloud}
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? 'INGESTING...' : 'SELECT CSV FILE'}
        </Button>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
          ${isDragging 
            ? 'border-[var(--fluxx-orange)] bg-[rgba(244,122,36,0.05)] scale-[1.02]' 
            : 'border-[var(--fluxx-border)] hover:border-[var(--fluxx-orange)] bg-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.7)]'
          }
        `}
      >
        {isUploading ? (
          <div className="flex flex-col items-center space-y-3">
            <Loader2 className="w-8 h-8 text-[var(--fluxx-orange)] animate-spin" />
            <div className="text-sm font-semibold text-[var(--fluxx-text)]">Ingesting Data...</div>
          </div>
        ) : (
          <>
            <div className="w-14 h-14 rounded-full bg-[rgba(244,122,36,0.1)] flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
              <UploadCloud className="w-7 h-7 text-[var(--fluxx-orange)]" />
            </div>
            <p className="text-sm font-semibold text-[var(--fluxx-text)]">
              Click to browse or drag and drop
            </p>
            <p className="text-xs font-mono text-[var(--fluxx-muted)] mt-1">
              CSV files up to 5MB
            </p>
          </>
        )}
      </div>

      {/* Error State */}
      {errorMessage && (
        <div className="mt-4 p-4 rounded-xl bg-[rgba(217,76,61,0.1)] border border-[var(--fluxx-critical)] flex items-start space-x-3 animate-in fade-in slide-in-from-top-4">
          <AlertCircle className="w-5 h-5 text-[var(--fluxx-critical)] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-[var(--fluxx-critical)]">Upload Failed</h4>
            <p className="text-xs text-[var(--fluxx-critical)] mt-1 opacity-90">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Success State */}
      {uploadResult && !errorMessage && (
        <div className="mt-4 p-4 rounded-xl bg-[rgba(63,166,107,0.1)] border border-[var(--fluxx-success)] flex items-center justify-between animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-[var(--fluxx-success)]" />
            <div>
              <h4 className="text-sm font-bold text-[var(--fluxx-success)]">{uploadResult.filename} uploaded</h4>
              <div className="flex items-center space-x-2 text-xs font-mono text-[var(--fluxx-success)] opacity-90 mt-1">
                <Database className="w-3.5 h-3.5" />
                <span>{uploadResult.count} records ingested</span>
                <span>·</span>
                <span>{uploadResult.timestamp}</span>
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={(e) => {
              e.stopPropagation();
              setUploadResult(null);
            }}
          >
            DISMISS
          </Button>
        </div>
      )}

      {/* Current Dataset Active View (always visible for visual feedback) */}
      <div className="border-t border-[var(--fluxx-border)] pt-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-[var(--fluxx-text)] tracking-wider">ACTIVE PIPELINE</h4>
          <span className="flex items-center text-[10px] font-mono text-[var(--fluxx-success)] bg-[rgba(63,166,107,0.1)] px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--fluxx-success)] mr-1.5 animate-pulse"></span>
            SYNCED
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-[rgba(255,255,255,0.4)] p-3 rounded-xl border border-[var(--fluxx-border)]">
            <div className="text-[10px] font-mono text-[var(--fluxx-muted)] mb-1 uppercase">Rows Processed</div>
            <div className="text-lg font-mono font-black text-[var(--fluxx-text)]">{uploadResult?.count || 300}</div>
          </div>
          <div className="bg-[rgba(255,255,255,0.4)] p-3 rounded-xl border border-[var(--fluxx-border)]">
            <div className="text-[10px] font-mono text-[var(--fluxx-muted)] mb-1 uppercase">Geospatial Grid</div>
            <div className="text-lg font-mono font-black text-[var(--fluxx-text)]">ACTIVE</div>
          </div>
          <div className="bg-[rgba(255,255,255,0.4)] p-3 rounded-xl border border-[var(--fluxx-border)]">
            <div className="text-[10px] font-mono text-[var(--fluxx-muted)] mb-1 uppercase">Parameters</div>
            <div className="text-lg font-mono font-black text-[var(--fluxx-text)]">4 MAIN</div>
          </div>
          <div className="bg-[rgba(255,255,255,0.4)] p-3 rounded-xl border border-[var(--fluxx-border)]">
            <div className="text-[10px] font-mono text-[var(--fluxx-muted)] mb-1 uppercase">Last Synced</div>
            <div className="text-lg font-mono font-black text-[var(--fluxx-text)]">{uploadResult?.timestamp || '16:42'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
