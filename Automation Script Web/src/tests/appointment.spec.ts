import { expect, test } from '../fixtures/testFixtures';
import type { AppointmentPage } from '../pages/appointmentPage';
import { appointmentData } from '../utils/testData';

async function expectAppointmentDetails(appointmentPage: AppointmentPage) {
  await expect(appointmentPage.facility).toHaveValue(appointmentData.facility);
  await expect(appointmentPage.readmission).toBeChecked({ checked: appointmentData.readmission });
  await expect(appointmentPage.program(appointmentData.program)).toBeChecked();
  await expect(appointmentPage.comment).toHaveValue(appointmentData.comment);
}

test('TC 2.1: Submit an appointment with the required date missing', async ({ page, appointmentPage }) => {
  await test.step('Leave the date field blank', async () => {
    await expect(appointmentPage.visitDate).toHaveValue('');
  });

  await test.step('Fill in all fields except the date', async () => {
    await appointmentPage.fillDetails(appointmentData);
    await expectAppointmentDetails(appointmentPage);
  });

  await test.step('Click Book Appointment and verify the required-date error', async () => {
    await appointmentPage.submit.click();
    await expect(page).toHaveURL(/#appointment$/);
    await expect(appointmentPage.visitDate).toHaveValue('');
    await expect(appointmentPage.visitDate.and(page.locator(':invalid'))).toBeVisible();
    await expect(appointmentPage.visitDate).toBeFocused();
    await expect(appointmentPage.visitDate).not.toHaveJSProperty('validationMessage', '');
  });
});

test('TC 2.2: Make an appointment successfully', async ({ page, appointmentPage }) => {
  await test.step('Fill in all fields', async () => {
    await appointmentPage.fillDetails(appointmentData);
    await appointmentPage.enterVisitDate(appointmentData.visitDate);
    await expectAppointmentDetails(appointmentPage);
    await expect(appointmentPage.visitDate).toHaveValue(appointmentData.visitDate);
  });

  await test.step('Click Book Appointment and verify the submitted details', async () => {
    await appointmentPage.submit.click();

    const { confirmation } = appointmentPage;
    await expect(page).toHaveURL(/\/appointment\.php#summary$/);
    await expect(confirmation.heading).toBeVisible();
    await expect(confirmation.facility).toHaveText(appointmentData.facility);
    await expect(confirmation.readmission).toHaveText(appointmentData.readmission ? 'Yes' : 'No');
    await expect(confirmation.program).toHaveText(appointmentData.program);
    await expect(confirmation.visitDate).toHaveText(appointmentData.visitDate);
    await expect(confirmation.comment).toHaveText(appointmentData.comment);
  });
});
