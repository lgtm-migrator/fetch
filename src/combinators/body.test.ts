import mock from 'fetch-mock-jest'
import { pipe } from 'fp-ts/function'
import { post, config } from '../monad'
import { withForm, withJSON } from './body'

beforeEach(() => mock.mock('https://example.com', 200))
afterEach(() => mock.reset())

const mk = config('https://example.com')

describe('JSON body combinator', () => {
  it('should encode JSON & set header', async () => {
    await pipe(post, withJSON({ Earth: 'Always Has Been' }), mk)()

    expect(mock.lastCall()?.[1]).toStrictEqual({
      body: '{"Earth":"Always Has Been"}',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
  })
})

describe('Form body combinator', () => {
  it('should encode FormData', async () => {
    await pipe(post, withForm({ Earth: 'Always Has Been' }), mk)()

    const form = new FormData()
    form.set('Earth', 'Always Has Been')

    expect(mock.lastCall()?.[1]).toStrictEqual({
      method: 'POST',
      body: form,
    })
  })
})
