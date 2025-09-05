import { test, expect } from '@playwright/test';

test('complete flow: login, create, delete application', async ({ page }) => {
  // 1. LOGIN
  await page.goto('/login');
  await page.fill('input[id="email"]', 'kevinleal@hotmail.com');
  await page.fill('input[id="password"]', 'kevin');
  await page.click('button[type="submit"]');

  // Attendre un peu pour que la requête de login se fasse
  await page.waitForTimeout(2000);

  // Attendre redirection vers applications
  await page.waitForURL('**/applications', { timeout: 10000 });

  // 2. CRÉER candidature
  await page.click('button:has-text("Add Application")');

  await page.fill('input[name="TitleApplication"]', 'Test E2E');
  await page.fill('input[name="Company"]', 'TestCorp');
  await page.fill('input[name="Location"]', 'Paris');

  // Remplir la date si nécessaire
  const dateButton = page.locator('button:has-text("Pick a date")');
  if (await dateButton.isVisible()) {
    await dateButton.click();
    // Sélectionner le 3 dans le calendrier 
    await page.click('button:has-text("3")');
  }

  await page.click('button:has-text("Pending")');

  await page.click('button:has-text("Create new application")');

  // Attendre que le modal se ferme
  await expect(page.locator('dialog')).not.toBeVisible();

  // Attendre un refresh du tableau
  await page.waitForTimeout(2000);

  // 3. SUPPRIMER candidature
  // Chercher l'application créée avec la barre de recherche
  await page.fill('input[placeholder="Search applications..."]', 'Test E2E');
  await page.waitForTimeout(1000); // Attendre le filtrage

  // Cocher la checkbox de la ligne avec "Test E2E"
  const row = page.locator('tr').filter({ hasText: 'Test E2E' });
  // Essayer plusieurs sélecteurs pour la checkbox
  const checkbox = row.locator('button[role="checkbox"], input[type="checkbox"], [data-state]').first();
  await checkbox.click();

  // Cliquer sur le bouton Delete qui apparaît
  await page.click('button:has-text("Delete")');

  // Confirmer la suppression dans la modal
  await page.click('button:has-text("Delete 1")');

  // Vérifier suppression
  await expect(page.getByText('Test E2E')).not.toBeVisible();
});
