import { test, expect } from '@playwright/test';

test('complete flow: login, create, delete application', async ({ page }) => {
  // 1. LOGIN
  await page.goto('/login');
  await page.fill('input[id="email"]', 'kevinleal@hotmail.com');
  await page.fill('input[id="password"]', 'kevin');
  await page.click('button[type="submit"]');
  
  // Attendre redirection
  await page.waitForURL('**/applications');
  console.log('✅ Login réussi');
  
  // 2. CRÉER candidature
  await page.click('button:has-text("Add")');
  
  await page.fill('input[name="TitleApplication"]', 'Test E2E');
  await page.fill('input[name="Company"]', 'TestCorp');
  await page.fill('input[name="Location"]', 'Paris');
  await page.click('button:has-text("Pending")');
  
  await page.click('button[type="submit"]');
  
  // Vérifier création
  await expect(page.locator('text=Test E2E')).toBeVisible();
  console.log('✅ Candidature créée');
  
  // 3. SUPPRIMER candidature
  await page.click('text=Test E2E');
  await page.click('button:has-text("Delete")');
  await page.click('button:has-text("Confirm")');
  
  // Vérifier suppression
  await expect(page.locator('text=Test E2E')).not.toBeVisible();
  console.log('✅ Candidature supprimée');
  
  console.log('🎯 Flow complet réussi : Login → Create → Delete');
});