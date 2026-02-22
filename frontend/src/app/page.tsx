'use client';

import { useState, useEffect } from 'react';
import { FileUploadZone } from '@/components/features/FileUploadZone';
import { AnalyticsDashboard } from '@/components/features/AnalyticsDashboard';
import { apiClient } from '@/lib/api';
import { AnalyticsSummary } from '@/types';

export default function Home() {
  const [reportId, setReportId] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);

  const fetchAnalytics = async (id: string) => {
    try {
      const data = await apiClient.getSummary(id);
      if (data.ai_usage.status === 'COMPLETED') {
        setAnalytics(data);
      }
    } catch (err) {
      console.error("Belum siap:", err);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (reportId && !analytics) {
      fetchAnalytics(reportId); 
      interval = setInterval(() => fetchAnalytics(reportId), 3000);
    }
    return () => clearInterval(interval);
  }, [reportId, analytics]);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Expense Intelligence</h1>
        
        <FileUploadZone onUploadSuccess={(id) => {
          setReportId(id);
          setAnalytics(null);
        }} />

        {reportId && !analytics && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg animate-pulse text-blue-700">
            AI sedang menganalisis dokumen Anda (ID: {reportId})...
          </div>
        )}

        {analytics && (
          <div className="mt-12 animate-in fade-in duration-700">
            <h2 className="text-2xl font-bold mb-6">Laporan: {analytics.filename}</h2>
            <AnalyticsDashboard data={analytics} />
            {/* Nanti kita tambahkan Chart di sini di Langkah 7.6 */}
          </div>
        )}
      </div>
    </main>
  );
}