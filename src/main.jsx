import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import HairstyleAI from './components/HairstyleAI'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HairstyleAI />
  </StrictMode>,
)
