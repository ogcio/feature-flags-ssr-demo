import { FeatureFlags } from '~/feature-flags'
import { getFlagsmithClient } from '~/services/flagsmith.server'
import type { User } from '~/services/user.mock.server'

const getFlagsmithFeatureFlags = async ({
  user,
}: {
  user: User
}) => {
  const client = getFlagsmithClient()

  const context = {
    name: user.username,
    email: user.email,
  }

  const flags = await client.getIdentityFlags(user.userId, context)

  return Object.values(FeatureFlags)
    .filter((key) => key.startsWith('flagsmith'))
    .reduce(
      (acc, flag: string) => {
        acc[flag as keyof typeof FeatureFlags] =
        flags.isFeatureEnabled(flag)
        return acc
      },
      {} as Record<keyof typeof FeatureFlags, boolean>,
    )
}

export { getFlagsmithFeatureFlags }
