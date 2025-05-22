'use client';

import React from 'react';
import { Box, Container, Typography, Link as MuiLink, Divider, Grid, List, ListItem, ListItemText } from '@mui/material';
import Link from 'next/link';
import { Phone as PhoneIcon, LocationOn as LocationIcon, CreditCard as CreditCardIcon, LocalShipping as ShippingIcon } from '@mui/icons-material';

/**
 * Footer component for the application
 * Contains links, copyright information, and company details
 * Updated to match kensetsu-shizai.com design from reference image
 */
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  // Footer links categorized
  const footerLinks = {
    categories: [
      { label: 'フレコンバッグ', href: '/products?category=frecon-bags' },
      { label: '土のう・ガラ袋', href: '/products?category=sandbags' },
      { label: 'シート類', href: '/products?category=sheets' },
      { label: '作業服・作業用品', href: '/products?category=workwear' },
      { label: '看板・構内備品', href: '/products?category=signs' },
      { label: '建設・土木資材', href: '/products?category=construction-materials' },
      { label: '物流機器・梱包資材', href: '/products?category=logistics' },
      { label: 'ライト・電源・配線', href: '/products?category=lighting' },
    ],
    purpose: [
      { label: '建設業', href: '/industry/construction' },
      { label: '解体業', href: '/industry/demolition' },
      { label: '製造業', href: '/industry/manufacturing' },
      { label: '農業', href: '/industry/agriculture' },
      { label: '物流業・倉庫業', href: '/industry/logistics' },
      { label: '運送業', href: '/industry/transportation' },
    ],
    userGuide: [
      { label: 'ご利用案内', href: '/guide' },
      { label: '見積書', href: '/quotation' },
      { label: 'よくあるご質問', href: '/faq' },
      { label: '当サイトについて', href: '/about' },
      { label: '会社概要', href: '/company' },
      { label: 'お問い合わせ', href: '/contact' },
    ],
    legal: [
      { label: 'ご利用規約', href: '/terms' },
      { label: 'プライバシーポリシー', href: '/privacy' },
      { label: '特定商取引法に基づく表記', href: '/legal' },
    ],
  };
  
  // Business information
  const businessInfo = [
    {
      icon: <CreditCardIcon fontSize="small" />,
      title: 'お支払い方法',
      content: 'Bカート掛け払い、代金引換、銀行振込、クレジットカード決済がご利用いただけます。'
    },
    {
      icon: <ShippingIcon fontSize="small" />,
      title: '送料について',
      content: '各商品ページをご確認ください。記載のない商品はお手数ですがお問い合わせください。'
    },
    {
      icon: <ShippingIcon fontSize="small" />,
      title: '配送について',
      content: '当日12時までのご注文は、翌営業日以降の発送となります。商品の出荷手続きが完了次第、最短での出荷となります。'
    },
    {
      icon: <LocationIcon fontSize="small" />,
      title: '返品・交換について',
      content: '原則返品・交換はお受けしておりません。納品時の破損、初期不良、当社出荷ミスの場合は返品・交換対応させていただきます。'
    },
  ];
  
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#f5f5f5',
        pt: 6,
        pb: 4,
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Section */}
        <Grid container spacing={4}>
          {/* Product Categories */}
          <Grid item xs={12} md={3}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                fontSize: '1rem',
                color: 'primary.main',
                borderBottom: '2px solid',
                borderColor: 'primary.main',
                pb: 1,
                mb: 2
              }}
            >
              商品カテゴリから探す
            </Typography>
            <List dense disablePadding>
              {footerLinks.categories.map((link) => (
                <ListItem key={link.label} dense disableGutters sx={{ pb: 0.5 }}>
                  <MuiLink
                    component={Link}
                    href={link.href}
                    color="text.secondary"
                    underline="hover"
                    sx={{ 
                      fontSize: '0.875rem',
                      '&:hover': { color: 'primary.main' }
                    }}
                  >
                    {link.label}
                  </MuiLink>
                </ListItem>
              ))}
            </List>
          </Grid>
          
          {/* Industry/Purpose */}
          <Grid item xs={12} md={3}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                fontSize: '1rem',
                color: 'primary.main',
                borderBottom: '2px solid',
                borderColor: 'primary.main',
                pb: 1,
                mb: 2
              }}
            >
              業種・目的から探す
            </Typography>
            <List dense disablePadding>
              {footerLinks.purpose.map((link) => (
                <ListItem key={link.label} dense disableGutters sx={{ pb: 0.5 }}>
                  <MuiLink
                    component={Link}
                    href={link.href}
                    color="text.secondary"
                    underline="hover"
                    sx={{ 
                      fontSize: '0.875rem',
                      '&:hover': { color: 'primary.main' }
                    }}
                  >
                    {link.label}
                  </MuiLink>
                </ListItem>
              ))}
            </List>
            
            <Typography 
              variant="h6" 
              sx={{ 
                mt: 3,
                fontWeight: 'bold',
                fontSize: '1rem',
                color: 'primary.main',
                borderBottom: '2px solid',
                borderColor: 'primary.main',
                pb: 1,
                mb: 2
              }}
            >
              お役立ち情報
            </Typography>
            <List dense disablePadding>
              <ListItem dense disableGutters sx={{ pb: 0.5 }}>
                <MuiLink
                  component={Link}
                  href="/lineup/frecon-bags"
                  color="text.secondary"
                  underline="hover"
                  sx={{ 
                    fontSize: '0.875rem',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  フレコンバッグラインナップ
                </MuiLink>
              </ListItem>
              <ListItem dense disableGutters sx={{ pb: 0.5 }}>
                <MuiLink
                  component={Link}
                  href="/guide/selection"
                  color="text.secondary"
                  underline="hover"
                  sx={{ 
                    fontSize: '0.875rem',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  商品の選び方
                </MuiLink>
              </ListItem>
            </List>
          </Grid>
          
          {/* User Guide */}
          <Grid item xs={12} md={3}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                fontSize: '1rem',
                color: 'primary.main',
                borderBottom: '2px solid',
                borderColor: 'primary.main',
                pb: 1,
                mb: 2
              }}
            >
              ご利用について
            </Typography>
            <List dense disablePadding>
              {footerLinks.userGuide.map((link) => (
                <ListItem key={link.label} dense disableGutters sx={{ pb: 0.5 }}>
                  <MuiLink
                    component={Link}
                    href={link.href}
                    color="text.secondary"
                    underline="hover"
                    sx={{ 
                      fontSize: '0.875rem',
                      '&:hover': { color: 'primary.main' }
                    }}
                  >
                    {link.label}
                  </MuiLink>
                </ListItem>
              ))}
            </List>
          </Grid>
          
          {/* Business Information */}
          <Grid item xs={12} md={3}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                fontSize: '1rem',
                color: 'primary.main',
                borderBottom: '2px solid',
                borderColor: 'primary.main',
                pb: 1,
                mb: 2
              }}
            >
              ご利用案内
            </Typography>
            
            {businessInfo.map((info, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.5 }}>
                  <Box sx={{ mr: 1, color: 'primary.main', mt: 0.5 }}>
                    {info.icon}
                  </Box>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '0.875rem' }}>
                    {info.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4, fontSize: '0.8rem' }}>
                  {info.content}
                </Typography>
              </Box>
            ))}
            
            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', bgcolor: 'primary.main', color: 'white', p: 1.5 }}>
              <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                  0120-814-844
                </Typography>
                <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                  受付時間：平日9:00～18:00
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ mt: 4, mb: 3 }} />
        
        {/* Legal Links */}
        <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {footerLinks.legal.map((link, index) => (
            <React.Fragment key={link.label}>
              <MuiLink
                component={Link}
                href={link.href}
                color="text.secondary"
                underline="hover"
                sx={{ 
                  mx: 1,
                  fontSize: '0.8rem',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                {link.label}
              </MuiLink>
              {index < footerLinks.legal.length - 1 && (
                <Typography color="text.disabled" sx={{ mx: 1 }}>|</Typography>
              )}
            </React.Fragment>
          ))}
        </Box>
        
        {/* Copyright */}
        <Typography variant="body2" color="text.secondary" align="center" sx={{ fontSize: '0.8rem' }}>
          {'© '}
          {currentYear}
          {' 建設土木資材.com All rights reserved.'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 