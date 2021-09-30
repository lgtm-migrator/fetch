import type { Combinator, MalformedResponseBody } from '..'
import type { Json } from 'fp-ts/Json'
import { left, right } from 'fp-ts/Either'
import { chainTaskEitherK } from 'fp-ts/ReaderTaskEither'
import { flow } from 'fp-ts/function'
import { withHeaders } from './header'

export const asJSON = <E>(): Combinator<
  E,
  Response,
  MalformedResponseBody,
  Json
> =>
  flow(
    withHeaders({ Accept: 'application/json' }),
    chainTaskEitherK<E | MalformedResponseBody, Response, Json>(
      resp => () =>
        resp.json().then(
          x => right(x as Json),
          () => {
            return left({ kind: 'MalformedResponseBody' })
          }
        )
    )
  )

export const asBlob = <E>(MIME: string): Combinator<E, Response, E, Blob> =>
  flow(
    withHeaders({ Accept: MIME }),
    chainTaskEitherK(resp => () => resp.blob().then(x => right(x)))
  )

export const asText = <E>(): Combinator<E, Response, E, string> =>
  flow(
    withHeaders({ Accept: 'text/plain' }),
    chainTaskEitherK(resp => () => resp.text().then(x => right(x)))
  )
