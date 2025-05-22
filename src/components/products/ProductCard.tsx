import React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActionArea, IconButton, Box, Chip, Badge } from '@mui/material';
import { Favorite, FavoriteBorder, ShoppingCart } from '@mui/icons-material';
import Link from 'next/link';
import { Product } from '@/lib/data/products';

/**
 * Product card component for displaying product information
 * Used in product listing pages
 * Updated to match kensetsu-shizai.com design
 * 
 * @param product - Product data to display
 * @param onAddToCart - Callback when "Add to Cart" is clicked
 * @param onToggleFavorite - Callback to toggle favorite status
 * @param isFavorite - Current favorite status of the product
 */
interface ProductCardProps {
  readonly product: Product;
  readonly onAddToCart?: (productId: string) => void;
  readonly onToggleFavorite?: (productId: string) => void;
  readonly isFavorite?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
}) => {
  // Stock status color and label mapping
  const stockStatusConfig = {
    IN_STOCK: { color: 'success', label: '在庫あり' },
    LOW_STOCK: { color: 'warning', label: '残りわずか' },
    OUT_OF_STOCK: { color: 'error', label: '在庫切れ' },
    ON_ORDER: { color: 'info', label: '取り寄せ' },
  } as const;
  
  const { color, label } = stockStatusConfig[product.stockStatus];
  
  // Handle add to cart click
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product.id);
    }
  };
  
  // Handle favorite toggle
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(product.id);
    }
  };
  
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        opacity: product.stockStatus === 'OUT_OF_STOCK' ? 0.7 : 1,
        borderRadius: 0,
        border: '1px solid #e0e0e0',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      {/* Favorite button */}
      {onToggleFavorite && (
        <IconButton
          onClick={handleToggleFavorite}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
            bgcolor: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.9)',
            },
            padding: '4px',
          }}
          aria-label={isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
          size="small"
        >
          {isFavorite ? (
            <Favorite color="error" fontSize="small" />
          ) : (
            <FavoriteBorder fontSize="small" />
          )}
        </IconButton>
      )}
      
      {/* Stock status badge */}
      <Box sx={{ position: 'absolute', top: 8, left: 8, zIndex: 2 }}>
        <Chip
          label={label}
          color={color as any}
          size="small"
          sx={{ 
            fontSize: '0.7rem',
            height: '20px',
            borderRadius: '2px'
          }}
        />
      </Box>
      
      <CardActionArea 
        component={Link} 
        href={`/products/${product.id}`}
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        {/* Product image */}
        <CardMedia
          component="img"
          height="160"
          image={product.images[0] || '/images/product-placeholder.jpg'}
          alt={product.name}
          sx={{
            objectFit: 'contain',
            padding: '8px',
            backgroundColor: '#f9f9f9'
          }}
        />
        
        {/* Product details */}
        <CardContent sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          p: 1.5,
          '&:last-child': { pb: 1.5 } 
        }}>
          <Typography 
            variant="subtitle2" 
            component="div" 
            noWrap 
            title={product.name}
            sx={{ fontWeight: 500, mb: 0.5, fontSize: '0.85rem', lineHeight: 1.3 }}
          >
            {product.name}
          </Typography>
          
          {product.maker && (
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ fontSize: '0.75rem', mb: 0.5 }}
            >
              メーカー: {product.maker}
            </Typography>
          )}
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ fontSize: '0.75rem', mb: 1 }}
          >
            型番: {product.sku}
          </Typography>
          
          <Box sx={{ mt: 'auto' }}>
            <Typography 
              variant="h6" 
              color="primary" 
              sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}
            >
              ¥{product.price.toLocaleString()}
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ fontSize: '0.7rem' }}
            >
              税込
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
      
      {/* Add to cart button for in-stock items */}
      {product.stockStatus !== 'OUT_OF_STOCK' && onAddToCart && (
        <Box sx={{ p: 1, borderTop: '1px solid', borderColor: 'divider' }}>
          <IconButton 
            color="primary" 
            onClick={handleAddToCart}
            aria-label="カートに追加"
            sx={{ 
              width: '100%',
              borderRadius: 0,
              py: 0.5
            }}
            size="small"
          >
            <ShoppingCart sx={{ mr: 1, fontSize: '1rem' }} />
            <Typography variant="button" sx={{ fontSize: '0.75rem' }}>カートに追加</Typography>
          </IconButton>
        </Box>
      )}
    </Card>
  );
};

export default ProductCard; 