import type { Combinator } from '..'
import { mapSnd } from 'fp-ts/Tuple'
import { withLocal } from './generic'

/**
 * All possible HTTP methods
 *
 * @since 1.0.0
 */
export type HTTPMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'HEAD'
  | 'DELETE'
  | 'OPTION'
  | 'PATCH'

/**
 * Set the request HTTP method.
 *
 * @param method HTTP method {@link HTTPMethod}
 *
 * @since 1.0.0
 */
export const withMethod = <E, A>(method: HTTPMethod): Combinator<E, A> =>
  withLocal(mapSnd(x => ({ method, ...x })))
