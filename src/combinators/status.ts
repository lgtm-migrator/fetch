import type { Combinator, ClientError, ServerError } from '..'
import { left, right } from 'fp-ts/Either'
import { chainEitherK } from 'fp-ts/ReaderTaskEither'

type NetworkError = ClientError | ServerError

export const guard = <E>(): Combinator<E, Response, NetworkError> =>
  chainEitherK<E | NetworkError, Response, Response>(resp => {
    if (resp.status >= 400 && resp.status < 500) {
      return left({ kind: 'ClientError', code: resp.status })
    } else if (resp.status >= 500) {
      return left({ kind: 'ServerError', code: resp.status })
    } else {
      return right(resp)
    }
  })
