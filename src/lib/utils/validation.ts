// 入力検証のエラーメッセージを格納するオブジェクト型
export interface ValidationErrors {
  [key: string]: string;
}

// メールアドレスの検証
export const validateEmail = (email: string): string | null => {
  if (!email) {
    return 'メールアドレスを入力してください。';
  }
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return '有効なメールアドレスを入力してください。';
  }
  
  return null;
};

// 郵便番号の検証
export const validatePostalCode = (postalCode: string): string | null => {
  if (!postalCode) {
    return '郵便番号を入力してください。';
  }
  
  // ハイフンありなしどちらも対応
  const postalCodeRegex = /^\d{3}-?\d{4}$/;
  if (!postalCodeRegex.test(postalCode)) {
    return '郵便番号は123-4567または1234567の形式で入力してください。';
  }
  
  return null;
};

// 電話番号の検証
export const validatePhoneNumber = (phoneNumber: string): string | null => {
  if (!phoneNumber) {
    return '電話番号を入力してください。';
  }
  
  // ハイフンありなしどちらも対応
  const phoneRegex = /^0\d{1,4}-?\d{1,4}-?\d{4}$/;
  if (!phoneRegex.test(phoneNumber)) {
    return '有効な電話番号を入力してください。';
  }
  
  return null;
};

// 文字列の長さ検証（最小・最大）
export const validateLength = (
  value: string, 
  min: number, 
  max: number, 
  fieldName: string
): string | null => {
  if (value.length < min) {
    return `${fieldName}は${min}文字以上で入力してください。`;
  }
  
  if (value.length > max) {
    return `${fieldName}は${max}文字以内で入力してください。`;
  }
  
  return null;
};

// 必須項目の検証
export const validateRequired = (value: any, fieldName: string): string | null => {
  if (value === null || value === undefined || value === '') {
    return `${fieldName}を入力してください。`;
  }
  
  return null;
};

// 数値の範囲検証
export const validateNumberRange = (
  value: number, 
  min: number, 
  max: number, 
  fieldName: string
): string | null => {
  if (value < min) {
    return `${fieldName}は${min}以上で入力してください。`;
  }
  
  if (value > max) {
    return `${fieldName}は${max}以下で入力してください。`;
  }
  
  return null;
};

// 複数フィールドの検証を一度に行う関数
export const validateFields = (
  fields: Record<string, any>,
  validationRules: Record<string, (value: any) => string | null>
): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  for (const [field, validator] of Object.entries(validationRules)) {
    const error = validator(fields[field]);
    if (error) {
      errors[field] = error;
    }
  }
  
  return errors;
}; 