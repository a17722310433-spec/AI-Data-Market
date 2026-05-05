'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, Download, Star, MessageSquare, Clock, DollarSign } from 'lucide-react';
import { ConversationData, DATA_CATEGORIES } from '@/types';
import { useUIStore } from '@/lib/store';

interface PreviewModalProps {
  data: ConversationData | null;
  isOpen: boolean;
  onClose: () => void;
  onPurchase?: (dataId: string) => void;
}

export default function PreviewModal({ data, isOpen, onClose, onPurchase }: PreviewModalProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'details' | 'reviews'>('preview');
  const [previewMessageIndex, setPreviewMessageIndex] = useState(0);

  if (!isOpen || !data) return null;

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, string> = {
      chatgpt: '🤖',
      claude: '🧠',
      wenxin: '📝',
      other: '💬',
    };
    return icons[platform] || '💬';
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}秒`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}分钟`;
    return `${Math.floor(seconds / 3600)}小时 ${Math.floor((seconds % 3600) / 60)}分钟`;
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 80) return 'text-green-400';
    if (quality >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-dark-200 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex-shrink-0 p-6 border-b border-gray-800">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{getPlatformIcon(data.platform)}</span>
                  <h2 className="text-xl font-bold">{data.title}</h2>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {data.messageCount} 条消息
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDuration(data.duration)}
                  </span>
                  <span className={`flex items-center gap-1 ${getQualityColor(data.quality)}`}>
                    <Star className="w-4 h-4" />
                    质量 {data.quality}%
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-accent-400">
                    ${data.estimatedValue}
                  </div>
                  <div className="text-xs text-gray-500">预估价值</div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mt-4">
              {(['preview', 'details', 'reviews'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab
                      ? 'bg-primary-500/20 text-primary-400'
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {tab === 'preview' ? '消息预览' : tab === 'details' ? '详细信息' : '评价'}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'preview' && (
              <div className="space-y-4">
                {/* Message Navigator */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">
                    消息 {previewMessageIndex + 1} / {data.messages.length}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPreviewMessageIndex(Math.max(0, previewMessageIndex - 1))}
                      disabled={previewMessageIndex === 0}
                      className="px-3 py-1 rounded-lg bg-gray-800 text-sm disabled:opacity-50 hover:bg-gray-700 transition-colors"
                    >
                      上一条
                    </button>
                    <button
                      onClick={() => setPreviewMessageIndex(Math.min(data.messages.length - 1, previewMessageIndex + 1))}
                      disabled={previewMessageIndex === data.messages.length - 1}
                      className="px-3 py-1 rounded-lg bg-gray-800 text-sm disabled:opacity-50 hover:bg-gray-700 transition-colors"
                    >
                      下一条
                    </button>
                  </div>
                </div>

                {/* Messages */}
                {data.messages.slice(0, 10).map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-xl ${
                      message.role === 'user'
                        ? 'bg-primary-500/20 border border-primary-500/30 ml-8'
                        : 'bg-secondary-500/20 border border-secondary-500/30 mr-8'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`badge ${message.role === 'user' ? 'badge-primary' : 'badge-secondary'}`}>
                        {message.role === 'user' ? '用户' : 'AI助手'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(message.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </motion.div>
                ))}

                {data.messages.length > 10 && (
                  <div className="text-center py-4 text-gray-500">
                    还有 {data.messages.length - 10} 条消息未显示
                  </div>
                )}
              </div>
            )}

            {activeTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Stats */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">数据统计</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-dark-100 rounded-xl">
                      <div className="text-2xl font-bold text-primary-400">{data.quality}%</div>
                      <div className="text-sm text-gray-500">数据质量</div>
                    </div>
                    <div className="p-4 bg-dark-100 rounded-xl">
                      <div className="text-2xl font-bold text-secondary-400">{data.messageCount}</div>
                      <div className="text-sm text-gray-500">消息总数</div>
                    </div>
                    <div className="p-4 bg-dark-100 rounded-xl">
                      <div className="text-2xl font-bold text-accent-400">
                        {formatDuration(data.duration)}
                      </div>
                      <div className="text-sm text-gray-500">对话时长</div>
                    </div>
                    <div className="p-4 bg-dark-100 rounded-xl">
                      <div className="text-2xl font-bold text-green-400">${data.estimatedValue}</div>
                      <div className="text-sm text-gray-500">预估价值</div>
                    </div>
                  </div>
                </div>

                {/* Categories & Tags */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">分类标签</h3>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">主要分类</p>
                    <div className="flex flex-wrap gap-2">
                      {data.category && (
                        <span className="badge badge-primary">
                          {DATA_CATEGORIES.find(c => c.id === data.category)?.name || data.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">标签</p>
                    <div className="flex flex-wrap gap-2">
                      {data.tags.map((tag, index) => (
                        <span key={index} className="badge badge-secondary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* File Info */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="font-bold text-lg">文件信息</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-dark-100 rounded-xl">
                      <div className="text-sm text-gray-500">文件名</div>
                      <div className="font-medium">{data.fileName}</div>
                    </div>
                    <div className="p-4 bg-dark-100 rounded-xl">
                      <div className="text-sm text-gray-500">文件大小</div>
                      <div className="font-medium">{(data.fileSize / 1024 / 1024).toFixed(2)} MB</div>
                    </div>
                    <div className="p-4 bg-dark-100 rounded-xl">
                      <div className="text-sm text-gray-500">上传时间</div>
                      <div className="font-medium">{new Date(data.uploadedAt).toLocaleString()}</div>
                    </div>
                    <div className="p-4 bg-dark-100 rounded-xl">
                      <div className="text-sm text-gray-500">状态</div>
                      <div className="font-medium">
                        {data.status === 'published' ? '已发布' : data.status}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-lg font-bold mb-2">暂无评价</h3>
                <p className="text-gray-500">购买后您可以对数据质量进行评价</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 flex items-center justify-between p-6 border-t border-gray-800">
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
                <Star className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
                <Download className="w-5 h-5" />
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl border border-gray-700 hover:bg-gray-800 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => onPurchase?.(data.id)}
                className="btn-primary flex items-center gap-2"
              >
                <DollarSign className="w-4 h-4" />
                立即购买
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
