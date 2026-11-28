// Genera docs/screenshot.png para el README: el diapasón con un acorde de La
// menor séptima armado. Uso: npm run build && npm run screenshot
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';

const PUERTO = 4182;
const salida = new URL('../docs/screenshot.png', import.meta.url).pathname;
const server = spawn('npx', ['vite', 'preview', '--port', String(PUERTO), '--strictPort'], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 2000));

const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1100, height: 560 }, deviceScaleFactor: 2, locale: 'es-CO' })).newPage();
await p.goto(`http://localhost:${PUERTO}/`);
const nota = (nombre) => p.getByRole('button', { name: nombre });
await nota('A2, cuerda 6, traste 5').click();
await nota('C3, cuerda 5, traste 3, tercera menor').click();
await nota('E3, cuerda 4, traste 2, quinta justa').click();
await nota('G3, cuerda 3, al aire, séptima menor').click();
await p.mouse.move(0, 0);
await p.waitForTimeout(400);
await p.screenshot({ path: salida, clip: { x: 0, y: 0, width: 1100, height: 330 } });
await b.close();
server.kill();
console.log(`Captura en ${salida}`);
