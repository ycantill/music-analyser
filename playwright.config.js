import { defineConfig, devices } from '@playwright/test';

// Pruebas de punta a punta sobre el build, en un celular en horizontal
// (así se usa la app: el diapasón es ancho).
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:4180',
    ...devices['Pixel 7 landscape'],
    locale: 'es-CO',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run build && npx vite preview --port 4180 --strictPort',
    url: 'http://localhost:4180',
    reuseExistingServer: !process.env.CI,
  },
});
