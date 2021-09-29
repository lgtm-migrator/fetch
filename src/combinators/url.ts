import { local } from 'fp-ts/ReaderTaskEither'
import type { Combinator } from '..'

export const withBaseURL = <E, A>(url?: URL | string): Combinator<E, A> =>
  local(({ input, init }) => ({
    init,
    input: new URL(input, url).href,
  }))
