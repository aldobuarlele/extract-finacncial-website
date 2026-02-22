const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiClient = {
  getSummary: async (reportId: string) => {
    const res = await fetch(`${BASE_URL}/analytics/summary/${reportId}`);
    if (!res.ok) throw new Error("Gagal mengambil data analitik");
    return res.json();
  },

  uploadDocument: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${BASE_URL}/documents/upload`, {
      method: "POST",
      body: formData,
    });
    
    if (!res.ok) throw new Error("Gagal mengunggah dokumen");
    return res.json(); 
  },
};