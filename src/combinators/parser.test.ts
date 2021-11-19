import mock from 'fetch-mock-jest'
import { pipe } from 'fp-ts/function'
import { Response } from 'cross-fetch'
import { left, right } from 'fp-ts/Either'
import { runFetchM, request } from '..'
import { asBlob, asJSON, asText } from './parser'

afterEach(() => mock.reset())

const mk = runFetchM('https://example.com')

describe('JSON Parser combinator', () => {
  it('should be able to parse JSON', async () => {
    mock.mock(
      'https://example.com',
      new Response(`{ "Earth": "Always Has Been" }`),
    )

    expect(await pipe(request, asJSON(), mk)()).toStrictEqual(
      right({
        Earth: 'Always Has Been',
      }),
    )
  })

  it('should throws SyntaxError if JSON syntax invalid', async () => {
    mock.mock(
      'https://example.com',
      new Response(`{ "Earth": "Always Has Been"`),
    )

    expect(
      await pipe(
        request,
        asJSON(() => 'InvalidSyntax'),
        mk,
      )(),
    ).toStrictEqual(left('InvalidSyntax'))
  })

  it('should set Accept header correctly', async () => {
    mock.mock('https://example.com', new Response(`{}`))

    await pipe(request, asJSON(), mk)()

    expect(mock.lastCall()?.[1]).toStrictEqual({
      headers: {
        Accept: 'application/json',
      },
    })
  })
})

describe('Blob Parser Combinator', () => {
  it('should be able to parse Blob', async () => {
    mock.mock(
      'https://example.com',
      new Response(new Blob([], { type: 'application/pdf' })),
    )

    expect(await pipe(request, asBlob('application/pdf'), mk)()).toStrictEqual(
      expect.objectContaining({ _tag: 'Right' }),
    )
  })

  it('should set Accept header correctly', async () => {
    mock.mock('https://example.com', 200)

    await pipe(request, asBlob('application/pdf'), mk)()

    expect(mock.lastCall()?.[1]).toStrictEqual({
      headers: {
        Accept: 'application/pdf',
      },
    })
  })
})

describe('Text Parser Combinator', () => {
  it('should be able to parse text', async () => {
    mock.mock('https://example.com', new Response(`Always Has Been`))

    expect(await pipe(request, asText(), mk)()).toStrictEqual(
      right('Always Has Been'),
    )
  })
})
