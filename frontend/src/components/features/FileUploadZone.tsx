'use client';

import React, { useCallback } from 'react';
import { useFileUpload } from '@/hooks/useFileUpload';

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

  return (
    <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50 hover:bg-gray-100 transition-colors">
      <input
        type="file"
        id="fileInput"
        className="hidden"
        onChange={handleFileChange}
        accept=".pdf,image/*"
        disabled={isUploading}
      />
      <label htmlFor="fileInput" className="cursor-pointer block">
        {isUploading ? (
          <p className="text-blue-600 font-medium">Sedang mengunggah dan memproses...</p>
        ) : (
          <div>
            <p className="text-lg font-semibold">Klik untuk pilih file atau seret ke sini</p>
            <p className="text-sm text-gray-500 mt-2">Dukungan PDF, PNG, JPG (Maks. 5MB)</p>
          </div>
        )}
      </label>
      {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
    </div>
  );
};