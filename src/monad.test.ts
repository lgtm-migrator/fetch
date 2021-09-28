import mock from 'fetch-mock-jest'
import { Response, fetch as realFetch } from 'cross-fetch'
import { right, left } from 'fp-ts/Either'
import { request, config } from './monad'
import { pipe } from 'fp-ts/function'

afterEach(() => mock.reset())

describe('Plain request', () => {
  it('should return a Response if succeeded', async () => {
    const resp = new Response('DATA', {
      status: 200,
      headers: {},
    })

    mock.mock('https://example.com', resp)

    expect(await pipe(request, config('https://example.com'))()).toStrictEqual(
      right(resp)
    )
  })

  it('should throw TypeError if config is malformed', async () => {
    expect(
      await pipe(request, config('https://*', {}, realFetch))()
    ).toStrictEqual(left(new TypeError('Only absolute URLs are supported')))
  })
})
