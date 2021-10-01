import mock from 'fetch-mock-jest'
import { fetch as realFetch } from 'cross-fetch'
import { pipe } from 'fp-ts/function'
import { left } from 'fp-ts/Either'
import { request, mkRequest, runFetchM } from '..'
import { withBaseURL } from './url'

afterEach(() => mock.reset())

describe('Base URL combinator', () => {
  it('should add the base URL', async () => {
    mock.mock('https://example.com/wait', 200)
    await pipe(
      request,
      withBaseURL('https://example.com'),
      runFetchM('/wait')
    )()
    expect(mock.lastUrl()).toStrictEqual('https://example.com/wait')
  })

  // FIXME URL behaves differently
  it('should throws if URL is invalid', async () => {
    expect(
      await pipe(
        mkRequest(() => 'InternalError', realFetch),
        withBaseURL('https://*', () => 'InternalError'),
        runFetchM('/wait')
      )()
    ).toStrictEqual(left('InternalError'))
  })

  // it('throws malformed URL', () => {
  //   expect(() => new URL('/wait', 'https://*')).toThrowError(TypeError)
  // })
})
