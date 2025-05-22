import { createTheme } from '@mui/material/styles';

/**
 * Material UI theme configuration for the EC site
 * Follows the specifications from SECTION_ID: 5.2 and 5.3
 * Colors updated to match kensetsu-shizai.com site
 */
const theme = createTheme({
  palette: {
    primary: {
      main: '#EB6100', // Updated to match kensetsu-shizai.com orange
    },
    secondary: {
      main: '#FFA000', // Updated from design
    },
    background: {
      default: '#FFFFFF', // BACKGROUND_DEFAULT
      paper: '#F5F5F5', // BACKGROUND_PAPER
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)', // TEXT_PRIMARY
      secondary: 'rgba(0, 0, 0, 0.6)', // TEXT_SECONDARY
    },
    error: {
      main: '#D32F2F', // ERROR_COLOR: MUI Red 700
    },
  },
  typography: {
    fontFamily: "'Noto Sans JP', 'Roboto', 'Helvetica', 'Arial', sans-serif", // Updated to include Noto Sans JP for better Japanese text rendering
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      marginBottom: '0.75rem',
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      marginBottom: '0.75rem',
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      marginBottom: '0.5rem',
      '@media (max-width:600px)': {
        fontSize: '1.25rem',
      },
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      marginBottom: '0.5rem',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      marginBottom: '0.5rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none', // Disable uppercase button text
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '8px 16px',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: '1rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          boxShadow: '1px 0px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          '&.Mui-selected': {
            backgroundColor: 'rgba(0, 91, 172, 0.1)', // Updated to match primary color
            '&:hover': {
              backgroundColor: 'rgba(0, 91, 172, 0.15)', // Updated to match primary color
            },
          },
        },
      },
    },
  },
});

export default theme; 