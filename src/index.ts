import type { ReaderTaskEither } from 'fp-ts/ReaderTaskEither'
import type { TaskEither } from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import { left, right } from 'fp-ts/Either'
import { withMethod } from './combinators/method'
import { guard } from './combinators/status'

export type Config = {
  input: string
  init?: RequestInit
  fetch?: typeof fetch
}

export type fetchM<E, A> = ReaderTaskEither<Config, E, A>

export type MalformedRequest = {
  kind: 'MalformedRequest'
}

export type MalformedResponseBody = {
  kind: 'MalformedResponseBody'
}

export type ClientError = {
  kind: 'ClientError'
  code: number
}

export type ServerError = {
  kind: 'ServerError'
  code: number
}

export type Combinator<E1, A, E2 = E1, B = A> = (
  m: fetchM<E1, A>
) => fetchM<E2 | E1, B>

export const request: fetchM<MalformedRequest, Response> =
  (config: Config) => () =>
    (config.fetch ?? fetch)(config.input, config.init).then(
      x => right(x),
      () => left({ kind: 'MalformedRequest' })
    )

export const runFetchM =
  <E, A>(input: string, init?: RequestInit, fetch?: Config['fetch']) =>
  (m: fetchM<E, A>): TaskEither<E, A> =>
    m({ input, init, fetch })

export const get = pipe(request, withMethod('GET'), guard())
export const post = pipe(request, withMethod('POST'), guard())
export const put = pipe(request, withMethod('PUT'), guard())
