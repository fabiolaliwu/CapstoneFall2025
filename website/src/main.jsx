import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Homepage from './components/homePage/homepage'
import Map from './components/Map';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <Homepage /> */}
    <Map />
  </StrictMode>,
)
