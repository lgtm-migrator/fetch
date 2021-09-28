import type { Option } from 'fp-ts/Option'
import type { Combinator } from '../monad'
import { pipe } from 'fp-ts/function'
import { foldW } from 'fp-ts/Option'
import { left, right } from 'fp-ts/Either'
import { chainEitherKW } from 'fp-ts/ReaderTaskEither'

export const guard = <E1 extends Error, E2 extends Error>(
  predicate: (n: number) => Option<E2>
): Combinator<E1, Response, E1 | E2> =>
  chainEitherKW(resp =>
    pipe(
      predicate(resp.status),
      foldW(
        () => right(resp),
        e => left(e)
      )
    )
  )
