import { GrowthBook } from '@growthbook/growthbook'
import invariant from 'tiny-invariant'

const { GROWTHBOOK_CLIENT_KEY, GROWTHBOOK_API_URL } = process.env
invariant(GROWTHBOOK_CLIENT_KEY, 'GROWTHBOOK_CLIENT_KEY is required')
invariant(GROWTHBOOK_API_URL, 'GROWTHBOOK_API_URL is required')

const getGrowthbookClient = async () => {
  const growthbook = new GrowthBook({
    clientKey: GROWTHBOOK_CLIENT_KEY,
    apiHost: GROWTHBOOK_API_URL,
  })

  await growthbook.init()

  return growthbook
}

export { getGrowthbookClient }
