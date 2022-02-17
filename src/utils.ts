import type { Lazy } from 'fp-ts/function'

const isLazy = <A>(a: A | Lazy<A>): a is Lazy<A> => typeof a === 'function'

export const eager = <A>(lazy: Lazy<A> | A): A => (isLazy(lazy) ? lazy() : lazy)
