import mock from 'fetch-mock-jest'
import { pipe } from 'fp-ts/function'
import { left } from 'fp-ts/Either'
import { request, runFetchM } from '..'
import { ensureStatus } from './status'

afterEach(() => mock.reset())

const mk = runFetchM('https://example.com')

describe('Status Combinator', () => {
  it('should reject', async () => {
    mock.mock('https://example.com', 400)
    expect(
      await pipe(
        request,
        ensureStatus(
          n => n < 400,
          () => 'Bad Response'
        ),
        mk
      )()
    ).toStrictEqual(left('Bad Response'))
  })

  it('should bypass', async () => {
    mock.mock('https://example.com', 200)
    expect(
      await pipe(
        request,
        ensureStatus(
          n => n < 400,
          () => 'Bad Response'
        ),
        mk
      )()
    ).toStrictEqual(expect.objectContaining({ _tag: 'Right' }))
  })
})
