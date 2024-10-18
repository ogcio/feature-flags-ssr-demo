import { ClientTokenAuthentication, FliptClient } from '@flipt-io/flipt'
import invariant from 'tiny-invariant'

const { FLIPT_CLIENT_TOKEN } = process.env
invariant(FLIPT_CLIENT_TOKEN, 'FLIPT_CLIENT_TOKEN is required')

const flipt = new FliptClient({
  authenticationStrategy: new ClientTokenAuthentication(FLIPT_CLIENT_TOKEN),
})

export { flipt }
