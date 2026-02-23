'use client';

import { useState, useEffect } from 'react';
import { FileUploadZone } from '@/components/features/FileUploadZone';
import { AnalyticsDashboard } from '@/components/features/AnalyticsDashboard';
import { HistorySelector } from '@/components/features/HistorySelector';
import { TransactionTable } from '@/components/features/TransactionTable';
import { apiClient } from '@/lib/api';
import { AnalyticsSummary } from '@/types';
import { FileText, FileSpreadsheet } from 'lucide-react'; 

export default function Home() {
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  
  const [refreshHistoryTick, setRefreshHistoryTick] = useState(0);

  const refreshData = async (id: string) => {
    try {
      const data = await apiClient.getSummary(id);
      if (data.ai_usage.status === 'COMPLETED') {
        setAnalytics(data);
      }
    } catch (err) {
      console.error("Data belum siap atau error:", err);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeReportId && !analytics) {
      refreshData(activeReportId);
      interval = setInterval(() => refreshData(activeReportId), 3000);
    }
    return () => clearInterval(interval);
  }, [activeReportId, analytics]);

  const handleExport = async (format: 'pdf' | 'excel') => {
    if (!activeReportId) return;
    try {
      await apiClient.downloadExport(activeReportId, format);
    } catch (err) {
      alert(`Gagal mengunduh ${format}. Pastikan backend export Anda sudah aktif.`);
    }
  };

  return (
    <main className="min-h-screen bg-[#0f172a] p-8 text-slate-200">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header & History Selector */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white">Expense <span className="text-indigo-500">Intelligence</span></h1>
            <p className="text-slate-400 mt-2">Professional AI Financial Extraction System</p>
          </div>
          
          {/* FIX 3: Flex container untuk menyandingkan Tombol Export & Dropdown History */}
          <div className="flex flex-col md:flex-row items-end gap-4">
            {activeReportId && analytics && (
              <div className="flex space-x-3 mb-1 md:mb-0">
                <button 
                  onClick={() => handleExport('pdf')} 
                  className="flex items-center space-x-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 px-4 py-3 rounded-xl transition-all border border-rose-500/20 font-medium text-sm"
                >
                  <FileText size={18} /> <span>PDF</span>
                </button>
                <button 
                  onClick={() => handleExport('excel')} 
                  className="flex items-center space-x-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl transition-all border border-emerald-500/20 font-medium text-sm"
                >
                  <FileSpreadsheet size={18} /> <span>Excel</span>
                </button>
              </div>
            )}
            
            <HistorySelector 
              activeId={activeReportId} 
              refreshTrigger={refreshHistoryTick} 
              onSelect={(id) => {
                setActiveReportId(id);
                setAnalytics(null);
              }} 
            />
          </div>
        </div>

        {/* Upload Zone */}
        <section>
          <FileUploadZone onUploadSuccess={(id) => {
            setActiveReportId(id);
            setAnalytics(null);
            setRefreshHistoryTick(prev => prev + 1); 
          }} />
        </section>

        {/* Dashboard & Table */}
        {analytics && (
          <div className="space-y-12 animate-in fade-in duration-1000">
            <AnalyticsDashboard data={analytics} />
            
            <TransactionTable 
              reportId={analytics.report_id} 
              onDataChange={() => refreshData(analytics.report_id)} 
            />
          </div>
        )}
      </div>
    </main>
  );
}