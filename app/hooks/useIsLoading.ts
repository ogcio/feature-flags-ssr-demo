import { useNavigation } from '@remix-run/react'

const useIsLoading = () => {
  const navigation = useNavigation()
  const isLoading =
    navigation.state === 'submitting' || navigation.state === 'loading'

  return {
    isLoading,
  }
}

export { useIsLoading }
