import type { Predicate } from 'fp-ts/Predicate'
import { pipe } from 'fp-ts/function'

import type { Combinator, MapError } from '..'
import { guard } from '..'

/**
 * Guard the {@link Response} status code.
 *
 * @param statusIsValid An predication whether the status code is valid.
 * @param otherwise An instance of {@link MapError}
 *
 * @since 1.0.0
 */
export const ensureStatus = <E, F>(
  predicate: Predicate<number>,
  otherwise: MapError<F, Response>,
): Combinator<E, Response, E | F> =>
  guard(resp => pipe(resp.status, predicate), otherwise)
