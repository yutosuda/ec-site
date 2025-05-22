// TYPE_ID: T_USER_PROFILE
export interface UserProfile {
  readonly id: string;            // FORMAT: 'user-' + UUID, IMMUTABLE, UNIQUE
  name: string;                   // CONSTRAINTS: Non-empty, Max 100 chars
  email: string;                  // FORMAT: Valid email address, UNIQUE
  password?: string;              // OPTIONAL for internal use only, not exposed to components
  phoneNumber?: string;           // (OPTIONAL) FORMAT: '090-1234-5678'
  companyName?: string;           // (OPTIONAL) CONSTRAINTS: Max 100 chars
  department?: string;            // (OPTIONAL) CONSTRAINTS: Max 50 chars
  position?: string;              // (OPTIONAL) CONSTRAINTS: Max 50 chars
  favoriteCategories?: string[];  // (OPTIONAL) ARRAY_OF: T_CATEGORY.id
  recentlyViewedProducts?: string[]; // (OPTIONAL) ARRAY_OF: T_PRODUCT.id, CONSTRAINTS: Max 20 items
  savedAddresses?: SavedAddress[]; // (OPTIONAL) ARRAY_OF: T_SAVED_ADDRESS
  createdAt: Date;                // Format: ISO date string in storage, Date object in memory
  updatedAt: Date;                // Format: ISO date string in storage, Date object in memory
}

// TYPE_ID: T_SAVED_ADDRESS
export interface SavedAddress {
  readonly id: string;            // FORMAT: 'addr-' + UUID, IMMUTABLE, UNIQUE
  name: string;                   // CONSTRAINTS: Non-empty, Max 50 chars (例: '本社', '工場', '自宅')
  postalCode: string;             // FORMAT: '123-4567'
  prefecture: string;             // CONSTRAINTS: Non-empty, Max 10 chars
  city: string;                   // CONSTRAINTS: Non-empty, Max 50 chars
  addressLine1: string;           // CONSTRAINTS: Non-empty, Max 100 chars
  addressLine2?: string;          // (OPTIONAL) CONSTRAINTS: Max 100 chars
  phoneNumber?: string;           // (OPTIONAL) FORMAT: '090-1234-5678'
  isDefault: boolean;             // Default: false
}

// モック用の初期ユーザープロファイル
export const mockUserProfile: UserProfile = {
  id: 'user-01',
  name: '山田 太郎',
  email: 'yamada@example.com',
  phoneNumber: '090-1234-5678',
  companyName: '山田建設株式会社',
  department: '現場管理部',
  position: '工事課長',
  favoriteCategories: ['cat-001', 'cat-002', 'cat-004'],
  recentlyViewedProducts: ['prod-001', 'prod-004', 'prod-007', 'prod-013', 'prod-016'],
  savedAddresses: [
    {
      id: 'addr-001',
      name: '会社',
      postalCode: '100-0001',
      prefecture: '東京都',
      city: '千代田区',
      addressLine1: '丸の内1-1-1',
      addressLine2: '丸の内ビル10F',
      phoneNumber: '03-1234-5678',
      isDefault: true
    },
    {
      id: 'addr-002',
      name: '現場事務所',
      postalCode: '220-0012',
      prefecture: '神奈川県',
      city: '横浜市西区',
      addressLine1: '南幸町2-2-2',
      phoneNumber: '045-123-4567',
      isDefault: false
    }
  ],
  createdAt: new Date('2023-01-15'),
  updatedAt: new Date('2023-05-20')
}; 