import mock from 'fetch-mock-jest'
import { left } from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { request, runFetchM } from '..'
import { withMethod } from './method'
import { withJSON } from './body'
import { when, fail, localE } from './generic'

beforeEach(() => mock.mock('https://example.com', 200))
afterEach(() => mock.reset())

const mk = runFetchM('https://example.com')

describe('when', () => {
  it('transparent if true', async () => {
    await pipe(
      request,
      withMethod('POST'),
      when(true, withJSON({ Earth: 'Always Has Been' })),
      mk
    )()

    expect(mock.lastCall()?.[1]).toStrictEqual({
      body: '{"Earth":"Always Has Been"}',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
  })

  it('transparent if true', async () => {
    expect(
      await pipe(
        request,
        when(
          false,
          fail(() => 'Always has been')
        ),
        mk
      )()
    ).toStrictEqual(expect.objectContaining({ _tag: 'Right' }))
  })
})

describe('fail', () => {
  it('fail the monad', async () => {
    expect(
      await pipe(
        request,
        fail(() => 'Always has been'),
        mk
      )()
    ).toStrictEqual(expect.objectContaining({ _tag: 'Left' }))
  })
})

describe('localE', () => {
  it('raise an error', async () => {
    expect(
      await pipe(
        request,
        localE(() => left('Always has been')),
        mk
      )()
    ).toStrictEqual(expect.objectContaining({ _tag: 'Left' }))
  })
})
