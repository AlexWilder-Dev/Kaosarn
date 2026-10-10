import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource-variable/fraunces/opsz-italic.css';
import '@fontsource-variable/instrument-sans/wght.css';
import '@fontsource/trirong/thai-300.css';
import '@fontsource/trirong/thai-400.css';
import '@fontsource/trirong/thai-500.css';
import '@fontsource/charmonman/thai-400.css';
import './styles/global.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
