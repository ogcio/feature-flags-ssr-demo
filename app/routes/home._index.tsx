import { useLoaderData } from '@remix-run/react'
import type { LoaderFunctionArgs } from '@vercel/remix'
import clsx from 'clsx'
import { FeatureFlags } from '~/feature-flags'
import { authenticator } from '~/services/auth.server'
import { getUnleashFeatureFlags } from '~/utils/getUnleashFeatureFlags'
import { getFeatbitFeatureFlags } from '~/utils/getFeatbitFeatureFlags'
import { getFlagsmithFeatureFlags } from '~/utils/getFlagsmithFeatureFlags'
import { getGrowthbookFeatureFlags } from '~/utils/getGrowthbookFeatureFlags'

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  })

  let unleashFeatureFlags: Record<string, boolean> = {}
  let featbitFeatureFlags: Record<string, boolean> = {}
  let flagsmithFeatureFlags: Record<string, boolean> = {}
  let growthbookFeatureFlags: Record<string, boolean> = {}

  let unleashError = false
  let featbitError = false
  let flagsmithError = false
  let growthbookError = false

  // NOTE: Request feature flags one by one backend to catch errors for each
  try {
    unleashFeatureFlags = await getUnleashFeatureFlags({
      user,
    })
  } catch {
    unleashError = true
  }

  try {
    featbitFeatureFlags = await getFeatbitFeatureFlags({
      user,
    })
  } catch {
    featbitError = true
  }

  try {
    flagsmithFeatureFlags = await getFlagsmithFeatureFlags({
      user,
    })
  } catch {
    flagsmithError = true
  }

  try {
    growthbookFeatureFlags = await getGrowthbookFeatureFlags({
      user,
    })
  } catch {
    growthbookError = true
  }

  return {
    ...unleashFeatureFlags,
    ...featbitFeatureFlags,
    ...flagsmithFeatureFlags,
    ...growthbookFeatureFlags,
    errors: {
      unleash: unleashError,
      featbit: featbitError,
      flagsmith: flagsmithError,
      growthbook: growthbookError,
    },
  }
}

export default function Screen() {
  const featureFlags = useLoaderData<typeof loader>()
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <h1>Feature Flags</h1>
      <div className="mt-6 border-t border-zinc-100">
        <dl className="divide-y divide-zinc-100">
          {Object.values(FeatureFlags).map((flag: string) => {
            const error =
              featureFlags.errors[
                flag.split('-')[0] as keyof typeof featureFlags.errors
              ]
            // @ts-expect-error: yes okay
            const featureFlag = featureFlags[flag as keyof typeof FeatureFlags]
            return (
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
                      error
                        ? 'bg-purple-500'
                        : featureFlag
                          ? 'bg-green-500'
                          : 'bg-red-500',
                    )}
                  />
                </dd>
              </div>
            )
          })}
        </dl>
      </div>
    </div>
  )
}
