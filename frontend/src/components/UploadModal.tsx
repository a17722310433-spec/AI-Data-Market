'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore, useDataStore } from '@/lib/store';
import { dataAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { SUPPORTED_PLATFORMS, PlatformConfig } from '@/types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const { user } = useAuthStore();
  const { addData } = useDataStore();
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
      'text/plain': ['.txt', '.md'],
      'text/html': ['.html'],
      'application/csv': ['.csv'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!selectedPlatform || files.length === 0) {
      toast.error('请选择平台并上传文件');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);

      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));
      formData.append('platform', selectedPlatform);

      const response = await dataAPI.upload(formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.data.success) {
        setEvaluationResult(response.data.evaluation);
        addData(response.data.data);
        toast.success('上传成功！数据已通过AI评估');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || '上传失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFiles([]);
    setSelectedPlatform('');
    setEvaluationResult(null);
    setUploadProgress(0);
    onClose();
  };

  if (!isOpen) return null;

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
          onClick={handleClose}
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-2xl bg-dark-200 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div>
              <h2 className="text-xl font-bold">上传对话数据</h2>
              <p className="text-sm text-gray-500 mt-1">上传您与AI的对话记录，立即获得AI评估</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Platform Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">选择AI平台</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SUPPORTED_PLATFORMS.map((platform) => (
                  <button
                    key={platform.name}
                    onClick={() => setSelectedPlatform(platform.name)}
                    className={`p-4 rounded-xl border transition-all duration-200 ${
                      selectedPlatform === platform.name
                        ? 'bg-primary-500/20 border-primary-500'
                        : 'bg-dark-100 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-2xl mb-2">{platform.icon}</div>
                    <div className="text-sm font-medium">{platform.name}</div>
                  </button>
                ))}
              </div>
              {selectedPlatform && (
                <p className="mt-3 text-sm text-gray-500">
                  导出方式: {SUPPORTED_PLATFORMS.find(p => p.name === selectedPlatform)?.exportInstructions}
                </p>
              )}
            </div>

            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                isDragActive
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragActive ? 'text-primary-400' : 'text-gray-500'}`} />
              <p className="text-lg font-medium mb-2">
                {isDragActive ? '释放以上传文件' : '拖拽文件到此处'}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                或点击选择文件上传
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="badge badge-primary">.json</span>
                <span className="badge badge-secondary">.html</span>
                <span className="badge badge-accent">.txt</span>
                <span className="badge badge-primary">.md</span>
                <span className="badge badge-secondary">.csv</span>
              </div>
              <p className="mt-4 text-xs text-gray-600">
                单个文件最大 50MB，支持批量上传
              </p>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-3">
                  已选择 {files.length} 个文件
                </label>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-dark-100 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <File className="w-5 h-5 text-primary-400" />
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="p-1 rounded hover:bg-gray-800 transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">上传中...</span>
                  <span className="text-sm text-primary-400">{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-dark-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Evaluation Result */}
            {evaluationResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <div>
                    <h3 className="font-bold">评估完成！</h3>
                    <p className="text-sm text-gray-500">AI已完成数据质量分析</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-dark-100 rounded-lg">
                    <div className="text-2xl font-bold text-primary-400">
                      {evaluationResult.quality}%
                    </div>
                    <div className="text-xs text-gray-500">数据质量</div>
                  </div>
                  <div className="text-center p-3 bg-dark-100 rounded-lg">
                    <div className="text-2xl font-bold text-secondary-400">
                      ${evaluationResult.estimatedValue}
                    </div>
                    <div className="text-xs text-gray-500">预估价值</div>
                  </div>
                  <div className="text-center p-3 bg-dark-100 rounded-lg">
                    <div className="text-2xl font-bold text-accent-400">
                      {evaluationResult.categories?.length || 0}
                    </div>
                    <div className="text-xs text-gray-500">识别分类</div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">数据摘要:</p>
                  <p className="text-sm">{evaluationResult.summary}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {evaluationResult.tags?.map((tag: string, index: number) => (
                    <span key={index} className="badge badge-primary text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-800">
            <button
              onClick={handleClose}
              className="px-6 py-2 rounded-xl border border-gray-700 hover:bg-gray-800 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedPlatform || files.length === 0 || isUploading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isUploading ? '上传中...' : '上传并评估'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
