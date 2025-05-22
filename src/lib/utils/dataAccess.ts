// ブラウザのローカルストレージからデータを取得する関数
export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') {
    return defaultValue;
  }

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting item from localStorage: ${key}`, error);
    return defaultValue;
  }
};

// ブラウザのローカルストレージにデータを保存する関数
export const saveToStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving item to localStorage: ${key}`, error);
  }
};

// ブラウザのローカルストレージからデータを削除する関数
export const removeFromStorage = (key: string): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item from localStorage: ${key}`, error);
  }
};

// Dateオブジェクトをシリアライズするためのリバイバー関数
export const dateReviver = (_key: string, value: any): any => {
  // ISO 8601形式の日付文字列を検出してDateオブジェクトに変換
  if (typeof value === 'string' && 
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(value)) {
    return new Date(value);
  }
  return value;
};

// Dateオブジェクトを含むデータをローカルストレージから取得する関数
export const getWithDates = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') {
    return defaultValue;
  }

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item, dateReviver) : defaultValue;
  } catch (error) {
    console.error(`Error getting item with dates from localStorage: ${key}`, error);
    return defaultValue;
  }
};

// ストレージキーの定数
export const STORAGE_KEYS = {
  CART: 'ec-site-cart',
  USER_PROFILE: 'ec-site-user-profile',
  RECENT_ORDERS: 'ec-site-recent-orders',
  VIEWED_PRODUCTS: 'ec-site-viewed-products',
  SETTINGS: 'ec-site-settings'
}; 