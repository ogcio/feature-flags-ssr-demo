import { Authenticator, AuthorizationError } from 'remix-auth'
import { FormStrategy } from 'remix-auth-form'
import { sessionStorage } from '~/services/session.server'
import { type User, findUser } from '~/services/user.mock.server'

const authenticator = new Authenticator<User>(sessionStorage)

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get('email') as string

    if (!email) {
      throw new AuthorizationError('Email is required')
    }

    const user = await findUser({ email })

    if (!user) {
      throw new AuthorizationError('Invalid credentials')
    }

    return user
  }),
)

export { authenticator }
