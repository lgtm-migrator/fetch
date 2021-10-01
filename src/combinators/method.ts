import type { Combinator } from '..'
import { local } from 'fp-ts/ReaderTaskEither'
import { mapSnd } from 'fp-ts/Tuple'

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'HEAD' | 'DELETE' | 'OPTION'

export const withMethod = <E, A>(method: HTTPMethod): Combinator<E, A> =>
  local(mapSnd(x => ({ method, ...x })))
