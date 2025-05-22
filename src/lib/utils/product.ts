import { Product } from '../data/products';
import { Category } from '../data/categories';

// 商品を検索する関数
export const searchProducts = (
  products: Product[], 
  query: string, 
  categoryId?: string
): Product[] => {
  // 検索クエリがない場合、全商品またはカテゴリーでフィルタリングした商品を返す
  if (!query.trim()) {
    return categoryId 
      ? products.filter(product => product.categoryIds.includes(categoryId))
      : products;
  }
  
  // 検索クエリを小文字に変換
  const normalizedQuery = query.trim().toLowerCase();
  
  // 商品をフィルタリング
  return products.filter(product => {
    // カテゴリーでフィルタリング（指定がある場合）
    if (categoryId && !product.categoryIds.includes(categoryId)) {
      return false;
    }
    
    // 商品名、説明、メーカー名、型番で検索
    return (
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.description.toLowerCase().includes(normalizedQuery) ||
      (product.maker && product.maker.toLowerCase().includes(normalizedQuery)) ||
      product.sku.toLowerCase().includes(normalizedQuery) ||
      // 使用例で検索
      (product.usage && 
        product.usage.some(u => u.toLowerCase().includes(normalizedQuery))) ||
      // 仕様で検索
      (product.specifications && 
        product.specifications.some(
          spec => 
            spec.label.toLowerCase().includes(normalizedQuery) || 
            spec.value.toLowerCase().includes(normalizedQuery)
        ))
    );
  });
};

// 商品を価格で並べ替える関数
export const sortProductsByPrice = (
  products: Product[], 
  order: 'asc' | 'desc' = 'asc'
): Product[] => {
  return [...products].sort((a, b) => {
    return order === 'asc' ? a.price - b.price : b.price - a.price;
  });
};

// 商品を在庫状況でフィルタリングする関数
export const filterProductsByStockStatus = (
  products: Product[],
  status: ('IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'ON_ORDER')[]
): Product[] => {
  return products.filter(product => status.includes(product.stockStatus));
};

// 商品をカテゴリー名でフィルタリングする関数
export const filterProductsByCategory = (
  products: Product[],
  categories: Category[],
  categoryNames: string[]
): Product[] => {
  // カテゴリー名からIDへのマッピングを作成
  const categoryIds = categories
    .filter(category => categoryNames.includes(category.name))
    .map(category => category.id);
  
  // 商品をフィルタリング
  return products.filter(product => 
    product.categoryIds.some(id => categoryIds.includes(id))
  );
};

// 関連商品を取得する関数
export const getRelatedProducts = (
  product: Product,
  allProducts: Product[],
  limit: number = 4
): Product[] => {
  // 明示的に関連商品が指定されている場合、それらを取得
  if (product.relatedProductIds && product.relatedProductIds.length > 0) {
    const relatedProducts = product.relatedProductIds
      .map(id => allProducts.find(p => p.id === id))
      .filter((p): p is Product => p !== undefined);
    
    // 指定された数に制限
    return relatedProducts.slice(0, limit);
  }
  
  // 関連商品が指定されていない場合、同じカテゴリーの商品を取得
  const sameCategory = allProducts.filter(p => 
    p.id !== product.id && // 自身を除外
    p.categoryIds.some(catId => product.categoryIds.includes(catId))
  );
  
  // ランダムにシャッフル
  const shuffled = [...sameCategory].sort(() => 0.5 - Math.random());
  
  // 指定された数に制限
  return shuffled.slice(0, limit);
}; 