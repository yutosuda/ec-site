'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart, CartItem, createEmptyCart, addOrUpdateCartItem, removeCartItem, clearCart } from '@/lib/data/cart';
import { Product } from '@/lib/data/products';
import { getWithDates, saveToStorage, STORAGE_KEYS } from '@/lib/utils/dataAccess';

// カートコンテキストの型定義
interface CartContextType {
  cart: Cart;
  isCartOpen: boolean;
  cartItemCount: number;
  cartTotal: number;
  addToCart: (product: Product, quantity: number) => void;
  updateCartItem: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  emptyCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

// コンテキストの作成
const CartContext = createContext<CartContextType | undefined>(undefined);

// カートプロバイダーのprops型
interface CartProviderProps {
  children: ReactNode;
  products: Product[]; // 全商品データ
}

// カートプロバイダーコンポーネント
export const CartProvider: React.FC<CartProviderProps> = ({ children, products }) => {
  // カートの状態
  const [cart, setCart] = useState<Cart>(createEmptyCart());
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  
  // ローカルストレージからカートを読み込む
  useEffect(() => {
    const savedCart = getWithDates<Cart>(STORAGE_KEYS.CART, createEmptyCart());
    setCart(savedCart);
  }, []);
  
  // カートに変更があったらローカルストレージに保存
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CART, cart);
  }, [cart]);
  
  // カート内のアイテム数を計算
  const cartItemCount = cart.items.reduce((count, item) => count + item.quantity, 0);
  
  // カートの合計金額を計算
  const cartTotal = cart.items.reduce((total, item) => {
    const product = products.find(p => p.id === item.productId);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);
  
  // カートにアイテムを追加
  const addToCart = (product: Product, quantity: number) => {
    setCart(prevCart => addOrUpdateCartItem(prevCart, product.id, quantity));
    // カートを表示
    setIsCartOpen(true);
  };
  
  // カート内のアイテムを更新
  const updateCartItem = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prevCart => removeCartItem(prevCart, productId));
    } else {
      setCart(prevCart => addOrUpdateCartItem(prevCart, productId, quantity));
    }
  };
  
  // カートからアイテムを削除
  const removeFromCart = (productId: string) => {
    setCart(prevCart => removeCartItem(prevCart, productId));
  };
  
  // カートを空にする
  const emptyCart = () => {
    setCart(prevCart => clearCart(prevCart));
  };
  
  // カートを開く
  const openCart = () => {
    setIsCartOpen(true);
  };
  
  // カートを閉じる
  const closeCart = () => {
    setIsCartOpen(false);
  };
  
  // カートの表示/非表示を切り替える
  const toggleCart = () => {
    setIsCartOpen(prevState => !prevState);
  };
  
  // コンテキスト値の作成
  const contextValue: CartContextType = {
    cart,
    isCartOpen,
    cartItemCount,
    cartTotal,
    addToCart,
    updateCartItem,
    removeFromCart,
    emptyCart,
    openCart,
    closeCart,
    toggleCart
  };
  
  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// カートコンテキストを使用するためのカスタムフック
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 