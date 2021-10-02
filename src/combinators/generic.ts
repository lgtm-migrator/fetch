import type { ReaderTaskEither } from 'fp-ts/ReaderTaskEither'
import type { ReaderEither } from 'fp-ts/ReaderEither'
import type { Combinator, Config } from '..'
import {
  chainEitherKW,
  chainTaskEitherKW,
  ask,
  local,
  chain,
  chainW,
  fromEither,
} from 'fp-ts/ReaderTaskEither'
import { pipe, flow } from 'fp-ts/lib/function'

export type Decoder<A, E, B> = ReaderEither<A, E, B>

export const withDecoder = <E, A, B, F>(
  decoder: Decoder<A, F, B>
): Combinator<E, A, F, B> => pipe(decoder, chainEitherKW)

export type TaskDecoder<A, E, B> = ReaderTaskEither<A, E, B>

export const withTaskDecoder = <E, A, B, F>(
  decoder: TaskDecoder<A, F, B>
): Combinator<E, A, F, B> => pipe(decoder, chainTaskEitherKW)

export type Guardian<A, E> = Decoder<A, E, A>

export const withGuardian = <E, A, F>(
  guardian: Guardian<A, F>
): Combinator<E, A, F> => pipe(guardian, chainEitherKW)

export type LocalEither<E> = Guardian<Config, E>

export const withLocalEither =
  <E, F, A>(modifier: LocalEither<F>): Combinator<E, A, F> =>
  m =>
    pipe(
      ask<Config>(),
      chain<Config, F, Config, Config>(flow(modifier, fromEither)),
      chainW(x =>
        pipe(
          m,
          local(() => x)
        )
      )
    )

export const withLocal = local
