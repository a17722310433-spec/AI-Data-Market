'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Calendar,
  TrendingUp,
  FileText,
  DollarSign
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { clsx } from 'clsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function TransactionsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [timeRange, setTimeRange] = useState('7d');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const transactions = [
    { id: '1', type: 'sale', title: '编程对话数据 #15', amount: 22.50, date: '2024-01-15 14:30', dataId: 'data1' },
    { id: '2', type: 'sale', title: '数据分析对话 #9', amount: 15.00, date: '2024-01-14 09:15', dataId: 'data2' },
    { id: '3', type: 'purchase', title: '购买高质量对话数据', amount: -18.00, date: '2024-01-13 16:45', dataId: 'data3' },
    { id: '4', type: 'withdrawal', title: '提现到银行账户', amount: -50.00, date: '2024-01-12 10:00', dataId: null },
    { id: '5', type: 'sale', title: '创意写作对话 #6', amount: 12.75, date: '2024-01-11 11:30', dataId: 'data4' },
    { id: '6', type: 'sale', title: '学术论文对话 #4', amount: 28.00, date: '2024-01-10 15:20', dataId: 'data5' },
    { id: '7', type: 'bonus', title: '新用户奖励', amount: 10.00, date: '2024-01-09 09:00', dataId: null },
    { id: '8', type: 'purchase', title: '购买商业咨询数据', amount: -25.00, date: '2024-01-08 14:00', dataId: 'data6' },
  ];

  const chartData = [
    { date: '01-08', sales: 120, purchases: 80 },
    { date: '01-09', sales: 150, purchases: 60 },
    { date: '01-10', sales: 280, purchases: 40 },
    { date: '01-11', sales: 180, purchases: 90 },
    { date: '01-12', sales: 200, purchases: 120 },
    { date: '01-13', sales: 150, purchases: 80 },
    { date: '01-14', sales: 220, purchases: 100 },
    { date: '01-15', sales: 375, purchases: 50 },
  ];

  const getTypeConfig = (type: string) => {
    const configs: Record<string, { color: string; bgColor: string; icon: any; label: string }> = {
      sale: { color: 'text-green-400', bgColor: 'bg-green-500/20', icon: ArrowUpRight, label: '销售' },
      purchase: { color: 'text-red-400', bgColor: 'bg-red-500/20', icon: ArrowDownRight, label: '购买' },
      withdrawal: { color: 'text-red-400', bgColor: 'bg-red-500/20', icon: Download, label: '提现' },
      bonus: { color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', icon: DollarSign, label: '奖励' },
    };
    return configs[type] || configs.sale;
  };

  const filteredTransactions = transactions.filter((t) => {
    return typeFilter === 'all' || t.type === typeFilter;
  });

  return (
    <div className="min-h-screen bg-dark-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">交易记录</h1>
          <p className="text-gray-500">
            查看所有交易和财务明细
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 glass rounded-2xl"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-gray-500">总收入</span>
            </div>
            <div className="text-2xl font-bold text-green-400">$508.25</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-6 glass rounded-2xl"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <ArrowDownRight className="w-5 h-5 text-red-400" />
              </div>
              <span className="text-gray-500">总支出</span>
            </div>
            <div className="text-2xl font-bold text-red-400">$93.00</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 glass rounded-2xl"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-gray-500">交易笔数</span>
            </div>
            <div className="text-2xl font-bold">8</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="p-6 glass rounded-2xl"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <DollarSign className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="text-gray-500">净收益</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">$415.25</div>
          </motion.div>
        </div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 p-6 glass rounded-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">交易趋势</h2>
            <div className="flex gap-2">
              {['7d', '30d', '90d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={clsx(
                    'px-4 py-2 rounded-lg text-sm transition-colors',
                    timeRange === range
                      ? 'bg-primary-500/20 text-primary-400'
                      : 'text-gray-500 hover:text-white'
                  )}
                >
                  {range === '7d' ? '7天' : range === '30d' ? '30天' : '90天'}
                </button>
              ))}
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPurchases" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#22c55e"
                  fillOpacity={1}
                  fill="url(#colorSales)"
                  name="销售额"
                />
                <Area
                  type="monotone"
                  dataKey="purchases"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#colorPurchases)"
                  name="购买额"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Transactions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">交易明细</h2>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 bg-dark-100 border border-gray-700 rounded-lg focus:outline-none focus:border-primary-500"
            >
              <option value="all">全部类型</option>
              <option value="sale">销售</option>
              <option value="purchase">购买</option>
              <option value="withdrawal">提现</option>
              <option value="bonus">奖励</option>
            </select>
          </div>

          <div className="space-y-4">
            {filteredTransactions.map((transaction) => {
              const config = getTypeConfig(transaction.type);
              const Icon = config.icon;
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-dark-100 rounded-xl hover:bg-dark-100/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={clsx('w-10 h-10 rounded-full flex items-center justify-center', config.bgColor)}>
                      <Icon className={clsx('w-5 h-5', config.color)} />
                    </div>
                    <div>
                      <p className="font-medium">{transaction.title}</p>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={clsx('font-bold', transaction.amount > 0 ? 'text-green-400' : 'text-red-400')}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                    <span className={clsx('text-xs px-2 py-0.5 rounded-full', config.bgColor, config.color)}>
                      {config.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-500">暂无交易记录</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
