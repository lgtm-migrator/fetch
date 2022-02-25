import type { Predicate } from 'fp-ts/Predicate'
import type { Either } from 'fp-ts/Either'
import {
  ask,
  chain,
  chainW,
  chainEitherKW,
  fromEither,
  left,
  local,
} from 'fp-ts/ReaderTaskEither'
import { left as leftE, right as rightE } from 'fp-ts/Either'
import type { Lazy } from 'fp-ts/function'
import { flow, pipe } from 'fp-ts/function'

import type { Combinator, Config, MapError } from '..'

/**
 * Guard the value in the pipline.
 *
 * @since 2.13.0
 *
 * @param predicate A {@link Predicate} determine whether the branch should be called
 * @param otherwise Called when the predicate is false
 */
export const guard = <E, F, A>(
  predicate: Predicate<A>,
  otherwise: MapError<F, A>,
): Combinator<E, A, E | F> =>
  chainEitherKW(a => (predicate(a) ? rightE(a) : pipe(a, otherwise, leftE)))

/**
 * Throw an error
 *
 * @param error
 *
 * @since 2.2.1
 */
export const fail = <E, A, F>(error: Lazy<F>): Combinator<E, A, E | F, A> =>
  flow(error, left)

/**
 * Abuse version of {@link local}, which might raise an error.
 *
 * @since 2.2.3
 */
export const localE =
  <E, A, F>(f: (a: Config) => Either<F, Config>): Combinator<E, A, E | F> =>
  m =>
    pipe(
      ask<Config>(),
      chain<Config, F, Config, Config>(flow(f, fromEither)),
      chainW(x =>
        pipe(
          m,
          local(() => x),
        ),
      ),
    )
