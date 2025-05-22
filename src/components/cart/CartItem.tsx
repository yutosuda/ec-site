import React from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  TextField, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Divider 
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import Link from 'next/link';
import { Product } from '@/lib/data/products';
import { CartItem as CartItemType } from '@/lib/hooks/useCart';

/**
 * CartItem component for displaying an item in the cart
 * 
 * @param item - Cart item data
 * @param productDetails - Corresponding product details for display
 * @param onUpdateQuantity - Callback to update quantity
 * @param onRemoveItem - Callback to remove item
 */
interface CartItemProps {
  readonly item: CartItemType;
  readonly productDetails: Product;
  readonly onUpdateQuantity: (productId: string, newQuantity: number) => void;
  readonly onRemoveItem: (productId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  productDetails,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  // Handle quantity change from input
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value > 0) {
      onUpdateQuantity(item.productId, value);
    }
  };
  
  // Increment quantity
  const handleIncrement = () => {
    onUpdateQuantity(item.productId, item.quantity + 1);
  };
  
  // Decrement quantity
  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.productId, item.quantity - 1);
    }
  };
  
  // Remove item
  const handleRemove = () => {
    onRemoveItem(item.productId);
  };
  
  // Calculate subtotal
  const subtotal = productDetails.price * item.quantity;
  
  return (
    <Card sx={{ mb: 2, overflow: 'visible' }}>
      <Grid container>
        {/* Product image */}
        <Grid item xs={4} sm={3} md={2}>
          <CardMedia
            component="img"
            image={productDetails.images[0] || '/images/product-placeholder.jpg'}
            alt={productDetails.name}
            sx={{
              height: '100%',
              objectFit: 'contain',
              p: 1,
              maxHeight: 140,
            }}
          />
        </Grid>
        
        {/* Product details */}
        <Grid item xs={8} sm={9} md={10}>
          <CardContent sx={{ p: 2 }}>
            <Grid container spacing={2}>
              {/* Product info */}
              <Grid item xs={12} md={8}>
                <Typography 
                  variant="h6" 
                  component={Link} 
                  href={`/products/${productDetails.id}`}
                  sx={{ 
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                    display: 'block',
                    mb: 1
                  }}
                >
                  {productDetails.name}
                </Typography>
                
                {productDetails.maker && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    メーカー: {productDetails.maker}
                  </Typography>
                )}
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  型番: {productDetails.sku}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  単価: ¥{productDetails.price.toLocaleString()}
                </Typography>
              </Grid>
              
              {/* Quantity and subtotal */}
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
                  {/* Quantity controls */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <IconButton onClick={handleDecrement} size="small" disabled={item.quantity <= 1}>
                      <Remove />
                    </IconButton>
                    
                    <TextField
                      type="number"
                      inputProps={{ min: 1 }}
                      value={item.quantity}
                      onChange={handleQuantityChange}
                      size="small"
                      sx={{ 
                        width: 60, 
                        mx: 1,
                        '& input': { textAlign: 'center' }
                      }}
                    />
                    
                    <IconButton onClick={handleIncrement} size="small">
                      <Add />
                    </IconButton>
                  </Box>
                  
                  {/* Subtotal */}
                  <Typography variant="h6" align="right" sx={{ mb: 1 }}>
                    ¥{subtotal.toLocaleString()}
                  </Typography>
                  
                  {/* Remove button */}
                  <IconButton 
                    onClick={handleRemove} 
                    color="error" 
                    size="small"
                    sx={{ alignSelf: { xs: 'flex-start', md: 'flex-end' } }}
                  >
                    <Delete sx={{ mr: 0.5 }} />
                    <Typography variant="button">削除</Typography>
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
};

export default CartItem; 