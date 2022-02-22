import { left, right } from 'fp-ts/Either'
import { chainEitherKW } from 'fp-ts/ReaderTaskEither'
import { pipe } from 'fp-ts/function'

import type { Combinator, MapError } from '..'

/**
 * Guard the {@link Response} status code.
 *
 * @param statusIsValid An predication whether the status code is valid.
 * @param otherwise An instance of {@link MapError}
 *
 * @since 1.0.0
 */
export const ensureStatus = <E, F>(
  statusIsValid: (code: number) => boolean,
  otherwise: MapError<F, Response>,
): Combinator<E, Response, E | F> =>
  chainEitherKW(resp =>
    statusIsValid(resp.status) ? right(resp) : pipe(resp, otherwise, left),
  )
