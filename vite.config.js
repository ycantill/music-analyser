import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repo = process.env.GITHUB_REPO;

export default defineConfig({
  plugins: [react()],
  base: repo ? `/${repo}/` : '/',
});
