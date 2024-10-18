import Flagsmith from 'flagsmith-nodejs'
import invariant from 'tiny-invariant'

const { FLAGSMITH_API_URL, FLAGSMITH_ENVIRONMENT_KEY } = process.env
invariant(FLAGSMITH_API_URL, 'FLAGSMITH_API_URL is required')
invariant(FLAGSMITH_ENVIRONMENT_KEY, 'FLAGSMITH_ENVIRONMENT_KEY is required')

const flagsmith = new Flagsmith({
  environmentKey: FLAGSMITH_ENVIRONMENT_KEY,
  apiUrl: FLAGSMITH_API_URL,
  enableAnalytics: true,
})

export { flagsmith }
