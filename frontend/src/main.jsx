import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { CssVarsProvider } from '@mui/joy/styles';
import theme from './styles/theme';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    <CssVarsProvider theme={theme} disableTransitionOnChange>
      <App />
    </CssVarsProvider>
  </React.StrictMode>,
)
