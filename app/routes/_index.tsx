import type { LoaderFunctionArgs } from '@remix-run/server-runtime'
import { authenticator } from '~/services/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
    successRedirect: '/home',
  })
}
