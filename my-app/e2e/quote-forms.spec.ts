import { test, expect } from '@playwright/test';

const PRODUCTION_URL = 'https://www.highendhomes.de';

test.describe('Angebotsformulare - Production E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/angebot`);
  });

  test('Entrümpelung-Formular vollständig ausfüllen und absenden', async ({ page }) => {
    // Tab wechseln
    await page.click('button:has-text("Entrümpelung")');
    
    // Pflichtfelder ausfüllen
    await page.fill('input#name', 'E2E Test Entrümpelung');
    await page.fill('input#email', 'e2e.entruempelung@test.com');
    await page.fill('input#sqm', '80');
    
    // Gebäudetyp auswählen - mit Trigger und direkter Auswahl
    const buildingTypeTrigger = page.locator('[role="combobox"]').first();
    await buildingTypeTrigger.click();
    await page.waitForTimeout(500);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    
    // Optionale Felder
    await page.fill('input#phone', '+49 151 11111111');
    await page.fill('input#company', 'Test GmbH');
    
    // Materialien auswählen - über Labels
    await page.locator('label', { hasText: 'Möbel' }).click();
    await page.locator('label', { hasText: 'Elektrogeräte' }).click();
    await page.locator('label', { hasText: 'Kleidung & Textilien' }).click();
    
    // Anmerkungen
    await page.fill('textarea#notes', 'E2E Production Test - Entrümpelung');
    
    // Formular absenden
    await page.click('button:has-text("Angebot anfragen")');
    
    // Erfolgsmeldung prüfen
    await expect(page.locator('text=Anfrage gesendet!')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Vielen Dank für Ihre Anfrage')).toBeVisible();
  });

  test('Entkernung-Formular vollständig ausfüllen und absenden', async ({ page }) => {
    // Tab wechseln
    await page.click('button:has-text("Entkernung")');
    
    // Pflichtfelder ausfüllen
    await page.fill('input#name-g', 'E2E Test Entkernung');
    await page.fill('input#email-g', 'e2e.entkernung@test.com');
    await page.fill('input#sqm-g', '100');
    
    // Gebäudetyp auswählen
    const buildingTypeTrigger = page.locator('[role="combobox"]').first();
    await buildingTypeTrigger.click();
    await page.waitForTimeout(500);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    
    // Zu entfernende Elemente - über Labels
    await page.locator('label', { hasText: 'Böden' }).click();
    await page.locator('label', { hasText: 'Wandverkleidungen & Putz' }).click();
    await page.locator('label', { hasText: 'Fenster & Türen' }).click();
    
    // Anmerkungen
    await page.fill('textarea#notes-g', 'E2E Production Test - Entkernung');
    
    // Formular absenden
    await page.click('button:has-text("Angebot anfragen")');
    
    // Erfolgsmeldung prüfen
    await expect(page.locator('text=Anfrage gesendet!')).toBeVisible({ timeout: 10000 });
  });

  test('Kombi-Formular vollständig ausfüllen und absenden', async ({ page }) => {
    // Tab wechseln
    await page.click('button:has-text("Kombi")');
    
    // Pflichtfelder ausfüllen
    await page.fill('input#name-k', 'E2E Test Kombi');
    await page.fill('input#email-k', 'e2e.kombi@test.com');
    await page.fill('input#sqm-k', '150');
    
    // Projektbeschreibung (Pflichtfeld)
    await page.fill('textarea#notes-k', 'E2E Production Test - Kombiprojekt aus Entkernung und Entrümpelung');
    
    // Formular absenden
    await page.click('button:has-text("Angebot anfragen")');
    
    // Erfolgsmeldung prüfen
    await expect(page.locator('text=Anfrage gesendet!')).toBeVisible({ timeout: 10000 });
  });

  test('Ausbau-Formular vollständig ausfüllen und absenden', async ({ page }) => {
    // Tab wechseln
    await page.click('button:has-text("Ausbau")');
    
    // Pflichtfelder ausfüllen
    await page.fill('input#name-a', 'E2E Test Ausbau');
    await page.fill('input#email-a', 'e2e.ausbau@test.com');
    
    // Leistungen auswählen - über Labels
    await page.locator('label', { hasText: 'Maler & Lackierer' }).click();
    await page.locator('label', { hasText: 'Trockenbau & Stuckateur' }).click();
    
    // Quadratmeter
    await page.fill('input#sqm-a', '120');
    
    // Projektbeschreibung (Pflichtfeld)
    await page.fill('textarea#notes-a', 'E2E Production Test - Ausbauarbeiten');
    
    // Formular absenden
    await page.click('button:has-text("Angebot anfragen")');
    
    // Erfolgsmeldung prüfen
    await expect(page.locator('text=Anfrage gesendet!')).toBeVisible({ timeout: 10000 });
  });

  test('Formular-Validierung - fehlende Pflichtfelder', async ({ page }) => {
    // Tab wechseln
    await page.click('button:has-text("Entrümpelung")');
    
    // Nur Name ausfüllen, E-Mail leer lassen
    await page.fill('input#name', 'Test User');
    
    // Versuchen abzuschicken - HTML5 Validierung sollte verhindern
    const submitButton = page.locator('button:has-text("Angebot anfragen")');
    await submitButton.click();
    
    // Prüfen dass kein Erfolg erscheint (Formular sollte noch sichtbar sein)
    await expect(page.locator('input#name')).toBeVisible();
  });

  test('Tab-Wechsel funktioniert korrekt', async ({ page }) => {
    // Prüfen ob alle Tabs vorhanden sind
    await expect(page.locator('button:has-text("Entrümpelung")')).toBeVisible();
    await expect(page.locator('button:has-text("Entkernung")')).toBeVisible();
    await expect(page.locator('button:has-text("Kombi")')).toBeVisible();
    await expect(page.locator('button:has-text("Ausbau")')).toBeVisible();
    
    // Tab wechseln und prüfen
    await page.click('button:has-text("Entkernung")');
    await expect(page.locator('input#name-g')).toBeVisible();
    
    await page.click('button:has-text("Kombi")');
    await expect(page.locator('input#name-k')).toBeVisible();
    
    await page.click('button:has-text("Ausbau")');
    await expect(page.locator('input#name-a')).toBeVisible();
  });

  test('Weitere Anfrage senden Button funktioniert', async ({ page }) => {
    // Ein Formular ausfüllen und absenden
    await page.click('button:has-text("Entrümpelung")');
    await page.fill('input#name', 'E2E Reset Test');
    await page.fill('input#email', 'reset@test.com');
    await page.fill('input#sqm', '50');
    
    // Gebäudetyp auswählen
    const buildingTypeTrigger = page.locator('[role="combobox"]').first();
    await buildingTypeTrigger.click();
    await page.waitForTimeout(500);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    
    await page.click('button:has-text("Angebot anfragen")');
    
    // Auf Erfolgsmeldung warten
    await expect(page.locator('text=Anfrage gesendet!')).toBeVisible({ timeout: 10000 });
    
    // "Weitere Anfrage senden" Button klicken
    await page.click('button:has-text("Weitere Anfrage senden")');
    
    // Formular sollte wieder sichtbar sein
    await expect(page.locator('input#name')).toBeVisible();
    await expect(page.locator('input#name')).toHaveValue('');
  });
});
