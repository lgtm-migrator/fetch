import mock from 'fetch-mock-jest'
import { Response } from 'cross-fetch'
import { pipe } from 'fp-ts/lib/function'
import { left, right } from 'fp-ts/Either'
import { withSignal, withTimeout } from './controller'
import { request, runFetchM } from '..'

afterEach(() => mock.reset())

const mk = runFetchM('https://example.com')

describe('Signal Combinator', () => {
  it('should make the request abortable', async () => {
    mock.mock('https://example.com', 200)
    const controller = new AbortController()
    const req = pipe(
      request,
      withSignal(controller.signal, () => 'Aborted'),
      mk
    )
    controller.abort()
    const result = await req()
    expect(result).toStrictEqual(left('Aborted'))
  })
})

describe('Timeout combinator', () => {
  it('should do nothing is returned before timeout', async () => {
    const response = new Response('Always Has Been', {})
    mock.mock('https://example.com', response, { delay: 500 })
    expect(await pipe(request, withTimeout(1000), mk)()).toStrictEqual(
      right(response)
    )
  })

  it('should throw if timeout', async () => {
    const response = new Response('Always Has Been', {})
    mock.mock('https://example.com', response, { delay: 500 })
    expect(
      await pipe(
        request,
        withTimeout(200, () => 'Aborted'),
        mk
      )()
    ).toStrictEqual(left('Aborted'))
  })
})
