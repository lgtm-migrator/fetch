import type { Combinator } from '..'
import { left, right } from 'fp-ts/Either'
import { chainTaskEitherKW } from 'fp-ts/ReaderTaskEither'
import { z } from 'zod'

export const withDecoder = <E, S extends z.ZodTypeAny>(
  s: S,
  params?: Partial<z.ParseParamsNoData>
): Combinator<E, unknown, z.ZodError, z.infer<S>> =>
  chainTaskEitherKW(
    x => () =>
      s.parseAsync(x, params).then(
        x => right(x),
        (e: unknown) => left(e as z.ZodError)
      )
  )
