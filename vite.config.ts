import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Served from https://<user>.github.io/Kaosarn/ on GitHub Pages.
export default defineConfig({
  base: '/Kaosarn/',
  plugins: [react()],
});
