import { GrowthBook } from '@growthbook/growthbook'
import invariant from 'tiny-invariant'

const { GROWTHBOOK_CLIENT_KEY, GROWTHBOOK_API_URL } = process.env
invariant(GROWTHBOOK_CLIENT_KEY, 'GROWTHBOOK_CLIENT_KEY is required')
invariant(GROWTHBOOK_API_URL, 'GROWTHBOOK_API_URL is required')

let growthbookClientInstance: GrowthBook | null = null

const getGrowthbookClient = async () => {
  if (growthbookClientInstance) {
    return growthbookClientInstance
  }

  growthbookClientInstance = new GrowthBook({
    clientKey: GROWTHBOOK_CLIENT_KEY,
    apiHost: GROWTHBOOK_API_URL,
  })

  try {
    await growthbookClientInstance.init()

    return growthbookClientInstance
    
  } catch (err) {
    console.error(err)
    throw err
  }
}

export { getGrowthbookClient }
