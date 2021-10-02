import type { Combinator, MapError } from '..'
import { withGuardian } from './generic'
import { left, right } from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'

export const ensureStatus = <E, F>(
  f: (code: number) => boolean,
  mapError: MapError<F, Response>
): Combinator<E, Response, F> =>
  withGuardian(resp =>
    f(resp.status) ? right(resp) : pipe(resp, mapError, left)
  )
