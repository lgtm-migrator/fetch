import { pipe } from 'fp-ts/function'

import mock from 'fetch-mock-jest'

import { request, runFetchM } from '..'
import {
  withBaseURL,
  withPassword,
  withURLSearchParams,
  withUsername,
} from './url'

// FIXME URL doesn't throw if invalid

afterEach(() => mock.reset())

describe('Base URL combinator', () => {
  it('should add the base URL', async () => {
    mock.mock('https://example.com/wait', 200)
    await pipe(
      request,
      withBaseURL('https://example.com'),
      runFetchM('/wait'),
    )()
    expect(mock.lastUrl()).toStrictEqual('https://example.com/wait')
  })

  it('latter should overwrite the former', async () => {
    mock.mock('https://example.com/wait', 200)
    await pipe(
      request,
      withBaseURL('https://example.org'),
      withBaseURL('https://example.com'),
      runFetchM('/wait'),
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

describe('URL Parameters Combinator', () => {
  it('should set URL Parameters', async () => {
    mock.mock('https://example.com?wait=always', 200)

    await pipe(
      request,
      withURLSearchParams({ wait: 'always' }),
      runFetchM('https://example.com'),
    )()

    expect(mock.lastCall()?.[0]).toStrictEqual(
      'https://example.com/?wait=always',
    )
  })

  it('latter combinator should take precedence', async () => {
    mock.mock('https://example.com?wait=always&has=been', 200)

    await pipe(
      request,
      withURLSearchParams({ wait: 'been', has: 'been' }),
      withURLSearchParams({ wait: 'always' }),
      runFetchM('https://example.com'),
    )()

    expect(mock.lastCall()?.[0]).toStrictEqual(
      'https://example.com/?wait=always&has=been',
    )
  })

  it('should work well with `withBaseURL`, regardless the order (normal)', async () => {
    mock.mock('https://example.com/orio?wait=always&has=been', 200)

    await pipe(
      request,
      withBaseURL('https://example.com/'),
      withURLSearchParams({ wait: 'always', has: 'been' }),
      runFetchM('orio'),
    )()

    expect(mock.lastCall()?.[0]).toStrictEqual(
      'https://example.com/orio?wait=always&has=been',
    )
  })

  it('should work well with `withBaseURL`, regardless the order (reversed)', async () => {
    mock.mock('https://example.com/orio?wait=always&has=been', 200)

    await pipe(
      request,
      withURLSearchParams({ wait: 'always', has: 'been' }),
      withBaseURL('https://example.com/'),
      runFetchM('orio'),
    )()

    expect(mock.lastCall()?.[0]).toStrictEqual(
      'https://example.com/orio?wait=always&has=been',
    )
  })
})

describe('URL Password Combinator', () => {
  it('should set password', async () => {
    mock.mock('https://:password@example.com', 200)

    await pipe(
      request,
      withPassword('password'),
      runFetchM('https://example.com'),
    )()

    expect(mock.lastCall()?.[0]).toStrictEqual('https://:password@example.com/')
  })

  it('should override', async () => {
    mock.mock('https://:password@example.com', 200)

    await pipe(
      request,
      withPassword('passwd'),
      withPassword('password'),
      runFetchM('https://example.com'),
    )()

    expect(mock.lastCall()?.[0]).toStrictEqual('https://:password@example.com/')
  })
})

describe('URL Username Combinator', () => {
  it('should set username', async () => {
    mock.mock('https://user@example.com', 200)

    await pipe(
      request,
      withUsername('user'),
      runFetchM('https://example.com'),
    )()

    expect(mock.lastCall()?.[0]).toStrictEqual('https://user@example.com/')
  })

  it('should override', async () => {
    mock.mock('https://user@example.com', 200)

    await pipe(
      request,
      withUsername('admin'),
      withUsername('user'),
      runFetchM('https://example.com'),
    )()

    expect(mock.lastCall()?.[0]).toStrictEqual('https://user@example.com/')
  })
})
