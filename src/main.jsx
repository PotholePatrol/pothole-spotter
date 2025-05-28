import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// PrimeReact core css
import 'primereact/resources/primereact.min.css';

// PrimeReact theme css - choose one
import 'primereact/resources/themes/lara-light-blue/theme.css'; // or lara-dark-blue, saga-blue, md-light, etc.

// PrimeIcons for icons
import 'primeicons/primeicons.css';

// Your own global styles (e.g. tailwind)
import './index.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
