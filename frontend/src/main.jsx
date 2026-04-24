import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3200,
        style: {
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          color: '#0f172a',
          fontSize: '14px'
        },
        success: {
          iconTheme: {
            primary: '#16a34a',
            secondary: '#ffffff'
          }
        },
        error: {
          iconTheme: {
            primary: '#dc2626',
            secondary: '#ffffff'
          }
        }
      }}
    />
  </StrictMode>,
)
