import type { Combinator } from '..'
import type { Json } from 'fp-ts/Json'
import { local } from 'fp-ts/ReaderTaskEither'
import { flow } from 'fp-ts/function'
import { mapSnd } from 'fp-ts/Tuple'
import { withHeaders } from './header'

type FormBlob = {
  blob: Blob
  filename?: string
}

/**
 * Create a {@link FormData} from a form like object {@link Formable}.
 *
 * @param form Form like object {@link Formable}
 * @returns Form Data {@link FormData}
 *
 * @since 1.1.0
 */
export const mkFormData = (form: Formable): FormData =>
  Object.entries(form).reduce((m, [k, v]) => {
    if (typeof v === 'string') {
      m.set(k, v)
    } else if (v instanceof Blob) {
      m.set(k, v)
    } else {
      m.set(k, v.blob, v.filename)
    }
    return m
  }, new FormData())

/**
 * Form like object.
 *
 * @since 1.1.0
 */
export type Formable = Record<string, string | Blob | FormBlob>

/**
 * Set the request body as {@link FormData}.
 *
 * @param f Form like object {@link Formable}
 *
 * @since 1.1.0
 */
export const withForm = <E, A>(f: Formable): Combinator<E, A> =>
  local(mapSnd(x => ({ body: mkFormData(f), ...x })))

/**
 * Set the request body as JSON.
 *
 * @param json JSON like object {@link Json}
 * @param replacer The replacer parameter in {@link JSON.stringify}
 * @param space The space parameter in {@link JSON.stringify}
 *
 * Note, this combinator will not set `Content-Type` header automatically.
 * You should use the {@link withJSON} combinator if that behavior is desired.
 *
 * @since 1.0.0
 */
export const withJSONBody = <E, A>(
  json: Json,
  replacer?: (
    this: unknown,
    key: string,
    value: unknown
  ) => unknown | (number | string)[] | null,
  space?: Parameters<typeof JSON.stringify>['2']
): Combinator<E, A> =>
  local(mapSnd(x => ({ body: JSON.stringify(json, replacer, space), ...x })))

/**
 * Set the request body as JSON.
 *
 * @param json JSON like object {@link Json}
 * @param replacer The replacer parameter in {@link JSON.stringify}
 * @param space The space parameter in {@link JSON.stringify}
 *
 * Note, this combinator will set `Content-Type` header automatically.
 * You could use the {@link withJSONBody} combinator if this behavior is not desired.
 *
 * @since 1.0.0
 */
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

/**
 * Set the request body as Blob.
 *
 * @param blob Data in {@link Blob}
 * @param contentType MIME
 *
 * @since 1.0.0
 */
export const withBlob = <E extends Error, A>(
  blob: Blob,
  contentType: string
): Combinator<E, A> =>
  flow(
    withHeaders({ 'Content-Type': contentType }),
    local(mapSnd(x => ({ body: blob, ...x })))
  )
