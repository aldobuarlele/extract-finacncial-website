'use client';

import { useState, useEffect } from 'react';
import { FileUploadZone } from '@/components/features/FileUploadZone';
import { AnalyticsDashboard } from '@/components/features/AnalyticsDashboard';
import { HistorySelector } from '@/components/features/HistorySelector';
import { TransactionTable } from '@/components/features/TransactionTable';
import { apiClient } from '@/lib/api';
import { AnalyticsSummary } from '@/types';

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

  return (
    <main className="min-h-screen bg-[#0f172a] p-8 text-slate-200">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header & History Selector */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white">Expense <span className="text-indigo-500">Intelligence</span></h1>
            <p className="text-slate-400 mt-2">Professional AI Financial Extraction System</p>
          </div>
          <HistorySelector 
            activeId={activeReportId} 
            refreshTrigger={refreshHistoryTick} 
            onSelect={(id) => {
              setActiveReportId(id);
              setAnalytics(null);
            }} 
          />
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