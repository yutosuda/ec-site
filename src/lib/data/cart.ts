// TYPE_ID: T_CART_ITEM
export interface CartItem {
  readonly productId: string;  // REF: T_PRODUCT.id
  quantity: number;            // CONSTRAINTS: Positive integer
  addedAt: Date;               // Format: ISO date string in storage, Date object in memory
}

// TYPE_ID: T_CART
export interface Cart {
  readonly id: string;          // FORMAT: 'cart-' + UUID, IMMUTABLE, UNIQUE
  items: CartItem[];            // ARRAY_OF: T_CART_ITEM
  lastUpdated: Date;            // Format: ISO date string in storage, Date object in memory
}

// 空のカートを作成する関数
export const createEmptyCart = (): Cart => {
  return {
    id: `cart-${crypto.randomUUID()}`,
    items: [],
    lastUpdated: new Date()
  };
};

// カートアイテムを追加・更新する関数
export const addOrUpdateCartItem = (cart: Cart, productId: string, quantity: number): Cart => {
  const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
  
  const updatedItems = [...cart.items];
  
  if (existingItemIndex >= 0) {
    // 既存のアイテムを更新
    updatedItems[existingItemIndex] = {
      ...updatedItems[existingItemIndex],
      quantity: quantity
    };
  } else {
    // 新しいアイテムを追加
    updatedItems.push({
      productId,
      quantity,
      addedAt: new Date()
    });
  }
  
  return {
    ...cart,
    items: updatedItems,
    lastUpdated: new Date()
  };
};

// カートからアイテムを削除する関数
export const removeCartItem = (cart: Cart, productId: string): Cart => {
  return {
    ...cart,
    items: cart.items.filter(item => item.productId !== productId),
    lastUpdated: new Date()
  };
};

// カートを空にする関数
export const clearCart = (cart: Cart): Cart => {
  return {
    ...cart,
    items: [],
    lastUpdated: new Date()
  };
}; 