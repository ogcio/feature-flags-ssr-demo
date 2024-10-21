import { FbClientBuilder, type IFbClient } from '@featbit/node-server-sdk'
import invariant from 'tiny-invariant'

const { FEATBIT_SDK_KEY, FEATBIT_STREAMING_URL, FEATBIT_EVENTS_URL } =
  process.env
invariant(FEATBIT_SDK_KEY, 'FEATBIT_SDK_KEY is required')
invariant(FEATBIT_STREAMING_URL, 'FEATBIT_STREAMING_URL is required')
invariant(FEATBIT_EVENTS_URL, 'FEATBIT_EVENTS_URL is required')

let featbitClientInstance: IFbClient | null = null

const getFeatbitClient = async () => {
  if (featbitClientInstance) {
    return featbitClientInstance
  }

  featbitClientInstance = new FbClientBuilder()
    .sdkKey(FEATBIT_SDK_KEY)
    .streamingUri(FEATBIT_STREAMING_URL)
    .eventsUri(FEATBIT_EVENTS_URL)
    .build()

  try {
    await featbitClientInstance.waitForInitialization()
  } catch (err) {
    console.error(err)
    throw err
  }

  return featbitClientInstance
}

export { getFeatbitClient }
