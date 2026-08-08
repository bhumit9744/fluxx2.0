import React, { useState, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';
import { useEnvironmentStore } from '../../stores/environmentStore';

export const UploadDatasetModal: React.FC = () => {
  const { isUploadModalOpen, closeUploadModal, uploadAndIngestCSV } = useEnvironmentStore();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isUploadModalOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.csv')) {
        setSelectedFile(file);
        setError(null);
      } else {
        setError('Please drop a valid .csv dataset file.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.endsWith('.csv')) {
        setSelectedFile(file);
        setError(null);
      } else {
        setError('Please select a valid .csv dataset file.');
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await uploadAndIngestCSV(selectedFile);
      setSuccess(`Successfully ingested ${res.observations_count || 'all'} observations!`);
      setTimeout(() => {
        setUploading(false);
        closeUploadModal();
        setSelectedFile(null);
        setSuccess(null);
      }, 1200);
    } catch (err: any) {
      setUploading(false);
      setError(err.message || 'Failed to upload CSV file');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none">
      <div 
        className="w-full max-w-md rounded-[24px] bg-white border border-[#F3E6D7] shadow-[0_20px_60px_rgba(70,40,20,0.18)] p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200"
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[18px] font-extrabold text-[#2B211C] tracking-tight">
              Upload Survey Dataset
            </h3>
            <p className="text-[12px] text-[#8C827A] font-medium mt-0.5">
              Connect a new CSV file to re-calculate all dashboard metrics live
            </p>
          </div>
          <button 
            onClick={closeUploadModal}
            className="p-1.5 rounded-xl border border-[#F3E6D7] hover:bg-[#FAF3EA] text-[#8C827A] hover:text-[#2B211C] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drag & Drop Box */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
            dragActive 
              ? 'border-[#F47A24] bg-[#FFF0E5]' 
              : 'border-[#F3E6D7] hover:border-[#F47A24] bg-[#FFFDF9]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-12 h-12 rounded-2xl bg-[#FFF0E5] text-[#F47A24] flex items-center justify-center mx-auto mb-3 shadow-xs">
            <UploadCloud className="w-6 h-6" />
          </div>

          <div className="font-bold text-[14px] text-[#2B211C]">
            {selectedFile ? selectedFile.name : 'Click to upload or drag & drop'}
          </div>
          <div className="text-[11px] text-[#8C827A] mt-1 font-medium">
            {selectedFile 
              ? `${(selectedFile.size / 1024).toFixed(1)} KB` 
              : 'CSV with timestamp, latitude, longitude, and pollutant readings'}
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="p-3 rounded-xl bg-[#FDECEC] border border-[#F5C2C2] text-[#E55353] text-[12px] font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl bg-[#EAF7EE] border border-[#C3E8CC] text-[#3FA66B] text-[12px] font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            onClick={closeUploadModal}
            className="px-4 py-2.5 rounded-xl border border-[#F3E6D7] hover:bg-[#FAF3EA] text-[#6B5E55] font-semibold text-[13px] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={!selectedFile || uploading}
            onClick={handleUpload}
            className="px-5 py-2.5 rounded-xl bg-[#F47A24] hover:bg-[#E06815] disabled:opacity-50 text-white font-bold text-[13px] flex items-center space-x-2 shadow-[0_4px_16px_rgba(244,122,36,0.3)] transition-all cursor-pointer"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>Ingest Dataset</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
