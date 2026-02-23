'use client';

import React from 'react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { UploadCloud, Loader2, AlertCircle } from 'lucide-react';

interface FileUploadZoneProps {
  onUploadSuccess: (reportId: string) => void;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({ onUploadSuccess }) => {
  const { upload, isUploading, error } = useFileUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const result = await upload(file);
      if (result?.report_id) {
        onUploadSuccess(result.report_id);
      }
    }
  };

  // Fungsi untuk membuat pesan error lebih ramah (Human-Readable)
  const getFriendlyErrorMessage = (errMsg: string) => {
    const lowerError = errMsg.toLowerCase();
    if (lowerError.includes('429') || lowerError.includes('quota') || lowerError.includes('exhausted')) {
      return "Sistem AI sedang sibuk memproses antrean. Mohon coba lagi dalam 1 menit.";
    }
    if (lowerError.includes('failed to fetch')) {
      return "Koneksi ke server terputus. Pastikan backend Anda berjalan.";
    }
    return errMsg;
  };

  return (
    <div className="relative p-12 border-2 border-dashed border-slate-700 rounded-3xl text-center bg-slate-900/40 hover:bg-slate-800/60 transition-all duration-300 group shadow-sm hover:shadow-md">
      <input
        type="file"
        id="fileInput"
        className="hidden"
        onChange={handleFileChange}
        accept=".pdf,image/*"
        disabled={isUploading}
      />
      <label htmlFor="fileInput" className="cursor-pointer block w-full h-full">
        {isUploading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-4 animate-in fade-in duration-500">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
            <p className="text-indigo-400 font-semibold tracking-wide">AI is analyzing document...</p>
            <p className="text-xs text-slate-500">Mengekstrak merchant, tanggal, dan nominal</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-5">
            <div className="p-5 bg-slate-800 rounded-2xl group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300 shadow-inner">
              <UploadCloud className="w-10 h-10 text-indigo-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white tracking-wide">Seret file ke sini, atau klik untuk unggah</p>
              <p className="text-sm text-slate-400 mt-2 font-medium">Mendukung PDF, PNG, JPG (Maks. 5MB)</p>
            </div>
          </div>
        )}
      </label>
      
      {/* Toast Notifikasi Error */}
      {error && (
        <div className="absolute -bottom-16 left-0 right-0 mx-auto w-full max-w-lg flex items-center justify-center space-x-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-5 py-3 rounded-2xl shadow-lg animate-in slide-in-from-bottom-4 duration-500 backdrop-blur-sm z-10">
          <AlertCircle size={20} className="shrink-0" />
          <p className="text-sm font-medium leading-tight text-left">
            {getFriendlyErrorMessage(error)}
          </p>
        </div>
      )}
    </div>
  );
};