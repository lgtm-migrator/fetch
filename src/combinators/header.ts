import type { Combinator } from '..'
import { mapSnd } from 'fp-ts/Tuple'
import { withLocal } from './generic'

/**
 * Collect {@link HeadersInit} as {@link Record}, where keys and values are both {@link string}
 *
 * @param headers Headers {@link HeadersInit}
 * @returns Record `Record<string, string>`
 *
 * @since 1.0.0
 */
export const toRecord = (headers: HeadersInit): Record<string, string> => {
  if (Array.isArray(headers)) {
    return Object.fromEntries(headers)
  } else if (headers instanceof Headers) {
    const obj: Record<string, string> = {}
    headers.forEach((v, k) => (obj[k] = v))
    return obj
  } else {
    return headers
  }
}

/**
 * Merge two {@link HeadersInit} into one {@link HeadersInit}.
 *
 * @param into The target {@link HeadersInit}, entries might be overwritten.
 * @param from The source {@link HeadersInit}, entries must persist.
 * @returns Headers {@link HeadersInit}
 *
 * @since 1.0.0
 */
export const merge = (into: HeadersInit, from: HeadersInit): HeadersInit => ({
  ...toRecord(into),
  ...toRecord(from),
})

/**
 * Set request headers
 *
 * @param headers Headers like {@link HeadersInit}
 *
 * @since 1.0.0
 */
export const withHeaders = <E, A>(headers: HeadersInit): Combinator<E, A> =>
  withLocal(mapSnd(x => ({ headers: merge(headers, x.headers ?? {}), ...x })))
