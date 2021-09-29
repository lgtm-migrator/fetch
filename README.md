[![codecov](https://codecov.io/gh/equt/fetch/branch/main/graph/badge.svg?token=EgscdLwP1m)](https://codecov.io/gh/equt/fetch)

> This repository is a fork of https://github.com/contactlab/appy. `Req<A>` in
> appy is equal to `fetchM<Identity, A>` in this package.

## Installation

This package requires [`fp-ts`](https://github.com/gcanti/fp-ts) as its peer
dependency. You have to install it before using this package.

```sh
pnpm add fp-ts @equt/fetch
```

## Introduction

Check the monad type `fetchM` and the combinator type `Combinator`.

Some common combinators are provided in the [combinators](/src/combinators)
directory.

Use `runFetchM` just like `fetch`, and you will get `TaskEither` as you wish.

A request now would look like

```typescript
import { post, runFetchM } from '@equt/fetch'
import { withJSON } from '@equt/fetch/combinators/body'
import { withDecoder } from '@equt/fetch/combinators/decoder'
import { json } from '@equt/fetch/combinators/parser'
import { withBaseURL } from '@equt/fetch/combinators/url'
import { pipe, absurd } from 'fp-ts/function'
import { match } from 'fp-ts/TaskEither'
import { z } from 'zod'

const createUser = pipe(
  // Send the request with POST method
  post,

  // Set the base URL from env
  withBaseURL(import.meta.env.BASE_URL),

  // Set the Request body to JSON
  withJSON({ mail: 'admin@example.com', password: 'ALWAYS_HAS_BEEN' }),

  // Parse the Response Body as JSON format
  json(),

  // Decode the Response Body JSON to a type
  withDecoder(
    z.object({
      redirect: z.string().url(),
    })
  ),

  // Run the Monad at `user` endpoint
  runFetchM('user'),

  // Error handling
  match(
    e => {
      switch (e.kind) {
        case 'MalformedRequest':
          // ...
          break
        case 'MalformedResponseBody':
          // ...
          break
        case 'ZodDecodeError':
          // ...
          break
        default:
          absurd(e)
      }
      return 'https://example.com/help'
    },
    ({ redirect }) => redirect
  )
)
```
