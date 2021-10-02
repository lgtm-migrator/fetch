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

export const toRecord = (params: URLSearchParams): Record<string, string> => {
  const obj: Record<string, string> = {}
  params.forEach((v, k) => (obj[k] = v))
  return obj
}

export const merge = (
  into: URLSearchParams,
  from: URLSearchParams
): URLSearchParams =>
  new URLSearchParams({
    ...toRecord(into),
    ...toRecord(from),
  })

export function withURLSearchParams<E, F, A>(
  params: Record<string, string>,
  mapError: MapError<F>
): Combinator<E, A, F>
export function withURLSearchParams<E, A>(
  params: Record<string, string>
): Combinator<E, A>
export function withURLSearchParams<E, F, A>(
  params: Record<string, string>,
  mapError: MapError<F> = bail
): Combinator<E, A, F> {
  return localEW(([input, init]) =>
    pipe(
      tryCatch(() => {
        const url = new URL(input)
        url.search = merge(
          new URLSearchParams(params),
          url.searchParams
        ).toString()
        return url.href
      }, mapError),
      map(s => [s, init])
    )
  )
}
