// 価格を日本円表示用にフォーマットする関数
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0
  }).format(price);
};

// 日付を日本語表示用にフォーマットする関数
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

// 日時を日本語表示用にフォーマットする関数
export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// 郵便番号をフォーマットする関数（例: 1234567 → 123-4567）
export const formatPostalCode = (postalCode: string): string => {
  // 既にハイフンが含まれている場合はそのまま返す
  if (postalCode.includes('-')) {
    return postalCode;
  }
  
  // ハイフンがない場合は挿入する
  const digits = postalCode.replace(/\D/g, '');
  if (digits.length === 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
  
  // フォーマットできない場合はそのまま返す
  return postalCode;
};

// 電話番号をフォーマットする関数
export const formatPhoneNumber = (phoneNumber: string): string => {
  // 既にハイフンが含まれている場合はそのまま返す
  if (phoneNumber.includes('-')) {
    return phoneNumber;
  }
  
  // ハイフンがない場合は挿入する
  const digits = phoneNumber.replace(/\D/g, '');
  
  if (digits.length === 10) {
    // 固定電話（市外局番が2桁の場合）: 03-1234-5678
    if (digits.startsWith('0') && ['1', '2', '3', '4', '5', '6', '7', '9'].includes(digits[1])) {
      return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
  }
  
  if (digits.length === 11) {
    // 携帯電話: 090-1234-5678
    if (digits.startsWith('0') && ['7', '8', '9'].includes(digits[1])) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    }
  }
  
  // フォーマットできない場合はそのまま返す
  return phoneNumber;
};

// 商品の在庫状況を日本語表示用にフォーマットする関数
export const formatStockStatus = (status: string): string => {
  switch (status) {
    case 'IN_STOCK':
      return '在庫あり';
    case 'LOW_STOCK':
      return '残りわずか';
    case 'OUT_OF_STOCK':
      return '在庫切れ';
    case 'ON_ORDER':
      return '入荷待ち';
    default:
      return status;
  }
};

// 注文ステータスを日本語表示用にフォーマットする関数
export const formatOrderStatus = (status: string): string => {
  switch (status) {
    case 'PENDING':
      return '注文受付';
    case 'CONFIRMED':
      return '発送準備中';
    case 'SHIPPED':
      return '発送済み';
    case 'DELIVERED':
      return '配達完了';
    case 'CANCELLED':
      return 'キャンセル済み';
    default:
      return status;
  }
}; 