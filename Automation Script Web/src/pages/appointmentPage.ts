import type { Page } from '@playwright/test';

export class AppointmentPage {
  readonly heading;
  readonly facility;
  readonly readmission;
  readonly comment;
  readonly visitDate;
  readonly submit;
  readonly confirmation;
  private readonly form;

  constructor(page: Page) {
    const appointment = page.locator('#appointment');
    this.form = appointment.locator('form');
    this.heading = appointment.getByRole('heading', { name: 'Make Appointment', exact: true });
    this.facility = appointment.getByLabel('Facility', { exact: true });
    this.readmission = appointment.getByLabel('Apply for hospital readmission', { exact: true });
    this.visitDate = appointment.getByLabel('Visit Date (Required)', { exact: true });
    this.comment = appointment.getByLabel('Comment', { exact: true });
    this.submit = appointment.getByRole('button', { name: 'Book Appointment', exact: true });

    const summary = page.locator('#summary');
    this.confirmation = {
      heading: summary.getByRole('heading', { name: 'Appointment Confirmation', exact: true }),
      facility: summary.locator('#facility'),
      readmission: summary.locator('#hospital_readmission'),
      program: summary.locator('#program'),
      visitDate: summary.locator('#visit_date'),
      comment: summary.locator('#comment'),
    };
  }

  program(name: string) {
    return this.form.getByRole('radio', { name, exact: true });
  }

  async fillDetails({ facility, readmission, program, comment }: {
    facility: string;
    readmission: boolean;
    program: string;
    comment: string;
  }) {
    await this.facility.selectOption({ label: facility });
    await this.readmission.setChecked(readmission);
    await this.program(program).check(); 
    await this.comment.fill(comment);
  }

  async enterVisitDate(date: string) {
    // The date picker updates its selected date on keyup and commits it on blur.
    await this.visitDate.pressSequentially(date);
    await this.visitDate.press('Tab');
  }
}
