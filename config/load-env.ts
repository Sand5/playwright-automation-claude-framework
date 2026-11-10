import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

// Single place that loads the env files. Import it for its side effect:
//   import '../config/load-env'
//
// - TEST_ENV picks the environment file: env/.env.<TEST_ENV> (default: qa).
//   e.g. TEST_ENV=staging npx playwright test  ->  env/.env.staging
// - dotenv never overrides a variable that is already set, so real environment
//   variables (e.g. CI secrets, or BASE_URL set in the shell) win over the
//   files, and the first file wins.
// - Paths are resolved from this file, not the working directory, so loading
//   works however the tests are launched.
const envDir = path.resolve(__dirname, '..', 'env');
const testEnv = process.env.TEST_ENV ?? 'qa';

if (!/^[a-z0-9-]+$/i.test(testEnv)) {
  throw new Error(
    `Invalid TEST_ENV "${testEnv}": use letters, numbers and dashes only.`,
  );
}

const envFile = path.join(envDir, `.env.${testEnv}`);
if (!fs.existsSync(envFile)) {
  throw new Error(`TEST_ENV is "${testEnv}" but ${envFile} does not exist.`);
}

dotenv.config({ path: path.join(envDir, '.env.secrets'), quiet: true }); // git-ignored credentials
dotenv.config({ path: envFile, quiet: true }); // committed, non-secret settings
