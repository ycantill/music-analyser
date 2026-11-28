import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const nota = (page, etiqueta) => page.getByRole('button', { name: etiqueta, exact: false });

test('se puede armar un acorde solo con el teclado y el lector de pantalla lo anuncia', async ({ page }) => {
  await page.goto('/');
  const notas = page.getByRole('group', { name: 'Notas del diapasón' }).getByRole('button');
  await expect(notas).toHaveCount(78);

  // C3: quinta cuerda (A), traste 3.
  const c3 = nota(page, 'C3, cuerda 5, traste 3');
  await c3.focus();
  await page.keyboard.press('Enter');
  await expect(nota(page, 'C3, cuerda 5, traste 3, tónica')).toHaveAttribute('aria-pressed', 'true');

  // E3 (tercera mayor) en la cuarta cuerda y G3 (quinta justa) en la tercera, al aire.
  await nota(page, 'E3, cuerda 4, traste 2, tercera mayor').focus();
  await page.keyboard.press('Enter');
  await nota(page, 'G3, cuerda 3, al aire, quinta justa').focus();
  await page.keyboard.press('Space');

  await expect(page.locator('[aria-live="polite"]')).toHaveText('Acorde: Cmaj');
  await expect(nota(page, 'G3, cuerda 3, al aire, quinta justa, en el acorde')).toHaveAttribute('aria-pressed', 'true');
});

test('con el mouse: tónica, intervalos y acorde a la vista', async ({ page }) => {
  await page.goto('/');
  await nota(page, 'A2, cuerda 6, traste 5').click();
  await nota(page, 'C3, cuerda 5, traste 3, tercera menor').click();
  await nota(page, 'E3, cuerda 4, traste 2, quinta justa').click();
  await expect(page.locator('.chord-badge')).toHaveText('Am');

  // Quitar la tercera deja un power chord.
  await nota(page, 'C3, cuerda 5, traste 3, tercera menor, en el acorde').click();
  await expect(page.locator('.chord-badge')).toHaveText('A5');
});

test('no tiene errores de accesibilidad (WCAG 2.2 AA), al inicio ni con un acorde', async ({ page }) => {
  await page.goto('/');
  const inicio = await new AxeBuilder({ page }).withTags(WCAG).analyze();
  expect(inicio.violations.map((v) => `${v.id} (${v.nodes.length})`)).toEqual([]);

  await nota(page, 'C3, cuerda 5, traste 3').click();
  await nota(page, 'E3, cuerda 4, traste 2, tercera mayor').click();
  const conAcorde = await new AxeBuilder({ page }).withTags(WCAG).analyze();
  expect(conAcorde.violations.map((v) => `${v.id} (${v.nodes.length})`)).toEqual([]);
});

test('sin errores en la consola y el audio no se carga hasta tocar una nota', async ({ page }) => {
  const errores = [];
  const scripts = [];
  page.on('console', (m) => m.type() === 'error' && errores.push(m.text()));
  page.on('pageerror', (e) => errores.push(e.message));
  page.on('request', (r) => r.resourceType() === 'script' && scripts.push(r.url()));
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const alCargar = scripts.length;

  await nota(page, 'C3, cuerda 5, traste 3').click();
  await expect.poll(() => scripts.length).toBeGreaterThan(alCargar);
  expect(errores).toEqual([]);
});

test('la app instalada abre dentro de su carpeta en GitHub Pages', async ({ request }) => {
  const manifest = await (await request.get('/manifest.json')).json();
  // Rutas relativas: en ycantill.github.io/music-analyser/ resuelven a esa carpeta, no a la raíz del dominio.
  expect(manifest.start_url).toBe('./');
  expect(manifest.scope).toBe('./');
  for (const icon of manifest.icons) expect(icon.src).not.toMatch(/^\//);
});

test('funciona sin internet después de la primera visita, incluido el sonido', async ({ page, context }) => {
  await page.goto('/');
  // Espera a que el service worker controle la página (ya guardó la app).
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) {
      await new Promise((r) => navigator.serviceWorker.addEventListener('controllerchange', r, { once: true }));
    }
  });

  await context.setOffline(true);
  await page.reload();
  const errores = [];
  page.on('pageerror', (e) => errores.push(e.message));

  await nota(page, 'C3, cuerda 5, traste 3').click();
  await nota(page, 'E3, cuerda 4, traste 2, tercera mayor').click();
  await nota(page, 'G3, cuerda 3, al aire, quinta justa').click();
  await expect(page.locator('.chord-badge')).toHaveText('Cmaj');
  // El audio (Tone.js) se carga al tocar: sin internet también tiene que llegar del dispositivo.
  await expect.poll(() => page.evaluate(() => performance.getEntriesByType('resource').some((r) => /\/assets\/esm-/.test(r.name)))).toBe(true);
  expect(errores).toEqual([]);
});

test('con señal lenta, tocar varias notas mientras carga el audio no da errores', async ({ page }) => {
  const errores = [];
  page.on('pageerror', (e) => errores.push(e.message));
  // Tone.js tarda en llegar, como con mala señal.
  await page.route('**/assets/esm-*.js', async (route) => {
    await new Promise((r) => setTimeout(r, 800));
    await route.continue();
  });
  await page.goto('/');
  await nota(page, 'C3, cuerda 5, traste 3').click();
  await nota(page, 'E3, cuerda 4, traste 2, tercera mayor').click();
  await nota(page, 'G3, cuerda 3, al aire, quinta justa').click();
  await expect(page.locator('.chord-badge')).toHaveText('Cmaj');
  await page.waitForTimeout(1500);
  expect(errores).toEqual([]);
});
