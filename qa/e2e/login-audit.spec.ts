import { test, expect } from '@playwright/test';

test('Audit the login page', async ({ page }) => {
  const consoleErrors: string[] = [];
  const consoleMessages: string[] = [];
  const networkErrors: string[] = [];

  // Capture console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    } else {
      consoleMessages.push(msg.text());
    }
  });

  // Capture failed requests
  page.on('requestfailed', request => {
    networkErrors.push(`${request.method()} ${request.url()} failed: ${request.failure()?.errorText}`);
  });

  page.on('pageerror', err => {
    consoleErrors.push(`Page Error: ${err.message}`);
  });

  // 1. Go to login page
  console.log('Navigating to http://localhost:3000/login...');
  await page.goto('http://localhost:3000/login');

  // Wait for network idle to catch lazy assets
  await page.waitForLoadState('networkidle');

  // 2. Take a screenshot for visual reference in case of failures (saved to test-results/playwright-report)
  await page.screenshot({ path: 'playwright-report/login-audit.png', fullPage: true });

  // 3. Verify page title
  const title = await page.title();
  console.log('Page Title:', title);

  // 4. Verify main heading
  const heading = await page.locator('h1').first().textContent();
  console.log('Main Heading:', heading);

  // 5. Audit PremiumLogo images - check if they loaded successfully
  const images = page.locator('img');
  const imgCount = await images.count();
  console.log(`Found ${imgCount} image(s) on the page.`);
  
  for (let i = 0; i < imgCount; i++) {
    const img = images.nth(i);
    const src = await img.getAttribute('src');
    const alt = await img.getAttribute('alt');
    const isLoaded = await img.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0);
    console.log(`Image #${i}: src="${src}", alt="${alt}", loadedSuccessfully=${isLoaded}`);
  }

  // 6. Check form inputs & labels association
  const inputs = page.locator('input');
  const inputCount = await inputs.count();
  console.log(`Found ${inputCount} input fields.`);
  
  for (let i = 0; i < inputCount; i++) {
    const input = inputs.nth(i);
    const id = await input.getAttribute('id');
    const placeholder = await input.getAttribute('placeholder');
    const type = await input.getAttribute('type');
    const autocomplete = await input.getAttribute('autocomplete');
    
    // Check if there is an associated label with htmlFor === id
    let labelText = 'No associated label';
    if (id) {
      const label = page.locator(`label[for="${id}"]`);
      if (await label.count() > 0) {
        labelText = await label.first().textContent() || 'Empty label';
      }
    }
    console.log(`Input #${i}: id="${id}", placeholder="${placeholder}", type="${type}", autocomplete="${autocomplete}", labelText="${labelText}"`);
  }

  // Report console and network results
  console.log('\n--- Console Messages ---');
  consoleMessages.forEach(msg => console.log('  INFO:', msg));
  
  console.log('\n--- Console Errors ---');
  consoleErrors.forEach(err => console.log('  ERROR:', err));

  console.log('\n--- Network Errors ---');
  networkErrors.forEach(err => console.log('  NET_ERR:', err));
});
