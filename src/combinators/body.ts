import type { Combinator } from '..'
import type { Json } from 'fp-ts/Json'
import { flow } from 'fp-ts/function'
import { mapSnd } from 'fp-ts/Tuple'
import { withHeaders } from './header'
import { withLocal } from './generic'

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

export const withForm = <E, A>(f: Formable): Combinator<E, A> =>
  withLocal(mapSnd(x => ({ body: mkFormData(f), ...x })))

export const withJSONBody = <E, A>(
  json: Json,
  replacer?: (
    this: unknown,
    key: string,
    value: unknown
  ) => unknown | (number | string)[] | null,
  space?: Parameters<typeof JSON.stringify>['2']
): Combinator<E, A> =>
  withLocal(
    mapSnd(x => ({ body: JSON.stringify(json, replacer, space), ...x }))
  )

export const withJSON = <E, A>(
  json: Json,
  replacer?: (
    this: unknown,
    key: string,
    value: unknown
  ) => unknown | (number | string)[] | null,
  space?: Parameters<typeof JSON.stringify>['2']
): Combinator<E, A> =>
  flow(
    withHeaders({ 'Content-Type': 'application/json' }),
    withJSONBody(json, replacer, space)
  )

export const withBlob = <E extends Error, A>(blob: Blob): Combinator<E, A> =>
  withLocal(mapSnd(x => ({ body: blob, ...x })))
