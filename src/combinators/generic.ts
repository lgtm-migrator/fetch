import type { Either } from 'fp-ts/Either'
import {
  ask,
  chain,
  chainW,
  fromEither,
  left,
  local,
} from 'fp-ts/ReaderTaskEither'
import type { Lazy } from 'fp-ts/function'
import { flow, identity, pipe } from 'fp-ts/function'

import type { Combinator, Config } from '..'

/**
 * Apply a combinator conditionally.
 *
 * @param condition Whether should the combinator runs or not
 * @param combinator The {@link Combinator}
 *
 * @since 2.2.1
 */
export const when = <E, A, F, B>(
  condition: boolean,
  combinator: Combinator<E, A, F, B>,
): Combinator<E, A, E | F, A | B> => (condition ? combinator : identity)

/**
 * Throw an error
 *
 * @param error
 *
 * @since 2.2.1
 */
export const fail = <E, A, F, B>(error: Lazy<F>): Combinator<E, A, E | F, B> =>
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
