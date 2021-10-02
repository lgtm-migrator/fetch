import type { Combinator } from '..'
import { mapSnd } from 'fp-ts/Tuple'
import { withLocal } from './generic'

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'HEAD' | 'DELETE' | 'OPTION'

export const withMethod = <E, A>(method: HTTPMethod): Combinator<E, A> =>
  withLocal(mapSnd(x => ({ method, ...x })))
