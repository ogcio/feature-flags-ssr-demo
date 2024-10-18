import { useLoaderData } from '@remix-run/react'
import type { LoaderFunctionArgs } from '@vercel/remix'
import clsx from 'clsx'
import { FeatureFlags } from '~/feature-flags'
import { authenticator } from '~/services/auth.server'
import { promiseHash } from 'remix-utils/promise'
import { getUnleashFeatureFlags } from '~/utils/getUnleashFeatureFlags'
import { getFeatbitFeatureFlags } from '~/utils/getFeatbitFeatureFlags'
import { getFliptFeatureFlags } from '~/utils/getFliptFeatureFlags'
import { getFlagsmithFeatureFlags } from '~/utils/getFlagsmithFeatureFlags'
import { getGrowthbookFeatureFlags } from '~/utils/getGrowthbookFeatureFlags'

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  })

  const featureFlags = await promiseHash({
    unleashFeatureFlags: getUnleashFeatureFlags({
      user,
      request,
    }),
    featbitFeatureFlags: getFeatbitFeatureFlags({
      user,
      request,
    }),
    fliptFeatureFlags: getFliptFeatureFlags({
      user,
      request,
    }),
    flagsmithFeatureFlags: getFlagsmithFeatureFlags({
      user,
      request,
    }),
    growthbookFeatureFlags: getGrowthbookFeatureFlags({
      user,
      request,
    }),
  })

  return {
    ...featureFlags.unleashFeatureFlags,
    ...featureFlags.featbitFeatureFlags,
    ...featureFlags.fliptFeatureFlags,
    ...featureFlags.flagsmithFeatureFlags,
    ...featureFlags.growthbookFeatureFlags,
  }
}

export default function Screen() {
  const featureFlags = useLoaderData<typeof loader>()
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <h1>Feature Flags</h1>
      <div className="mt-6 border-t border-zinc-100">
        <dl className="divide-y divide-zinc-100">
          {Object.values(FeatureFlags).map((flag: string) => (
            <div
              className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
              key={flag}
            >
              <dt className="text-sm font-medium leading-6 text-zinc-900">
                <span className="label">{flag}</span>
              </dt>
              <dd className="mt-1 text-sm leading-6 text-zinc-700 sm:col-span-2 sm:mt-0">
                <span
                  className={clsx(
                    'rounded-full size-6 inline-block mr-2',
                    featureFlags[flag as keyof typeof FeatureFlags]
                      ? 'bg-green-500'
                      : 'bg-red-500',
                  )}
                />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
