import { FeatureFlags } from '~/feature-flags'
import { flagsmith } from '~/services/flagsmith.server'
import type { User } from '~/services/user.mock.server'

const getFlagsmithFeatureFlags = async ({
  user,
  // biome-ignore lint/correctness/noUnusedVariables:
  request,
}: {
  user: User
  request: Request
}) => {
  const flagsmithContext = {
    region: process.env.VERCEL_REGION ?? '',
    name: user.username,
    email: user.email,
  }
  const flagsmithFeatureFlagsClient = await flagsmith.getIdentityFlags(
    user.userId,
    flagsmithContext,
  )
  
  return Object.values(FeatureFlags)
    .filter((key) => key.startsWith('flagsmith'))
    .reduce(
      (acc, flag: string) => {
        acc[flag as keyof typeof FeatureFlags] =
          flagsmithFeatureFlagsClient.isFeatureEnabled(flag)
        return acc
      },
      {} as Record<keyof typeof FeatureFlags, boolean>,
    )
}

export { getFlagsmithFeatureFlags }
