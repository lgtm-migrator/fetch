import { withDecoder } from './decoder'
import mock from 'fetch-mock-jest'
import { Response } from 'cross-fetch'
import { pipe } from 'fp-ts/function'
import { runFetchM, request } from '..'
import { asJSON } from './parser'
import { left, right } from 'fp-ts/Either'

afterEach(() => mock.reset())

const mk = runFetchM('https://example.com')

describe('Decoder combinator', () => {
  it('should decode', async () => {
    mock.mock(
      'https://example.com',
      new Response(`{ "Earth": "Always Has Been" }`)
    )

    expect(
      await pipe(
        request,
        asJSON(),
        withDecoder(() => right({})),
        mk
      )()
    ).toStrictEqual(right({}))
  })

  it('throws if invalid', async () => {
    mock.mock(
      'https://example.com',
      new Response(`{ "Earth": "Always Has Been" }`)
    )

    expect(
      await pipe(
        request,
        asJSON(),
        withDecoder(() => left({})),
        mk
      )()
    ).toStrictEqual(left({}))
  })
})
