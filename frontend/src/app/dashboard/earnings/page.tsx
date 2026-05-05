'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Wallet,
  CreditCard,
  Banknote,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { clsx } from 'clsx';

export default function EarningsPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'withdraw'>('overview');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('bank');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const earningsHistory = [
    { id: '1', title: '编程对话数据 #12', amount: 15.50, date: '2024-01-15', status: 'completed' },
    { id: '2', title: '数据分析对话 #8', amount: 8.75, date: '2024-01-14', status: 'completed' },
    { id: '3', title: '创意写作对话 #5', amount: 12.00, date: '2024-01-13', status: 'completed' },
    { id: '4', title: '学术论文对话 #3', amount: 18.25, date: '2024-01-12', status: 'pending' },
  ];

  const withdrawals = [
    { id: '1', amount: 50.00, method: 'bank', status: 'completed', date: '2024-01-10' },
    { id: '2', amount: 100.00, method: 'paypal', status: 'completed', date: '2024-01-05' },
    { id: '3', amount: 75.00, method: 'bank', status: 'processing', date: '2024-01-16' },
  ];

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount < 10) {
      alert('最低提现金额为 $10');
      return;
    }
    if (amount > (user?.balance || 0)) {
      alert('余额不足');
      return;
    }
    alert('提现申请已提交！');
    setWithdrawAmount('');
  };

  const getMethodIcon = (method: string) => {
    const icons: Record<string, any> = {
      bank: Banknote,
      paypal: CreditCard,
      crypto: Wallet,
    };
    return icons[method] || Banknote;
  };

  return (
    <div className="min-h-screen bg-dark-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">收益中心</h1>
          <p className="text-gray-500">
            管理您的收益和提现
          </p>
        </motion.div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-2 p-6 glass rounded-2xl"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">可提现余额</p>
                <div className="text-4xl font-bold gradient-text">
                  ${user?.balance?.toFixed(2) || '0.00'}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-r from-primary-500/20 to-secondary-500/20">
                <Wallet className="w-8 h-8 text-primary-400" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-dark-100 rounded-xl">
                <p className="text-2xl font-bold text-green-400">${user?.totalEarnings?.toFixed(2) || '0.00'}</p>
                <p className="text-sm text-gray-500">累计收益</p>
              </div>
              <div className="text-center p-4 bg-dark-100 rounded-xl">
                <p className="text-2xl font-bold text-yellow-400">$45.50</p>
                <p className="text-sm text-gray-500">待结算</p>
              </div>
              <div className="text-center p-4 bg-dark-100 rounded-xl">
                <p className="text-2xl font-bold text-blue-400">$150.00</p>
                <p className="text-sm text-gray-500">已提现</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 glass rounded-2xl"
          >
            <h3 className="font-bold mb-4">快速提现</h3>
            <div className="space-y-3">
              {[10, 25, 50, 100].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setWithdrawAmount(amount.toString())}
                  className={clsx(
                    'w-full py-3 rounded-xl border transition-all',
                    withdrawAmount === amount.toString()
                      ? 'bg-primary-500/20 border-primary-500 text-primary-400'
                      : 'border-gray-700 hover:border-gray-600'
                  )}
                >
                  ${amount}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={clsx(
              'px-6 py-3 rounded-xl font-medium transition-colors',
              activeTab === 'overview'
                ? 'bg-primary-500/20 text-primary-400'
                : 'text-gray-500 hover:text-white'
            )}
          >
            收益明细
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className={clsx(
              'px-6 py-3 rounded-xl font-medium transition-colors',
              activeTab === 'withdraw'
                ? 'bg-primary-500/20 text-primary-400'
                : 'text-gray-500 hover:text-white'
            )}
          >
            提现记录
          </button>
        </div>

        {/* Earnings History */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="font-bold mb-4">近期收益</h3>
            <div className="space-y-4">
              {earningsHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-dark-100 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      item.status === 'completed' 
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {item.status === 'completed' ? (
                        <ArrowUpRight className="w-5 h-5" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-400">+${item.amount.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">
                      {item.status === 'completed' ? '已到账' : '处理中'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Withdrawal History */}
        {activeTab === 'withdraw' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="font-bold mb-4">提现记录</h3>
            <div className="space-y-4">
              {withdrawals.map((item) => {
                const MethodIcon = getMethodIcon(item.method);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-dark-100 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-500/20 flex items-center justify-center">
                        <MethodIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium capitalize">{item.method === 'bank' ? '银行转账' : item.method === 'paypal' ? 'PayPal' : '加密货币'}</p>
                        <p className="text-sm text-gray-500">{item.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">-${item.amount.toFixed(2)}</p>
                      <p className={clsx(
                        'text-xs',
                        item.status === 'completed' ? 'text-green-400' : 'text-yellow-400'
                      )}>
                        {item.status === 'completed' ? '已完成' : '处理中'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Withdraw Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-6 glass rounded-2xl"
        >
          <h3 className="font-bold mb-6">申请提现</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">提现金额</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00"
                  className="input-field pl-8"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">最低提现金额: $10</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">提现方式</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'bank', icon: Banknote, label: '银行' },
                  { id: 'paypal', icon: CreditCard, label: 'PayPal' },
                  { id: 'crypto', icon: Wallet, label: '加密货币' },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setWithdrawMethod(method.id)}
                    className={clsx(
                      'p-4 rounded-xl border transition-all flex flex-col items-center gap-2',
                      withdrawMethod === method.id
                        ? 'bg-primary-500/20 border-primary-500'
                        : 'border-gray-700 hover:border-gray-600'
                    )}
                  >
                    <method.icon className={clsx(
                      'w-6 h-6',
                      withdrawMethod === method.id ? 'text-primary-400' : 'text-gray-500'
                    )} />
                    <span className="text-sm">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={handleWithdraw}
            className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
          >
            提交提现申请
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
