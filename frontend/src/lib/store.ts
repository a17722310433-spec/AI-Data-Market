import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, ConversationData, Order } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

interface DataState {
  myData: ConversationData[];
  uploadHistory: ConversationData[];
  setMyData: (data: ConversationData[]) => void;
  addData: (data: ConversationData) => void;
  updateData: (id: string, updates: Partial<ConversationData>) => void;
  removeData: (id: string) => void;
}

export const useDataStore = create<DataState>((set) => ({
  myData: [],
  uploadHistory: [],
  setMyData: (data) => set({ myData: data }),
  addData: (data) => set((state) => ({
    myData: [data, ...state.myData],
    uploadHistory: [data, ...state.uploadHistory]
  })),
  updateData: (id, updates) => set((state) => ({
    myData: state.myData.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    ),
    uploadHistory: state.uploadHistory.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    )
  })),
  removeData: (id) => set((state) => ({
    myData: state.myData.filter((item) => item.id !== id),
    uploadHistory: state.uploadHistory.filter((item) => item.id !== id)
  })),
}));

interface UIState {
  isSidebarOpen: boolean;
  activeTab: string;
  isUploadModalOpen: boolean;
  isPreviewModalOpen: boolean;
  previewData: ConversationData | null;
  setSidebarOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
  setUploadModalOpen: (open: boolean) => void;
  setPreviewModalOpen: (open: boolean) => void;
  setPreviewData: (data: ConversationData | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  activeTab: 'dashboard',
  isUploadModalOpen: false,
  isPreviewModalOpen: false,
  previewData: null,
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setUploadModalOpen: (open) => set({ isUploadModalOpen: open }),
  setPreviewModalOpen: (open) => set({ isPreviewModalOpen: open }),
  setPreviewData: (data) => set({ previewData: data }),
}));

interface MarketState {
  filters: {
    platform: string;
    category: string;
    minQuality: number;
    maxPrice: number;
    sortBy: string;
  };
  searchQuery: string;
  setFilters: (filters: Partial<MarketState['filters']>) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

export const useMarketStore = create<MarketState>((set) => ({
  filters: {
    platform: 'all',
    category: 'all',
    minQuality: 0,
    maxPrice: 100,
    sortBy: 'quality',
  },
  searchQuery: '',
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  resetFilters: () => set({
    filters: {
      platform: 'all',
      category: 'all',
      minQuality: 0,
      maxPrice: 100,
      sortBy: 'quality',
    },
    searchQuery: ''
  }),
}));
