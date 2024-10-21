import { type IUser, UserBuilder } from '@featbit/node-server-sdk'
import { promiseHash } from 'remix-utils/promise'
import { FeatureFlags } from '~/feature-flags'
import { getFeatbitClient } from '~/services/featbit.server'
import type { User } from '~/services/user.mock.server'

const getFeatbitFeatureFlags = async ({
  user,
}: { user: User }) => {
  // NOTE: This is a singleton instance of the client,
  // there's no actual awaiting if it has already been initialized  
  const client = await getFeatbitClient()

  const context: IUser = new UserBuilder(user.userId)
    .name(user.username)
    .custom('email', user.email)
    .build()
    
  const featbitFeatureFlagsPromises = Object.values(FeatureFlags)
    .filter((key) => key.startsWith('featbit'))
    .reduce(
      (acc, flag: string) => {
        acc[flag as keyof typeof FeatureFlags] = client.boolVariation(
          flag,
          context,
          false,
        )
        return acc
      },
      {} as Record<keyof typeof FeatureFlags, Promise<boolean>>,
    )

  return await promiseHash(featbitFeatureFlagsPromises)
}

export { getFeatbitFeatureFlags }
