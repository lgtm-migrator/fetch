import { bail, Combinator, MapError } from '..'
import type { Json } from 'fp-ts/Json'
import { tryCatch } from 'fp-ts/TaskEither'
import { flow } from 'fp-ts/function'
import { withHeaders } from './header'
import { withTaskDecoder } from './generic'

/**
 * Parse the {@link Response} body as {@link Json}
 *
 * @param mapError An instance of {@link MapError}
 *
 * @since 1.0.0
 */
export function asJSON<E, F>(
  mapError: MapError<F>
): Combinator<E, Response, F, Json>
export function asJSON<E>(): Combinator<E, Response, E, Json>
export function asJSON<E, F>(
  mapError: MapError<F> = bail
): Combinator<E, Response, F, Json> {
  return flow(
    withHeaders({ Accept: 'application/json' }),
    withTaskDecoder(resp =>
      tryCatch(() => resp.json().then(x => x as Json), mapError)
    )
  )
}

/**
 * Parse the {@link Response} body as {@link Blob}
 *
 * @param accept Set the `Accept` MIME header
 * @param mapError An instance of {@link MapError}
 *
 * @since 1.0.0
 */
export function asBlob<E, F>(
  accept: string,
  mapError: MapError<F>
): Combinator<E, Response, F, Blob>
export function asBlob<E>(accept: string): Combinator<E, Response, E, Blob>
export function asBlob<E, F>(
  accept: string,
  mapError: MapError<F> = bail
): Combinator<E, Response, F, Blob> {
  return flow(
    withHeaders({ Accept: accept }),
    withTaskDecoder(resp => tryCatch(() => resp.blob(), mapError))
  )
}

/**
 * Parse the {@link Response} body as {@link string}
 *
 * @param mapError An instance of {@link MapError}
 *
 * @since 1.0.0
 */
export function asText<E, F>(
  mapError: MapError<F>
): Combinator<E, Response, F, string>
export function asText<E>(): Combinator<E, Response, E, string>
export function asText<E, F>(
  mapError: MapError<F> = bail
): Combinator<E, Response, F, string> {
  return flow(
    withHeaders({ Accept: 'text/plain' }),
    withTaskDecoder(resp => tryCatch(() => resp.text(), mapError))
  )
}
