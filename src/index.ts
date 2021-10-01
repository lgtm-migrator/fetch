import type { ReaderTaskEither } from 'fp-ts/ReaderTaskEither'
import type { TaskEither } from 'fp-ts/TaskEither'
import { withMethod } from './combinators/method'
import { tryCatch } from 'fp-ts/TaskEither'
import { pipe, tupled } from 'fp-ts/function'

export type Config = [string, RequestInit]

export type FetchM<E, A> = ReaderTaskEither<Config, E, A>

export type MapError<E> = (err: unknown) => E

export const bail: MapError<never> = e => {
  if (e instanceof Error) {
    throw e
  } else {
    throw new Error(`${e}`)
  }
}

export type Combinator<E1, A, E2 = E1, B = A> = (
  m: FetchM<E1, A>
) => FetchM<E2 | E1, B>

export const mkRequest =
  <E>(mapError: MapError<E>, fetchImpl?: typeof fetch): FetchM<E, Response> =>
  r =>
    tryCatch(() => tupled(fetchImpl ?? fetch)(r), mapError)

export const request = mkRequest(bail)

export const runFetchM =
  (input: string, init?: RequestInit) =>
  <E, A>(m: FetchM<E, A>): TaskEither<E, A> =>
    m([input, init ?? {}])

export const get = request
export const post = pipe(request, withMethod('POST'))
