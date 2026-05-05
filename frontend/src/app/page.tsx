'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Shield, 
  TrendingUp, 
  Users, 
  Lock, 
  ArrowRight, 
  Play,
  CheckCircle,
  BarChart3,
  DollarSign,
  Clock,
  FileText,
  Star
} from 'lucide-react';

export default function HomePage() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'AI智能评估',
      description: '采用先进的大模型技术，自动分析对话质量、分类标签和商业价值，给出公正透明的估价'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: '数据安全加密',
      description: '端到端加密传输，分布式存储，隐私保护技术确保您的数据安全'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: '实时价值追踪',
      description: '基于市场供需动态定价，实时反映数据稀缺性和商业价值变化'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: '全球数据市场',
      description: '连接全球AI企业与数据所有者，透明交易，智能匹配需求'
    }
  ];

  const stats = [
    { label: '已注册用户', value: '50,000+', icon: Users },
    { label: '数据交易量', value: '$2.5M+', icon: DollarSign },
    { label: '日均上传', value: '10,000+', icon: FileText },
    { label: '企业客户', value: '200+', icon: BarChart3 },
  ];

  const steps = [
    {
      step: 1,
      title: '上传对话数据',
      description: '从ChatGPT、Claude等平台导出一键上传',
      icon: <Upload className="w-6 h-6" />,
    },
    {
      step: 2,
      title: 'AI自动评估',
      description: '智能分析质量、分类，给出公正估价',
      icon: <Zap className="w-6 h-6" />,
    },
    {
      step: 3,
      title: '发布到市场',
      description: '数据上架，全球AI企业可见并购买',
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      step: 4,
      title: '获得收益',
      description: '交易完成后即时获得收益分成',
      icon: <DollarSign className="w-6 h-6" />,
    },
  ];

  const testimonials = [
    {
      name: '张工程师',
      role: 'AI研究员 @ 某科技巨头',
      avatar: '👨‍💻',
      content: 'DataChain让我的AI对话数据产生了实际价值，每月能获得可观的额外收入。',
      rating: 5,
    },
    {
      name: '李产品经理',
      role: '某AI创业公司CEO',
      avatar: '👩‍💼',
      content: '通过DataChain获取的高质量训练数据，显著提升了我们的模型性能。',
      rating: 5,
    },
    {
      name: '王开发者',
      role: '独立AI开发者',
      avatar: '👨‍🔬',
      content: '平台的AI评估系统非常准确，数据的质量评分和实际使用效果高度一致。',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-500/10 rounded-full blur-3xl" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm">2026年AI数据风口已至 · 加入DataChain</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="gradient-text">AI对话数据</span>
              <br />
              <span className="text-white">交易市场先驱</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto"
            >
              2026年AI原始人类数据将耗尽，您的对话数据将成为
              <span className="text-primary-400">各巨头争抢的资产</span>
              。DataChain让您的数据创造真正的价值。
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <Link href="/register" className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
                立即开始变现
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button 
                onClick={() => setIsVideoModalOpen(true)}
                className="px-8 py-4 rounded-xl border border-gray-700 hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                观看演示
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="p-6 glass rounded-2xl"
                >
                  <stat.icon className="w-6 h-6 text-primary-400 mx-auto mb-2" />
                  <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-gray-600 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-gray-600 rounded-full" />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              为什么<span className="gradient-text">现在</span>是最佳时机？
            </h2>
            <p className="text-xl text-gray-400">
              AI行业正面临前所未有的数据危机，而您手中握有解决方案
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 bg-red-500/10 border border-red-500/30 rounded-2xl"
            >
              <div className="text-red-400 text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold mb-4">危机：AI数据枯竭</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  OpenAI、Google等公司预测：高质量人类生成数据将在2026年前耗尽
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  现有AI模型训练数据质量下降，模型性能提升遇瓶颈
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  各AI公司争相布局数据资产，数据价值飙升
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 bg-green-500/10 border border-green-500/30 rounded-2xl"
            >
              <div className="text-green-400 text-5xl mb-4">💡</div>
              <h3 className="text-xl font-bold mb-4">机遇：数据即资产</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  用户与AI的对话数据是训练下一代AI的黄金资源
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  早期参与者将获得数据稀缺红利，实现财富增值
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  DataChain为您提供安全、透明、高效的数据变现渠道
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-dark-200/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              如何<span className="gradient-text">开始</span>
            </h2>
            <p className="text-xl text-gray-400">
              简单四步，将您的对话数据转化为财富
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative p-6 glass rounded-2xl card-hover"
              >
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500" />
                )}
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-xl font-bold mb-4">
                  {step.step}
                </div>
                <div className="text-primary-400 mb-3">{step.icon}</div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/register" className="btn-primary inline-flex items-center gap-2">
              立即开始
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              为什么选择<span className="gradient-text">DataChain</span>
            </h2>
            <p className="text-xl text-gray-400">
              领先的技术和安全保障，让您的数据价值最大化
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 data-card rounded-2xl"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-primary-500/20 to-secondary-500/20 flex items-center justify-center text-primary-400 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24 bg-dark-200/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              数据<span className="gradient-text">定价参考</span>
            </h2>
            <p className="text-xl text-gray-400">
              透明定价，数据价值一目了然
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: '基础对话', price: '$0.5-2', quality: '60-70%', desc: '日常闲聊问答类对话' },
              { name: '专业对话', price: '$2-10', quality: '70-85%', desc: '包含技术解答、代码生成等' },
              { name: '高质量数据', price: '$10-50+', quality: '85%+', desc: '深度分析、创意写作、长对话' },
            ].map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-8 rounded-2xl border ${
                  index === 1 
                    ? 'bg-gradient-to-b from-primary-500/20 to-secondary-500/20 border-primary-500/50 relative'
                    : 'bg-dark-100 border-gray-800'
                }`}
              >
                {index === 1 && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full text-sm font-medium">
                    推荐
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                <div className="text-3xl font-bold gradient-text mb-1">{tier.price}</div>
                <div className="text-sm text-gray-500 mb-4">质量: {tier.quality}</div>
                <p className="text-gray-400 text-sm">{tier.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              * 最终价格由AI评估系统根据对话质量、主题稀缺性等因素综合确定
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              用户<span className="gradient-text">真实评价</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 glass rounded-2xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-400 mb-4">{testimonial.content}</p>
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 animated-gradient opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              立即加入<span className="gradient-text">DataChain</span>
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              首批用户享受高额补贴，数据变现从现在开始
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
                免费注册
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/login" className="text-gray-400 hover:text-white transition-colors">
                已有账号？立即登录
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl animated-gradient flex items-center justify-center">
                  <span className="text-xl">💎</span>
                </div>
                <div>
                  <h3 className="font-bold gradient-text">DataChain</h3>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                下一代AI数据交易市场，让您的对话数据创造真正价值。
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">产品</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/market" className="hover:text-white transition-colors">数据市场</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">价格说明</Link></li>
                <li><Link href="/enterprise" className="hover:text-white transition-colors">企业服务</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">支持</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/help" className="hover:text-white transition-colors">帮助中心</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">常见问题</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">联系我们</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">法律</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/privacy" className="hover:text-white transition-colors">隐私政策</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">服务条款</Link></li>
                <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie政策</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © 2024 DataChain. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-500 hover:text-white transition-colors">Twitter</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">Discord</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80"
            onClick={() => setIsVideoModalOpen(false)}
          />
          <div className="relative w-full max-w-3xl aspect-video bg-dark-100 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Play className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                <p className="text-gray-500">演示视频加载中...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Import Upload icon
function Upload(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}
