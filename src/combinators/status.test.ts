import { guard } from './status'
import mock from 'fetch-mock-jest'
import { runFetchM, request } from '..'
import { pipe } from 'fp-ts/function'
import { some, none } from 'fp-ts/Option'
import { left } from 'fp-ts/Either'

afterEach(() => mock.reset())

const mk = runFetchM('https://example.com')

describe('Status combinator', () => {
  it('should return error if satisfied', async () => {
    mock.mock('https://example.com', 400)

    class CustomError extends Error {}

    expect(
      await pipe(
        request,
        guard(n =>
          n >= 400 ? some(new CustomError('Always Has Been')) : none
        ),
        mk
      )()
    ).toStrictEqual(left(new CustomError('Always Has Been')))
  })

  it('should return none if not satisfied', async () => {
    mock.mock('https://example.com', 200)

    class CustomError extends Error {}

    expect(
      await pipe(
        request,
        guard(n =>
          n >= 400 ? some(new CustomError('Always Has Been')) : none
        ),
        mk
      )()
    ).toStrictEqual(expect.objectContaining({ _tag: 'Right' }))
  })
})
