import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repo = process.env.GITHUB_REPO;

export default defineConfig({
  plugins: [react()],
  base: repo ? `/${repo}/` : '/',
  // Vitest solo corre las pruebas unitarias; las de e2e/ son de Playwright.
  test: { include: ['src/**/*.test.js'] },
});
