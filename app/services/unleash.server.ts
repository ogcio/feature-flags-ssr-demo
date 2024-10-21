import invariant from 'tiny-invariant'
import { InMemStorageProvider, startUnleash, type Unleash } from 'unleash-client'

const { UNLEASH_SERVER_URL, UNLEASH_SERVER_TOKEN, UNLEASH_APPLICATION_NAME } =
  process.env
invariant(UNLEASH_SERVER_URL, 'UNLEASH_SERVER_URL is required')
invariant(UNLEASH_SERVER_TOKEN, 'UNLEASH_SERVER_TOKEN is required')
invariant(UNLEASH_APPLICATION_NAME, 'UNLEASH_APPLICATION_NAME is required')

let unleashClientInstance: Unleash | null = null;

// NOTE: We could also construct the client in a non-blocking manner
// and  listen for the 'synchronized' event to know when the client is ready
const getUnleashClient = async () => {
  if (unleashClientInstance) {
    return unleashClientInstance;
  }

  try {
    unleashClientInstance = await startUnleash({
      url: UNLEASH_SERVER_URL,
      appName: UNLEASH_APPLICATION_NAME,
      customHeaders: { Authorization: UNLEASH_SERVER_TOKEN },
      storageProvider: new InMemStorageProvider(),
    })
    return unleashClientInstance
  } catch (err) {
    console.error(err)
    throw err
  }
}

export { getUnleashClient }
