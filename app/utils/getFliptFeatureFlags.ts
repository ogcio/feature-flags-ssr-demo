import { promiseHash } from 'remix-utils/promise'
import { FeatureFlags } from '~/feature-flags'
import { flipt } from '~/services/flipt.server'
import type { User } from '~/services/user.mock.server'

const getFliptFeatureFlags = async ({
  user,
  // biome-ignore lint/correctness/noUnusedVariables:
  request,
}: {
  user: User
  request: Request
}) => {
  const fliptContext = {
    entityId: user.userId,
    context: {
      region: process.env.VERCEL_REGION,
    },
  }

  const fliptFeatureFlagsPromises = Object.values(FeatureFlags)
    .filter((key) => key.startsWith('flipt'))
    .reduce(
      (acc, flag: string) => {
        acc[flag as keyof typeof FeatureFlags] = flipt.evaluation.boolean({
          namespaceKey: 'default',
          flagKey: flag,
          ...fliptContext,
        })
        return acc
      },
      {} as Record<
        keyof typeof FeatureFlags,
        ReturnType<typeof flipt.evaluation.boolean>
      >,
    )

  const fliptFeatureFlagsReturns = await promiseHash(fliptFeatureFlagsPromises)

  return Object.entries(fliptFeatureFlagsReturns).reduce(
    (acc, [key, value]) => {
      acc[key as keyof typeof FeatureFlags] = value.enabled
      return acc
    },
    {} as Record<keyof typeof FeatureFlags, boolean>,
  )
}

export { getFliptFeatureFlags }
