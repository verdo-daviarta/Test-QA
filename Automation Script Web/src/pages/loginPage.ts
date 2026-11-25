import type { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly username;
  readonly password;
  readonly submit;
  readonly error;

  constructor(page: Page) {
    const login = page.locator('#login');
    this.username = login.getByLabel('Username', { exact: true });
    this.password = login.getByLabel('Password', { exact: true });
    this.submit = login.getByRole('button', { name: 'Login', exact: true });
    this.error = login.getByText('Login failed! Please ensure the username and password are valid.', { exact: true });
  }

  async enterUsername(username: string) {
    await this.fillSensitiveField(this.username, username);
  }

  async enterPassword(password: string) {
    await this.fillSensitiveField(this.password, password);
  }

  private async fillSensitiveField(field: Locator, value: string) {
    await field.fill('');

    // Pass the value as an evaluate argument so it stays out of Playwright step titles.
    await field.evaluate((input: HTMLInputElement, text) => {
      input.value = text;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }, value);
  }
}
