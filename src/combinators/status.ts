import type { Combinator, MapError } from '..'
import { chainEitherKW } from 'fp-ts/ReaderTaskEither'
import { left, right } from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'

/**
 * Guard the {@link Response} status code.
 *
 * @param f An predication whether the status code is valid.
 * @param mapError An instance of {@link MapError}
 *
 * @since 1.0.0
 */
export const ensureStatus = <E, F>(
  f: (code: number) => boolean,
  mapError: MapError<F, Response>
): Combinator<E, Response, E | F> =>
  chainEitherKW(resp =>
    f(resp.status) ? right(resp) : pipe(resp, mapError, left)
  )
