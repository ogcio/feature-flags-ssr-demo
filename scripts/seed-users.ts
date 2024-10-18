import { faker } from '@faker-js/faker'
import fs from 'node:fs'
import path, { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export function createRandomUser() {
  return {
    userId: faker.string.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
  }
}

export const users = faker.helpers.multiple(createRandomUser, {
  count: 5,
})

export const saveUsers = () => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const usersPath = path.resolve(
    join(__dirname, '..'),
    join('app', 'mock', 'users.json'),
  )
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2))
}

saveUsers()
