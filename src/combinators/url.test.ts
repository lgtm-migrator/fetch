import mock from 'fetch-mock-jest'
import { pipe } from 'fp-ts/function'
import { request, runFetchM } from '..'
import { withBaseURL, merge, withURLSearchParams } from './url'

// FIXME URL doesn't throw if invalid

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

  it('latter should overwrite the former', async () => {
    mock.mock('https://example.com/wait', 200)
    await pipe(
      request,
      withBaseURL('https://example.org'),
      withBaseURL('https://example.com'),
      runFetchM('/wait')
    )()
    expect(mock.lastUrl()).toStrictEqual('https://example.com/wait')
  })

  // it('should throws if URL is invalid', async () => {
  //   expect(
  //     await pipe(
  //       mkRequest(() => 'InternalError', realFetch),
  //       withBaseURL('https://*', () => 'InternalError'),
  //       runFetchM('/wait')
  //     )()
  //   ).toStrictEqual(left('InternalError'))
  // })
})

it('Merge two URLSearchParams', () => {
  expect(
    merge(
      new URLSearchParams({
        wait: 'Always Has Been',
        earth: 'Its All Orio',
      }),
      new URLSearchParams({
        wait: 'R > N',
      })
    ).toString()
  ).toStrictEqual(
    new URLSearchParams({
      wait: 'R > N',
      earth: 'Its All Orio',
    }).toString()
  )
})

describe('URL Parameters Combinator', () => {
  it('should set URL Parameters', async () => {
    mock.mock('https://example.com?wait=always', 200)

    await pipe(
      request,
      withURLSearchParams({ wait: 'always' }),
      runFetchM('https://example.com')
    )()

    expect(mock.lastCall()?.[0]).toStrictEqual(
      'https://example.com/?wait=always'
    )
  })

  it('latter combinator should take precedence', async () => {
    mock.mock('https://example.com?wait=always&has=been', 200)

    await pipe(
      request,
      withURLSearchParams({ wait: 'been', has: 'been' }),
      withURLSearchParams({ wait: 'always' }),
      runFetchM('https://example.com')
    )()

    expect(mock.lastCall()?.[0]).toStrictEqual(
      'https://example.com/?wait=always&has=been'
    )
  })
})
