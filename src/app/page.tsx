'use client';

import React, { useState } from 'react';
import { Container, Typography, Grid, Button, Box, Paper, Card, CardContent, CardMedia, CardActionArea, Stack, Divider, Tabs, Tab } from '@mui/material';
import { ArrowForward, Category as CategoryIcon, Build as BuildIcon } from '@mui/icons-material';
import Link from 'next/link';
import { products } from '@/lib/data/products';
import { categories } from '@/lib/data/categories';

/**
 * Home page component
 * Features hero section, featured products, and category navigation
 * Updated to match kensetsu-shizai.com design from reference image
 */
export default function Home() {
  // Tab state
  const [tabValue, setTabValue] = useState(0);
  
  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Get 8 featured products
  const featuredProducts = products.slice(0, 8);
  
  // Main product categories to highlight
  const mainCategories = [
    { name: 'フレコンバッグ', href: '/products?category=frecon-bags', image: '/images/category-frecon.jpg' },
    { name: '土のう・ガラ袋', href: '/products?category=sandbags', image: '/images/category-sandbag.jpg' },
    { name: 'シート類', href: '/products?category=sheets', image: '/images/category-sheet.jpg' },
    { name: '作業・安全用品', href: '/products?category=safety-equipment', image: '/images/category-safety.jpg' },
  ];
  
  return (
    <>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: 'url(/images/hero-bg.jpg)',
          p: { xs: 3, md: 6 },
          borderRadius: 0,
          overflow: 'hidden',
        }}
      >
        {/* Increase the opacity of the background */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.5)',
          }}
        />
        
        {/* Hero content */}
        <Container maxWidth="lg">
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              maxWidth: { xs: '100%', sm: '70%' },
            }}
          >
            <Typography component="h1" variant="h3" color="inherit" gutterBottom fontWeight="bold">
              お客様のご要望に応じた商品をお届けします！
            </Typography>
            <Typography variant="subtitle1" color="inherit" paragraph>
              高品質の建設資材を、あなたの現場へ。
              迅速な配送と専門スタッフのサポートで、プロの仕事をバックアップします。
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              component={Link}
              href="/products"
              endIcon={<ArrowForward />}
              size="large"
              sx={{ mt: 2 }}
            >
              商品を見る
            </Button>
          </Box>
        </Container>
      </Paper>
      
      <Container maxWidth="lg">
        {/* Category Tabs and Cards */}
        <Box sx={{ mb: 5 }}>
          <Box sx={{ width: '100%', bgcolor: '#f5f5f5', mb: 0 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              aria-label="category tabs"
              TabIndicatorProps={{
                style: { display: 'none' }
              }}
              sx={{
                '& .MuiTab-root': {
                  fontWeight: 'bold',
                  py: 2,
                  '&.Mui-selected': {
                    color: 'white',
                    bgcolor: 'primary.main',
                  },
                },
              }}
            >
              <Tab 
                label="商品カテゴリから探す" 
                sx={{ 
                  bgcolor: tabValue === 0 ? 'primary.main' : '#f5f5f5',
                  color: tabValue === 0 ? 'white' : 'text.primary',
                  borderRadius: 0,
                  fontSize: '1rem',
                }}
              />
              <Tab 
                label="業種・目的から探す" 
                sx={{ 
                  bgcolor: tabValue === 1 ? 'primary.main' : '#f5f5f5',
                  color: tabValue === 1 ? 'white' : 'text.primary',
                  borderRadius: 0,
                  fontSize: '1rem',
                }}
              />
            </Tabs>
          </Box>
          
          <Box sx={{ p: 2, bgcolor: '#f5f5f5', mb: 4 }}>
            <Grid container spacing={2}>
              {categories.map((category) => (
                <Grid item key={category.id} xs={6} sm={4} md={3}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      borderRadius: 0,
                      boxShadow: 'none',
                      bgcolor: 'white',
                      overflow: 'hidden',
                      '&:hover': {
                        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                      },
                    }}
                  >
                    <CardActionArea 
                      component={Link} 
                      href={`/products?category=${category.slug}`}
                      sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                    >
                      <CardMedia
                        component="img"
                        height={140}
                        image={category.image || '/images/product-placeholder.jpg'}
                        alt={category.name}
                        sx={{ objectFit: 'contain', p: 2 }}
                      />
                      <CardContent sx={{ textAlign: 'center', p: 1, bgcolor: 'white' }}>
                        <Typography 
                          variant="body1" 
                          component="div"
                          sx={{ fontWeight: 'medium' }}
                        >
                          {category.name}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>

        {/* Featured Products Banner - フレコンバッグ */}
        <Box sx={{ mb: 4, position: 'relative' }}>
          <Paper 
            elevation={0}
            sx={{ 
              bgcolor: '#F9F5E8', 
              p: 3, 
              borderRadius: 0,
              border: '1px solid #E5DFC9'
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography variant="h5" component="h2" gutterBottom fontWeight="bold" color="primary.main">
                  フレコンバッグ
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  お客様のご要望に応じた商品をお届けします！
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  当店では各種フレコンバッグを取り揃えております。
                  用途や素材、サイズなど、お客様のニーズに合わせてご選択いただけます。
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  ※分類や規格によって対応できる現場が異なりますので、詳細は商品ページをご確認ください。
                </Typography>
                <Button 
                  variant="contained"
                  color="primary"
                  component={Link}
                  href="/products?category=frecon-bags"
                  endIcon={<ArrowForward />}
                >
                  詳細を見る
                </Button>
              </Grid>
              <Grid item xs={12} md={5}>
                <Box 
                  component="img"
                  src="/images/category-frecon.jpg"
                  alt="フレコンバッグ"
                  sx={{ 
                    width: '100%',
                    maxHeight: 250,
                    objectFit: 'contain' 
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Box>

        {/* Special Info Box */}
        <Box sx={{ mb: 4 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2,
              borderRadius: 0,
              border: '2px solid',
              borderColor: 'primary.main',
            }}
          >
            <Typography 
              component="h2" 
              variant="h6" 
              align="center" 
              sx={{ color: 'primary.main', fontWeight: 'bold', mb: 1 }}
            >
              特価商品のご案内
            </Typography>
            <Typography align="center">
              50枚以上のご注文で特別価格でご提供いたします。お見積りは無料ですのでお気軽にお問い合わせください。
            </Typography>
          </Paper>
        </Box>
        
        {/* Featured Products */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                fontWeight: 'bold', 
                display: 'flex', 
                alignItems: 'center',
                color: 'primary.main',
                borderBottom: '2px solid',
                borderColor: 'primary.main',
                pb: 1,
                width: '100%'
              }}
            >
              <BuildIcon sx={{ mr: 1 }} />
              おすすめ商品
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button 
              variant="outlined" 
              color="primary"
              component={Link}
              href="/products"
              endIcon={<ArrowForward />}
              size="small"
            >
              すべての商品を見る
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {featuredProducts.map((product) => (
              <Grid item key={product.id} xs={6} sm={4} md={3}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: 0,
                    border: '1px solid #e0e0e0',
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                    }
                  }}
                >
                  <CardActionArea component={Link} href={`/products/${product.id}`} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                      component="img"
                      height={160}
                      image={product.images[0] || '/images/product-placeholder.jpg'}
                      alt={product.name}
                      sx={{ objectFit: 'contain', bgcolor: '#f9f9f9', p: 1 }}
                    />
                    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                      <Typography 
                        variant="subtitle2"
                        component="div" 
                        noWrap 
                        fontWeight="medium"
                        sx={{ mb: 0.5, fontSize: '0.85rem', lineHeight: 1.3 }}
                      >
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        {product.maker || ''}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.75rem' }}>
                        型番: {product.sku}
                      </Typography>
                      <Box>
                        <Typography variant="h6" color="primary" fontWeight="bold" sx={{ fontSize: '1.1rem' }}>
                          ¥{product.price.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                          税込
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </>
  );
} 