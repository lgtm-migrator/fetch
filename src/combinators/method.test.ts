import { withMethod } from './method'
import { request, runFetchM } from '../monad'
import mock from 'fetch-mock-jest'
import { pipe } from 'fp-ts/function'

beforeEach(() => mock.mock('https://example.com', 200))
afterEach(() => mock.reset())

const mk = runFetchM('https://example.com')

describe('Method combinator', () => {
  it('should set method correctly', async () => {
    await pipe(request, withMethod('POST'), mk)()
    expect(mock.lastOptions()).toStrictEqual({ method: 'POST' })
  })

  it('latter combinator should take the precedence', async () => {
    await pipe(request, withMethod('POST'), withMethod('DELETE'), mk)()
    expect(mock.lastOptions()).toStrictEqual({ method: 'DELETE' })
  })

  it('config should take the precedence', async () => {
    await pipe(
      request,
      withMethod('DELETE'),
      runFetchM('https://example.com', { method: 'GET' })
    )()
    expect(mock.lastOptions()).toStrictEqual({ method: 'GET' })
  })
})
