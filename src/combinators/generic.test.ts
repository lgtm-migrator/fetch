import { left, right } from 'fp-ts/Either'
import { map } from 'fp-ts/ReaderTaskEither'
import { pipe, constVoid, constNull, constTrue } from 'fp-ts/function'

import mock from 'fetch-mock-jest'

import { request, runFetchM } from '..'
import { fail, localE, guard } from './generic'

beforeEach(() => mock.mock('https://example.com', 200))
afterEach(() => mock.reset())

const mk = runFetchM('https://example.com')

describe('guard', () => {
  it('transparent if true', async () => {
    expect(
      await pipe(
        request,
        map(constTrue),
        guard(b => b, constVoid),
        mk,
      )(),
    ).toStrictEqual(right(true))
  })

  it('should return null if false', async () => {
    expect(
      await pipe(
        request,
        guard(() => false, constNull),
        mk,
      )(),
    ).toStrictEqual(left(null))
  })
})

describe('fail', () => {
  it('fail the monad', async () => {
    expect(
      await pipe(
        request,
        fail(() => 'Always has been'),
        mk,
      )(),
    ).toStrictEqual(expect.objectContaining({ _tag: 'Left' }))
  })
})

describe('localE', () => {
  it('raise an error', async () => {
    expect(
      await pipe(
        request,
        localE(() => left('Always has been')),
        mk,
      )(),
    ).toStrictEqual(expect.objectContaining({ _tag: 'Left' }))
  })

  it('update the config', async () => {
    await pipe(
      request,
      localE(() => right(['https://example.com', {}])),
      mk,
    )()

    expect(mock.lastCall()?.[0]).toBe('https://example.com/')
  })
})
