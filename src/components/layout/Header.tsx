'use client';

import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Badge,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Container,
  InputBase,
  Paper,
  TextField,
  Stack
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { 
  Menu as MenuIcon,
  ShoppingCart as ShoppingCartIcon,
  Person as PersonIcon,
  Favorite as FavoriteIcon,
  History as HistoryIcon,
  Search as SearchIcon,
  Home as HomeIcon,
  ExitToApp as LogoutIcon,
  Build as BuildIcon,
  Engineering as EngineeringIcon,
  ExpandMore as ExpandMoreIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Header component for the application
 * Contains navigation, search, cart, and user menu
 * Updated to match kensetsu-shizai.com design from reference image
 */
const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const { isAuthenticated, currentUser, logout } = useAuth();
  
  // State for menus and drawer
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [categoryMenuAnchor, setCategoryMenuAnchor] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll event to track if page is scrolled
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);
  
  // Handle user menu opening
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };
  
  // Handle user menu closing
  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };
  
  // Handle category menu
  const handleCategoryMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setCategoryMenuAnchor(event.currentTarget);
  };
  
  const handleCategoryMenuClose = () => {
    setCategoryMenuAnchor(null);
  };
  
  // Handle logout
  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    router.push('/');
  };
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  // Toggle mobile drawer
  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };
  
  // Mobile drawer content
  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem button component={Link} href="/">
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="ホーム" />
        </ListItem>
        <ListItem button component={Link} href="/products">
          <ListItemIcon><BuildIcon /></ListItemIcon>
          <ListItemText primary="商品一覧" />
        </ListItem>
        
        {/* Add categories in mobile menu */}
        <ListItem>
          <ListItemText primary="商品カテゴリ" primaryTypographyProps={{ fontWeight: 'bold' }} />
        </ListItem>
        <ListItem button component={Link} href="/products?category=power-tools">
          <ListItemText primary="電動工具" sx={{ pl: 2 }} />
        </ListItem>
        <ListItem button component={Link} href="/products?category=measuring-tools">
          <ListItemText primary="測定工具" sx={{ pl: 2 }} />
        </ListItem>
        <ListItem button component={Link} href="/products?category=safety-equipment">
          <ListItemText primary="安全用品" sx={{ pl: 2 }} />
        </ListItem>
        <ListItem button component={Link} href="/products?category=construction-materials">
          <ListItemText primary="建設資材" sx={{ pl: 2 }} />
        </ListItem>
      </List>
      <Divider />
      {isAuthenticated ? (
        <List>
          <ListItem button component={Link} href="/cart">
            <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
            <ListItemText primary="カート" />
          </ListItem>
          <ListItem button component={Link} href="/favorites">
            <ListItemIcon><FavoriteIcon /></ListItemIcon>
            <ListItemText primary="お気に入り" />
          </ListItem>
          <ListItem button component={Link} href="/history">
            <ListItemIcon><HistoryIcon /></ListItemIcon>
            <ListItemText primary="注文履歴" />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="ログアウト" />
          </ListItem>
        </List>
      ) : (
        <List>
          <ListItem button component={Link} href="/login">
            <ListItemIcon><PersonIcon /></ListItemIcon>
            <ListItemText primary="ログイン" />
          </ListItem>
          <ListItem button component={Link} href="/register">
            <ListItemIcon><PersonIcon /></ListItemIcon>
            <ListItemText primary="会員登録" />
          </ListItem>
        </List>
      )}
    </Box>
  );

  const topHeaderHeight = 30; // Height for the top header section - reduced from 40
  
  return (
    <Box sx={{ position: 'sticky', top: 0, zIndex: 1100 }}>
      {/* Top Header - Contact Info */}
      <Box 
        sx={{ 
          bgcolor: '#f5f5f5', 
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: { xs: 'none', md: 'block' },
          height: topHeaderHeight
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PhoneIcon fontSize="small" sx={{ mr: 0.5, color: 'primary.main' }} />
              <Typography variant="body2" sx={{ mr: 2, fontWeight: 'bold' }}>0120-814-844</Typography>
              <Typography variant="body2" color="text.secondary">受付時間：平日9:00～18:00</Typography>
            </Box>
          </Box>
        </Container>
      </Box>
      
      {/* Main Header */}
      <AppBar 
        position="relative"
        color="default" 
        elevation={0}
        sx={{ 
          backgroundColor: 'white',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ py: 1 }}>
            {/* Mobile menu icon */}
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            {/* Logo */}
            <Typography
              variant="h6"
              component={Link}
              href="/"
              sx={{
                flexGrow: { xs: 1, md: 0 },
                mr: { md: 4 },
                textDecoration: 'none',
                color: 'text.primary',
                display: 'flex',
                alignItems: 'center',
                fontWeight: 'bold',
                fontSize: '1.2rem'
              }}
            >
              <Box component="img" src="/images/logo.png" alt="建材ECモック" sx={{ height: 40, mr: 1, display: { xs: 'none', sm: 'block' } }} />
              建設土木資材.com
            </Typography>
            
            {/* Search bar - Desktop */}
            {!isMobile && (
              <Paper
                component="form"
                onSubmit={handleSearch}
                sx={{ 
                  p: '2px 4px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  flexGrow: 1,
                  mr: 2,
                  borderRadius: 0,
                  border: '2px solid',
                  borderColor: 'primary.main'
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="商品を検索"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <IconButton type="submit" sx={{ p: '10px', color: 'primary.main' }} aria-label="search">
                  <SearchIcon />
                </IconButton>
              </Paper>
            )}
            
            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              {/* Favorites */}
              {isAuthenticated && (
                <IconButton 
                  color="inherit" 
                  aria-label="favorites"
                  component={Link}
                  href="/favorites"
                  sx={{ mr: 1 }}
                >
                  <FavoriteIcon />
                </IconButton>
              )}
              
              {/* Cart icon with badge */}
              <IconButton 
                color="inherit" 
                aria-label="cart"
                component={Link}
                href="/cart"
                sx={{ mr: 1 }}
              >
                <Badge badgeContent={0} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
              
              {/* User menu */}
              {isAuthenticated ? (
                <Box>
                  <IconButton
                    aria-label="user account"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleUserMenuOpen}
                    color="inherit"
                  >
                    <PersonIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={userMenuAnchor}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(userMenuAnchor)}
                    onClose={handleUserMenuClose}
                  >
                    <MenuItem component={Link} href="/account" onClick={handleUserMenuClose}>
                      <PersonIcon sx={{ mr: 1, fontSize: 'small' }} />
                      アカウント情報
                    </MenuItem>
                    <MenuItem component={Link} href="/favorites" onClick={handleUserMenuClose}>
                      <FavoriteIcon sx={{ mr: 1, fontSize: 'small' }} />
                      お気に入り
                    </MenuItem>
                    <MenuItem component={Link} href="/history" onClick={handleUserMenuClose}>
                      <HistoryIcon sx={{ mr: 1, fontSize: 'small' }} />
                      注文履歴
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <LogoutIcon sx={{ mr: 1, fontSize: 'small' }} />
                      ログアウト
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                <Stack direction="row" spacing={1}>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    component={Link} 
                    href="/login"
                    size="small"
                  >
                    ログイン
                  </Button>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    component={Link} 
                    href="/register"
                    size="small"
                  >
                    会員登録
                  </Button>
                </Stack>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Categories navigation bar */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main',
          color: 'white',
          display: { xs: 'none', md: 'block' }
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between'
          }}>
            <Button 
              color="inherit" 
              component={Link}
              href="/products"
              sx={{ py: 1, flex: '1 1 0', textAlign: 'center' }}
            >
              商品一覧
            </Button>
            <Button 
              color="inherit" 
              component={Link}
              href="/products?category=frecon-bags"
              sx={{ py: 1, flex: '1 1 0', textAlign: 'center' }}
            >
              フレコンバッグ
            </Button>
            <Button 
              color="inherit" 
              component={Link}
              href="/products?category=sandbags"
              sx={{ py: 1, flex: '1 1 0', textAlign: 'center' }}
            >
              土のう・ガラ袋
            </Button>
            <Button 
              color="inherit" 
              component={Link}
              href="/products?category=sheets"
              sx={{ py: 1, flex: '1 1 0', textAlign: 'center' }}
            >
              シート類
            </Button>
            <Button 
              color="inherit" 
              component={Link}
              href="/products?category=workwear"
              sx={{ py: 1, flex: '1 1 0', textAlign: 'center' }}
            >
              作業服・作業用品
            </Button>
          </Box>
        </Container>
      </Box>
      
      {/* Mobile search bar */}
      {isMobile && (
        <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
          <Paper
            component="form"
            onSubmit={handleSearch}
            sx={{ 
              p: '2px 4px', 
              display: 'flex', 
              alignItems: 'center',
              borderRadius: 0,
              border: '2px solid',
              borderColor: 'primary.main'
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="商品を検索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <IconButton type="submit" sx={{ p: '10px', color: 'primary.main' }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Box>
      )}
      
      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Header; 