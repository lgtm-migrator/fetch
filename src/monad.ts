import type { ReaderTaskEither } from 'fp-ts/ReaderTaskEither'
import type { Json } from 'fp-ts/Json'
import type { Option } from 'fp-ts/Option'
import { left, right } from 'fp-ts/Either'
import {
  chainTaskEitherK,
  chainTaskEitherKW,
  chainEitherKW,
} from 'fp-ts/ReaderTaskEither'
import { foldW } from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'
import { z } from 'zod'

const unreachable = (): never => {
  throw new Error('WTF')
}

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
      if (e instanceof TypeError) {
        return left(e)
      }
      return unreachable()
    }
  )

export const guard = <E1 extends Error, E2 extends Error>(
  predicate: (n: number) => Option<E2>
): Combinator<E1, Response, E1 | E2> =>
  pipe(
    chainEitherKW(resp =>
      pipe(
        predicate(resp.status),
        foldW(
          () => right(resp),
          e => left(e)
        )
      )
    )
  )

export const json = <E extends Error>(): Combinator<
  E,
  Response,
  E | SyntaxError,
  Json
> =>
  pipe(
    chainTaskEitherK(
      resp => () =>
        resp.json().then(
          x => right(x as Json) /* TODO Why? */,
          (e: unknown) => {
            if (e instanceof SyntaxError) {
              return left(e)
            }
            return unreachable()
          }
        )
    )
  )

export const blob = <E extends Error>(): Combinator<
  E,
  Response,
  E /* TODO */,
  Blob
> =>
  pipe(
    chainTaskEitherK(
      resp => () =>
        resp.blob().then(
          x => right(x),
          () => unreachable() /* TODO */
        )
    )
  )

export const text = <E extends Error>(): Combinator<
  E,
  Response,
  E /* TODO */,
  string
> =>
  pipe(
    chainTaskEitherK(
      resp => () =>
        resp.text().then(
          x => right(x),
          () => unreachable() /* TODO */
        )
    )
  )

export const formData = <E extends Error>(): Combinator<
  E,
  Response,
  E /* TODO */,
  FormData
> =>
  pipe(
    chainTaskEitherK(
      resp => () =>
        resp.formData().then(
          x => right(x),
          () => unreachable() /* TODO */
        )
    )
  )

export const withDecoder = <E extends Error, S extends z.ZodTypeAny>(
  s: S,
  params?: Partial<z.ParseParamsNoData>
): Combinator<E, unknown, E | z.ZodError, S> =>
  pipe(
    chainTaskEitherKW(
      x => () =>
        s.parseAsync(x, params).then(
          x => right(x as S) /* TODO Why ? */,
          (e: unknown) => {
            if (e instanceof z.ZodError) {
              return left(e)
            }
            return unreachable()
          }
        )
    )
  )
