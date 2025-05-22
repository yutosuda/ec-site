/**
 * アプリケーションの初期データをLocalStorageに設定するユーティリティ
 * SECTION_ID: 3.7 の定義に基づいて localStorage のキーを管理
 */

import { mockUserProfile } from '@/lib/data/user';
import { products } from '@/lib/data/products';

// KEM_MOCK_ をプレフィックスとするすべてのキー
const STORAGE_KEYS = {
  USERS: 'KEM_MOCK_USERS',
  CURRENT_USER_ID: 'KEM_MOCK_CURRENT_USER_ID',
  CART: (userId: string) => `KEM_MOCK_CART_${userId}`,
  FAVORITES: (userId: string) => `KEM_MOCK_FAVORITES_${userId}`,
  ORDERS: (userId: string) => `KEM_MOCK_ORDERS_${userId}`,
};

/**
 * アプリケーションの初期データを設定
 * 初回アクセス時やリセット時に使用
 */
export const initializeAppData = () => {
  try {
    // すでにユーザーデータが存在するか確認
    const existingUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    
    if (!existingUsers) {
      // モックユーザーを設定
      const initialUsers = [
        {
          ...mockUserProfile,
          // 設計書の要件に基づき、パスワードはプレーンテキストで保存
          password: 'password123',
        },
        {
          id: 'user-002',
          name: '佐藤 次郎',
          email: 'test@example.com', // テスト用アカウント
          password: 'password123',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
      console.log('Mock users initialized');
    }
    
    // ランダムな商品をピックアップしてテスト用のお気に入りとカートデータを作成
    const getRandomProducts = (count: number) => {
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };
    
    // 各ユーザーのデータが存在しない場合は初期化
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    
    users.forEach((user: any) => {
      // ユーザーのカートデータを初期化
      const cartKey = STORAGE_KEYS.CART(user.id);
      if (!localStorage.getItem(cartKey)) {
        const randomCartItems = getRandomProducts(2).map(product => ({
          productId: product.id,
          quantity: Math.floor(Math.random() * 3) + 1, // 1~3個
        }));
        
        localStorage.setItem(cartKey, JSON.stringify(randomCartItems));
      }
      
      // ユーザーのお気に入りを初期化
      const favoritesKey = STORAGE_KEYS.FAVORITES(user.id);
      if (!localStorage.getItem(favoritesKey)) {
        const randomFavorites = getRandomProducts(5).map(product => product.id);
        localStorage.setItem(favoritesKey, JSON.stringify(randomFavorites));
      }
      
      // ユーザーの注文履歴を初期化
      const ordersKey = STORAGE_KEYS.ORDERS(user.id);
      if (!localStorage.getItem(ordersKey)) {
        // サンプル注文を生成
        const mockOrders = [
          {
            id: `order-${new Date().getTime() - 86400000}`, // 1日前
            userId: user.id,
            items: getRandomProducts(3).map(product => ({
              productId: product.id,
              quantity: Math.floor(Math.random() * 3) + 1,
              unitPrice: product.price,
            })),
            totalPrice: 0, // 後で計算
            orderedAt: new Date(Date.now() - 86400000).toISOString(), // 1日前
          },
          {
            id: `order-${new Date().getTime() - 86400000 * 7}`, // 1週間前
            userId: user.id,
            items: getRandomProducts(2).map(product => ({
              productId: product.id,
              quantity: Math.floor(Math.random() * 3) + 1,
              unitPrice: product.price,
            })),
            totalPrice: 0, // 後で計算
            orderedAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 1週間前
          },
        ];
        
        // 合計金額を計算
        mockOrders.forEach(order => {
          order.totalPrice = order.items.reduce(
            (sum, item) => sum + item.unitPrice * item.quantity, 
            0
          );
        });
        
        localStorage.setItem(ordersKey, JSON.stringify(mockOrders));
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error initializing app data:', error);
    return false;
  }
};

/**
 * localStorage のサイズを取得（バイト単位）
 * @returns localStorage の使用サイズ（バイト）
 */
export const getLocalStorageSize = (): number => {
  let totalSize = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      totalSize += (localStorage[key].length + key.length) * 2; // UTF-16 エンコードの各文字は2バイト
    }
  }
  return totalSize;
};

/**
 * 古い注文履歴を削除してストレージを最適化
 * @param userId ユーザーID
 * @param maxItems 保持する注文履歴の最大数
 */
export const clearOldOrders = (userId: string, maxItems: number = 10): void => {
  const storageKey = STORAGE_KEYS.ORDERS(userId);
  const orders = JSON.parse(localStorage.getItem(storageKey) || '[]');
  
  if (orders.length > maxItems) {
    // 日付でソートして古いものを削除
    const sortedOrders = orders.sort((a: any, b: any) => 
      new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime()
    );
    
    localStorage.setItem(storageKey, JSON.stringify(sortedOrders.slice(0, maxItems)));
  }
};

// LocalStorage 操作のラッパー（例外処理付き）
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Failed to get item from localStorage: ${key}`, error);
      return null;
    }
  },
  
  setItem: (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Failed to set item in localStorage: ${key}`, error);
      return false;
    }
  },
  
  removeItem: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Failed to remove item from localStorage: ${key}`, error);
      return false;
    }
  }
}; 