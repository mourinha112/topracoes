import { createTheme } from '@mui/material/styles';

// Paleta Top Racoes: fundo preto, dourado como destaque.
const PRETO = '#000000';
const SUPERFICIE = '#161616';
const SUPERFICIE_2 = '#1F1F1F';
const BORDA = '#2A2A2A';
const TEXTO = '#F5F5F5';
const TEXTO_SUAVE = '#A3A3A3';
const DOURADO = '#F2B705';
const DOURADO_ESCURO = '#C8960C';
const DOURADO_CLARO = '#FFD95A';
const TEXTO_NO_DOURADO = '#111111';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: DOURADO,
      light: DOURADO_CLARO,
      dark: DOURADO_ESCURO,
      contrastText: TEXTO_NO_DOURADO,
    },
    secondary: {
      main: DOURADO_CLARO,
      contrastText: TEXTO_NO_DOURADO,
    },
    success: { main: '#3DDC84', contrastText: TEXTO_NO_DOURADO },
    error: { main: '#FF5252', contrastText: TEXTO_NO_DOURADO },
    warning: { main: '#FFA533', contrastText: TEXTO_NO_DOURADO },
    info: { main: '#5AB0FF', contrastText: TEXTO_NO_DOURADO },
    background: {
      default: PRETO,
      paper: SUPERFICIE,
    },
    text: {
      primary: TEXTO,
      secondary: TEXTO_SUAVE,
    },
    divider: BORDA,
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: 'none',
          backgroundColor: SUPERFICIE,
          border: `1px solid ${BORDA}`,
          boxShadow: '0 1px 4px rgba(0,0,0,0.35)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: SUPERFICIE_2,
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: BORDA,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          backgroundImage: 'none',
          backgroundColor: SUPERFICIE,
          border: `1px solid ${BORDA}`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: SUPERFICIE_2,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottomColor: BORDA,
        },
        head: {
          backgroundColor: SUPERFICIE_2,
          color: TEXTO_SUAVE,
          fontWeight: 600,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: SUPERFICIE_2,
          },
        },
      },
    },
  },
  typography: {
    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
});

export default theme;
