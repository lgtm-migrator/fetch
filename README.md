![codecov](https://badgen.net/codecov/c/github/equt/fetch)
[![npm](https://badgen.net/npm/v/@equt/fetch)](https://www.npmjs.com/package/@equt/fetch)

> This repository starts from a fork of
> [`contactlab/appy`](https://github.com/contactlab/appy). See the
> [compare to `@contactlab/appy`](#compare-to-contactlabappy) section for the
> difference.

## Introduction

**TLDR** We could abstract the process of fetching data (building `Request` and
handling `Response`) as a Monad, and everything now could be expressed as a
transition from one Monad to another.

`FetchM<E, A>` is the core of this package, it is a Monad that

- either returns type `A` after `runFetchM`,
- or fails with type `E` once the first error occurs.

A combinator `Combinator<E, A, F, B>` is simply an alias of function
`FetchM<E, A> => FetchM<F = E, B = A>`.

With the above two types, the `pipe` function provided by the peer dep `fp-ts`,
and many combinators setting inside the [`combinators`](/src/combinators)
directory, we could now write our `Request` building & `Response` handling logic
like

```typescript
import type { Json } from 'fp-ts/lib/Json'
import type { Decoder } from '../combinators/generic'
import { mkRequest, runFetchM } from '..'
import { withMethod } from '../combinators/method'
import { withTimeout } from '../combinators/controller'
import { withJSON } from '../combinators/body'
import { asJSON } from '../combinators/parser'
import { withDecoder } from '../combinators/generic'
import { pipe } from 'fp-ts/function'

export type ErrorKind = 'Internal Error' | 'Timeout' | 'Respone Syntax Error'

export type CreateUserResult = {
  succeeded: boolean
  redirection: string
}

declare const decoder: Decoder<Json, ErrorKind, CreateUserResult>

export const create = pipe(
  mkRequest((): ErrorKind => 'Internal Error'),

  // Send the request as a `POST`
  withMethod('POST'),

  // Set request timeout to 3000
  withTimeout(3000, (): ErrorKind => 'Timeout'),

  // Set the request body
  withJSON({
    name: 'John',
    password: 'ALWAYS_HAS_BEEN',
  }),

  // Parse the response body as JSON
  asJSON((): ErrorKind => 'Response Syntax Error'),

  // Decode the JSON into our type
  withDecoder(decoder),

  // Run the Monad
  runFetchM('https://example.com')
)
```

The intuitive and declarative pipeline structure illustrates the logical flow of
the communication between the client and the server. Errors now could be easily
handled within your context, and the type of the error is totally defined by
yourself.

The `create` function defined above will give you a
`TaskEither<ErrorKind, CreateUserResult>`, you could continue applying
transformations upon the right value using packages like `monocle-ts`, or notify
the user with the left value and send log report back to your server.

## Installation

This package requires [`fp-ts`](https://github.com/gcanti/fp-ts) as its peer
dependency. You have to install it before using this package.

```sh
pnpm add fp-ts @equt/fetch
```

## Compare to `@contactlab/appy`

- You could pass your custom error type down.
- Fined-grained control of `Response`,
  - Instead of parsing `Response` body as `text`, parse it into anything you
    want.
  - Handle the request body even if the `Response.ok` is not `true`.
- Support more combinators like `withForm`, `withBlob`, `withBaseURL`, etc.
