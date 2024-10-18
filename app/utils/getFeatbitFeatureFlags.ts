import { type IUser, UserBuilder } from '@featbit/node-server-sdk'
import { useCallback } from 'react'
import { promiseHash } from 'remix-utils/promise'
import { FeatureFlags } from '~/feature-flags'
import { featbit } from '~/services/featbit.server'
import type { User } from '~/services/user.mock.server'

const getFeatbitFeatureFlags = async ({
  user,
  // biome-ignore lint/correctness/noUnusedVariables:
  request,
}: { user: User; request: Request }) => {
  const featbitContext: IUser = new UserBuilder(user.userId)
    .name(user.username)
    .custom('email', user.email)
    .custom('region', process.env.VERCEL_REGION ?? '')
    .build()
  const featbitClient = await featbit()

  const featbitFeatureFlagsPromises = Object.values(FeatureFlags)
    .filter((key) => key.startsWith('featbit'))
    .reduce(
      (acc, flag: string) => {
        acc[flag as keyof typeof FeatureFlags] = featbitClient.boolVariation(
          flag,
          featbitContext,
          false,
        )
        return acc
      },
      {} as Record<keyof typeof FeatureFlags, Promise<boolean>>,
    )

  return await promiseHash(featbitFeatureFlagsPromises)
}

export { getFeatbitFeatureFlags }
