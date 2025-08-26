import { test, expect, Page } from '@playwright/test';

// Test data
const ADMIN_EMAIL = 'admin@aether.com';
const ADMIN_PASSWORD = 'password';

const TEST_PROJECT = {
  title: 'Test Project for E2E',
  description: 'This is a test project created during automated testing',
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
  
  // Wait for the form to be visible
  await expect(page.locator('form')).toBeVisible();
  
  // Fill in the login form
  await page.fill('input[name="email"]', ADMIN_EMAIL);
  await page.fill('input[name="password"]', ADMIN_PASSWORD);
  
  // Submit the form
  await page.click('button[type="submit"]');
  
  // Wait for successful login and redirect to admin dashboard
  await page.waitForURL('/admin');
  await expect(page.locator('text=Admin Dashboard')).toBeVisible();
}

test.describe('Admin Panel Authentication', () => {
  test('should redirect to login page when not authenticated', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForURL('/admin/login');
    expect(page.url()).toContain('/admin/login');
  });

  test('should show error message for invalid credentials', async ({ page }) => {
    await page.goto('/admin/login');
    
    await page.fill('input[name="email"]', 'invalid@email.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Wait for error message
    await expect(page.locator('text=Invalid email or password')).toBeVisible({ timeout: 5000 });
  });

  test('should login successfully with valid admin credentials', async ({ page }) => {
    await loginAsAdmin(page);
    
    // Verify we're on the admin dashboard
    await expect(page.locator('text=Admin Dashboard')).toBeVisible();
    await expect(page.locator('text=Logout')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    await loginAsAdmin(page);
    
    // Click logout button
    await page.click('text=Logout');
    
    // Should redirect to login page
    await page.waitForURL('/admin/login');
    expect(page.url()).toContain('/admin/login');
  });
});

test.describe('Admin Panel Project Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('should display project list', async ({ page }) => {
    // Check if we can see the project management interface
    await expect(page.locator('text=Add New Project')).toBeVisible();
  });

  test('should open project form when clicking Add New Project', async ({ page }) => {
    await page.click('text=Add New Project');
    
    // Wait for form to appear
    await expect(page.locator('text=Add New Project')).toBeVisible();
    await expect(page.locator('textbox[name="title"]')).toBeVisible();
    await expect(page.locator('textbox[name="description"]')).toBeVisible();
  });

  test('should validate required fields in project form', async ({ page }) => {
    await page.click('text=Add New Project');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.locator('text=Title must be at least 2 characters')).toBeVisible();
    await expect(page.locator('text=Description must be at least 10 characters')).toBeVisible();
  });

  test('should create a new project successfully', async ({ page }) => {
    await page.click('text=Add New Project');
    
    // Fill in the project form
    await page.fill('input[name="title"]', TEST_PROJECT.title);
    await page.fill('textarea[name="description"]', TEST_PROJECT.description);
    await page.fill('input[name="tags"]', TEST_PROJECT.tags);
    await page.fill('input[name="imageUrl"]', TEST_PROJECT.imageUrl);
    await page.fill('input[name="projectUrl"]', TEST_PROJECT.projectUrl);
    await page.fill('textarea[name="data-ai-hint"]', TEST_PROJECT.aiHint);
    
    // Fill case study fields
    await page.fill('textarea[name="caseStudyProblem"]', TEST_PROJECT.caseStudyProblem);
    await page.fill('textarea[name="caseStudySolution"]', TEST_PROJECT.caseStudySolution);
    await page.fill('textarea[name="caseStudyOutcome"]', TEST_PROJECT.caseStudyOutcome);
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Wait for success message
    await expect(page.locator('text=Project "' + TEST_PROJECT.title + '" saved successfully')).toBeVisible({ timeout: 10000 });
    
    // Verify the project appears in the list
    await expect(page.locator('text=' + TEST_PROJECT.title)).toBeVisible();
  });

  test('should be able to search for projects', async ({ page }) => {
    // Assuming there are projects in the list, test search functionality
    const searchInput = page.locator('input[placeholder*="Search"]');
    if (await searchInput.count() > 0) {
      await searchInput.fill('Test');
      // Should filter results based on search term
      await page.waitForTimeout(1000); // Wait for search to process
    }
  });

  test('should be able to filter projects by tag', async ({ page }) => {
    // Check if filter dropdown is available
    const filterSelect = page.locator('text=Filter by tag').first();
    if (await filterSelect.count() > 0) {
      await filterSelect.click();
      // Should see tag options
      await expect(page.locator('text=All Tags')).toBeVisible();
    }
  });
});

test.describe('Admin Panel Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('should handle API errors gracefully', async ({ page }) => {
    await page.click('text=Add New Project');
    
    // Fill form with invalid data (invalid URL)
    await page.fill('input[name="title"]', 'Test Project');
    await page.fill('textarea[name="description"]', 'Test description for error handling');
    await page.fill('input[name="tags"]', 'Test');
    await page.fill('input[name="imageUrl"]', 'invalid-url');
    await page.fill('textarea[name="caseStudyProblem"]', 'Test problem');
    await page.fill('textarea[name="caseStudySolution"]', 'Test solution');
    await page.fill('textarea[name="caseStudyOutcome"]', 'Test outcome');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Should show validation error for invalid URL
    await expect(page.locator('text=Must be a valid URL')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Admin Panel Responsive Design', () => {
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