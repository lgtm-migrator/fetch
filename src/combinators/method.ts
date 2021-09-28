import type { Combinator, Config } from '../monad'
import { local } from 'fp-ts/ReaderTaskEither'
import { pipe } from 'fp-ts/function'

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'HEAD' | 'DELETE' | 'OPTION'

export const withMethod = <E extends Error, A>(
  method: HTTPMethod
): Combinator<E, A> =>
  pipe(
    local(
      ({ input, init }): Config => ({
        input,
        init: {
          method,
          ...init,
        },
      })
    )
  )
