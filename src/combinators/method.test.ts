import { withMethod } from './method'
import { request, config } from '../monad'
import mock from 'fetch-mock-jest'
import { pipe } from 'fp-ts/function'

afterEach(() => mock.reset())

const mk = config('https://example.com')

describe('Method combinator', () => {
  it('should set method correctly', async () => {
    mock.mock('https://example.com', 200)

    await pipe(request, withMethod('POST'), mk)()

    expect(mock.lastOptions()).toEqual({ method: 'POST' })
  })

  it('latter combinator should take the precedence', async () => {
    mock.mock('https://example.com', 200)

    await pipe(request, withMethod('POST'), withMethod('DELETE'), mk)()

    expect(mock.lastOptions()).toEqual({ method: 'DELETE' })
  })

  it('config should take the precedence', async () => {
    mock.mock('https://example.com', 200)

    await pipe(
      request,
      withMethod('DELETE'),
      config('https://example.com', { method: 'GET' })
    )()

    expect(mock.lastOptions()).toEqual({ method: 'GET' })
  })
})
