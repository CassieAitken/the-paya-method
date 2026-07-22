import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { BadgePreview } from './pages/BadgePreview';
import './index.css';

const isPreview = window.location.hash === '#preview' || window.location.search.includes('page=preview') || window.location.pathname === '/preview';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isPreview ? <BadgePreview /> : <App />}
  </StrictMode>
);
