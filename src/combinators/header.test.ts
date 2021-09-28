import { union, toRecord } from './header'

describe('Convert HeaderInit to Record<string, string>', () => {
  it('should satisfy identity', () => {
    expect(
      toRecord({
        Authorization: 'BEARER WAIT_ITS_ALL_OHIO',
      })
    ).toStrictEqual({
      Authorization: 'BEARER WAIT_ITS_ALL_OHIO',
    })
  })

  it('should create Record from entries', () => {
    expect(
      toRecord([['Authorization', 'BEARER ALWAYS_HAS_BEEN']])
    ).toStrictEqual({
      Authorization: 'BEARER ALWAYS_HAS_BEEN',
    })
  })

  it('should iterate over Headers to create Record', () => {
    expect(
      toRecord(new Headers([['Authorization', 'BEARER ALWAYS_HAS_BEEN']]))
    ).toStrictEqual({
      authorization: 'BEARER ALWAYS_HAS_BEEN',
    })
  })
})

describe('Merge two HeaderInit and create a new one', () => {
  it('without intersection', () => {
    expect(
      union(
        { Authorization: 'BEARER ALWAYS_HAS_BEEN' },
        { Accept: 'application/json' }
      )
    ).toStrictEqual({
      Authorization: 'BEARER ALWAYS_HAS_BEEN',
      Accept: 'application/json',
    })
  })

  it('with intersection', () => {
    expect(
      union(
        { Authorization: 'BEARER ALWAYS_HAS_BEEN' },
        { Authorization: 'BEARER WAIT_ITS_ALL_OHIO' }
      )
    ).toStrictEqual({ Authorization: 'BEARER WAIT_ITS_ALL_OHIO' })
  })
})
