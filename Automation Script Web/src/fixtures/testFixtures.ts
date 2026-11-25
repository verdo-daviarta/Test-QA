import { expect, test as base } from '@playwright/test';
import { AppointmentPage } from '../pages/appointmentPage';
import { HomePage } from '../pages/homepage';
import { LoginPage } from '../pages/loginPage';

export const test = base.extend<{
  demoAccount: { username: string; password: string };
  loginPage: LoginPage;
  appointmentPage: AppointmentPage;
}>({
  demoAccount: async ({}, use) => {
    const username = process.env.CURA_USERNAME;
    const password = process.env.CURA_PASSWORD;
    if (!username?.trim() || !password) {
      throw new Error('set the Username and Password in the .env file');
    }
    await use({ username, password });
  },
  loginPage: async ({ page }, use) => {
    await new HomePage(page).openLogin();
    await use(new LoginPage(page));
  },
  appointmentPage: async ({ demoAccount, page, loginPage }, use) => {
    const appointmentPage = new AppointmentPage(page);
    await base.step('Log in with valid credentials (TC 1.2)', async () => {
      await loginPage.enterUsername(demoAccount.username);
      await loginPage.enterPassword(demoAccount.password);
      await loginPage.submit.click();

      await expect(page).toHaveURL(/#appointment$/);
      await expect(appointmentPage.heading).toBeVisible();
    });
    await use(appointmentPage);
  },
});

export { expect };
