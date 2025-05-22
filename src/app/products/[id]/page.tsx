'use client';

import React, { useState } from 'react';
import { useParams, notFound, useRouter } from 'next/navigation';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  Button, 
  Divider, 
  Chip, 
  Paper, 
  TextField, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableRow,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  IconButton,
  Link as MuiLink,
  Breadcrumbs
} from '@mui/material';
import { 
  Add as AddIcon, 
  Remove as RemoveIcon, 
  Favorite as FavoriteIcon, 
  FavoriteBorder as FavoriteBorderIcon,
  ArrowBackIos as ArrowBackIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { products } from '@/lib/data/products';
import { categories } from '@/lib/data/categories';
import { useCart } from '@/lib/hooks/useCart';
import { useFavorites } from '@/lib/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Product detail page component
 * Displays detailed information about a specific product
 */
export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  
  // Get product ID from URL params
  const productId = params.id as string;
  
  // Find the product
  const product = products.find(p => p.id === productId);
  
  // If product not found, show 404
  if (!product) {
    notFound();
  }
  
  // Get categories for the product
  const productCategories = categories.filter(cat => 
    product.categoryIds.includes(cat.id)
  );
  
  // Get related products
  const relatedProducts = product.relatedProductIds
    ? products.filter(p => product.relatedProductIds?.includes(p.id))
    : products
        .filter(p => 
          p.id !== product.id && 
          p.categoryIds.some(catId => product.categoryIds.includes(catId))
        )
        .slice(0, 4);
  
  // State for quantity
  const [quantity, setQuantity] = useState(1);
  
  // Handle quantity change
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };
  
  // Increment quantity
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  // Decrement quantity
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (isAuthenticated) {
      addItem(product.id, quantity);
      // Could show a success message here
      alert(`${product.name} をカートに追加しました。`);
    } else {
      // Could redirect to login page with a return URL
      alert('カートに追加するにはログインしてください。');
    }
  };
  
  // Handle toggle favorite
  const handleToggleFavorite = () => {
    if (isAuthenticated) {
      toggleFavorite(product.id);
    } else {
      alert('お気に入り機能を使うにはログインしてください。');
    }
  };
  
  // Stock status config
  const stockStatusConfig = {
    IN_STOCK: { color: 'success', label: '在庫あり', available: true },
    LOW_STOCK: { color: 'warning', label: '残りわずか', available: true },
    OUT_OF_STOCK: { color: 'error', label: '在庫切れ', available: false },
    ON_ORDER: { color: 'info', label: '取り寄せ', available: true },
  } as const;
  
  const { color, label, available } = stockStatusConfig[product.stockStatus];
  
  return (
    <Container maxWidth="lg">
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <MuiLink component={Link} href="/" color="inherit">
          ホーム
        </MuiLink>
        <MuiLink component={Link} href="/products" color="inherit">
          商品一覧
        </MuiLink>
        {productCategories.length > 0 && (
          <MuiLink 
            component={Link} 
            href={`/products?category=${productCategories[0].slug}`}
            color="inherit"
          >
            {productCategories[0].name}
          </MuiLink>
        )}
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>
      
      {/* Back button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => router.back()}
        sx={{ mb: 2 }}
      >
        戻る
      </Button>
      
      <Grid container spacing={4}>
        {/* Product images */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              mb: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 400,
              bgcolor: 'background.paper',
            }}
          >
            <Box
              component="img"
              src={product.images[0] || '/images/product-placeholder.jpg'}
              alt={product.name}
              sx={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
          </Paper>
          
          {/* Thumbnail images */}
          {product.images.length > 1 && (
            <Grid container spacing={1}>
              {product.images.map((image, index) => (
                <Grid item key={index} xs={3}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 1,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 80,
                      cursor: 'pointer',
                      '&:hover': {
                        opacity: 0.8,
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={image}
                      alt={`${product.name} - 画像 ${index + 1}`}
                      sx={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
        
        {/* Product details */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.name}
          </Typography>
          
          {/* Categories */}
          <Box sx={{ mb: 2 }}>
            {productCategories.map(category => (
              <Chip
                key={category.id}
                label={category.name}
                component={Link}
                href={`/products?category=${category.slug}`}
                clickable
                sx={{ mr: 1, mb: 1 }}
                size="small"
              />
            ))}
          </Box>
          
          {/* Maker */}
          {product.maker && (
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              メーカー: {product.maker}
            </Typography>
          )}
          
          {/* SKU */}
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            型番: {product.sku}
          </Typography>
          
          {/* Stock status */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mr: 1 }}>
              在庫状況:
            </Typography>
            <Chip
              label={label}
              color={color as any}
              size="small"
            />
          </Box>
          
          {/* Price */}
          <Typography variant="h5" color="primary" gutterBottom>
            ¥{product.price.toLocaleString()}
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          {/* Add to cart */}
          {available ? (
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                {/* Quantity selector */}
                <Grid item xs={12} sm={5}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      size="small"
                    >
                      <RemoveIcon />
                    </IconButton>
                    <TextField
                      type="number"
                      inputProps={{ min: 1 }}
                      value={quantity}
                      onChange={handleQuantityChange}
                      size="small"
                      sx={{ width: 60, mx: 1, '& input': { textAlign: 'center' } }}
                    />
                    <IconButton
                      onClick={incrementQuantity}
                      size="small"
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Grid>
                
                {/* Add to cart button */}
                <Grid item xs={12} sm={7}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleAddToCart}
                  >
                    カートに追加
                  </Button>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Box sx={{ mb: 3 }}>
              <Button
                variant="outlined"
                color="error"
                disabled
                fullWidth
              >
                在庫切れ
              </Button>
            </Box>
          )}
          
          {/* Favorite button */}
          <Button
            variant="outlined"
            color={isFavorite(product.id) ? 'error' : 'primary'}
            startIcon={isFavorite(product.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            onClick={handleToggleFavorite}
            sx={{ mb: 3 }}
          >
            {isFavorite(product.id) ? 'お気に入りから削除' : 'お気に入りに追加'}
          </Button>
          
          {/* Product description */}
          <Typography variant="h6" gutterBottom>
            商品説明
          </Typography>
          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>
          
          {/* Product usage */}
          {product.usage && product.usage.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom>
                使用用途
              </Typography>
              <Box sx={{ mb: 2 }}>
                {product.usage.map((usage, index) => (
                  <Chip
                    key={index}
                    label={usage}
                    sx={{ mr: 1, mb: 1 }}
                    size="small"
                  />
                ))}
              </Box>
            </>
          )}
        </Grid>
      </Grid>
      
      {/* Product specifications */}
      {product.specifications && product.specifications.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom>
            製品仕様
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                {product.specifications.map((spec, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" sx={{ width: '30%', bgcolor: 'action.hover' }}>
                      {spec.label}
                    </TableCell>
                    <TableCell>{spec.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      
      {/* Related products */}
      {relatedProducts.length > 0 && (
        <Box sx={{ mt: 8 }}>
          <Typography variant="h5" gutterBottom>
            関連商品
          </Typography>
          <Grid container spacing={3}>
            {relatedProducts.map(relatedProduct => (
              <Grid item key={relatedProduct.id} xs={12} sm={6} md={3}>
                <Card>
                  <CardActionArea component={Link} href={`/products/${relatedProduct.id}`}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={relatedProduct.images[0] || '/images/product-placeholder.jpg'}
                      alt={relatedProduct.name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div" noWrap>
                        {relatedProduct.name}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {relatedProduct.maker || ''}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        型番: {relatedProduct.sku}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        ¥{relatedProduct.price.toLocaleString()}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
} 