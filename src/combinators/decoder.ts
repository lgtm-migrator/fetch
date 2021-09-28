import type { Combinator } from '../monad'
import { pipe } from 'fp-ts/function'
import { left, right } from 'fp-ts/Either'
import { chainTaskEitherKW } from 'fp-ts/ReaderTaskEither'
import { z } from 'zod'
import { unreachable } from '../utils'

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
