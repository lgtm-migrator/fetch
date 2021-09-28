import type { ReaderTaskEither } from 'fp-ts/ReaderTaskEither'
import { pipe } from 'fp-ts/function'
import { left, right } from 'fp-ts/Either'
import { assert } from './utils'
import { withMethod } from './combinators/method'

export type Config = {
  input: RequestInfo
  init?: RequestInit
}

export type fetchM<E extends Error, A> = ReaderTaskEither<Config, E, A>

export type Combinator<E1 extends Error, A, E2 extends Error = E1, B = A> = (
  m: fetchM<E1, A>
) => fetchM<E2 | E1, B>

export const request: fetchM<TypeError, Response> = (config: Config) => () =>
  fetch(config.input, config.init).then(
    x => right(x),
    (e: unknown) => {
      assert.TypeError(e)
      return left(e)
    }
  )

export const get = pipe(request, withMethod('GET'))
export const post = pipe(request, withMethod('POST'))
export const put = pipe(request, withMethod('PUT'))
export const del = pipe(request, withMethod('DELETE'))
