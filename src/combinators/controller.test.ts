import mock from 'fetch-mock-jest'
import { Response } from 'cross-fetch'
import { pipe } from 'fp-ts/lib/function'
import { left, right } from 'fp-ts/Either'
import { withSignal, withTimeout } from './controller'
import { mkRequest, runFetchM } from '..'

afterEach(() => mock.reset())

const mk = runFetchM('https://example.com')

describe('Signal Combinator', () => {
  it('should make the request abortable', async () => {
    mock.mock('https://example.com', 200)
    const controller = new AbortController()
    const req = pipe(
      mkRequest(() => 'Aborted'),
      withSignal(controller.signal),
      mk
    )
    controller.abort()
    const result = await req()
    expect(result).toStrictEqual(left('Aborted'))
  })

  // TODO We cannot test the order of AbortControllers, since we cannot identify them currently.
})

describe('Timeout combinator', () => {
  it('should do nothing is returned before timeout', async () => {
    const response = new Response('Alwaays Has Been', {})
    mock.mock('https://example.com', response, { delay: 500 })
    expect(
      await pipe(
        mkRequest(() => 'Aborted'),
        withTimeout(1000),
        mk
      )()
    ).toStrictEqual(right(response))
  })

  it('should throw if timeout', async () => {
    const response = new Response('Alwaays Has Been', {})
    mock.mock('https://example.com', response, { delay: 500 })
    expect(
      await pipe(
        mkRequest(() => 'Aborted'),
        withTimeout(200),
        mk
      )()
    ).toStrictEqual(left('Aborted'))
  })
})
