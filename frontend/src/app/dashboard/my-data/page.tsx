'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Download,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { useAuthStore, useDataStore, useUIStore } from '@/lib/store';
import { ConversationData } from '@/types';
import UploadModal from '@/components/UploadModal';
import PreviewModal from '@/components/PreviewModal';
import { clsx } from 'clsx';

export default function MyDataPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { myData, setMyData, updateData, removeData } = useDataStore();
  const { isUploadModalOpen, setUploadModalOpen } = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [previewData, setPreviewData] = useState<ConversationData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Mock data for demo
  const mockData: ConversationData[] = [
    {
      id: '1',
      userId: 'user1',
      platform: 'chatgpt',
      title: 'React组件开发深度对话',
      messages: [],
      quality: 92,
      estimatedValue: 28.50,
      category: 'coding',
      tags: ['React', 'TypeScript'],
      duration: 5400,
      messageCount: 156,
      status: 'published',
      uploadedAt: '2024-01-15T10:30:00Z',
      fileName: 'react-conversation.json',
      fileSize: 2048000,
    },
    {
      id: '2',
      userId: 'user1',
      platform: 'claude',
      title: 'Python数据分析实战案例',
      messages: [],
      quality: 88,
      estimatedValue: 18.00,
      category: 'analysis',
      tags: ['Python', 'Pandas'],
      duration: 3600,
      messageCount: 98,
      status: 'sold',
      uploadedAt: '2024-01-14T15:20:00Z',
      fileName: 'python-analysis.json',
      fileSize: 1536000,
    },
    {
      id: '3',
      userId: 'user1',
      platform: 'wenxin',
      title: '商业计划书撰写指导',
      messages: [],
      quality: 85,
      estimatedValue: 22.00,
      category: 'business',
      tags: ['商业', '创业'],
      duration: 4200,
      messageCount: 112,
      status: 'processing',
      uploadedAt: '2024-01-13T09:15:00Z',
      fileName: 'business-plan.json',
      fileSize: 1843200,
    },
    {
      id: '4',
      userId: 'user1',
      platform: 'chatgpt',
      title: '创意写作与故事构思',
      messages: [],
      quality: 78,
      estimatedValue: 12.50,
      category: 'writing',
      tags: ['创意', '小说'],
      duration: 4800,
      messageCount: 134,
      status: 'pending',
      uploadedAt: '2024-01-12T11:00:00Z',
      fileName: 'creative-writing.json',
      fileSize: 1766400,
    },
  ];

  useEffect(() => {
    setMyData(mockData);
  }, []);

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; icon: any; label: string }> = {
      pending: { color: 'text-yellow-400 bg-yellow-400/20', icon: Clock, label: '待处理' },
      processing: { color: 'text-blue-400 bg-blue-400/20', icon: Loader2, label: '评估中' },
      evaluated: { color: 'text-green-400 bg-green-400/20', icon: CheckCircle, label: '已评估' },
      published: { color: 'text-primary-400 bg-primary-400/20', icon: CheckCircle, label: '已发布' },
      sold: { color: 'text-secondary-400 bg-secondary-400/20', icon: CheckCircle, label: '已售出' },
    };
    return configs[status] || configs.pending;
  };

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, string> = {
      chatgpt: '🤖',
      claude: '🧠',
      wenxin: '📝',
      other: '💬',
    };
    return icons[platform] || '💬';
  };

  const filteredData = myData.filter((data) => {
    const matchesSearch = data.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      data.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || data.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这条数据吗？')) {
      removeData(id);
    }
  };

  return (
    <div className="min-h-screen bg-dark-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">我的数据</h1>
            <p className="text-gray-500">
              管理您上传的AI对话数据
            </p>
          </div>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            上传新数据
          </button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex flex-col sm:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索数据标题、标签..."
              className="input-field pl-12"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-dark-200 border border-gray-700 rounded-xl focus:outline-none focus:border-primary-500"
          >
            <option value="all">全部状态</option>
            <option value="pending">待处理</option>
            <option value="processing">评估中</option>
            <option value="published">已发布</option>
            <option value="sold">已售出</option>
          </select>
        </motion.div>

        {/* Data Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left p-4 font-medium text-gray-500">数据</th>
                  <th className="text-left p-4 font-medium text-gray-500">平台</th>
                  <th className="text-left p-4 font-medium text-gray-500">质量</th>
                  <th className="text-left p-4 font-medium text-gray-500">价值</th>
                  <th className="text-left p-4 font-medium text-gray-500">状态</th>
                  <th className="text-left p-4 font-medium text-gray-500">上传时间</th>
                  <th className="text-right p-4 font-medium text-gray-500">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((data) => {
                  const statusConfig = getStatusConfig(data.status);
                  return (
                    <tr 
                      key={data.id} 
                      className="border-b border-gray-800/50 hover:bg-dark-100/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-dark-100 flex items-center justify-center text-lg">
                            {getPlatformIcon(data.platform)}
                          </div>
                          <div>
                            <p className="font-medium line-clamp-1">{data.title}</p>
                            <p className="text-xs text-gray-500">{data.messageCount} 条消息</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="capitalize">{data.platform}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-dark-100 rounded-full overflow-hidden">
                            <div 
                              className={clsx(
                                'h-full',
                                data.quality >= 85 ? 'bg-green-500' :
                                data.quality >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                              )}
                              style={{ width: `${data.quality}%` }}
                            />
                          </div>
                          <span className="text-sm">{data.quality}%</span>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-accent-400">
                        ${data.estimatedValue}
                      </td>
                      <td className="p-4">
                        <span className={clsx('inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm', statusConfig.color)}>
                          <statusConfig.icon className="w-4 h-4" />
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500">
                        {new Date(data.uploadedAt).toLocaleDateString('zh-CN')}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setPreviewData(data)}
                            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                            title="预览"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {data.status === 'published' && (
                            <button
                              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                              title="下载"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(data.id)}
                            className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                            title="删除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-lg font-bold mb-2">暂无数据</h3>
              <p className="text-gray-500 mb-4">上传您的第一个AI对话数据开始变现</p>
              <button
                onClick={() => setUploadModalOpen(true)}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                上传数据
              </button>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {filteredData.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-500">
              显示 {(filteredData.length)} 条结果
            </p>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 rounded-xl border border-gray-700 hover:bg-gray-800 transition-colors">
                上一页
              </button>
              <button className="px-4 py-2 rounded-xl border border-gray-700 hover:bg-gray-800 transition-colors">
                下一页
              </button>
            </div>
          </div>
        )}
      </div>

      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setUploadModalOpen(false)} 
      />

      <PreviewModal
        data={previewData}
        isOpen={!!previewData}
        onClose={() => setPreviewData(null)}
      />
    </div>
  );
}
