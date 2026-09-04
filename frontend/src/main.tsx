import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Importo BrowserRouter que permite que la aplicacion controle rutas
import { BrowserRouter } from "react-router-dom";

import './index.css'
import App from './App.tsx'

// Agrego BrowserRouter
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
