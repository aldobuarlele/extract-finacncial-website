'use client';

import React from 'react';
import { AnalyticsSummary } from '@/types';

export const AnalyticsDashboard: React.FC<{ data: AnalyticsSummary }> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      <div className="p-6 border rounded-xl shadow-sm bg-white">
        <p className="text-sm text-gray-500 uppercase font-bold">Total Spent</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">
          {data.summary.total_spent.toLocaleString('en-US', { style: 'currency', currency: data.summary.currency })}
        </p>
      </div>
      
      <div className="p-6 border rounded-xl shadow-sm bg-white">
        <p className="text-sm text-gray-500 uppercase font-bold">Transactions</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{data.summary.transaction_count}</p>
      </div>

      <div className="p-6 border rounded-xl shadow-sm bg-white">
        <p className="text-sm text-gray-500 uppercase font-bold">AI Usage</p>
        <p className="text-3xl font-bold text-blue-600 mt-2">{data.ai_usage.total_tokens} <span className="text-sm text-gray-400">tokens</span></p>
      </div>
    </div>
  );
};