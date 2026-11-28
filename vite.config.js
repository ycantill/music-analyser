import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const repo = process.env.GITHUB_REPO;

export default defineConfig({
  plugins: [
    react(),
    // Service worker: guarda la app en el dispositivo para que funcione sin
    // internet después de la primera visita (útil en aulas con mala señal).
    // El sonido lo sintetiza el navegador con Tone.js, así que no hay audios que descargar.
    VitePWA({
      registerType: 'autoUpdate',
      // Se usa public/manifest.json tal cual.
      manifest: false,
      workbox: {
        // Todo el build, incluidos Tone.js y html2canvas, que se cargan al usarlos.
        globPatterns: ['**/*.{js,css,html,svg,json}'],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  base: repo ? `/${repo}/` : '/',
  // Vitest solo corre las pruebas unitarias; las de e2e/ son de Playwright.
  test: { include: ['src/**/*.test.js'] },
});
