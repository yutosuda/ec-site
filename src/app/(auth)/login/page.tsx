'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  TextField, 
  Button, 
  Alert, 
  Divider,
  CircularProgress,
  Link as MuiLink
} from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// Wrapper component that uses the search params
function LoginContent() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get return URL from query params
  const returnUrl = searchParams.get('returnUrl') || '/';
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push(returnUrl);
    }
  }, [isAuthenticated, router, returnUrl]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset error
    setError('');
    
    // Validation
    if (!email) {
      setError('メールアドレスを入力してください。');
      return;
    }
    
    if (!password) {
      setError('パスワードを入力してください。');
      return;
    }
    
    // Login
    setIsLoading(true);
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        router.push(returnUrl);
      } else {
        setError(result.error || 'ログインに失敗しました。');
      }
    } catch (error) {
      setError('ログイン処理中にエラーが発生しました。');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <LoginIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
          <Typography component="h1" variant="h4" gutterBottom>
            ログイン
          </Typography>
          
          {/* Error message */}
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {/* Login form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="メールアドレス"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="パスワード"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'ログイン'}
            </Button>
          </Box>
          
          <Divider sx={{ width: '100%', my: 2 }} />
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body1">
              アカウントをお持ちでない方は
              <MuiLink component={Link} href="/register" sx={{ ml: 1 }}>
                新規登録
              </MuiLink>
            </Typography>
          </Box>
          
          <Box sx={{ mt: 3, width: '100%' }}>
            <Alert severity="info">
              <Typography variant="body2">
                ※このサイトはモックアップです。実際の認証は行われません。
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                テスト用アカウント: test@example.com / password123
              </Typography>
            </Alert>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

/**
 * Login page component
 * Handles user authentication
 */
export default function LoginPage() {
  return (
    <Suspense fallback={
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Container>
    }>
      <LoginContent />
    </Suspense>
  );
} 