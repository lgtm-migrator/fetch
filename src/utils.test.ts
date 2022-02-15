import { eager } from './utils'

it('Do not be lazy', () => {
  expect(eager(() => 3)).toBe(3)
})
