export const invalidAccount = {
  username: 'invalid-demo-user',
  password: 'invalid-demo-password',
};

const tomorrow = new Date();
tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

export const appointmentData = {
  facility: 'Hongkong CURA Healthcare Center',
  readmission: true,
  program: 'Medicaid',
  visitDate: tomorrow.toLocaleDateString('en-GB', { timeZone: 'UTC' }),
  comment: 'Playwright CURA demo test',
};
