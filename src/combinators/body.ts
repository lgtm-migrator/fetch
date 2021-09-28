import type { Combinator, Config } from '..'
import type { Json } from 'fp-ts/Json'
import { flow } from 'fp-ts/function'
import { local } from 'fp-ts/ReaderTaskEither'
import { withHeaders } from './header'

type FormBlob = {
  blob: Blob
  filename?: string
}

const isFormBlob = (x: unknown): x is FormBlob => !!(x as FormBlob).blob

export const mkFormData = (form: Formable): FormData =>
  Object.entries(form).reduce((m, [k, v]) => {
    if (typeof v === 'string') {
      m.set(k, v)
    } else if (v instanceof Blob) {
      m.set(k, v)
    } else if (isFormBlob(v)) {
      m.set(k, v.blob, v.filename)
    } else {
      m.set(k, v.toString())
    }
    return m
  }, new FormData())

export type Formable = FormableK | FormableKV

type FormableK = Record<string, string | Blob | FormBlob>

type FormableKV = Record<
  string,
  string | Blob | FormBlob | { toString: () => string }
>

export const withForm = <E extends Error, A>(f: Formable): Combinator<E, A> =>
  local(
    ({ input, init }): Config => ({
      input,
      init: {
        body: mkFormData(f),
        ...init,
      },
    })
  )

export const withJSONBody = <E extends Error, A>(
  json: Json,
  // FIXME Overload
  // See https://github.com/microsoft/TypeScript/issues/26591
  // Maybe we could handle it manually
  replacer?: Parameters<typeof JSON.stringify>['1'],
  space?: Parameters<typeof JSON.stringify>['2']
): Combinator<E, A> =>
  local(({ input, init }) => ({
    input,
    init: {
      body: JSON.stringify(json, replacer, space),
      ...init,
    },
  }))

export const withJSON = <E extends Error, A>(
  json: Json,
  replacer?: Parameters<typeof JSON.stringify>['1'],
  space?: Parameters<typeof JSON.stringify>['2']
): Combinator<E, A> =>
  flow(
    withJSONBody(json, replacer, space),
    withHeaders({ 'Content-Type': 'application/json' })
  )

// export const withBlob = <E extends Error, A>(blob: Blob): Combinator<E, A> =>
//   local(({ input, init }) => ({
//     input,
//     init: {
//       body: blob,
//       ...init,
//     },
//   }))

// export const withArrayBuffer = <E extends Error, A>(
//   buf: ArrayBuffer
// ): Combinator<E, A> =>
//   local(({ input, init }) => ({
//     input,
//     init: {
//       body: buf,
//       ...init,
//     },
//   }))
