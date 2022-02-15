import { local } from 'fp-ts/ReaderTaskEither'
import { mapSnd } from 'fp-ts/Tuple'
import type { Lazy } from 'fp-ts/function'

import type { Combinator, MapError } from '..'
import { bail } from '..'
import { eager } from '../utils'

type MaybeURLLike = URL | string | undefined

/**
 * Set the base URL for the request.
 *
 * @param url The base URL
 * @param mapError An instance of {@link MapError}, if omit, {@link bail} will be used instead.
 *
 * @since 1.0.0
 */
export function withBaseURL<E, F, A>(
  url: MaybeURLLike | Lazy<MaybeURLLike>,
  mapError: MapError<F>,
): Combinator<E, A, E | F>
export function withBaseURL<E, A>(
  url: MaybeURLLike | Lazy<MaybeURLLike>,
): Combinator<E, A>
export function withBaseURL<E, F, A>(
  url: MaybeURLLike | Lazy<MaybeURLLike>,
  mapError: MapError<F> = bail,
): Combinator<E, A, E | F> {
  return local(
    mapSnd(x => ({
      _BASE_URL: eager(url),
      _BASE_URL_MAP_ERROR: mapError,
      ...x,
    })),
  )
}

/**
 * Set URL search parameters.
 *
 * If this combinator occurs more than one time in the pipeline, the latter set parameters will
 * merge into the previous set ones.
 *
 * @param params URL parameters in `Record<string, string>`
 *
 * @since 2.0.0
 */
export const withURLSearchParams = <E, A>(
  params: Record<string, string> | Lazy<Record<string, string>>,
): Combinator<E, A> => {
  type ExtendedRequestInit = RequestInit & {
    _URL_SEARCH_PARAMS?: Record<string, string>
  }

  return local(
    mapSnd(x => {
      const { _URL_SEARCH_PARAMS, ...rest } = x as ExtendedRequestInit
      return {
        _URL_SEARCH_PARAMS: {
          ...eager(params),
          ..._URL_SEARCH_PARAMS,
        },
        ...rest,
      }
    }),
  )
}
