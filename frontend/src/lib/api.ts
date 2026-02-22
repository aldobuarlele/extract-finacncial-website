import { DocumentHistory, Transaction, TransactionUpdatePayload, TransactionCreatePayload } from '@/types';

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

  getHistory: async (): Promise<DocumentHistory[]> => {
    const res = await fetch(`${BASE_URL}/documents/`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Gagal mengambil riwayat dokumen");
    return res.json();
  },

  getTransactions: async (reportId: string): Promise<Transaction[]> => {
    const res = await fetch(`${BASE_URL}/transactions/report/${reportId}`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Gagal mengambil data transaksi");
    return res.json();
  },

  updateTransaction: async (transactionId: string, payload: TransactionUpdatePayload) => {
    const res = await fetch(`${BASE_URL}/transactions/${transactionId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Gagal mengupdate transaksi");
    return res.json();
  },
  
  getCategories: async (): Promise<string[]> => {
    const res = await fetch(`${BASE_URL}/transactions/categories`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Gagal mengambil daftar kategori");
    return res.json();
  },

  createTransaction: async (payload: TransactionCreatePayload): Promise<Transaction> => {
    const res = await fetch(`${BASE_URL}/transactions/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const errData = await res.json();
        console.error("Detail Error FastAPI:", errData);
        throw new Error("Gagal membuat transaksi baru");
    }
    return res.json();
  },
};