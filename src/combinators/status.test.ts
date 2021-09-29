import { guard } from './status'
import mock from 'fetch-mock-jest'
import { runFetchM, request } from '..'
import { pipe } from 'fp-ts/function'
import { left } from 'fp-ts/Either'

afterEach(() => mock.reset())

const mk = runFetchM('https://example.com')

describe('Status combinator', () => {
  it('should return ClientError if >= 400 < 500', async () => {
    mock.mock('https://example.com', 400)

    expect(await pipe(request, guard(), mk)()).toStrictEqual(
      left({
        kind: 'ClientError',
        code: 400,
      })
    )
  })

  it('should return ServerError if >= 500', async () => {
    mock.mock('https://example.com', 500)

    expect(await pipe(request, guard(), mk)()).toStrictEqual(
      left({
        kind: 'ServerError',
        code: 500,
      })
    )
  })

  it('should be transparent if ok', async () => {
    mock.mock('https://example.com', 200)

    expect(await pipe(request, guard(), mk)()).toStrictEqual(
      expect.objectContaining({ _tag: 'Right' })
    )
  })
})
