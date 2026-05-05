'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import { useAuthStore, useMarketStore, useUIStore } from '@/lib/store';
import { ConversationData, DATA_CATEGORIES } from '@/types';
import PreviewModal from '@/components/PreviewModal';
import { clsx } from 'clsx';

export default function MarketPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { filters, setFilters, searchQuery, setSearchQuery } = useMarketStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [previewData, setPreviewData] = useState<ConversationData | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Mock market data
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
      tags: ['React', 'TypeScript', '组件设计'],
      duration: 5400,
      messageCount: 156,
      status: 'published',
      uploadedAt: '2024-01-15T10:30:00Z',
      fileName: 'react-conversation.json',
      fileSize: 2048000,
    },
    {
      id: '2',
      userId: 'user2',
      platform: 'claude',
      title: 'Python数据分析实战案例',
      messages: [],
      quality: 88,
      estimatedValue: 18.00,
      category: 'analysis',
      tags: ['Python', 'Pandas', '数据可视化'],
      duration: 3600,
      messageCount: 98,
      status: 'published',
      uploadedAt: '2024-01-14T15:20:00Z',
      fileName: 'python-analysis.json',
      fileSize: 1536000,
    },
    {
      id: '3',
      userId: 'user3',
      platform: 'chatgpt',
      title: '商业计划书撰写指导',
      messages: [],
      quality: 85,
      estimatedValue: 22.00,
      category: 'business',
      tags: ['商业', '创业', '战略规划'],
      duration: 4200,
      messageCount: 112,
      status: 'published',
      uploadedAt: '2024-01-13T09:15:00Z',
      fileName: 'business-plan.json',
      fileSize: 1843200,
    },
    {
      id: '4',
      userId: 'user4',
      platform: 'wenxin',
      title: '学术论文润色与修改',
      messages: [],
      quality: 95,
      estimatedValue: 35.00,
      category: 'research',
      tags: ['学术', '论文', '英语润色'],
      duration: 7200,
      messageCount: 203,
      status: 'published',
      uploadedAt: '2024-01-12T14:45:00Z',
      fileName: 'academic-paper.json',
      fileSize: 2560000,
    },
    {
      id: '5',
      userId: 'user5',
      platform: 'claude',
      title: '创意写作与故事构思',
      messages: [],
      quality: 78,
      estimatedValue: 12.50,
      category: 'writing',
      tags: ['创意', '小说', '叙事技巧'],
      duration: 4800,
      messageCount: 134,
      status: 'published',
      uploadedAt: '2024-01-11T11:00:00Z',
      fileName: 'creative-writing.json',
      fileSize: 1766400,
    },
    {
      id: '6',
      userId: 'user6',
      platform: 'chatgpt',
      title: '机器学习模型优化讨论',
      messages: [],
      quality: 90,
      estimatedValue: 25.00,
      category: 'coding',
      tags: ['ML', '深度学习', '模型优化'],
      duration: 6600,
      messageCount: 178,
      status: 'published',
      uploadedAt: '2024-01-10T16:30:00Z',
      fileName: 'ml-optimization.json',
      fileSize: 2355200,
    },
  ];

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, string> = {
      chatgpt: '🤖',
      claude: '🧠',
      wenxin: '📝',
      other: '💬',
    };
    return icons[platform] || '💬';
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 85) return 'text-green-400 bg-green-500/20';
    if (quality >= 70) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 3600) return `${Math.floor(seconds / 60)}分钟`;
    return `${Math.floor(seconds / 3600)}小时`;
  };

  const handlePurchase = (dataId: string) => {
    // Redirect to checkout
    router.push(`/checkout/${dataId}`);
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
          <h1 className="text-3xl font-bold mb-2">数据市场</h1>
          <p className="text-gray-500">
            浏览并购买高质量AI对话数据
          </p>
        </motion.div>

        {/* Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 p-4 glass rounded-2xl"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
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

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3">
              {/* Platform Filter */}
              <select
                value={filters.platform}
                onChange={(e) => setFilters({ platform: e.target.value })}
                className="px-4 py-3 bg-dark-100 border border-gray-700 rounded-xl focus:outline-none focus:border-primary-500"
              >
                <option value="all">全部平台</option>
                <option value="chatgpt">ChatGPT</option>
                <option value="claude">Claude</option>
                <option value="wenxin">文心一言</option>
              </select>

              {/* Category Filter */}
              <select
                value={filters.category}
                onChange={(e) => setFilters({ category: e.target.value })}
                className="px-4 py-3 bg-dark-100 border border-gray-700 rounded-xl focus:outline-none focus:border-primary-500"
              >
                <option value="all">全部分类</option>
                {DATA_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>

              {/* Quality Filter */}
              <div className="flex items-center gap-2 px-4 py-3 bg-dark-100 border border-gray-700 rounded-xl">
                <span className="text-sm text-gray-500">质量:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.minQuality}
                  onChange={(e) => setFilters({ minQuality: parseInt(e.target.value) })}
                  className="w-20"
                />
                <span className="text-sm">{filters.minQuality}%+</span>
              </div>

              {/* View Toggle */}
              <div className="flex items-center border border-gray-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={clsx(
                    'p-3 transition-colors',
                    viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-gray-500 hover:text-white'
                  )}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={clsx(
                    'p-3 transition-colors',
                    viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-gray-500 hover:text-white'
                  )}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="mb-4 text-gray-500">
          找到 {mockData.length} 个结果
        </div>

        {/* Data Grid/List */}
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
        }>
          {mockData.map((data, index) => (
            <motion.div
              key={data.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={clsx(
                'glass rounded-2xl overflow-hidden cursor-pointer card-hover',
                viewMode === 'list' && 'flex'
              )}
              onClick={() => setPreviewData(data)}
            >
              {viewMode === 'grid' ? (
                <>
                  {/* Card Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-3xl">{getPlatformIcon(data.platform)}</span>
                      <span className={clsx('px-3 py-1 rounded-full text-sm font-medium', getQualityColor(data.quality))}>
                        {data.quality}%
                      </span>
                    </div>
                    <h3 className="font-bold mb-2 line-clamp-2">{data.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {data.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="badge badge-primary text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Stats */}
                  <div className="px-6 py-4 bg-dark-100/50 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-gray-500">
                      <span>{data.messageCount} 条</span>
                      <span>{formatDuration(data.duration)}</span>
                    </div>
                    <div className="text-xl font-bold text-accent-400">
                      ${data.estimatedValue}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* List Item */}
                  <div className="flex items-center gap-4 p-4 flex-1">
                    <span className="text-4xl">{getPlatformIcon(data.platform)}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold truncate">{data.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <span>{data.messageCount} 条消息</span>
                        <span>{formatDuration(data.duration)}</span>
                        <div className="flex gap-2">
                          {data.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="badge badge-primary text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 p-4 border-t border-gray-800">
                    <span className={clsx('px-3 py-1 rounded-full text-sm font-medium', getQualityColor(data.quality))}>
                      {data.quality}%
                    </span>
                    <div className="text-xl font-bold text-accent-400">
                      ${data.estimatedValue}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePurchase(data.id);
                      }}
                      className="btn-primary text-sm py-2 px-4"
                    >
                      购买
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 rounded-xl border border-gray-700 hover:bg-gray-800 transition-colors">
            加载更多
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        data={previewData}
        isOpen={!!previewData}
        onClose={() => setPreviewData(null)}
        onPurchase={handlePurchase}
      />
    </div>
  );
}
