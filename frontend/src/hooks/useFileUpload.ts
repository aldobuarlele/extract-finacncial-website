import { useState } from 'react';
import { apiClient } from '@/lib/api';
import { UploadResponse } from '@/types';

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);

  const upload = async (file: File) => {
    setIsUploading(true);
    setError(null);
    try {
      const result = await apiClient.uploadDocument(file);
      setUploadResult(result);
      return result;
    } catch (err) {
      setError("Gagal mengunggah dokumen. Silakan coba lagi.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading, error, uploadResult };
};