'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { DocumentHistory } from '@/types';
import { History, ChevronDown } from 'lucide-react';

interface HistorySelectorProps {
  onSelect: (reportId: string) => void;
  activeId: string | null;
  refreshTrigger: number; 
}

export const HistorySelector: React.FC<HistorySelectorProps> = ({ onSelect, activeId, refreshTrigger }) => {
  const [history, setHistory] = useState<DocumentHistory[]>([]);

  useEffect(() => {
    apiClient.getHistory().then(setHistory).catch(console.error);
  }, [refreshTrigger]); 

  return (
    <div className="relative inline-block w-full max-w-xs group">
      <div className="flex items-center space-x-2 mb-2 text-slate-400 text-xs font-semibold uppercase tracking-widest">
        <History size={14} />
        <span>Select Document History</span>
      </div>
      <select
        value={activeId || ''}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full bg-slate-900 text-slate-200 border border-slate-700 rounded-xl px-4 py-3 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 hover:border-slate-500 transition-all"
      >
        <option value="" disabled>Choose a report...</option>
        {history.map((doc) => (
          <option key={doc.id} value={doc.id}>
            {doc.filename} ({new Date(doc.created_at).toLocaleDateString()})
          </option>
        ))}
      </select>
      <div className="absolute right-4 bottom-3.5 pointer-events-none text-slate-500 group-hover:text-slate-300 transition-colors">
        <ChevronDown size={18} />
      </div>
    </div>
  );
};