import { FbClientBuilder } from '@featbit/node-server-sdk'
import invariant from 'tiny-invariant'

const { FEATBIT_SDK_KEY, FEATBIT_STREAMING_URL, FEATBIT_EVENTS_URL } =
  process.env
invariant(FEATBIT_SDK_KEY, 'FEATBIT_SDK_KEY is required')
invariant(FEATBIT_STREAMING_URL, 'FEATBIT_STREAMING_URL is required')
invariant(FEATBIT_EVENTS_URL, 'FEATBIT_EVENTS_URL is required')

const featbit = async () => {
  const featbitClient = new FbClientBuilder()
    .sdkKey(FEATBIT_SDK_KEY)
    .streamingUri(FEATBIT_STREAMING_URL)
    .eventsUri(FEATBIT_EVENTS_URL)
    .build()

  try {
    await featbitClient.waitForInitialization()
  } catch (err) {
    console.log(err)
  }

  return featbitClient
}

export { featbit }
