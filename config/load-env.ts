import path from 'node:path'
import dotenv from 'dotenv'

// Single place that loads the env files. Import it for its side effect:
//   import '../config/load-env'
//
// - dotenv never overrides a variable that is already set, so real environment
//   variables (e.g. CI secrets) win over the files, and the first file wins.
// - Paths are resolved from this file, not the working directory, so loading
//   works however the tests are launched.
const envDir = path.resolve(__dirname, '..', 'env')

dotenv.config({ path: path.join(envDir, '.env.secrets'), quiet: true }) // git-ignored credentials
dotenv.config({ path: path.join(envDir, '.env.qa'), quiet: true }) // committed, non-secret settings
