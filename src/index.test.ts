import { left, right } from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'

import { Response, fetch as realFetch } from 'cross-fetch'
import mock from 'fetch-mock-jest'

import {
  bail,
  mkRequest,
  request,
  runFetchM,
  runFetchMFlipped,
  runFetchMFlippedP,
  runFetchMFlippedPT,
  runFetchMFlippedPTL,
  runFetchMP,
  runFetchMPT,
  runFetchMPTL,
} from '.'

afterEach(() => mock.reset())

describe('Plain request', () => {
  it('should return a Response if succeeded', async () => {
    const resp = new Response('DATA', {
      status: 200,
      headers: {},
    })

    mock.mock('https://example.com', resp)

    expect(
      await pipe(request, runFetchM('https://example.com'))(),
    ).toStrictEqual(right(resp))
    expect(
      await pipe(request, runFetchMP('https://example.com')),
    ).toStrictEqual(right(resp))
    expect(
      await pipe(request, runFetchMPT('https://example.com')),
    ).toStrictEqual(resp)
    expect(
      await pipe(request, runFetchMPTL('https://example.com'))(),
    ).toStrictEqual(resp)
    expect(
      await pipe(request, runFetchMFlipped)('https://example.com')(),
    ).toStrictEqual(right(resp))
    expect(
      await pipe(request, runFetchMFlippedP)('https://example.com'),
    ).toStrictEqual(right(resp))
    expect(
      await pipe(request, runFetchMFlippedPT)('https://example.com'),
    ).toStrictEqual(resp)
    expect(
      await pipe(request, runFetchMFlippedPTL)('https://example.com')(),
    ).toStrictEqual(resp)
  })

  it('should throw TypeError if config is malformed', async () => {
    expect(
      await pipe(
        mkRequest(() => 'InternalError', realFetch),
        runFetchM('https://*'),
      )(),
    ).toStrictEqual(left('InternalError'))
    expect(
      await pipe(
        mkRequest(() => 'InternalError', realFetch),
        runFetchMP('https://*'),
      ),
    ).toStrictEqual(left('InternalError'))
    expect(
      async () =>
        await pipe(
          mkRequest(() => 'InternalError', realFetch),
          runFetchMPT('https://*'),
        ),
    ).rejects.toMatch('InternalError')
    expect(
      async () =>
        await pipe(
          mkRequest(() => 'InternalError', realFetch),
          runFetchMPTL('https://*'),
        )(),
    ).rejects.toMatch('InternalError')
    expect(
      await pipe(
        mkRequest(() => 'InternalError', realFetch),
        runFetchMFlipped,
      )('https://*')(),
    ).toStrictEqual(left('InternalError'))
    expect(
      await pipe(
        mkRequest(() => 'InternalError', realFetch),
        runFetchMFlippedP,
      )('https://*'),
    ).toStrictEqual(left('InternalError'))
    expect(
      async () =>
        await pipe(
          mkRequest(() => 'InternalError', realFetch),
          runFetchMFlippedPT,
        )('https://*'),
    ).rejects.toMatch('InternalError')
    expect(
      async () =>
        await pipe(
          mkRequest(() => 'InternalError', realFetch),
          runFetchMFlippedPTL,
        )('https://*')(),
    ).rejects.toMatch('InternalError')
  })
})

it('bail should throws parameter as error', () => {
  expect(() => bail(new Error('Wait'))).toThrowError(new Error('Wait'))
  expect(() => bail('Wait')).toThrowError(new Error('Wait'))
})
