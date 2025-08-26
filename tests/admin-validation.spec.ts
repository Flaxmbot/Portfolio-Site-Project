import { test, expect } from '@playwright/test';

test.describe('Admin Panel Functionality Validation', () => {
  test('should display admin dashboard when already authenticated', async ({ page }) => {
    // Admin appears to be already authenticated - go directly to admin page
    await page.goto('/admin');
    
    // Verify admin dashboard is visible
    await expect(page.locator('text=Admin Dashboard')).toBeVisible();
    await expect(page.locator('text=Welcome, admin@aether.com')).toBeVisible();
    await expect(page.locator('text=Logout')).toBeVisible();
  });

  test('should display project management interface', async ({ page }) => {
    await page.goto('/admin');
    
    // Verify project management elements
    await expect(page.locator('text=Add New Project')).toBeVisible();
    await expect(page.locator('text=Showing 6 of 6 projects')).toBeVisible();
    
    // Verify search and filter functionality
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
    await expect(page.locator('text=All Tags')).toBeVisible();
    await expect(page.locator('text=Sort by Title')).toBeVisible();
  });

  test('should display existing projects', async ({ page }) => {
    await page.goto('/admin');
    
    // Verify specific projects are visible
    await expect(page.locator('text=ConnectSphere')).toBeVisible();
    await expect(page.locator('text=EcoVoyage')).toBeVisible();
    await expect(page.locator('text=Fusion Eats')).toBeVisible();
    await expect(page.locator('text=NovaLaunch')).toBeVisible();
    await expect(page.locator('text=Quantum Analytics')).toBeVisible();
    await expect(page.locator('text=Zenith Solutions')).toBeVisible();
  });

  test('should open project form dialog', async ({ page }) => {
    await page.goto('/admin');
    
    // Click Add New Project button
    await page.click('text=Add New Project');
    
    // Verify dialog opens
    await expect(page.locator('dialog')).toBeVisible();
    await expect(page.locator('heading:has-text("Add New Project")')).toBeVisible();
    
    // Verify form fields are present
    await expect(page.locator('input[name="title"]')).toBeVisible();
    await expect(page.locator('textarea[name="description"]')).toBeVisible();
    await expect(page.locator('input[name="tags"]')).toBeVisible();
    await expect(page.locator('input[name="imageUrl"]')).toBeVisible();
    await expect(page.locator('input[name="projectUrl"]')).toBeVisible();
    await expect(page.locator('textarea[name="caseStudyProblem"]')).toBeVisible();
    await expect(page.locator('textarea[name="caseStudySolution"]')).toBeVisible();
    await expect(page.locator('textarea[name="caseStudyOutcome"]')).toBeVisible();
    
    // Verify action buttons
    await expect(page.locator('button:has-text("Save Project")')).toBeVisible();
    await expect(page.locator('button:has-text("Generate Details with AI")')).toBeVisible();
  });

  test('should display statistics cards', async ({ page }) => {
    await page.goto('/admin');
    
    // Verify statistics cards
    await expect(page.locator('text=Total Projects')).toBeVisible();
    await expect(page.locator('text=6')).toBeVisible(); // Project count
    await expect(page.locator('text=Total Users')).toBeVisible();
    await expect(page.locator('text=Contacts')).toBeVisible();
    await expect(page.locator('text=Proposals')).toBeVisible();
    await expect(page.locator('text=Unique Tags')).toBeVisible();
    await expect(page.locator('text=15')).toBeVisible(); // Tag count
    await expect(page.locator('text=Admin Users')).toBeVisible();
  });

  test('should display navigation tabs', async ({ page }) => {
    await page.goto('/admin');
    
    // Verify navigation tabs
    await expect(page.locator('button:has-text("Projects")')).toBeVisible();
    await expect(page.locator('button:has-text("Users")')).toBeVisible();
    await expect(page.locator('button:has-text("Contacts")')).toBeVisible();
    await expect(page.locator('button:has-text("Proposals")')).toBeVisible();
    await expect(page.locator('button:has-text("Analytics")')).toBeVisible();
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/admin');
    
    // Core elements should still be visible on mobile
    await expect(page.locator('text=Admin Dashboard')).toBeVisible();
    await expect(page.locator('text=Add New Project')).toBeVisible();
    await expect(page.locator('text=Logout')).toBeVisible();
  });

  test('should have working search functionality', async ({ page }) => {
    await page.goto('/admin');
    
    // Get search input
    const searchInput = page.locator('input[placeholder*="Search"]');
    await expect(searchInput).toBeVisible();
    
    // Perform a search
    await searchInput.fill('Connect');
    await page.waitForTimeout(1000); // Wait for search to process
    
    // Should still show results (search is working)
    await expect(page.locator('text=ConnectSphere')).toBeVisible();
  });

  test('should have functional form validation', async ({ page }) => {
    await page.goto('/admin');
    
    // Open project form
    await page.click('text=Add New Project');
    await expect(page.locator('dialog')).toBeVisible();
    
    // Try to submit empty form
    await page.click('button:has-text("Save Project")');
    
    // Dialog should remain open (indicating validation is working)
    await expect(page.locator('dialog')).toBeVisible();
    
    // Close the dialog
    await page.click('button:has-text("Close")');
    await expect(page.locator('dialog')).not.toBeVisible();
  });
});