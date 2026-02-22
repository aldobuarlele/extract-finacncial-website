'use client';

import React from 'react';
import { AnalyticsSummary } from '@/types';
import { Wallet, Hash, Zap, TrendingUp } from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#f43f5e', '#8b5cf6', '#06b6d4'];

export const AnalyticsDashboard: React.FC<{ data: AnalyticsSummary }> = ({ data }) => {
  const pieData = Object.entries(data.category_distribution).map(([name, value]) => ({
    name,
    value: Math.abs(value) 
  }));

  const formatCurrency = (val: number) => {
    return val.toLocaleString('en-US', { style: 'currency', currency: data.summary.currency });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. Stat Cards dengan Dark Theme Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="relative overflow-hidden p-6 border border-slate-800 rounded-2xl bg-slate-900 shadow-lg">
          <div className="absolute top-0 right-0 p-3 bg-emerald-500/10 rounded-bl-2xl text-emerald-400"><Wallet size={24} /></div>
          <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Spent</p>
          <p className="text-3xl font-bold text-white mt-2">{formatCurrency(data.summary.total_spent)}</p>
          <div className="mt-4 flex items-center text-xs text-emerald-400 font-medium"><TrendingUp size={14} className="mr-1" /><span>Verified by AI</span></div>
        </div>

        <div className="relative overflow-hidden p-6 border border-slate-800 rounded-2xl bg-slate-900 shadow-lg">
          <div className="absolute top-0 right-0 p-3 bg-indigo-500/10 rounded-bl-2xl text-indigo-400"><Hash size={24} /></div>
          <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Transactions</p>
          <p className="text-3xl font-bold text-white mt-2">{data.summary.transaction_count}</p>
          <p className="mt-4 text-xs text-slate-500">Total items extracted</p>
        </div>

        <div className="relative overflow-hidden p-6 border border-slate-700 rounded-2xl bg-slate-800 text-white shadow-lg">
          <div className="absolute top-0 right-0 p-3 bg-slate-700 rounded-bl-2xl text-yellow-400"><Zap size={24} fill="currentColor" /></div>
          <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">AI Intelligence</p>
          <p className="text-3xl font-bold mt-2">{data.ai_usage.total_tokens.toLocaleString()}</p>
          <p className="mt-4 text-xs text-slate-500 italic">Tokens consumed by Gemini</p>
        </div>
      </div>

      {/* 2. Charts Section dengan Dark Theme Tweak */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Distribution (Pie Chart) */}
        <div className="p-8 border border-slate-800 rounded-2xl bg-slate-900 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-6">Category Distribution</h3>
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
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                  itemStyle={{ color: '#f8fafc' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend iconType="circle" wrapperStyle={{ color: '#94a3b8' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Spending Trend (Area Chart) */}
        <div className="p-8 border border-slate-800 rounded-2xl bg-slate-900 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-6">Spending Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.daily_trends}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  width={80}
                  tickFormatter={(val) => val.toLocaleString('en-US', {notation: 'compact'})}
                />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                   formatter={(value: number) => formatCurrency(value)}
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