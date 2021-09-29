import { z } from 'zod'
import { withDecoder } from './decoder'
import mock from 'fetch-mock-jest'
import { Response } from 'cross-fetch'
import { pipe } from 'fp-ts/function'
import { runFetchM, request } from '..'
import { asJSON } from './parser'
import { right } from 'fp-ts/Either'

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
        withDecoder(z.object({ Earth: z.string() })),
        mk
      )()
    ).toStrictEqual(right({ Earth: 'Always Has Been' }))
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
        withDecoder(z.object({ Earth: z.string().url() })),
        mk
      )()
    ).toStrictEqual(expect.objectContaining({ _tag: 'Left' }))
  })
})
