import type { Context } from 'unleash-client'
import { FeatureFlags } from '~/feature-flags'
import { unleash } from '~/services/unleash.server'
import type { User } from '~/services/user.mock.server'

const getUnleashFeatureFlags = async ({
  user,
  request,
}: { user: User; request: Request }) => {
  const unleashContext = {
    userId: user.userId,
    sessionId: '123',
    remoteAddress:
      request.headers.get('x-real-ip') ??
      request.headers.get('x-forwarded-for') ??
      '127.0.0.1',
    properties: {
      region: process.env.VERCEL_REGION,
    },
  } satisfies Context

  return Object.values(FeatureFlags)
    .filter((key) => key.startsWith('unleash'))
    .reduce(
      (acc, flag: string) => {
        acc[flag as keyof typeof FeatureFlags] = unleash.isEnabled(
          flag,
          unleashContext,
        )
        return acc
      },
      {} as Record<keyof typeof FeatureFlags, boolean>,
    )
}

export { getUnleashFeatureFlags }
