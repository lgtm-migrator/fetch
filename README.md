![codecov](https://badgen.net/codecov/c/github/equt/fetch)
[![npm](https://badgen.net/npm/v/@equt/fetch)](https://www.npmjs.com/package/@equt/fetch)

> This repository starts from a fork of
> [`contactlab/appy`](https://github.com/contactlab/appy). See the
> [compare to `@contactlab/appy`](#compare-to-contactlabappy) section for the
> difference.

## Introduction

We could abstract the process of fetching data (building `Request` and handling
`Response`) as a Monad, and actions like setting body or adding header could be
now expressed as a transition from one Monad to another.

### Core

`FetchM<E, A>` is the core of this package, it is a Monad that

- either returns type `A` on succeeded,
- or fails with type `E` once the first error occurs.

Internally, the Monad maintains an environment describing how the `Request`
should be built. A combinator `Combinator<E, A, F, B>` is simply an alias of
function `FetchM<E, A> => FetchM<F = E, B = A>`. Each combinator changes the
local environment or transforms the `Response` object.

### Basic Example

With the above two types, the `pipe` function provided by the peer dep `fp-ts`,
and many combinators sitting inside the [`combinators`](/src/combinators)
directory, we could now write our `Request` building & `Response` handling logic
like

```typescript
import type { Json } from 'fp-ts/lib/Json'
import type { Decoder } from '@equt/fetch/combinators/generic'
import { mkRequest, runFetchM } from '@equt/fetch'
import { withMethod } from '@equt/fetch/combinators/method'
import { withTimeout } from '@equt/fetch/combinators/controller'
import { withJSON } from '@equt/fetch/combinators/body'
import { asJSON } from '@equt/fetch/combinators/parser'
import { withDecoder } from '@equt/fetch/combinators/generic'
import { pipe } from 'fp-ts/function'

export type ErrorKind =
  | 'Internal Error'
  | 'Timeout'
  | 'Response Syntax Error'
  | 'Decode Error'

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
handled within context, and the type of the error is defined by yourself.

The `create` function defined above will give you a
`TaskEither<ErrorKind, CreateUserResult>`, you could continue applying
transformations upon the right value using packages like `monocle-ts`, or notify
the user with the left value and send log report back to your server.

### Do Not Repeat Yourself

Since function composition satisfies the associativity law, you could always
split the above function into multiple parts.

You may like to define a global pattern like

```typescript
import { request } from '@equt/fetch'
import { withBaseURL } from '@equt/fetch/combinators/url'
import { withMethod } from '@equt/fetch/method'
import { withTimeout } from '@equt/fetch/controller'
import { withHeader } from '@equt/fetch/header'
import { pipe } from 'fp-ts/function'

declare const TOKEN: string

export const api = pipe(
  request,
  withBaseURL(process.env.API_HOST),
  withMethod('POST'),
  withTimeout(3000),
  withHeader({ Authorization: `Bearer ${TOKEN}` })
)
```

The above code defines a generic client for all requests inside the codebase.
Put it in your project once, and use it everywhere, so every request will share
the `Authorization` header and the timeout settings immediately.

The combinator coming later will overwrite or merge the previous one, so you
could change the HTTP method specifically.

```typescript
import { withURLSearchParams } from '@equt/fetch/combinators/url'
import { withMethod } from '@equt/fetch/method'
import { pipe } from 'fp-ts/function'
import { api } from 'lib'

export const detail = pipe(
  // Reuse the API settings above
  api,

  // Overwrite the HTTP method
  withMethod('GET'),

  // Add search params
  withURLSearchParams({ id: 1 })
)
```

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

<sub>LICENSE [MIT] • Author [@equt] • Issue [New]</sub>

[mit]: ./LICENSE.md
[@equt]: https://github.com/equt
[new]: https://github.com/equt/fetch/issues/new
