import users from '~/mock/users.json'

export type User = {
  email: string
  username: string
  userId: string
}

export const findUser = async (user: User): Promise<User | undefined> => {
  return users.find((u) => u.email === user.email)
}
