import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { ProductProvider } from './context/ProductContext_Temp'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProductProvider>
      <App />
    </ProductProvider>
  </StrictMode>,
)
