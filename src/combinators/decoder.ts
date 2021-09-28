import type { Combinator } from '../monad'
import { left, right } from 'fp-ts/Either'
import { chainTaskEitherKW } from 'fp-ts/ReaderTaskEither'
import { z } from 'zod'
import { unreachable } from '../utils'

export const withDecoder = <E extends Error, S extends z.ZodTypeAny>(
  s: S,
  params?: Partial<z.ParseParamsNoData>
): Combinator<E, unknown, z.ZodError, S> =>
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
