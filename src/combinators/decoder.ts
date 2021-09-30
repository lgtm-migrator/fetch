import { chainEitherK } from 'fp-ts/ReaderTaskEither'
import type { ReaderEither } from 'fp-ts/ReaderEither'
import type { Combinator } from '..'
import { pipe } from 'fp-ts/lib/function'

export type Decoder<A, E, B> = ReaderEither<A, E, B>

export const withDecoder = <E, A, B, DecodeError>(
  decoder: Decoder<A, E, B>
): Combinator<E, A, DecodeError, B> => pipe(decoder, chainEitherK)
