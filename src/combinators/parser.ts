import { bail, Combinator, MapError } from '..'
import type { Json } from 'fp-ts/Json'
import { chainTaskEitherKW } from 'fp-ts/ReaderTaskEither'
import { tryCatch } from 'fp-ts/TaskEither'
import { flow } from 'fp-ts/function'
import { withHeaders } from './header'

/**
 * Parse the {@link Response} body as {@link Json}
 *
 * @param mapError An instance of {@link MapError}
 *
 * @since 1.0.0
 */
export function asJSON<E, F>(
  mapError: MapError<F>,
): Combinator<E, Response, E | F, Json>
export function asJSON<E>(): Combinator<E, Response, E, Json>
export function asJSON<E, F>(
  mapError: MapError<F> = bail,
): Combinator<E, Response, E | F, Json> {
  return flow(
    withHeaders({ Accept: 'application/json' }),
    chainTaskEitherKW(resp =>
      tryCatch(() => resp.json().then(x => x as Json), mapError),
    ),
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
  mapError: MapError<F>,
): Combinator<E, Response, E | F, Blob>
export function asBlob<E>(accept: string): Combinator<E, Response, E, Blob>
export function asBlob<E, F>(
  accept: string,
  mapError: MapError<F> = bail,
): Combinator<E, Response, E | F, Blob> {
  return flow(
    withHeaders({ Accept: accept }),
    chainTaskEitherKW(resp => tryCatch(() => resp.blob(), mapError)),
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
  mapError: MapError<F>,
): Combinator<E, Response, E | F, string>
export function asText<E>(): Combinator<E, Response, E, string>
export function asText<E, F>(
  mapError: MapError<F> = bail,
): Combinator<E, Response, E | F, string> {
  return flow(
    withHeaders({ Accept: 'text/plain' }),
    chainTaskEitherKW(resp => tryCatch(() => resp.text(), mapError)),
  )
}
