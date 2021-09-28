import type { Combinator, Config } from '..'
import { local } from 'fp-ts/ReaderTaskEither'

export const withSignal = <E extends Error, A>(
  signal: AbortSignal
): Combinator<E, A, E | DOMException> =>
  local(({ input, init }): Config => ({ input, init: { signal, ...init } }))
