import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // UMD без ESM default — pre-bundle добавляет interop
    include: ['sql.js/dist/sql-wasm-browser.js'],
  },
});
