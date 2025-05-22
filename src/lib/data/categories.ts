// TYPE_ID: T_CATEGORY
export interface Category {
  readonly id: string;         // FORMAT: 'cat-' + 3-digit number (e.g., 'cat-001'), IMMUTABLE, UNIQUE
  name: string;       // CONSTRAINTS: Non-empty, Max 50 chars
  slug: string;       // FORMAT: kebab-case, URL-safe, UNIQUE, Max 50 chars
  image?: string;     // Path to the category image
}

// DATA_EXAMPLE_ID: D_CATEGORIES_SAMPLE
export const categories: Category[] = [
  { id: 'cat-001', name: 'フレコンバッグ', slug: 'frecon-bags', image: '/images/category-frecon.jpg' },
  { id: 'cat-002', name: '土のう・ガラ袋', slug: 'sandbags', image: '/images/category-sandbag.jpg' },
  { id: 'cat-003', name: 'シート類', slug: 'sheets', image: '/images/category-sheet.jpg' },
  { id: 'cat-004', name: '作業・安全用品', slug: 'safety-equipment', image: '/images/category-safety.jpg' },
  { id: 'cat-005', name: '看板・標識備品', slug: 'signage-equipment', image: '/images/category-signage.jpg' },
  { id: 'cat-006', name: '建設・土木資材', slug: 'construction-materials', image: '/images/category-construction.jpg' },
  { id: 'cat-007', name: 'ライト・電源・配線', slug: 'lighting-power', image: '/images/category-lighting.jpg' },
  { id: 'cat-008', name: 'オフィス・住設用品', slug: 'office-residential', image: '/images/category-office.jpg' },
  { id: 'cat-009', name: '災害対策用品', slug: 'disaster-prevention', image: '/images/category-disaster.jpg' },
  { id: 'cat-010', name: '物流機器・梱包資材', slug: 'logistics-packaging', image: '/images/category-logistics.jpg' },
  { id: 'cat-011', name: '養生用品', slug: 'protection-materials', image: '/images/category-protection.jpg' },
  { id: 'cat-012', name: '農業資材・園芸用品', slug: 'agricultural-gardening', image: '/images/category-agricultural.jpg' }
]; 