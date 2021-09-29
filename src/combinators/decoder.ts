import type { Combinator } from '..'
import { left, right } from 'fp-ts/Either'
import { chainTaskEitherK } from 'fp-ts/ReaderTaskEither'
import { z } from 'zod'

export type DecodeError = {
  kind: 'ZodDecodeError'
  error: z.ZodError
}

export const withDecoder = <E, S extends z.ZodTypeAny>(
  s: S,
  params?: Partial<z.ParseParamsNoData>
): Combinator<E, unknown, DecodeError, z.infer<S>> =>
  chainTaskEitherK<E | DecodeError, unknown, z.infer<S>>(
    x => () =>
      s.parseAsync(x, params).then(
        x => right(x),
        (error: unknown) =>
          left({ kind: 'ZodDecodeError', error: error as z.ZodError })
      )
  )
