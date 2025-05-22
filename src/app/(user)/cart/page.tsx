'use client';

import React, { useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Button, 
  Box, 
  Paper, 
  Divider, 
  Alert
} from '@mui/material';
import { 
  ShoppingCart as ShoppingCartIcon, 
  ArrowForward as ArrowForwardIcon 
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart, CartItem as CartItemType } from '@/lib/hooks/useCart';
import { products } from '@/lib/data/products';
import CartItem from '@/components/cart/CartItem';
import { Product } from '@/lib/data/products';
import { safeLocalStorage } from '@/lib/utils/initializeAppData';

/**
 * Cart page component
 * Displays cart items, subtotal, and checkout button
 */
export default function CartPage() {
  const { isAuthenticated, currentUser } = useAuth();
  const { cartItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const router = useRouter();
  
  // Redirect to login page if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?returnUrl=/cart');
    }
  }, [isAuthenticated, router]);
  
  // Handle checkout
  const handleCheckout = () => {
    // In a real application, this would navigate to a checkout page
    // For this mock, we'll create a dummy order and clear the cart
    
    const orderId = `order-${new Date().getTime().toString().slice(-6)}`;
    
    // Create order items with current prices
    const orderItems = cartItems.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product?.price || 0
      };
    });
    
    // Create order object
    const order = {
      id: orderId,
      userId: currentUser?.id || '',
      items: orderItems,
      totalPrice: totalPrice,
      orderedAt: new Date().toISOString()
    };
    
    // Save order to localStorage
    if (currentUser) {
      const storageKey = `KEM_MOCK_ORDERS_${currentUser.id}`;
      const ordersJson = safeLocalStorage.getItem(storageKey);
      let orders: any[] = [];
      
      if (ordersJson) {
        try {
          orders = JSON.parse(ordersJson);
        } catch (error) {
          console.error('Failed to parse orders from localStorage', error);
        }
      }
      
      orders.push(order);
      safeLocalStorage.setItem(storageKey, JSON.stringify(orders));
      
      // Clear cart
      clearCart();
      
      // Navigate to order complete page
      router.push(`/order-complete?orderId=${orderId}`);
    }
  };
  
  // Map cart items to products
  const cartItemsWithDetails = cartItems.map(item => {
    const productDetails = products.find(p => p.id === item.productId);
    return {
      item,
      productDetails
    };
  }).filter(({ productDetails }) => productDetails !== undefined) as { item: CartItemType; productDetails: Product }[];
  
  // Check if cart is empty
  const isCartEmpty = cartItems.length === 0;
  
  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        <ShoppingCartIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        ショッピングカート
      </Typography>
      
      {isCartEmpty ? (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            カートに商品はありません。
          </Alert>
          <Button
            variant="contained"
            component={Link}
            href="/products"
            sx={{ mt: 2 }}
          >
            商品を探す
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {/* Cart items */}
          <Grid item xs={12} md={8}>
            {cartItemsWithDetails.map(({ item, productDetails }) => (
              <CartItem
                key={item.productId}
                item={item}
                productDetails={productDetails}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
              />
            ))}
          </Grid>
          
          {/* Cart summary */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                注文内容
              </Typography>
              
              <Box sx={{ my: 2 }}>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography variant="body1">商品点数:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" align="right">
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)}点
                    </Typography>
                  </Grid>
                </Grid>
                
                <Grid container sx={{ mt: 1 }}>
                  <Grid item xs={6}>
                    <Typography variant="body1">小計:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" align="right">
                      ¥{totalPrice.toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
                
                <Grid container sx={{ mt: 1 }}>
                  <Grid item xs={6}>
                    <Typography variant="body1">消費税:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" align="right">
                      (内税)
                    </Typography>
                  </Grid>
                </Grid>
                
                <Grid container sx={{ mt: 1 }}>
                  <Grid item xs={6}>
                    <Typography variant="body1">送料:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" align="right" color="success.main">
                      無料
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Grid container>
                <Grid item xs={6}>
                  <Typography variant="h6">合計:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" align="right" color="primary">
                    ¥{totalPrice.toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
              
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                endIcon={<ArrowForwardIcon />}
                onClick={handleCheckout}
                sx={{ mt: 3 }}
              >
                購入手続きへ進む
              </Button>
              
              <Button
                variant="text"
                component={Link}
                href="/products"
                fullWidth
                sx={{ mt: 2 }}
              >
                買い物を続ける
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
} 