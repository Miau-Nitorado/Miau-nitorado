import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = [
  { path: '/', heading: 'Ajude a encontrar quem está perdido.' },
  { path: '/login', heading: 'Entrar' },
  { path: '/cadastro', heading: 'Criar conta' },
  { path: '/animais-perdidos', heading: 'Animais Perdidos' },
  { path: '/animais-encontrados', heading: 'Animais Encontrados' },
];

test.beforeEach(async ({ page }) => {
  // Stubs prevent test runs from creating or changing production records.
  await page.route('**/api/**', async route => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
  });
});

for (const route of routes) {
  test(`WCAG 2.2 AA scan: ${route.path}`, async ({ page }) => {
    await page.goto(route.path);
    await expect(page.getByRole('heading', { name: route.heading }).first()).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations.map(v => ({
      id: v.id, impact: v.impact, description: v.description,
      nodes: v.nodes.map(node => node.target),
    })), `Accessibility violations on ${route.path}`).toEqual([]);
  });
}

test('skip link moves keyboard focus to main content', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Pular para o conteúdo principal' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#conteudo-principal')).toBeFocused();
});

test('login form exposes labelled fields and accessible validation', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByLabel('E-mail')).toBeVisible();
  await expect(page.getByLabel('Senha')).toBeVisible();
  await page.locator('form').getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByLabel('E-mail')).toBeFocused();
  await expect(page.getByLabel('E-mail')).toHaveJSProperty('validity.valueMissing', true);
});

test('public API routes respond without authentication', async ({ request }) => {
  test.skip(!process.env.API_BASE_URL, 'Configure API_BASE_URL para executar smoke tests da API.');
  const paths = ['/api/v1/ocorrencias', '/api/v1/ocorrencias/recentes', '/api/v1/ocorrencias/cidades'];
  for (const path of paths) {
    const response = await request.get(new URL(path, process.env.API_BASE_URL).toString());
    expect(response.status(), `Unexpected status for ${path}`).toBe(200);
  }
});

test('protected API routes reject anonymous requests', async ({ request }) => {
  test.skip(!process.env.API_BASE_URL, 'Configure API_BASE_URL para executar smoke tests da API.');
  const response = await request.get(new URL('/api/v1/ocorrencias/minhas', process.env.API_BASE_URL).toString());
  expect(response.status()).toBe(401);
});