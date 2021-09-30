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
import { asJSON } from '@equt/fetch/combinators/parser'
import { withBaseURL } from '@equt/fetch/combinators/url'
import { pipe, absurd, identity } from 'fp-ts/function'
import { match } from 'fp-ts/TaskEither'

const createUser = pipe(
  // Send the request with POST method
  post,

  // Set the base URL from env
  withBaseURL(process.env.HOST),

  // Set the Request body to JSON
  withJSON({ mail: 'admin@example.com', password: 'ALWAYS_HAS_BEEN' }),

  // Parse the Response Body as JSON format
  asJSON(),

  // Run the Monad at `user` endpoint
  runFetchM('user'),

  // Error handling
  match(e => {
    switch (e.kind) {
      case 'MalformedRequest':
        // ...
        break
      case 'MalformedResponseBody':
        // ...
        break
      default:
        absurd(e)
    }
    return 'https://example.com/help'
  }, identity)
)
```

## Comparing to `@contactlab/appy`

- `@equt/fetch` allows you to specify your `fetch` instance, and of course it'll
  use the global fetch by default (https://github.com/contactlab/appy/pull/325)
- `@equt/fetch` provides a bear bone `request` comparing to appy's one. This is
  extremely helpful if you want to parse Request Body into Blob or Stream, and
  also handle Body if `Response.ok` is not true.
  (https://github.com/contactlab/appy/issues/322)
- `@equt/fetch` allows you to pass your own error down, and has no limitation on
  your error type.
