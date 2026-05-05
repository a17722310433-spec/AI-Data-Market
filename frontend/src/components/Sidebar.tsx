import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  Home, 
  Upload, 
  ShoppingBag, 
  Wallet, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X,
  BarChart3,
  FileText,
  Users,
  ChevronDown
} from 'lucide-react';
import { useAuthStore, useUIStore } from '@/lib/store';
import { clsx } from 'clsx';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { isSidebarOpen, setSidebarOpen, activeTab, setActiveTab } = useUIStore();
  
  const userMenuItems = [
    { id: 'dashboard', label: '控制台', icon: Home, path: '/dashboard' },
    { id: 'upload', label: '上传数据', icon: Upload, path: '/dashboard/upload' },
    { id: 'my-data', label: '我的数据', icon: FileText, path: '/dashboard/my-data' },
    { id: 'earnings', label: '收益中心', icon: Wallet, path: '/dashboard/earnings' },
    { id: 'transactions', label: '交易记录', icon: BarChart3, path: '/dashboard/transactions' },
    { id: 'profile', label: '个人设置', icon: Settings, path: '/dashboard/profile' },
  ];

  const enterpriseMenuItems = [
    { id: 'market', label: '数据市场', icon: ShoppingBag, path: '/enterprise/market' },
    { id: 'orders', label: '订单管理', icon: FileText, path: '/enterprise/orders' },
    { id: 'downloads', label: '数据下载', icon: User, path: '/enterprise/downloads' },
    { id: 'analytics', label: '数据分析', icon: BarChart3, path: '/enterprise/analytics' },
  ];

  const menuItems = user?.role === 'enterprise' 
    ? [...userMenuItems.slice(0, 2), ...enterpriseMenuItems, ...userMenuItems.slice(4)]
    : userMenuItems;

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed left-0 top-0 h-full w-64 bg-dark-200 border-r border-gray-800 z-50 transition-transform duration-300',
          'lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-800">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl animated-gradient flex items-center justify-center">
                <span className="text-xl">💎</span>
              </div>
              <div>
                <h1 className="text-lg font-bold gradient-text">DataChain</h1>
                <p className="text-xs text-gray-500">AI数据交易市场</p>
              </div>
            </Link>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>

          {/* User Info */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-lg font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="badge badge-primary">
                {user?.role === 'enterprise' ? '企业用户' : '个人用户'}
              </span>
              {user?.isVerified && (
                <span className="badge badge-secondary">已认证</span>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id || pathname === item.path;
                return (
                  <li key={item.id}>
                    <Link
                      href={item.path}
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                      }}
                      className={clsx(
                        'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                        isActive
                          ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">退出登录</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-30 p-3 rounded-xl bg-dark-200 border border-gray-800 text-white lg:hidden"
      >
        <Menu className="w-5 h-5" />
      </button>
    </>
  );
}
