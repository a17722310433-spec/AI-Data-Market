'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuthStore, useUIStore } from '@/lib/store';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  ChevronDown,
  LayoutDashboard,
  Upload,
  Wallet,
  Settings
} from 'lucide-react';

export default function Header() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const { setSidebarOpen } = useUIStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-40 bg-dark-200/80 backdrop-blur-xl border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left - Logo */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-800 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl animated-gradient flex items-center justify-center">
                <span className="text-xl">💎</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold gradient-text">DataChain</h1>
                <p className="text-xs text-gray-500">AI数据交易市场</p>
              </div>
            </Link>
          </div>

          {/* Center - Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              首页
            </Link>
            <Link href="/market" className="text-gray-400 hover:text-white transition-colors">
              数据市场
            </Link>
            <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
              关于我们
            </Link>
            <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">
              价格
            </Link>
          </nav>

          {/* Right - Auth */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-sm font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">${user.balance?.toFixed(2)}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {isDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 py-2 bg-dark-100 rounded-xl border border-gray-800 shadow-xl z-20">
                      <div className="px-4 py-3 border-b border-gray-800">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="badge badge-primary text-xs">
                            ${user.balance?.toFixed(2)} 余额
                          </span>
                          <span className="badge badge-secondary text-xs">
                            ${user.totalEarnings?.toFixed(2)} 收益
                          </span>
                        </div>
                      </div>
                      
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span className="text-sm">控制台</span>
                      </Link>
                      
                      <Link
                        href="/dashboard/upload"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Upload className="w-4 h-4" />
                        <span className="text-sm">上传数据</span>
                      </Link>
                      
                      <Link
                        href="/dashboard/earnings"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Wallet className="w-4 h-4" />
                        <span className="text-sm">收益中心</span>
                      </Link>
                      
                      <Link
                        href="/dashboard/profile"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">设置</span>
                      </Link>
                      
                      <div className="border-t border-gray-800 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2 text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm">退出登录</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  登录
                </Link>
                <Link
                  href="/register"
                  className="btn-primary text-sm py-2 px-4"
                >
                  注册
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-800 lg:hidden"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-800">
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                首页
              </Link>
              <Link
                href="/market"
                className="px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                数据市场
              </Link>
              <Link
                href="/about"
                className="px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                关于我们
              </Link>
              <Link
                href="/pricing"
                className="px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                价格
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
