'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { products } from '@/lib/data/products';
import { safeLocalStorage } from '@/lib/utils/initializeAppData';

/**
 * お気に入り管理用のカスタムフック
 * ユーザーごとのお気に入りデータをLocalStorageで管理
 */
export const useFavorites = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // お気に入りキー取得
  const getFavoritesKey = useCallback(() => {
    if (!isAuthenticated || !currentUser) {
      return null;
    }
    return `KEM_MOCK_FAVORITES_${currentUser.id}`;
  }, [isAuthenticated, currentUser]);
  
  // お気に入りデータ読み込み
  const loadFavorites = useCallback(() => {
    const favoritesKey = getFavoritesKey();
    if (!favoritesKey) {
      setFavorites([]);
      return;
    }
    
    const favoritesData = safeLocalStorage.getItem(favoritesKey);
    if (!favoritesData) {
      setFavorites([]);
      return;
    }
    
    try {
      const parsedFavorites = JSON.parse(favoritesData) as string[];
      setFavorites(parsedFavorites);
    } catch (error) {
      console.error('Failed to parse favorites data:', error);
      setFavorites([]);
    }
  }, [getFavoritesKey]);
  
  // お気に入りデータ保存
  const saveFavorites = useCallback((newFavorites: string[]) => {
    const favoritesKey = getFavoritesKey();
    if (!favoritesKey) {
      return false;
    }
    
    try {
      safeLocalStorage.setItem(favoritesKey, JSON.stringify(newFavorites));
      return true;
    } catch (error) {
      console.error('Failed to save favorites data:', error);
      return false;
    }
  }, [getFavoritesKey]);
  
  // お気に入りの切り替え（追加/削除）
  const toggleFavorite = useCallback((productId: string) => {
    if (!isAuthenticated) {
      return false;
    }
    
    setFavorites(prevFavorites => {
      // すでにお気に入りにある場合は削除、なければ追加
      const isFavorited = prevFavorites.includes(productId);
      let newFavorites: string[];
      
      if (isFavorited) {
        newFavorites = prevFavorites.filter(id => id !== productId);
      } else {
        newFavorites = [...prevFavorites, productId];
      }
      
      saveFavorites(newFavorites);
      return newFavorites;
    });
    
    return true;
  }, [isAuthenticated, saveFavorites]);
  
  // お気に入りの追加
  const addFavorite = useCallback((productId: string) => {
    if (!isAuthenticated) {
      return false;
    }
    
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(productId)) {
        return prevFavorites; // すでに存在する場合は何もしない
      }
      
      const newFavorites = [...prevFavorites, productId];
      saveFavorites(newFavorites);
      return newFavorites;
    });
    
    return true;
  }, [isAuthenticated, saveFavorites]);
  
  // お気に入りから削除
  const removeFavorite = useCallback((productId: string) => {
    if (!isAuthenticated) {
      return false;
    }
    
    setFavorites(prevFavorites => {
      const newFavorites = prevFavorites.filter(id => id !== productId);
      saveFavorites(newFavorites);
      return newFavorites;
    });
    
    return true;
  }, [isAuthenticated, saveFavorites]);
  
  // お気に入りかどうかをチェック
  const isFavorite = useCallback((productId: string): boolean => {
    return favorites.includes(productId);
  }, [favorites]);
  
  // お気に入り商品の詳細情報を取得
  const getFavoriteProducts = useCallback(() => {
    return products.filter(product => favorites.includes(product.id));
  }, [favorites]);
  
  // ログイン状態が変わったらお気に入りを読み込み直す
  useEffect(() => {
    loadFavorites();
  }, [isAuthenticated, currentUser, loadFavorites]);
  
  return {
    favorites,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavoriteProducts
  };
};

export default useFavorites; 