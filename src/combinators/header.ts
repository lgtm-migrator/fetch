import type { Combinator } from '..'
import { mapSnd } from 'fp-ts/Tuple'
import { withLocal } from './generic'

export const toRecord = (x: HeadersInit): Record<string, string> => {
  if (Array.isArray(x)) {
    return Object.fromEntries(x)
  } else if (x instanceof Headers) {
    const obj: Record<string, string> = {}
    x.forEach((v, k) => (obj[k] = v))
    return obj
  } else {
    return x
  }
}

export const merge = (into: HeadersInit, from: HeadersInit): HeadersInit => ({
  ...toRecord(into),
  ...toRecord(from),
})

export const withHeaders = <E, A>(hs: HeadersInit): Combinator<E, A> =>
  withLocal(mapSnd(x => ({ headers: merge(hs, x.headers ?? {}), ...x })))
