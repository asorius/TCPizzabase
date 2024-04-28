import { test, expect } from '@playwright/test'
import { loginNewUser } from 'utils/api'

test.describe.serial('creation features', () => {
  test('not logged in users can not access creation', async ({ page }) => {
    await page.goto('/')

    expect(await page.locator('#createNew')).toBeVisible()

    await page.locator('#createNew').click()

    await page.waitForURL('/login')
  })
  test('logged in users can access creation', async ({ page }) => {
    await page.goto('/')

    const { email, password } = await loginNewUser(page)

    await page.goto('/login')

    await page.getByLabel('Email').fill(email)
    await page.getByLabel('Password').fill(password)
    await page.locator('#loginButton').click()

    expect(await page.locator('#createNew')).toBeVisible()

    await page.locator('#createNew').click()

    await page.waitForURL('/create')
  })
})
