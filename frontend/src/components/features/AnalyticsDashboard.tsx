'use client';

import React from 'react';
import { AnalyticsSummary } from '@/types';
import { Wallet, Hash, Zap, TrendingUp } from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';

// Palet warna yang elegant dan colorful
const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#f43f5e', '#8b5cf6', '#06b6d4'];

export const AnalyticsDashboard: React.FC<{ data: AnalyticsSummary }> = ({ data }) => {
  // Mapping data untuk Pie Chart
  const pieData = Object.entries(data.category_distribution).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. Stat Cards (Sudah Anda buat sebelumnya) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* ... (Kode Card Tetap Sama) ... */}
         <div className="relative overflow-hidden p-6 border rounded-2xl bg-white shadow-sm group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 p-3 bg-emerald-50 rounded-bl-2xl text-emerald-600"><Wallet size={24} /></div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Spent</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{data.summary.total_spent.toLocaleString('en-US', { style: 'currency', currency: data.summary.currency })}</p>
          <div className="mt-4 flex items-center text-xs text-emerald-600 font-medium"><TrendingUp size={14} className="mr-1" /><span>Verified by AI</span></div>
        </div>

        <div className="relative overflow-hidden p-6 border rounded-2xl bg-white shadow-sm group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 p-3 bg-indigo-50 rounded-bl-2xl text-indigo-600"><Hash size={24} /></div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Transactions</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{data.summary.transaction_count}</p>
          <p className="mt-4 text-xs text-slate-400">Total items extracted</p>
        </div>

        <div className="relative overflow-hidden p-6 border rounded-2xl bg-slate-900 text-white shadow-lg group">
          <div className="absolute top-0 right-0 p-3 bg-slate-800 rounded-bl-2xl text-yellow-400"><Zap size={24} fill="currentColor" /></div>
          <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">AI Intelligence</p>
          <p className="text-3xl font-bold mt-2">{data.ai_usage.total_tokens.toLocaleString()}</p>
          <p className="mt-4 text-xs text-slate-500 italic">Tokens consumed by Gemini 2.5</p>
        </div>
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Distribution (Pie Chart) */}
        <div className="p-8 border rounded-2xl bg-white shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Category Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Spending Trend (Area Chart) */}
        <div className="p-8 border rounded-2xl bg-white shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Spending Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.daily_trends}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};