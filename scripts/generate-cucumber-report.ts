import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import '../config/load-env';
import logger from '../logger/logger';

// Builds the multiple-cucumber-html-reporter HTML report from the Cucumber
// JSON that playwright-bdd writes during a test run (see playwright.config.ts).
//   npm run report:cucumber   then open cucumber-report/html/index.html
const reportDir = path.resolve(__dirname, '..', 'cucumber-report');
const jsonFile = path.join(reportDir, 'cucumber.json');
const enrichedDir = path.join(reportDir, 'enriched');
const htmlDir = path.join(reportDir, 'html');

// Generic on purpose: the report is shared and screenshotted, so it must not
// expose the OS username or the machine's hostname (the package would fill
// both in from the OS by default).
const inCI = Boolean(process.env.GITHUB_ACTIONS);
const reportUser = inCI ? 'runner' : 'local';
const reportDevice = inCI ? 'GitHub Actions runner' : 'Local machine';

// The parts of the Cucumber JSON this script touches.
type CucumberFeature = { id: string; metadata?: unknown };

// playwright-bdd puts the project at the start of each feature id, e.g.
// "chromium-›-demoblaze-login". The reporter shows the browser per feature
// from the feature's own metadata, so we add it here.
function projectOf(feature: CucumberFeature): string {
  const [project] = feature.id.split('-›-');
  return project || process.env.REPORT_PROJECT || 'unknown';
}

// Browser versions come from the builds Playwright ships with.
function browserVersions(): Record<string, string> {
  const file = path.resolve(
    __dirname,
    '..',
    'node_modules',
    'playwright-core',
    'browsers.json',
  );
  const { browsers } = JSON.parse(fs.readFileSync(file, 'utf8')) as {
    browsers: { name: string; browserVersion?: string }[];
  };
  return Object.fromEntries(
    browsers.map((b) => [b.name, b.browserVersion ?? 'unknown']),
  );
}

async function main(): Promise<void> {
  if (!fs.existsSync(jsonFile)) {
    throw new Error(`No ${jsonFile}. Run the tests first (npm run test:all).`);
  }

  // Start clean so files from an earlier run are not left behind
  fs.rmSync(enrichedDir, { recursive: true, force: true });
  fs.rmSync(htmlDir, { recursive: true, force: true });
  fs.mkdirSync(enrichedDir, { recursive: true });

  const versions = browserVersions();
  const features = JSON.parse(
    fs.readFileSync(jsonFile, 'utf8'),
  ) as CucumberFeature[];
  for (const feature of features) {
    const project = projectOf(feature);
    feature.metadata = {
      browser: { name: project, version: versions[project] ?? 'unknown' },
      device: reportDevice,
      hostname: reportDevice,
      username: reportUser,
      platform: { name: os.platform(), version: os.release() },
      executionPlatform: 'local',
    };
  }
  fs.writeFileSync(
    path.join(enrichedDir, 'cucumber.json'),
    JSON.stringify(features, null, 2),
  );

  // The reporter is ESM-only and this project is CommonJS, so load it with a
  // dynamic import.
  const { generate } = await import('multiple-cucumber-html-reporter');

  await generate({
    jsonDir: enrichedDir,
    reportPath: htmlDir,
    reportName: 'Demoblaze BDD Test Report',
    pageTitle: 'Demoblaze BDD Test Report',
    displayDuration: true,
    customData: {
      projectName: 'Demoblaze',
      username: reportUser,
      hostname: reportDevice,
      environment: process.env.TEST_ENV ?? 'qa',
      baseUrl: process.env.BASE_URL ?? '',
      ciPipeline: inCI ? 'GitHub Actions' : 'Local',
      buildNumber: process.env.GITHUB_RUN_NUMBER ?? 'local',
    },
  });

  logger.info(`Cucumber report: ${path.join(htmlDir, 'index.html')}`);
}

main().catch((error: unknown) => {
  logger.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
