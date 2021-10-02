import type { Combinator } from '..'
import { mapSnd } from 'fp-ts/Tuple'
import { rightIO, chain, chainFirst } from 'fp-ts/ReaderTaskEither'
import { withLocal } from './generic'
import { pipe } from 'fp-ts/function'

export const withSignal = <E, A>(signal: AbortSignal): Combinator<E, A> =>
  withLocal(mapSnd(x => ({ signal, ...x })))

export const withTimeout =
  <E, A>(miliseconds: number): Combinator<E, A> =>
  m => {
    const controller = new AbortController()

    return pipe(
      rightIO(() => setTimeout(() => controller.abort(), miliseconds)),
      chain(id =>
        pipe(
          m,
          withSignal<E, A>(controller.signal),
          chainFirst(() => rightIO(() => clearTimeout(id)))
        )
      )
    )
  }
