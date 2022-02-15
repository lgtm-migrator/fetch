import { left, right } from 'fp-ts/Either'
import { pipe } from 'fp-ts/lib/function'

import { Response } from 'cross-fetch'
import mock from 'fetch-mock-jest'

import { request, runFetchM } from '..'
import { withSignal, withTimeout } from './controller'

afterEach(() => mock.reset())

const mk = runFetchM('https://example.com')

describe('Signal Combinator', () => {
  it('should make the request abortable', async () => {
    mock.mock('https://example.com', 200)
    const controller = new AbortController()
    const req = pipe(
      request,
      withSignal(controller.signal, () => 'Aborted'),
      mk,
    )
    controller.abort()
    const result = await req()
    expect(result).toStrictEqual(left('Aborted'))
  })

  it('should throw if no MapError provided', async () => {
    mock.mock('https://example.com', 200)
    const controller = new AbortController()
    const req = pipe(request, withSignal(controller.signal), mk)
    controller.abort()
    await expect(async () => await req()).rejects.toThrowError(
      'The operation was aborted.',
    )
  })
})

describe('Timeout combinator', () => {
  it('should do nothing is returned before timeout', async () => {
    const response = new Response('Always Has Been', {})
    mock.mock('https://example.com', response, { delay: 500 })
    expect(await pipe(request, withTimeout(1000), mk)()).toStrictEqual(
      right(response),
    )
  })

  it('should throw if timeout', async () => {
    const response = new Response('Always Has Been', {})
    mock.mock('https://example.com', response, { delay: 500 })
    expect(
      await pipe(
        request,
        withTimeout(200, () => 'Aborted'),
        mk,
      )(),
    ).toStrictEqual(left('Aborted'))
  })
})
