import type { ActionFunctionArgs, LoaderFunctionArgs } from '@vercel/remix'
import { Form } from '@remix-run/react'
import { authenticator } from '~/services/auth.server'
import users from '~/mock/users.json'
import { useIsLoading } from '~/hooks/useIsLoading'

export default function Screen() {
  const { isLoading } = useIsLoading()
  return (
    <Form method="post" id="login">
      <h1>Feature-Flags Demo</h1>
      <select required name="email" id="email" disabled={isLoading}>
        {users.map((user) => (
          <option key={user.email} value={user.email}>
            {user.email}
          </option>
        ))}
      </select>
      <button type="submit" disabled={isLoading}>
        Login
      </button>
    </Form>
  )
}

export async function action({ request }: ActionFunctionArgs) {
  return await authenticator.authenticate('form', request, {
    successRedirect: '/home',
    failureRedirect: '/login',
  })
}

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: '/home',
  })
}
