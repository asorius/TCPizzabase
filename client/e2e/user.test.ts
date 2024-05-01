import { test, expect } from '@playwright/test'

import { fakeUser } from 'utils/fakeData'

const { email, password } = fakeUser()

test.describe.serial('signup and login sequence', () => {
  test('visitor can signup', async ({ page }) => {
    await page.goto('/signup')

    await page.getByLabel('Email').fill(email)
    await page.getByLabel('Password', { exact: true }).fill(password)
    await page.getByLabel('Confirm password').fill(password)

    await page.locator('#signupButton').click()

    await page.waitForURL('/login')
  })

  test('visitor can not access personal page before login', async ({ page }) => {
    await page.goto('/personal')

    await page.waitForURL('/login')
  })

  test('visitor can login', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('Email').fill(email)
    await page.getByLabel('Password').fill(password)
    await page.locator('#loginButton').click()

    await page.waitForURL('/')

    await expect(page.locator('#userMenu')).toBeVisible()
    await page.locator('#userMenu').click()

    await expect(page.locator('#viewPersonalBase')).toBeVisible()
    await expect(page.locator('#logout')).toBeVisible()
  })
})
test('visitor can logout', async ({ page }) => {
  await page.goto('/')
  await page.locator('#login').click()

  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.locator('#loginButton').click()

  await page.waitForURL('/')

  await expect(page.locator('#userMenu')).toBeVisible()
  await page.locator('#userMenu').click()

  await expect(page.locator('#logout')).toBeVisible()
  await page.locator('#logout').click()

  await expect(page).toHaveURL('/')
})
