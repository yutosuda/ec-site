'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField, 
  Chip, 
  Paper,
  InputAdornment,
  SelectChangeEvent,
  IconButton,
  CircularProgress
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { useSearchParams } from 'next/navigation';
import { products } from '@/lib/data/products';
import { categories } from '@/lib/data/categories';
import ProductCard from '@/components/products/ProductCard';
import { useCart } from '@/lib/hooks/useCart';
import { useFavorites } from '@/lib/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';

// Wrapper component that uses the search params
function ProductsContent() {
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  
  // Get initial category from URL params
  const initialCategory = searchParams.get('category') || '';
  
  // State for filters
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  
  // Apply filters when they change
  useEffect(() => {
    let result = [...products];
    
    // Apply category filter
    if (categoryFilter) {
      const categoryObj = categories.find(cat => cat.slug === categoryFilter);
      if (categoryObj) {
        result = result.filter(product => product.categoryIds.includes(categoryObj.id));
      }
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.sku.toLowerCase().includes(query) || 
        (product.maker && product.maker.toLowerCase().includes(query))
      );
    }
    
    setFilteredProducts(result);
  }, [categoryFilter, searchQuery]);
  
  // Handle category filter change
  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setCategoryFilter(event.target.value);
  };
  
  // Handle search query change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
  // Clear filters
  const clearFilters = () => {
    setCategoryFilter('');
    setSearchQuery('');
  };
  
  // Handle add to cart
  const handleAddToCart = (productId: string) => {
    addItem(productId, 1);
  };
  
  // Handle toggle favorite
  const handleToggleFavorite = (productId: string) => {
    if (isAuthenticated) {
      toggleFavorite(productId);
    } else {
      // Could show a login prompt here
      alert('お気に入り機能を使うにはログインしてください。');
    }
  };
  
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        商品一覧
      </Typography>
      
      {/* Filters */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          {/* Category filter */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="category-select-label">カテゴリ</InputLabel>
              <Select
                labelId="category-select-label"
                value={categoryFilter}
                label="カテゴリ"
                onChange={handleCategoryChange}
              >
                <MenuItem value="">すべて</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.slug}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* Search query */}
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="商品名・型番・メーカーで検索"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearchQuery('')} edge="end" size="small">
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
        </Grid>
        
        {/* Active filters */}
        {(categoryFilter || searchQuery) && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              適用中のフィルター:
            </Typography>
            
            {categoryFilter && (
              <Chip
                label={`カテゴリ: ${categories.find(cat => cat.slug === categoryFilter)?.name || categoryFilter}`}
                onDelete={() => setCategoryFilter('')}
                sx={{ mr: 1 }}
                size="small"
              />
            )}
            
            {searchQuery && (
              <Chip
                label={`検索: ${searchQuery}`}
                onDelete={() => setSearchQuery('')}
                sx={{ mr: 1 }}
                size="small"
              />
            )}
            
            <Chip
              label="すべてクリア"
              onClick={clearFilters}
              color="primary"
              variant="outlined"
              size="small"
            />
          </Box>
        )}
      </Paper>
      
      {/* Results count */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1">
          {filteredProducts.length} 件の商品が見つかりました
        </Typography>
      </Box>
      
      {/* Products grid */}
      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <ProductCard
              product={product}
              onAddToCart={isAuthenticated ? handleAddToCart : undefined}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={isAuthenticated && isFavorite(product.id)}
            />
          </Grid>
        ))}
        
        {/* No results message */}
        {filteredProducts.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <Typography variant="h6" gutterBottom>
                検索条件に一致する商品が見つかりませんでした。
              </Typography>
              <Typography variant="body1">
                検索条件を変更して、もう一度お試しください。
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

/**
 * Products listing page component
 * Displays all products with filtering and search capabilities
 */
export default function ProductsPage() {
  return (
    <Suspense fallback={
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Container>
    }>
      <ProductsContent />
    </Suspense>
  );
} 