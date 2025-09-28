import { StrictMode } from 'react'
import { createRoot} from 'react-dom/client'
import './index.css'
import App from './App'
import Map from './components/Map';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* <Map /> */}
  </StrictMode>,
)
