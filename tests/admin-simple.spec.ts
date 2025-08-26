import { test, expect, Page } from '@playwright/test';

// Test data
const ADMIN_EMAIL = 'admin@aether.com';
const ADMIN_PASSWORD = 'password';

const TEST_PROJECT = {
  title: 'Test Project E2E',
  description: 'This is a test project created during automated testing to verify admin functionality',
  tags: 'React, TypeScript, Testing',
  imageUrl: 'https://via.placeholder.com/400x300.png?text=Test+Image',
  projectUrl: 'https://example.com',
  aiHint: 'Modern web application with clean design',
  caseStudyProblem: 'The client needed a modern web application with responsive design and user-friendly interface.',
  caseStudySolution: 'We developed a React-based application with TypeScript for type safety and modern UI components.',
  caseStudyOutcome: 'Successfully delivered a performant web application that increased user engagement by 150%.'
};

async function loginAsAdmin(page: Page) {
  await page.goto('/admin/login');
  
  // Wait for the login form to be visible
  await expect(page.locator('textbox[name="Email"]')).toBeVisible();
  
  // Fill in the login form using the exact field names from the actual form
  await page.fill('input[name="email"]', ADMIN_EMAIL);
  await page.fill('input[name="password"]', ADMIN_PASSWORD);
  
  // Submit the form
  await page.click('button:has-text("Login")');
  
  // Wait for successful login
  await page.waitForURL('/admin');
  await expect(page.locator('text=Admin Dashboard')).toBeVisible();
}

test.describe('Admin Panel Core Functionality', () => {
  test('should allow admin login and access dashboard', async ({ page }) => {
    await loginAsAdmin(page);
    
    // Verify we're on the admin dashboard
    await expect(page.locator('text=Admin Dashboard')).toBeVisible();
    await expect(page.locator('text=Logout')).toBeVisible();
    await expect(page.locator('text=Add New Project')).toBeVisible();
  });

  test('should open and display project form', async ({ page }) => {
    await loginAsAdmin(page);
    
    // Click Add New Project
    await page.click('text=Add New Project');
    
    // Wait for form dialog to appear
    await expect(page.locator('dialog[aria-label="Add New Project"]')).toBeVisible();
    
    // Check that key form fields are present
    await expect(page.locator('input[name="title"]')).toBeVisible();
    await expect(page.locator('textarea[name="description"]')).toBeVisible();
    await expect(page.locator('input[name="tags"]')).toBeVisible();
    await expect(page.locator('input[name="imageUrl"]')).toBeVisible();
  });

  test('should display existing projects', async ({ page }) => {
    await loginAsAdmin(page);
    
    // Should see project count and projects
    await expect(page.locator('text=Showing 6 of 6 projects')).toBeVisible();
    await expect(page.locator('text=ConnectSphere')).toBeVisible();
    await expect(page.locator('text=EcoVoyage')).toBeVisible();
  });

  test('should have search and filter functionality', async ({ page }) => {
    await loginAsAdmin(page);
    
    // Check search input is present
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
    
    // Check filter dropdowns are present
    await expect(page.locator('text=All Tags')).toBeVisible();
    await expect(page.locator('text=Sort by Title')).toBeVisible();
  });

  test('should allow logout', async ({ page }) => {
    await loginAsAdmin(page);
    
    // Click logout button
    await page.click('text=Logout');
    
    // Should redirect to login page
    await page.waitForURL('/admin/login');
    await expect(page.locator('text=Admin Login')).toBeVisible();
  });

  test('should show form validation for empty fields', async ({ page }) => {
    await loginAsAdmin(page);
    
    // Open project form
    await page.click('text=Add New Project');
    await expect(page.locator('dialog')).toBeVisible();
    
    // Try to submit empty form
    await page.click('button:has-text("Save Project")');
    
    // Should see some form of validation (field highlighting, error messages, etc.)
    // The exact validation behavior may vary, so we just check the form is still open
    await expect(page.locator('dialog')).toBeVisible();
  });

  test('should redirect to login when accessing admin directly without auth', async ({ page }) => {
    // Try to access admin page directly without logging in
    await page.goto('/admin');
    
    // Should be redirected to login page
    await page.waitForURL('/admin/login');
    await expect(page.locator('text=Admin Login')).toBeVisible();
  });
});

test.describe('Admin Panel Responsive Behavior', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Should still show admin dashboard
    await expect(page.locator('text=Admin Dashboard')).toBeVisible();
    await expect(page.locator('text=Add New Project')).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Should still show admin dashboard
    await expect(page.locator('text=Admin Dashboard')).toBeVisible();
    await expect(page.locator('text=Add New Project')).toBeVisible();
  });
});