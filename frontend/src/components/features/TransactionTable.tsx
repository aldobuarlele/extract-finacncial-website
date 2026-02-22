'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { Transaction } from '@/types';
import { Edit2, Check, X, Plus, Trash2 } from 'lucide-react';

export const TransactionTable: React.FC<{ reportId: string, onDataChange: () => void }> = ({ reportId, onDataChange }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState({
    date: '',
    merchant: '',
    amount: 0,
    category: ''
  });

  const loadData = async () => {
    try {
      const [txData, catData] = await Promise.all([
        apiClient.getTransactions(reportId),
        apiClient.getCategories()
      ]);
      setTransactions(txData);
      setCategories(catData);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { loadData(); }, [reportId]);

  const handleSaveEdit = async (id: string) => {
    try {
      await apiClient.updateTransaction(id, { 
        category_name: formData.category,
        merchant_name: formData.merchant,
        transaction_date: formData.date
      });
      setEditingId(null);
      loadData();
      onDataChange();
    } catch (error) {
      alert("Gagal menyimpan perubahan. Pastikan tanggal valid.");
    }
  };

  const handleAddNew = async () => {
    if (!formData.date || !formData.merchant || !formData.category) {
      alert("Mohon isi Date, Merchant, dan Category sebelum menyimpan.");
      return;
    }

    try {
      await apiClient.createTransaction({
        report_id: reportId,
        category_name: formData.category,
        transaction_date: formData.date,
        merchant_name: formData.merchant,
        amount: formData.amount 
      });
      setIsAdding(false);
      setFormData({ date: '', merchant: '', amount: 0, category: '' });
      loadData();
      onDataChange();
    } catch (error) {
      alert("Terjadi kesalahan saat menyimpan ke database.");
    }
  };

  return (
    <div className="mt-12 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-2xl">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white">Transaction Details</h3>
          <p className="text-slate-400 text-sm mt-1">Manage and audit your extracted data.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition-all font-medium text-sm"
        >
          <Plus size={18} /> <span>Add Transaction</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-slate-300">
          <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Merchant</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {/* Baris Input Tambah Baru */}
            {isAdding && (
              <tr className="bg-indigo-500/5 border-l-4 border-indigo-500">
                <td className="px-6 py-4">
                  <input type="date" className="bg-slate-800 border border-slate-700 rounded p-1 text-sm w-full" onChange={e => setFormData({...formData, date: e.target.value})} />
                </td>
                <td className="px-6 py-4">
                  <input type="text" placeholder="Merchant name" className="bg-slate-800 border border-slate-700 rounded p-1 text-sm w-full" onChange={e => setFormData({...formData, merchant: e.target.value})} />
                </td>
                <td className="px-6 py-4">
                  <input type="number" placeholder="0.00" className="bg-slate-800 border border-slate-700 rounded p-1 text-sm w-full text-emerald-400" onChange={e => setFormData({...formData, amount: parseFloat(e.target.value) || 0})} />
                </td>
                <td className="px-6 py-4">
                  <select className="bg-slate-800 border border-slate-700 rounded p-1 text-sm w-full" onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    <option value="Others">+ New Category (Others)</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <button onClick={handleAddNew} className="text-emerald-400 hover:text-emerald-300"><Check size={20}/></button>
                    <button onClick={() => setIsAdding(false)} className="text-rose-400 hover:text-rose-300"><X size={20}/></button>
                  </div>
                </td>
              </tr>
            )}

            {/* Daftar Transaksi Existing */}
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors group">
                <td className="px-6 py-4 text-sm">
                  {editingId === tx.id ? <input type="date" defaultValue={tx.date || ''} className="bg-slate-800 border border-slate-700 rounded p-1 text-xs" onChange={e => setFormData({...formData, date: e.target.value})} /> : tx.date}
                </td>
                <td className="px-6 py-4 font-medium text-white">
                  {editingId === tx.id ? <input type="text" defaultValue={tx.merchant} className="bg-slate-800 border border-slate-700 rounded p-1 text-xs w-full" onChange={e => setFormData({...formData, merchant: e.target.value})} /> : tx.merchant}
                </td>
                <td className="px-6 py-4 text-emerald-400 font-bold">
                  {tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'IDR' })}
                </td>
                <td className="px-6 py-4">
                  {editingId === tx.id ? (
                    <select defaultValue={tx.category} className="bg-slate-800 border border-slate-700 rounded p-1 text-xs w-full" onChange={e => setFormData({...formData, category: e.target.value})}>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  ) : (
                    <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {tx.category}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {editingId === tx.id ? (
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleSaveEdit(tx.id)} className="text-emerald-400 hover:text-emerald-300"><Check size={18}/></button>
                      <button onClick={() => setEditingId(null)} className="text-rose-400 hover:text-rose-300"><X size={18}/></button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => { setEditingId(tx.id); setFormData({date: tx.date || '', merchant: tx.merchant, amount: tx.amount, category: tx.category}); }}
                      className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-indigo-400 transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};