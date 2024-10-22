import { FeatureFlags } from '~/feature-flags'
import { getGrowthbookClient } from '~/services/growthbook.server'
import type { User } from '~/services/user.mock.server'

const getGrowthbookFeatureFlags = async ({
  user,
}: {
  user: User
}) => {
  // NOTE: This is a singleton instance of the client,
  // there's no actual awaiting if it has already been initialized  
  const growthbook = await getGrowthbookClient()

  await growthbook.setAttributes({
    id: user.userId,
  })

  return Object.values(FeatureFlags)
    .filter((key) => key.startsWith('growthbook'))
    .reduce(
      (acc, flag: string) => {
        acc[flag as keyof typeof FeatureFlags] = growthbook.isOn(flag)
        return acc
      },
      {} as Record<keyof typeof FeatureFlags, boolean>,
    )
}

export { getGrowthbookFeatureFlags }
