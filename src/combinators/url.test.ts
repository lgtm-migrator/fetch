import mock from 'fetch-mock-jest'
import { pipe } from 'fp-ts/function'
import { request, runFetchM } from '..'
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

  // it('should throws if URL is invalid', async () => {
  //   expect(
  //     await pipe(
  //       mkRequest(bail, realFetch),
  //       withBaseURL('https://*', () => 'InternalError'),
  //       runFetchM('/wait')
  //     )()
  //   ).toStrictEqual(left('InternalError'))
  // })
})
