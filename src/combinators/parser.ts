import type { Combinator } from '../monad'
import type { Json } from 'fp-ts/Json'
import { left, right } from 'fp-ts/Either'
import { chainTaskEitherK } from 'fp-ts/ReaderTaskEither'
import { unreachable } from '../utils'

export const json = <E extends Error>(): Combinator<
  E,
  Response,
  E | SyntaxError,
  Json
> =>
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

export const blob = <E extends Error>(): Combinator<
  E,
  Response,
  E /* TODO */,
  Blob
> =>
  chainTaskEitherK(
    resp => () =>
      resp.blob().then(
        x => right(x),
        () => unreachable() /* TODO */
      )
  )

export const text = <E extends Error>(): Combinator<
  E,
  Response,
  E /* TODO */,
  string
> =>
  chainTaskEitherK(
    resp => () =>
      resp.text().then(
        x => right(x),
        () => unreachable() /* TODO */
      )
  )

export const formData = <E extends Error>(): Combinator<
  E,
  Response,
  E /* TODO */,
  FormData
> =>
  chainTaskEitherK(
    resp => () =>
      resp.formData().then(
        x => right(x),
        () => unreachable() /* TODO */
      )
  )
