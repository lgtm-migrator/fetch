[![codecov](https://codecov.io/gh/equt/fetch/branch/main/graph/badge.svg?token=EgscdLwP1m)](https://codecov.io/gh/equt/fetch)

> This repository is a fork of
> [`contactlab/appy`](https://github.com/contactlab/appy). `Req<A>` in appy is
> equal to `FetchM<Identity, A>` in this package.

## Installation

This package requires [`fp-ts`](https://github.com/gcanti/fp-ts) as its peer
dependency. You have to install it before using this package.

```sh
pnpm add fp-ts @equt/fetch
```

## Introduction

Check the monad type `FetchM` and the combinator type `Combinator`.

Some common combinators are provided in the [combinators](/src/combinators)
directory.

Use `runFetchM` just like `fetch` to get a `TaskEither`.

A basic use case would be

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

export type ErrorKind = 'Internal Error' | 'Timeout'

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
  asJSON(),

  // Decode the JSON into our type
  withDecoder(decoder),

  // Run the Monad
  runFetchM('https://example.com')
)
```

For more, see [examples](/src/examples).

## Compare to `@contactlab/appy`

- You could pass your custom error type down.
- Fined-grained control of `Response`,
  - Instead of always parsing `Response` body as `text`, parse it into anything
    you want.
  - Handle the request body even if the `Response.ok` is not `true`.
- Support more combinators.
