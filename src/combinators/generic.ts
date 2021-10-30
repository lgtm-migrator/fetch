import type { Combinator } from '..'
import type { Lazy } from 'fp-ts/function'
import { left } from 'fp-ts/ReaderTaskEither'
import { flow, identity } from 'fp-ts/function'

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
  combinator: Combinator<E, A, F, B>
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
