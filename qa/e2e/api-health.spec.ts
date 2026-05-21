import { test, expect } from '@playwright/test';

test.describe('API Health & Documentation', () => {
  test('should have a working swagger documentation', async ({ page }) => {
    await page.goto('/api-docs');
    await expect(page).toHaveTitle(/Smart Event AI OS/);
    
    // Check if the custom American Blue header is present
    const header = page.locator('header');
    await expect(header).toBeVisible();
    await expect(header).toHaveCSS('background-color', 'rgb(62, 68, 119)'); // #3E4477
  });

  test('should return valid swagger json', async ({ request }) => {
    const response = await request.get('/api/swagger');
    expect(response.ok()).toBeTruthy();
    const json = await response.json();
    expect(json.openapi).toBeDefined();
    expect(json.info.title).toContain('Smart Event AI OS');
  });
});
