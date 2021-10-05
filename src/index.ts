import type { ReaderTaskEither } from 'fp-ts/ReaderTaskEither'
import type { TaskEither } from 'fp-ts/TaskEither'
import { tryCatch } from 'fp-ts/TaskEither'
import { tupled } from 'fp-ts/function'
import { snd } from 'fp-ts/Tuple'

/**
 * {@link FetchM} Monad Environment.
 *
 * This is the same as the parameters of the {@link fetch} function.
 *
 * @since 1.0.0
 */
export type Config = [string, RequestInit]

/**
 * Main Monad of this package. The stack contains
 *
 * - A {@link Reader} of {@link Config}
 * - A {@link TaskEither} represents an asynchronous computation which can yield result `A` or raise an Error of type `E` eventually.
 *
 * @since 1.0.0
 */
export type FetchM<E, A> = ReaderTaskEither<Config, E, A>

/**
 * An mapping from type `S` to an arbitrary error type `E`.
 *
 * @since 1.0.0
 */
export type MapError<E, S = unknown> = (s: S) => E

/**
 * A built-in instance for {@link MapError}.
 *
 * @param e Arbitrary data to be thrown as an {@link Error}
 *
 * @since 1.0.0
 */
export const bail: MapError<never> = e => {
  if (e instanceof Error) {
    throw e
  } else {
    throw new Error(`${e}`)
  }
}

/**
 * Transform from one {@link FetchM} to another {@link FetchM}.
 *
 * Previous errors will be preserved.
 *
 * @since 1.0.0
 */
export type Combinator<E1, A, E2 = E1, B = A> = (
  m: FetchM<E1, A>
) => FetchM<E2 | E1, B>

/**
 * Create an instance of {@link FetchM} by providing how to map possible errors and optional {@link fetch} implementation.
 *
 * @param mapError An instance of {@link MapError}
 * @param fetchImpl An implementation of {@link fetch}
 * @returns An instance of {@link FetchM}
 *
 * @since 1.0.0
 */
export const mkRequest =
  <E>(mapError: MapError<E>, fetchImpl?: typeof fetch): FetchM<E, Response> =>
  r =>
    tryCatch(
      () => tupled(fetchImpl ?? fetch)(r),
      e => {
        // For two controller combinators, a.k.a., withSignal & withTimeout, we could have
        // two `MapError` passed in. But that is technically not even possible, since the
        // abortion error is raised only when the `fetch` Promise is getting resolved.
        // The trick here is we abuse the reader env to pass the `MapError` down, and when
        // resolving the `fetch` Promise, we search for that special key. So on the user side,
        // it seems like the error handling part `MapError` is right inside the combinator.

        type ExtendedRequestInit = RequestInit & {
          _ABORT_MAP_ERROR: MapError<unknown>
        }

        const init = snd(r)
        if (
          // If the key exists, indicating user has used either of two controller combinators
          (init as ExtendedRequestInit)._ABORT_MAP_ERROR &&
          // and not that the DOMException error only raises on abortion.
          e instanceof DOMException
        ) {
          // We cast the error into `E` to satisfy the compiler, but we know we have set the correct
          // error type in the combinator itself, so the error type union must contains the right
          // type.
          return (init as ExtendedRequestInit)._ABORT_MAP_ERROR(e) as E
        }
        return mapError(e)
      }
    )

/**
 * A special instance of {@link FetchM} which always {@link bail}s errors and utilizes global {@link fetch}.
 *
 * @since 1.0.0
 */
export const request = mkRequest(bail)

/**
 * Run the main Monad {@link FetchM}.
 *
 * This is the same as calling {@link fetch} function, or the Monad {@link FetchM} itself.
 *
 * @param input URL
 * @param init Request init {@link RequestInit}
 * @returns The result {@link TaskEither}
 *
 * @since 1.0.0
 */
export const runFetchM =
  (input: string, init?: RequestInit) =>
  <E, A>(m: FetchM<E, A>): TaskEither<E, A> =>
    m([input, init ?? {}])
