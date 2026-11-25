import type { Page } from '@playwright/test';

export class HomePage {
  constructor(private readonly page: Page) {}

  async openLogin() {
    await this.page.goto('/');
    await this.page.getByRole('link', { name: 'Make Appointment', exact: true }).click();
  }
}
