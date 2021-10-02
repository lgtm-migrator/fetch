import type { Combinator } from '..'
import { mapSnd } from 'fp-ts/Tuple'
import { rightIO, chain, chainFirst } from 'fp-ts/ReaderTaskEither'
import { withLocal } from './generic'
import { pipe } from 'fp-ts/function'

/**
 * Set an abort signal.
 *
 * @param signal Abort signal {@link AbortSignal}
 *
 * Please note, the thrown `AbortError` must be handled specifically during creating request,
 * a.k.a, `mkRequest`.
 *
 * You cannot distinguish between a manually aborted request and a timeout request.
 *
 * @since 1.0.0
 */
export const withSignal = <E, A>(signal: AbortSignal): Combinator<E, A> =>
  withLocal(mapSnd(x => ({ signal, ...x })))

/**
 * Set the request timeout.
 *
 * @param miliseconds Duration in miliseconds
 *
 * Please note, the thrown `AbortError` must be handled specifically during creating request,
 * a.k.a, `mkRequest`.
 *
 * You cannot distinguish between a manually aborted request and a timeout request.
 *
 * @since 1.0.0
 */
export const withTimeout =
  <E, A>(miliseconds: number): Combinator<E, A> =>
  m => {
    const controller = new AbortController()

    return pipe(
      rightIO(() => setTimeout(() => controller.abort(), miliseconds)),
      chain(id =>
        pipe(
          m,
          withSignal<E, A>(controller.signal),
          chainFirst(() => rightIO(() => clearTimeout(id)))
        )
      )
    )
  }
