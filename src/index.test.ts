import mock from 'fetch-mock-jest'
import { Response, fetch as realFetch } from 'cross-fetch'
import { left, right } from 'fp-ts/Either'
import { request, runFetchM } from '.'
import { pipe } from 'fp-ts/function'

afterEach(() => mock.reset())

describe('Plain request', () => {
  it('should return a Response if succeeded', async () => {
    const resp = new Response('DATA', {
      status: 200,
      headers: {},
    })

    mock.mock('https://example.com', resp)

    expect(
      await pipe(request, runFetchM('https://example.com'))()
    ).toStrictEqual(right(resp))
  })

  it('should throw TypeError if config is malformed', async () => {
    expect(
      await pipe(request, runFetchM('https://*', {}, realFetch))()
    ).toStrictEqual(left({ kind: 'MalformedRequest' }))
  })
})
