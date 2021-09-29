import type { Combinator, MalformedResponseBody } from '..'
import type { Json } from 'fp-ts/Json'
import { left, right } from 'fp-ts/Either'
import { chainTaskEitherK } from 'fp-ts/ReaderTaskEither'

export const json = <E>(): Combinator<
  E,
  Response,
  MalformedResponseBody,
  Json
> =>
  chainTaskEitherK<E | MalformedResponseBody, Response, Json>(
    resp => () =>
      resp.json().then(
        x => right(x as Json),
        () => {
          return left({ kind: 'MalformedResponseBody' })
        }
      )
  )

// export const blob = <E>(): Combinator<E, Response, E, Blob> =>
//   chainTaskEitherK(resp => () => resp.blob().then(x => right(x)))

export const text = <E>(): Combinator<E, Response, E, string> =>
  chainTaskEitherK(resp => () => resp.text().then(x => right(x)))

// export const formData = <E>(): Combinator<
//   E,
//   Response,
//   E,
//   FormData
// > => chainTaskEitherK(resp => () => resp.formData().then(x => right(x)))
