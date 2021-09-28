import type { ReaderTaskEither } from 'fp-ts/ReaderTaskEither'
import type { TaskEither } from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import { left, right } from 'fp-ts/Either'
import { withMethod } from './combinators/method'

export type Config = {
  input: RequestInfo
  init?: RequestInit
  fetch?: typeof fetch
}

export type fetchM<E extends Error, A> = ReaderTaskEither<Config, E, A>

export type Combinator<E1 extends Error, A, E2 extends Error = E1, B = A> = (
  m: fetchM<E1, A>
) => fetchM<E2 | E1, B>

export const request: fetchM<TypeError, Response> = (config: Config) => () =>
  (config.fetch ?? fetch)(config.input, config.init).then(
    x => right(x),
    (e: unknown) => left(new TypeError((e as Error).message))
  )

export const runFetchM =
  <E extends Error, A>(
    input: RequestInfo,
    init?: RequestInit,
    fetch?: Config['fetch']
  ) =>
  (m: fetchM<E, A>): TaskEither<E, A> =>
    m({ input, init, fetch })

export const get = pipe(request, withMethod('GET'))
export const post = pipe(request, withMethod('POST'))
export const put = pipe(request, withMethod('PUT'))
export const del = pipe(request, withMethod('DELETE'))
