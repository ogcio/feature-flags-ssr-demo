import { Form, Outlet, useLoaderData } from '@remix-run/react'
import type { LoaderFunctionArgs } from '@vercel/remix'
import { useIsLoading } from '~/hooks/useIsLoading'
import { authenticator } from '~/services/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  })
}

export default function Index() {
  const user = useLoaderData<typeof loader>()
  const { isLoading } = useIsLoading()

  return (
    <div>
      <Form method="post" action="/logout">
        <button type="submit" disabled={isLoading}>
          Logout
        </button>
      </Form>
      <h1>Welcome {user.username}</h1>
      <p>
        Here you can check the status of the feature flags defined in different
        backends for {user.username}
      </p>

      <div className="mt-6 border-t border-zinc-100">
        <dl className="divide-y divide-zinc-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-zinc-900">
              Email address
            </dt>
            <dd className="mt-1 text-sm leading-6 text-zinc-700 sm:col-span-2 sm:mt-0">
              {user.email}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-zinc-900">
              User ID
            </dt>
            <dd className="mt-1 text-sm leading-6 text-zinc-700 sm:col-span-2 sm:mt-0">
              {user.userId}
            </dd>
          </div>
        </dl>
      </div>
      <Outlet />
    </div>
  )
}
