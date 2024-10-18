import { FeatureFlags } from '~/feature-flags'
import { getGrowthbookClient } from '~/services/growthbook.server'
import type { User } from '~/services/user.mock.server'

const getGrowthbookFeatureFlags = async ({
  user,
  // biome-ignore lint/correctness/noUnusedVariables:
  request,
}: {
  user: User
  request: Request
}) => {
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
