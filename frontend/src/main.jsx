// import React from 'react'
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthContext.jsx';
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { CssVarsProvider } from '@mui/joy/styles';
import theme from './styles/theme';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <BrowserRouter>
      <CssVarsProvider theme={theme} disableTransitionOnChange>
        <App />
      </CssVarsProvider>
    </BrowserRouter>
  </AuthProvider>
)
