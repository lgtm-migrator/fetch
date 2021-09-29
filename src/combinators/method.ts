import type { Combinator, Config } from '..'
import { local } from 'fp-ts/ReaderTaskEither'

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'HEAD' | 'DELETE' | 'OPTION'

export const withMethod = <E, A>(method: HTTPMethod): Combinator<E, A> =>
  local(
    ({ input, init }): Config => ({
      input,
      init: {
        method,
        ...init,
      },
    })
  )
