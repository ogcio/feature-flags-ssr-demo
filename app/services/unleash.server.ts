import invariant from 'tiny-invariant'
import { getFeatureToggleDefinitions, startUnleash } from 'unleash-client'
// import { Operator } from 'unleash-client/lib/strategy/strategy'
// import { FeatureFlags } from '~/feature-flags'
// import users from '~/mock/users.json'

const { UNLEASH_SERVER_URL, UNLEASH_SERVER_TOKEN, UNLEASH_APPLICATION_NAME } =
  process.env
invariant(UNLEASH_SERVER_URL, 'UNLEASH_SERVER_URL is required')
invariant(UNLEASH_SERVER_TOKEN, 'UNLEASH_SERVER_TOKEN is required')
invariant(UNLEASH_APPLICATION_NAME, 'UNLEASH_APPLICATION_NAME is required')

const unleash = await startUnleash({
  url: UNLEASH_SERVER_URL,
  appName: UNLEASH_APPLICATION_NAME,
  customHeaders: { Authorization: UNLEASH_SERVER_TOKEN },
  // bootstrap: {
  //   data: [
  //     {
  //       name: FeatureFlags.UNLEASH_BOOTSTRAPPED_PERMISSION_FLAG,
  //       description: 'A test permission flag',
  //       project: 'default',
  //       stale: false,
  //       type: 'permission',
  //       enabled: true,
  //       strategies: [
  //         {
  //           name: 'flexibleRollout',
  //           parameters: {
  //             groupId: FeatureFlags.UNLEASH_BOOTSTRAPPED_PERMISSION_FLAG,
  //             rollout: '100',
  //             stickiness: 'default',
  //           },
  //           constraints: [
  //             {
  //               values: [users[0].userId],
  //               inverted: false,
  //               operator: Operator.IN,
  //               contextName: 'userId',
  //               caseInsensitive: false,
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // },
})

const featureToggles = getFeatureToggleDefinitions()

export { unleash, featureToggles }
