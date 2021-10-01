import type { Either } from 'fp-ts/Either'
import type { Config, Combinator, MapError } from '..'
import { ask, chain, chainW, fromEither, local } from 'fp-ts/ReaderTaskEither'
import { tryCatch, map } from 'fp-ts/Either'
import { pipe, flow } from 'fp-ts/function'
import { bail } from '..'

export const localEW =
  <E, F, A>(f: (r: Config) => Either<F, Config>): Combinator<E, A, F> =>
  m =>
    pipe(
      ask<Config>(),
      chain<Config, F, Config, Config>(flow(f, fromEither)),
      chainW(x =>
        pipe(
          m,
          local(() => x)
        )
      )
    )

export function withBaseURL<E, F, A>(
  url: URL | string | undefined,
  mapError: MapError<F>
): Combinator<E, A, F>
export function withBaseURL<E, A>(
  url: URL | string | undefined
): Combinator<E, A>
export function withBaseURL<E, F, A>(
  url: URL | string | undefined,
  mapError: MapError<F> = bail
): Combinator<E, A, F> {
  return localEW(([input, init]) =>
    pipe(
      tryCatch(() => new URL(input, url).href, mapError),
      map(s => [s, init])
    )
  )
}
