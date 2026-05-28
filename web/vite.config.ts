import fs from 'node:fs';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/** Встраивает .wasm?inline-wasm как base64-строку (для file:// без fetch). */
function wasmInlinePlugin(): Plugin {
  return {
    name: 'wasm-inline',
    enforce: 'pre',
    load(id) {
      const [file, query] = id.split('?');
      if (query !== 'inline-wasm' || !file.endsWith('.wasm')) return null;
      const base64 = fs.readFileSync(file).toString('base64');
      return `export default ${JSON.stringify(base64)};`;
    },
  };
}

/** Убирает type="module" — иначе Chrome/Edge блокируют скрипт по file:// (CORS). */
function fileProtocolBuild(): Plugin {
  return {
    name: 'file-protocol-build',
    apply: 'build',
    transformIndexHtml(html) {
      return html
        .replace(/type="module"\s*/g, '')
        .replace(/\scrossorigin/g, '')
        // Без defer скрипт в <head> бежит раньше <div id="root"> → React #299
        .replace(/<script(?![^>]*\bdefer\b)(?![^>]*\basync\b) /g, '<script defer ');
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [wasmInlinePlugin(), react(), fileProtocolBuild()],
  optimizeDeps: {
    include: ['sql.js/dist/sql-wasm-browser.js'],
  },
  build: {
    modulePreload: false,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        format: 'iife',
        name: 'VkClientWeb',
        inlineDynamicImports: true,
        entryFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
});
