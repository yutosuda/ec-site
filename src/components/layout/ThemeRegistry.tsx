'use client';

import React, { ReactNode, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import theme from '@/styles/theme';
import { AuthProvider } from '@/contexts/AuthContext';
import { initializeAppData } from '@/lib/utils/initializeAppData';

interface ThemeRegistryProps {
  children: ReactNode;
}

/**
 * Client component that provides MUI theme and global providers
 */
const ThemeRegistry: React.FC<ThemeRegistryProps> = ({ children }) => {
  // アプリケーションの初期化処理
  useEffect(() => {
    // クライアントサイドでのみ実行
    if (typeof window !== 'undefined') {
      // アプリケーションの初期データを設定
      initializeAppData();
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          <Header />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              py: 3,
            }}
          >
            {children}
          </Box>
          <Footer />
        </Box>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default ThemeRegistry; 