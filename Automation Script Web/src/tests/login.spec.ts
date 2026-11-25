import { expect, test } from '../fixtures/testFixtures';
import { AppointmentPage } from '../pages/appointmentPage';
import { invalidAccount } from '../utils/testData';

test('TC 1.1: Log in with invalid credentials', async ({ page, loginPage }) => {
  await test.step('Enter an invalid username', async () => {
    await loginPage.enterUsername(invalidAccount.username);
    await expect(loginPage.username).toHaveValue(invalidAccount.username);
  });

  await test.step('Enter an invalid password', async () => {
    await loginPage.enterPassword(invalidAccount.password);
    await expect(loginPage.password).toHaveValue(invalidAccount.password);
  });

  await test.step('Click Login and verify that login fails', async () => {
    await loginPage.submit.click();
    await expect(page).toHaveURL(/\/profile\.php#login$/);
    await expect(loginPage.error).toBeVisible();
  });
});

test('TC 1.2: Log in with valid credentials', async ({ demoAccount, page, loginPage }) => {
  await test.step('Enter a valid username', async () => {
    await loginPage.enterUsername(demoAccount.username);
    expect(await loginPage.username.inputValue() === demoAccount.username, 'Username field is filled correctly').toBe(true);
  });

  await test.step('Enter a valid password', async () => {
    await loginPage.enterPassword(demoAccount.password);
    expect(await loginPage.password.inputValue() === demoAccount.password, 'Password field is filled correctly').toBe(true);
  });

  await test.step('Click Login and verify the Make Appointment page opens', async () => {
    await loginPage.submit.click();
    await expect(page).toHaveURL(/#appointment$/);
    await expect(new AppointmentPage(page).heading).toBeVisible();
  });
});
