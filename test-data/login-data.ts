import '../config/load-env'

// Credentials come from the environment (env/.env.secrets locally, GitHub
// secrets in CI). The fallbacks below are Demoblaze's PUBLIC demo account and
// exist for demo purposes only. In a real project never keep a default here:
// fail fast when a credential is missing instead.
const username = process.env.TEST_USERNAME || 'test'
const password = process.env.TEST_PASSWORD || 'test'

export const loginData = {
  username,
  password,
  welcomeText: `Welcome ${username}`,
  invalidPassword: 'not-the-password',
  wrongPasswordMessage: 'Wrong password.',
} as const
