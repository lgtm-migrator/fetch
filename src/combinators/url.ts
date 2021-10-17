import type { Combinator, MapError } from '..'
import { mapSnd } from 'fp-ts/Tuple'
import { bail } from '..'
import { withLocal } from './generic'

/**
 * Set the base URL for the request.
 *
 * @param url The base URL
 * @param mapError An instance of {@link MapError}, if omit, {@link bail} will be used instead.
 *
 * @since 1.0.0
 */
export function withBaseURL<E, F, A>(
  url: URL | string | undefined,
  mapError: MapError<F>
): Combinator<E, A, F>
export function withBaseURL<E, A>(
  url: URL | string | undefined
): Combinator<E, A>
export function withBaseURL<E, F, A>(
  url: URL | string | undefined,
  mapError: MapError<F> = bail
): Combinator<E, A, F> {
  return withLocal(
    mapSnd(x => ({ _BASE_URL: url, _BASE_URL_MAP_ERROR: mapError, ...x }))
  )
}

/**
 * Collect {@link URLSearchParams} as {@link Record}, where keys and values are both {@link string}
 *
 * @param params Search parameters {@link URLSearchParams}
 * @returns Record `Record<string, string>`
 *
 * @since 1.0.0
 * @deprecated Since 1.2.0, the {@link withURLSearchParams} no longer uses this function internally.
 */
export const toRecord = (params: URLSearchParams): Record<string, string> => {
  const obj: Record<string, string> = {}
  params.forEach((v, k) => (obj[k] = v))
  return obj
}

/**
 * Merge two {@link URLSearchParams} into one {@link URLSearchParams}.
 *
 * @param into The target {@link URLSearchParams}, entries might be overwritten.
 * @param from The source {@link URLSearchParams}, entries must persist.
 * @returns Search parameters {@link URLSearchParams}
 *
 * @since 1.0.0
 * @deprecated Since 1.2.0, the {@link withURLSearchParams} no longer uses this function internally.
 */
export const merge = (
  into: URLSearchParams,
  from: URLSearchParams
): URLSearchParams =>
  new URLSearchParams({
    ...toRecord(into),
    ...toRecord(from),
  })

/**
 * Set URL search parameters.
 *
 * If this combinator occurs more than one time in the pipeline, the latter set parameters will
 * merge into the previous set ones.
 *
 * @param params URL parameters in `Record<string, string>`
 * @param mapError An instance of {@link MapError}
 *
 * @since 1.2.0
 */
export function withURLSearchParams<E, F, A>(
  params: Record<string, string>,
  mapError: MapError<F>
): Combinator<E, A, F>
export function withURLSearchParams<E, A>(
  params: Record<string, string>
): Combinator<E, A>
export function withURLSearchParams<E, F, A>(
  params: Record<string, string>,
  mapError: MapError<F> = bail
): Combinator<E, A, F> {
  type ExtendedRequestInit = RequestInit & {
    _URL_SEARCH_PARAMS?: Record<string, string>
  }

  return withLocal(
    mapSnd(x => {
      const { _URL_SEARCH_PARAMS, ...rest } = x as ExtendedRequestInit
      return {
        _URL_SEARCH_PARAMS_MAP_ERROR: mapError,
        _URL_SEARCH_PARAMS: {
          ...params,
          ..._URL_SEARCH_PARAMS,
        },
        ...rest,
      }
    })
  )
}
