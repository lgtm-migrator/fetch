import type { Combinator } from '../monad'
import type { Json } from 'fp-ts/Json'
import { pipe } from 'fp-ts/function'
import { left, right } from 'fp-ts/Either'
import { chainTaskEitherK } from 'fp-ts/ReaderTaskEither'
import { unreachable } from '../utils'

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
