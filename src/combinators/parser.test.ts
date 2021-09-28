import mock from 'fetch-mock-jest'
import { pipe } from 'fp-ts/function'
import { Response } from 'cross-fetch'
import { right } from 'fp-ts/Either'
import { runFetchM, request } from '..'
import { json, text } from './parser'

afterEach(() => mock.reset())

const mk = runFetchM('https://example.com')

describe('Parser combinator', () => {
  it('should be able to parse JSON', async () => {
    mock.mock(
      'https://example.com',
      new Response(`{ "Earth": "Always Has Been" }`)
    )

    expect(await pipe(request, json(), mk)()).toStrictEqual(
      right({
        Earth: 'Always Has Been',
      })
    )
  })

  it('should throws SyntaxError if JSON syntax invalid', async () => {
    mock.mock(
      'https://example.com',
      new Response(`{ "Earth": "Always Has Been"`)
    )

    expect(await pipe(request, json(), mk)()).toStrictEqual(
      expect.objectContaining({
        _tag: 'Left',
      })
    )
  })

  it('should be able to parse text', async () => {
    mock.mock('https://example.com', new Response(`Always Has Been`))

    expect(await pipe(request, text(), mk)()).toStrictEqual(
      right('Always Has Been')
    )
  })
})
