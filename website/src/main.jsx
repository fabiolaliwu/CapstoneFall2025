import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Homepage from './homePage/homepage'
import Maps from './app'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <Homepage /> */}
    <Maps />
  </StrictMode>,
)
