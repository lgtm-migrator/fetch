import type { Combinator } from '..'
import type { Json } from 'fp-ts/Json'
import { left, right } from 'fp-ts/Either'
import { chainTaskEitherK } from 'fp-ts/ReaderTaskEither'

export const json = <E extends Error>(): Combinator<
  E,
  Response,
  SyntaxError,
  Json
> =>
  chainTaskEitherK(
    resp => () =>
      resp.json().then(
        x => right(x as Json),
        (e: unknown) => {
          return left(new SyntaxError((e as Error).message))
        }
      )
  )

// export const blob = <E extends Error>(): Combinator<E, Response, E, Blob> =>
//   chainTaskEitherK(resp => () => resp.blob().then(x => right(x)))

export const text = <E extends Error>(): Combinator<E, Response, E, string> =>
  chainTaskEitherK(resp => () => resp.text().then(x => right(x)))

// export const formData = <E extends Error>(): Combinator<
//   E,
//   Response,
//   E,
//   FormData
// > => chainTaskEitherK(resp => () => resp.formData().then(x => right(x)))
