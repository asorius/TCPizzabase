import { test, expect } from '@playwright/test'
import { loginNewUser } from 'utils/api'
import { fakeUser } from 'utils/fakeData'

const { email, password } = fakeUser()
// test('test', async ({ page }) => {
//   await page.goto('http://127.0.0.1:5173/')
//   await expect(page.getByRole('link', { name: 'Sign Up' })).toBeVisible()
//   await page.getByRole('link', { name: 'Sign Up' }).click()
//   await page.getByLabel('Email').click()
//   await page.getByLabel('Email').fill(email)
//   await page.getByLabel('Password', { exact: true }).click()
//   await page.getByLabel('Password', { exact: true }).fill(password)
//   await page.getByLabel('Confirm password').click()
//   await page.getByLabel('Confirm password').fill(password)
//   await expect(
//     page.getByText('Create new accountEmailPasswordConfirm password Sign up Cancel')
//   ).toBeVisible()
//   await page.getByRole('button', { name: 'Sign up' }).click()
//   await page.goto('http://127.0.0.1:5173/login')
//   await expect(page.getByText('Log InEmailPassword Log in')).toBeVisible()
//   await page.getByLabel('Email').click()
//   await page.getByLabel('Email').fill(email)
//   await page.getByLabel('Email').press('Tab')
//   await page.getByLabel('Password').click()
//   await page.getByLabel('Password').fill(password)
//   await page.getByRole('button', { name: 'Log in' }).click()

//   await expect(page.getByRole('button', { name: email })).toBeVisible()
//   await page.getByRole('button', { name: email }).click()
//   await expect(page.getByRole('link', { name: 'View Your Base' })).toBeVisible()
//   await expect(page.locator('li').filter({ hasText: 'Logout' })).toBeVisible()
//   await page.getByRole('link', { name: 'View Your Base' }).click()
//   await expect(page.getByText("Current basePizzas you've")).toBeVisible()

//   await page.getByTestId('logo').click()
//   await page.getByRole('link', { name: 'Create New Pizza' }).click()
//   await page.getByPlaceholder('Pizza name').click()
//   await page.getByPlaceholder('Pizza name').fill('pizza')
//   await page.getByPlaceholder('Brand').click()
//   await page.getByPlaceholder('Brand').fill('brand')
//   await page.locator('#country').selectOption('Egypt')
//   await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible()
//   await page.getByTestId('logo').click()
//   await page.getByRole('link', { name: 'View Your Base' }).click()
//   await expect(page.getByText("Current basePizzas you've")).toBeVisible()
// })
test.describe.serial('signup and login sequence', () => {
  test('visitor can signup', async ({ page }) => {
    // Given (ARRANGE)
    await page.goto('/signup')

    // When (ACT)
    const form = page.getByRole('form', { name: 'Signup' })
    await form.locator('input[type="email"]').fill(email)
    await form.locator('input[type="password"]').fill(password)
    await form.locator('button[type="submit"]').click()

    // Then (ASSERT)
    await page.waitForURL('/login')
  })

  test('visitor can not access personal page before login', async ({ page }) => {
    await page.goto('/personal')

    // user is redirected to login page
    await page.waitForURL('/login')
  })

  test('visitor can login', async ({ page }) => {
    // Given (ARRANGE)
    await page.goto('/login')

    // When (ACT)
    const form = page.getByRole('form', { name: 'Login' })
    await form.locator('input[type="email"]').fill(email)
    await form.locator('input[type="password"]').fill(password)
    await form.locator('button[type="submit"]').click()

    // user is redirected to login page
    await page.waitForURL('/home')

    await expect(page.getByRole('button', { name: email })).toBeVisible()
    await page.getByRole('button', { name: email }).click()

    await expect(page.getByRole('link', { name: 'View Your Base' })).toBeVisible()
    await expect(page.locator('li').filter({ hasText: 'Logout' })).toBeVisible()
  })
})

// Running logout test in isolation.
test('visitor can logout', async ({ page }) => {
  // Given (ARRANGE)
  await loginNewUser(page)

  await page.goto('/home')
  const logoutLink = page.getByRole('link', { name: 'Logout' })

  // When (ACT)
  await logoutLink.click()

  // Then (ASSERT)
  await expect(logoutLink).toBeHidden()

  // Ensure that we are redirected to the login page.
  // This test would break if we changed the login page URL,
  // but this is a signifcant change that we would want to
  // be aware of.
  await expect(page).toHaveURL('/home')

  // Refresh the page to make sure that the user is still logged out.
  await page.goto('/personal')
  await expect(logoutLink).toBeHidden()
  await expect(page).toHaveURL('/login')
})
