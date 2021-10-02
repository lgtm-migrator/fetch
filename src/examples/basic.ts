import type { Json } from 'fp-ts/lib/Json'
import type { Decoder } from '../combinators/generic'
import { mkRequest, runFetchM } from '..'
import { withMethod } from '../combinators/method'
import { withTimeout } from '../combinators/controller'
import { withJSON } from '../combinators/body'
import { asJSON } from '../combinators/parser'
import { withDecoder } from '../combinators/generic'
import { pipe } from 'fp-ts/function'

export type ErrorKind = 'Internal Error' | 'Timeout' | 'Decoder Error'

export type CreateUserResult = {
  succeeded: boolean
  redirection: string
}

declare const decoder: Decoder<Json, ErrorKind, CreateUserResult>

export const create = pipe(
  mkRequest((e: unknown): ErrorKind => {
    if (e instanceof DOMException) {
      return 'Timeout'
    } else {
      return 'Internal Error'
    }
  }),

  // Send the request as a `POST`
  withMethod('POST'),

  // Set request timeout to 3000
  withTimeout(3000),

  // Set the request body
  withJSON({
    name: 'John',
    password: 'ALWAYS_HAS_BEEN',
  }),

  // Parse the response body as JSON
  asJSON(),

  // Decode the JSON into our type
  withDecoder(decoder),

  // Run the Monad
  runFetchM('https://example.com')
)
