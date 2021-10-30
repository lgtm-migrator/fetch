import { bail, Combinator, MapError } from '..'
import { mapSnd } from 'fp-ts/Tuple'
import { local, rightIO, chain, chainFirst } from 'fp-ts/ReaderTaskEither'
import { pipe } from 'fp-ts/function'

/**
 * Set an abort signal.
 *
 * @param signal Abort signal {@link AbortSignal}
 *
 * @since 1.0.0
 */
export function withSignal<E, A, F>(
  signal: AbortSignal,
  mapError: MapError<F>
): Combinator<E, A, E | F>
export function withSignal<E, A>(signal: AbortSignal): Combinator<E, A>
export function withSignal<E, A, F>(
  signal: AbortSignal,
  mapError: MapError<F> = bail
): Combinator<E, A, E | F> {
  // How could this even be possible? See the impl details of `mkRequest`
  return local(mapSnd(x => ({ signal, _ABORT_MAP_ERROR: mapError, ...x })))
}

/**
 * Set the request timeout.
 *
 * @param miliseconds Duration in miliseconds
 *
 * @since 1.0.0
 */
export function withTimeout<E, A, F>(
  miliseconds: number,
  mapError: MapError<F>
): Combinator<E, A, E | F>
export function withTimeout<E, A>(miliseconds: number): Combinator<E, A>
export function withTimeout<E, A, F>(
  miliseconds: number,
  mapError: MapError<F> = bail
): Combinator<E, A, E | F> {
  return m => {
    let controller: AbortController

    return pipe(
      rightIO(() => {
        controller = new AbortController()
        return setTimeout(() => controller.abort(), miliseconds)
      }),
      chain(id =>
        pipe(
          m,
          withSignal<E, A, F>(controller.signal, mapError),
          chainFirst(() => rightIO(() => clearTimeout(id)))
        )
      )
    )
  }
}
