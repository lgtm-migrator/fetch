import type { Lazy } from 'fp-ts/function'

const isLazy = <A>(a: A | Lazy<A>): a is Lazy<A> => typeof a === 'function'

/**
 * Require the expression to be reduced.
 *
 * @param lazy A value that might be lazy
 *
 * @since 2.3.0
 */
export const eager = <A>(lazy: Lazy<A> | A): A => (isLazy(lazy) ? lazy() : lazy)
