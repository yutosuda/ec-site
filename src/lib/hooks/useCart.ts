'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { products } from '@/lib/data/products';
import { safeLocalStorage } from '@/lib/utils/initializeAppData';

/**
 * Interface for cart items
 */
export interface CartItem {
  readonly productId: string;
  quantity: number;
}

/**
 * Interface for cart items with details
 */
export interface CartItemWithDetails extends CartItem {
  product: any; // 商品の詳細情報
  subtotal: number; // 小計 (単価 × 数量)
}

/**
 * Custom hook for managing cart data in localStorage
 * Handles adding, removing, updating items and calculating totals
 */
export const useCart = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  
  // Get cart key
  const getCartKey = useCallback(() => {
    if (!isAuthenticated || !currentUser) {
      return null;
    }
    return `KEM_MOCK_CART_${currentUser.id}`;
  }, [isAuthenticated, currentUser]);
  
  // Load cart data
  const loadCartData = useCallback(() => {
    const cartKey = getCartKey();
    if (!cartKey) {
      setCartItems([]);
      setTotalPrice(0);
      setTotalItems(0);
      return;
    }
    
    const cartData = safeLocalStorage.getItem(cartKey);
    if (!cartData) {
      setCartItems([]);
      setTotalPrice(0);
      setTotalItems(0);
      return;
    }
    
    try {
      const parsedCart = JSON.parse(cartData) as CartItem[];
      setCartItems(parsedCart);
      
      // Calculate total price and total items
      let price = 0;
      let items = 0;
      
      parsedCart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          price += product.price * item.quantity;
          items += item.quantity;
        }
      });
      
      setTotalPrice(price);
      setTotalItems(items);
    } catch (error) {
      console.error('Failed to parse cart data:', error);
      setCartItems([]);
      setTotalPrice(0);
      setTotalItems(0);
    }
  }, [getCartKey]);
  
  // Save cart data
  const saveCartData = useCallback((newItems: CartItem[]) => {
    const cartKey = getCartKey();
    if (!cartKey) {
      return false;
    }
    
    try {
      safeLocalStorage.setItem(cartKey, JSON.stringify(newItems));
      return true;
    } catch (error) {
      console.error('Failed to save cart data:', error);
      return false;
    }
  }, [getCartKey]);
  
  // Add item to cart
  const addItem = useCallback((productId: string, quantity: number) => {
    if (!isAuthenticated) {
      // Do nothing if not logged in
      return false;
    }
    
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.productId === productId);
      let newItems: CartItem[];
      
      if (existingItemIndex >= 0) {
        // If item exists, update quantity
        newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity
        };
      } else {
        // If new item, add it
        newItems = [...prevItems, { productId, quantity }];
      }
      
      // Save and update
      saveCartData(newItems);
      loadCartData(); // Reload to recalculate
      return newItems;
    });
    
    return true;
  }, [isAuthenticated, saveCartData, loadCartData]);
  
  // Update item quantity in cart
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (!isAuthenticated || quantity < 1) {
      return false;
    }
    
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.productId === productId);
      
      if (existingItemIndex >= 0) {
        const newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity
        };
        
        saveCartData(newItems);
        loadCartData(); // Reload to recalculate
        return newItems;
      }
      
      return prevItems;
    });
    
    return true;
  }, [isAuthenticated, saveCartData, loadCartData]);
  
  // Remove item from cart
  const removeItem = useCallback((productId: string) => {
    if (!isAuthenticated) {
      return false;
    }
    
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => item.productId !== productId);
      saveCartData(newItems);
      loadCartData(); // Reload to recalculate
      return newItems;
    });
    
    return true;
  }, [isAuthenticated, saveCartData, loadCartData]);
  
  // Clear all items from cart
  const clearCart = useCallback(() => {
    if (!isAuthenticated) {
      return false;
    }
    
    setCartItems([]);
    setTotalPrice(0);
    setTotalItems(0);
    saveCartData([]);
    
    return true;
  }, [isAuthenticated, saveCartData]);
  
  // Get cart items with details
  const getCartItemsWithDetails = useCallback((): CartItemWithDetails[] => {
    return cartItems.map(item => {
      const product = products.find(p => p.id === item.productId);
      const subtotal = product ? product.price * item.quantity : 0;
      
      return {
        ...item,
        product,
        subtotal
      };
    });
  }, [cartItems]);
  
  // Reload cart data when login status changes
  useEffect(() => {
    loadCartData();
  }, [isAuthenticated, currentUser, loadCartData]);
  
  return {
    cartItems,
    totalPrice,
    totalItems,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getCartItemsWithDetails
  };
};

export default useCart; 