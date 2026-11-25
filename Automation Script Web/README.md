# CURA Demo Playwright Tests

Playwright and TypeScript test suite for the [CURA Demo](https://katalon-demo-cura.herokuapp.com/). The four cases in the [test scenario spreadsheet](https://docs.google.com/spreadsheets/d/1X_pHOqkMzgp2x87sdaltqLglVWTYgTXr6azGM9VXYYQ/edit) run in Chromium, Firefox, and WebKit.

| ID | Test case | Expected result |
| --- | --- | --- |
| 1.1 | Log in with invalid credentials | The login page stays open and displays an error |
| 1.2 | Log in with valid credentials | The Make Appointment page opens |
| 2.1 | Submit an appointment with the required date missing | The browser shows a required-date message and keeps the form open |
| 2.2 | Make an appointment successfully | The confirmation page displays all submitted details |

## Run the tests

Use Node.js 24 and a connection to the demo site. Run the commands from the `ecommerce-playwright` directory.

If `.env` is missing, copy `.env.example` to `.env` and set `CURA_USERNAME` and `CURA_PASSWORD` for the test account. Git ignores `.env`. Shell environment variables take precedence over values in `.env`.

```powershell
npm.cmd ci
npm.cmd run install:browsers
npm.cmd run typecheck
npm.cmd test
npm.cmd run report
```

Use `npm` on macOS or Linux. To run a single case in Chromium, use `npm.cmd test -- --project=chromium --grep 'TC 2.1'`. The HTML report is saved in `playwright-report/`. Trace, screenshot, video, and failure snapshot capture are disabled to limit exposure of credentials.

Run `npm.cmd test -- --ui` from `ecommerce-playwright` to open Playwright UI Mode. If UI Mode was already open when `.env` changed, close it and start the command again so it loads the latest settings.

After each `npm test` run, the PDF reporter saves the latest test statuses and durations to `output/pdf/cura-test-report.pdf`, including any failures. The reporter uses the Chromium installation from `npm run install:browsers` to generate the PDF, even for Firefox-only or WebKit-only runs.

Playwright uses the CURA Demo URL by default. Set `BASE_URL` to target another CURA instance. The invalid credentials and appointment details in `testData.ts` are synthetic.

For GitHub Actions, add the repository secrets `CURA_USERNAME` and `CURA_PASSWORD`. The workflow runs the full suite for pushes and same-repository pull requests, then uploads the HTML and PDF reports. Fork pull requests and Dependabot runs execute only TC 1.1, which requires no test account.

## Project structure

| Path | Contents |
| --- | --- |
| `playwright.config.ts` | Entry point detected by Playwright CLI and UI Mode |
| `config/playwright.config.ts` | Browser projects, parallel execution, and reporters |
| `src/pages/` | Page objects for Home, Login, and Appointment |
| `src/tests/` | Login and Make Appointment scenarios |
| `src/fixtures/testFixtures.ts` | Environment credentials and an isolated login session for each appointment test |
| `src/utils/testData.ts` | Synthetic invalid login and appointment data |
| `.github/workflows/` | GitHub Actions workflow |
| `.vscode/` | Playwright extension recommendation |

