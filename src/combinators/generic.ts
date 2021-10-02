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

/**
 * Decode `A` to `B`, and might fail with `E`.
 *
 * @since 1.0.0
 */
export type Decoder<A, E, B> = ReaderEither<A, E, B>

/**
 * Use a {@link Decoder} as a combinator.
 *
 * @param decoder A {@link Decoder} to decodes `A` to `B`, and might fails with `E`.
 *
 * @since 1.0.0
 */
export const withDecoder = <E, A, B, F>(
  decoder: Decoder<A, F, B>
): Combinator<E, A, F, B> => pipe(decoder, chainEitherKW)

/**
 * Decode `A` to `B` asynchronously, and might fail with `E`.
 *
 * @since 1.0.0
 */
export type TaskDecoder<A, E, B> = ReaderTaskEither<A, E, B>

/**
 * Use a {@link TaskDecoder} as a combinator.
 *
 * @param decoder A {@link TaskDecoder} to decode `A` to `B` asynchronously, and might fail with `E`.
 *
 * @since 1.0.0
 */
export const withTaskDecoder = <E, A, B, F>(
  decoder: TaskDecoder<A, F, B>
): Combinator<E, A, F, B> => pipe(decoder, chainTaskEitherKW)

/**
 * Inspect the input `A`, and fails with `E`.
 *
 * @since 1.0.0
 */
export type Guardian<A, E> = Decoder<A, E, A>

/**
 * Use a {@link Guardian} as a combinator.
 *
 * @param guardian A {@link Guardian} to inspect the input `A`, and fails with `E`.
 *
 * @since 1.0.0
 */
export const withGuardian = <E, A, F>(
  guardian: Guardian<A, F>
): Combinator<E, A, F> => pipe(guardian, chainEitherKW)

/**
 * Change the Reader environment, but might fail.
 *
 * @since 1.0.0
 */
export type LocalEither<E> = Guardian<Config, E>

/**
 * Use a {@link LocalEither} as a combinator.
 *
 * @param localE A {@link LocalEither} change the Reader environment, but might fail.
 *
 * @since 1.0.0
 */
export const withLocalEither =
  <E, F, A>(localE: LocalEither<F>): Combinator<E, A, F> =>
  m =>
    pipe(
      ask<Config>(),
      chain<Config, F, Config, Config>(flow(localE, fromEither)),
      chainW(x =>
        pipe(
          m,
          local(() => x)
        )
      )
    )

/**
 * Type alias for {@link local}.
 *
 * @since 1.0.0
 */
export const withLocal = local
