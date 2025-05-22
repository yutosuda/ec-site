'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Button, 
  Divider, 
  Grid,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress
} from '@mui/material';
import { CheckCircle, ArrowForward } from '@mui/icons-material';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { products } from '@/lib/data/products';

// Wrapper component that uses the search params
function OrderCompleteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, currentUser } = useAuth();
  const [order, setOrder] = useState<any>(null);
  
  // Get order ID from URL params
  const orderId = searchParams.get('orderId');
  
  // Load order data from localStorage
  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      router.push('/login');
      return;
    }
    
    if (!orderId) {
      router.push('/');
      return;
    }
    
    const storageKey = `KEM_MOCK_ORDERS_${currentUser.id}`;
    const ordersJson = localStorage.getItem(storageKey);
    
    if (ordersJson) {
      try {
        const orders = JSON.parse(ordersJson);
        const foundOrder = orders.find((o: any) => o.id === orderId);
        
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Failed to parse orders from localStorage', error);
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [orderId, currentUser, isAuthenticated, router]);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Get product details by ID
  const getProductDetails = (productId: string) => {
    return products.find(p => p.id === productId);
  };
  
  // If order not loaded yet, show loading
  if (!order) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <CheckCircle color="success" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            ご注文ありがとうございます
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            注文ID: {order.id}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            ご注文の確認メールをお送りしました。
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        <Typography variant="h5" gutterBottom>
          注文詳細
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              注文日時
            </Typography>
            <Typography variant="body1">
              {formatDate(order.orderedAt)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              お支払い合計
            </Typography>
            <Typography variant="body1" color="primary" fontWeight="bold">
              ¥{order.totalPrice.toLocaleString()}
            </Typography>
          </Grid>
        </Grid>
        
        <Typography variant="h6" gutterBottom>
          ご注文商品
        </Typography>
        
        <Paper variant="outlined" sx={{ mb: 4 }}>
          <List disablePadding>
            {order.items.map((item: any, index: number) => {
              const product = getProductDetails(item.productId);
              
              return (
                <React.Fragment key={item.productId}>
                  {index > 0 && <Divider />}
                  <ListItem sx={{ py: 2, px: 3 }}>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1">
                          {product?.name || '不明な商品'}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary" component="span">
                            単価: ¥{item.unitPrice.toLocaleString()}
                          </Typography>
                          {' • '}
                          <Typography variant="body2" color="text.secondary" component="span">
                            数量: {item.quantity}
                          </Typography>
                        </>
                      }
                    />
                    <Typography variant="subtitle1">
                      ¥{(item.unitPrice * item.quantity).toLocaleString()}
                    </Typography>
                  </ListItem>
                </React.Fragment>
              );
            })}
            
            <Divider />
            
            <ListItem sx={{ py: 2, px: 3 }}>
              <ListItemText primary="合計" />
              <Typography variant="subtitle1" fontWeight="bold">
                ¥{order.totalPrice.toLocaleString()}
              </Typography>
            </ListItem>
          </List>
        </Paper>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body1" paragraph>
            ※このサイトはモックアップのため、実際の取引は行われません。
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            component={Link}
            href="/history"
            endIcon={<ArrowForward />}
            sx={{ mr: 2 }}
          >
            注文履歴を見る
          </Button>
          
          <Button
            variant="outlined"
            component={Link}
            href="/products"
          >
            買い物を続ける
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

/**
 * Order complete page component
 * Displays order confirmation and details after successful checkout
 */
export default function OrderCompletePage() {
  return (
    <Suspense fallback={
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Container>
    }>
      <OrderCompleteContent />
    </Suspense>
  );
} 