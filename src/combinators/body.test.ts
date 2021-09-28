import mock from 'fetch-mock-jest'
import { pipe } from 'fp-ts/function'
import { post, runFetchM } from '..'
import { withForm, withJSON, mkFormData } from './body'

beforeEach(() => mock.mock('https://example.com', 200))
afterEach(() => mock.reset())

describe('Create FormData', () => {
  it('build from strict Formable', () => {
    const generated = mkFormData({
      name: 'John',
      license: new Blob(['DATA']),
      backup: {
        blob: new Blob(['DATA']),
        filename: 'Backup',
      },
    })

    const expected = new FormData()
    expected.set('name', 'John')
    expected.set('license', new Blob(['DATA']))
    expected.set('backup', new Blob(['DATA']), 'Backup')

    expect(generated).toStrictEqual(expected)
  })

  it('build from weak Formable', () => {
    const generated = mkFormData({
      id: 1,
      license: new Blob(['DATA']),
      backup: {
        blob: new Blob(['DATA']),
        filename: 'Backup',
      },
    })

    const expected = new FormData()
    expected.set('id', '1')
    expected.set('license', new Blob(['DATA']))
    expected.set('backup', new Blob(['DATA']), 'Backup')

    expect(generated).toStrictEqual(expected)
  })
})

const mk = runFetchM('https://example.com')

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
