'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  Upload, 
  FileText, 
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Clock
} from 'lucide-react';
import { useAuthStore, useDataStore, useUIStore } from '@/lib/store';
import Sidebar from '@/components/Sidebar';
import UploadModal from '@/components/UploadModal';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { myData, setMyData } = useDataStore();
  const { isUploadModalOpen, setUploadModalOpen, setActiveTab } = useUIStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Mock data for demo
  const stats = [
    {
      label: '账户余额',
      value: `$${user?.balance?.toFixed(2) || '0.00'}`,
      change: '+12.5%',
      isPositive: true,
      icon: DollarSign,
      color: 'text-green-400',
    },
    {
      label: '累计收益',
      value: `$${user?.totalEarnings?.toFixed(2) || '0.00'}`,
      change: '+28.3%',
      isPositive: true,
      icon: TrendingUp,
      color: 'text-primary-400',
    },
    {
      label: '上传数据',
      value: '24',
      change: '+5',
      isPositive: true,
      icon: Upload,
      color: 'text-secondary-400',
    },
    {
      label: '已售出',
      value: '18',
      change: '+3',
      isPositive: true,
      icon: FileText,
      color: 'text-accent-400',
    },
  ];

  const recentTransactions = [
    {
      id: '1',
      title: '高质量编程对话数据',
      amount: 12.50,
      type: 'sale',
      date: '2024-01-15',
    },
    {
      id: '2',
      title: '数据分析对话集',
      amount: 8.75,
      type: 'sale',
      date: '2024-01-14',
    },
    {
      id: '3',
      title: '创意写作对话',
      amount: 15.00,
      type: 'sale',
      date: '2024-01-13',
    },
    {
      id: '4',
      title: '提现到银行账户',
      amount: -50.00,
      type: 'withdrawal',
      date: '2024-01-12',
    },
  ];

  const qualityDistribution = [
    { range: '90-100%', count: 5, color: 'bg-green-500' },
    { range: '80-89%', count: 8, color: 'bg-green-400' },
    { range: '70-79%', count: 6, color: 'bg-yellow-500' },
    { range: '60-69%', count: 3, color: 'bg-orange-500' },
    { range: '<60%', count: 2, color: 'bg-red-500' },
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-300 flex">
      <Sidebar />
      
      <main className="flex-1 lg:ml-64 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">
              欢迎回来，{user?.name} 👋
            </h1>
            <p className="text-gray-500">
              这里显示您账户的实时数据和分析
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 glass rounded-2xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-dark-100 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${
                    stat.isPositive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stat.isPositive ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Transactions */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 glass rounded-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">最近交易</h2>
                  <button 
                    onClick={() => router.push('/dashboard/transactions')}
                    className="text-sm text-primary-400 hover:text-primary-300"
                  >
                    查看全部
                  </button>
                </div>
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-dark-100 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'sale' 
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {transaction.type === 'sale' ? (
                            <ArrowUpRight className="w-5 h-5" />
                          ) : (
                            <ArrowDownRight className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.title}</p>
                          <p className="text-sm text-gray-500">{transaction.date}</p>
                        </div>
                      </div>
                      <div className={`font-bold ${
                        transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Quality Distribution */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-6 glass rounded-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">质量分布</h2>
                  <Star className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="space-y-4">
                  {qualityDistribution.map((item) => (
                    <div key={item.range} className="flex items-center gap-3">
                      <div className="w-16 text-sm text-gray-500">{item.range}</div>
                      <div className="flex-1 h-3 bg-dark-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.count / 24) * 100}%` }}
                          transition={{ delay: 0.6 }}
                          className={`h-full ${item.color}`}
                        />
                      </div>
                      <div className="w-6 text-sm text-right">{item.count}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 p-6 glass rounded-2xl"
          >
            <h2 className="text-xl font-bold mb-6">快速操作</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setUploadModalOpen(true)}
                className="p-6 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-xl border border-primary-500/30 hover:border-primary-500/50 transition-all group"
              >
                <Upload className="w-8 h-8 text-primary-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold mb-1">上传新数据</h3>
                <p className="text-sm text-gray-500">上传您的AI对话数据</p>
              </button>
              
              <button
                onClick={() => router.push('/dashboard/my-data')}
                className="p-6 bg-gradient-to-r from-secondary-500/20 to-accent-500/20 rounded-xl border border-secondary-500/30 hover:border-secondary-500/50 transition-all group"
              >
                <FileText className="w-8 h-8 text-secondary-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold mb-1">查看我的数据</h3>
                <p className="text-sm text-gray-500">管理已上传的数据</p>
              </button>
              
              <button
                onClick={() => router.push('/dashboard/earnings')}
                className="p-6 bg-gradient-to-r from-accent-500/20 to-green-500/20 rounded-xl border border-accent-500/30 hover:border-accent-500/50 transition-all group"
              >
                <DollarSign className="w-8 h-8 text-accent-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold mb-1">收益中心</h3>
                <p className="text-sm text-gray-500">查看收益明细和提现</p>
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setUploadModalOpen(false)} 
      />
    </div>
  );
}
