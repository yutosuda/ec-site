// TYPE_ID: T_ORDER_ITEM
export interface OrderItem {
  readonly productId: string;  // REF: T_PRODUCT.id
  name: string;                // Copy of T_PRODUCT.name at time of order
  price: number;               // Copy of T_PRODUCT.price at time of order
  quantity: number;            // CONSTRAINTS: Positive integer
}

// TYPE_ID: T_ORDER_ADDRESS
export interface OrderAddress {
  postalCode: string;          // FORMAT: '123-4567'
  prefecture: string;          // CONSTRAINTS: Non-empty, Max 10 chars
  city: string;                // CONSTRAINTS: Non-empty, Max 50 chars
  addressLine1: string;        // CONSTRAINTS: Non-empty, Max 100 chars
  addressLine2?: string;       // (OPTIONAL) CONSTRAINTS: Max 100 chars
}

// TYPE_ID: T_ORDER_CUSTOMER
export interface OrderCustomer {
  name: string;                // CONSTRAINTS: Non-empty, Max 100 chars
  email: string;               // FORMAT: Valid email address
  phoneNumber: string;         // FORMAT: '090-1234-5678'
  companyName?: string;        // (OPTIONAL) CONSTRAINTS: Max 100 chars
}

// TYPE_ID: T_ORDER_STATUS
export type OrderStatus = 
  | 'PENDING'   // 注文受付、決済前
  | 'CONFIRMED' // 決済完了、発送準備中
  | 'SHIPPED'   // 発送済み
  | 'DELIVERED' // 配達完了
  | 'CANCELLED'; // キャンセル済み

// TYPE_ID: T_ORDER
export interface Order {
  readonly id: string;            // FORMAT: 'order-' + YYYYMMDD + 3-digit number (e.g., 'order-20240523001'), IMMUTABLE, UNIQUE
  items: OrderItem[];             // ARRAY_OF: T_ORDER_ITEM, CONSTRAINTS: Non-empty array
  totalAmount: number;            // CONSTRAINTS: Sum of (items[].price * items[].quantity)
  customer: OrderCustomer;        // REF: T_ORDER_CUSTOMER
  shippingAddress: OrderAddress;  // REF: T_ORDER_ADDRESS
  status: OrderStatus;            // REF: T_ORDER_STATUS
  createdAt: Date;                // Format: ISO date string in storage, Date object in memory
  updatedAt: Date;                // Format: ISO date string in storage, Date object in memory
  notes?: string;                 // (OPTIONAL) CONSTRAINTS: Max 500 chars
}

// 注文IDを生成する関数
export const generateOrderId = (): string => {
  const today = new Date();
  const dateStr = today.getFullYear() +
    String(today.getMonth() + 1).padStart(2, '0') +
    String(today.getDate()).padStart(2, '0');
  
  // 本来はDBなどで連番管理するが、モックのためランダムな3桁の数字を生成
  const randomNumber = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `order-${dateStr}${randomNumber}`;
};

// 簡易的な注文バリデーション
export const validateOrder = (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): string[] => {
  const errors: string[] = [];
  
  // アイテムチェック
  if (!order.items || order.items.length === 0) {
    errors.push('注文アイテムが指定されていません。');
  }
  
  // 顧客情報チェック
  if (!order.customer.name) errors.push('お名前を入力してください。');
  if (!order.customer.email) errors.push('メールアドレスを入力してください。');
  if (!order.customer.phoneNumber) errors.push('電話番号を入力してください。');
  
  // 配送先住所チェック
  if (!order.shippingAddress.postalCode) errors.push('郵便番号を入力してください。');
  if (!order.shippingAddress.prefecture) errors.push('都道府県を選択してください。');
  if (!order.shippingAddress.city) errors.push('市区町村を入力してください。');
  if (!order.shippingAddress.addressLine1) errors.push('住所を入力してください。');
  
  return errors;
}; 