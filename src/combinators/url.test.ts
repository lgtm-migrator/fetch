import mock from 'fetch-mock-jest'
import { pipe } from 'fp-ts/function'
import { get, runFetchM } from '..'
import { withBaseURL } from './url'

afterEach(() => mock.reset())

describe('Base URL combinator', () => {
  it('should add the base URL', async () => {
    mock.mock('https://example.com/wait', 200)
    await pipe(get, withBaseURL('https://example.com'), runFetchM('/wait'))()
    expect(mock.lastUrl()).toStrictEqual('https://example.com/wait')
  })
})
