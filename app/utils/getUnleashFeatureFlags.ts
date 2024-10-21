import type { Context } from 'unleash-client'
import { FeatureFlags, reduceFeatureFlags } from '~/feature-flags'
import { getUnleashClient } from '~/services/unleash.server'
import type { User } from '~/services/user.mock.server'

const getUnleashFeatureFlags = async ({ user }: { user: User }) => {
  // NOTE: This is a singleton instance of the client,
  // there's no actual awaiting if it has already been initialized
  const client = await getUnleashClient()

  const context = {
    userId: user.userId,
  } satisfies Context

  return Object.values(FeatureFlags)
    .filter((key) => key.startsWith('unleash'))
    .reduce(
      (acc, flag: string) => {
        acc[flag as keyof typeof FeatureFlags] = client.isEnabled(
          flag,
          context,
        )
        return acc
      },
      {} as Record<keyof typeof FeatureFlags, boolean>,
    )
}

export { getUnleashFeatureFlags }
