import { local } from 'fp-ts/ReaderTaskEither'
import { mapSnd } from 'fp-ts/Tuple'
import type { Lazy } from 'fp-ts/function'

import type { Combinator } from '..'
import { eager } from '../utils'

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
  | (string & Record<never, never>)

/**
 * Set the request HTTP method.
 *
 * @param method HTTP method {@link HTTPMethod}
 *
 * @since 1.0.0
 */
export const withMethod = <E, A>(
  method: HTTPMethod | Lazy<HTTPMethod>,
): Combinator<E, A> => local(mapSnd(x => ({ method: eager(method), ...x })))
