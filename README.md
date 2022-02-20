![codecov](https://badgen.net/codecov/c/github/equt/fetch)
[![npm](https://badgen.net/npm/v/@equt/fetch)](https://www.npmjs.com/package/@equt/fetch)

This package wraps the
[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) using
[`fp-ts`](https://github.com/gcanti/fp-ts), a functional programming library in
TypeScript, allowing you to build up request & parse response progressively.

This package is inspired by the
[`contactlab/appy`](https://github.com/contactlab/appy). See [this
section](#Differences between `contactlab/appy`) for more details.

## Introduction

The following few sections introduce the most important features of this
package. Even readers without experience of `fp-ts` should be able to
understand.

### Combinators

This package provides some common functions, e.g., `withHeaders` and `asJSON`,
to allow you both to modify the request as well as parse the response. This
request-response pattern is made possible by the `pipe` function provided by
`fp-ts`, which mimics the pipe operator in many other languages (or `.` in
Haskell).

These functions, known as `Combinator`s, either change how the request should be
built up, or tell the response how it could get parsed. Comparing to the
middleware solution, this fully utilizes the type system, i.e., where has been
modified and what should be expected is now completely reflected in the type
signature, without having to dive into the source code and worrying about side
effects.

For example, the following code snippet sets an `Authorization` header, add
user's id as a search parameter, and parse the response body into JSON.

```ts
import { request } from '@equt/fetch'
import {
  asJSON,
  withHeaders,
  withURLSearchParams,
} from '@equt/fetch/combinators'

const getUserProfile = pipe(
  request,
  withHeaders({
    Authorization: `BEARER ${user.access_token}`,
  }),
  withURLSearchParams({
    id: user.id,
  }),
  asJSON(),
)
```

### Error Handling

Any built-in combinator that could throw in its context provides an optional
parameter named `mapError`, this allows you to handle the error right in that
combinator. Instead of throwing directly, you transforms it into whatever you
want, e.g., notify the UI to show a toast for a timeout request.

Leaving that parameter undefined implicitly tells the combinator to throw the
error, just like what we've done above. To create a more _safe_ one, we could
rewrite it into the following form

```ts
import { mkRequest } from '@equt/fetch'
import {
  asJSON,
  withHeaders,
  withURLSearchParams,
} from '@equt/fetch/combinators'

type Err = 'NETWORK_ERROR' | 'MALFORMED_JSON'

const getUserProfile = pipe(
  mkRequest((): Err => 'NETWORK_ERROR'),
  withHeaders({
    Authorization: `BEARER ${user.access_token}`,
  }),
  withURLSearchParams({
    id: user.id,
  }),
  asJSON((): Err => 'MALFORMED_JSON'),
)
```

Since we've explicitly told what to do with all the possible errors, the
`getUserProfile` now **never throws an error**.

### Execution

The request-response pipeline will not be executed until we run it manually.
This could be done by the provided `runFetchM` and its variants, they all accept
the same parameters just like the `fetch` function.

```ts
import { mkRequest, runFetchMFlippedP } from '@equt/fetch'
import {
  asJSON,
  withHeaders,
  withURLSearchParams,
} from '@equt/fetch/combinators'

type Err = 'NETWORK_ERROR' | 'MALFORMED_JSON'

const getUserProfile = pipe(
  mkRequest((): Err => 'NETWORK_ERROR'),
  withHeaders({
    Authorization: `BEARER ${user.access_token}`,
  }),
  withURLSearchParams({
    id: user.id,
  }),
  asJSON((): Err => 'MALFORMED_JSON'),
  runFetchMFlippedP,
)
```

Now `getUserProfile` is of the type
`(input: string) => Promise<Either<Err, Json>>`, indicating you'll either get an
error of type `Err`, or a valid JSON object.

### Laziness

Sometimes, values might not be ready when constructing the request, e.g., `user`
might not available when building up the `getUserProfile`. Or, if you're using
the `useState` hook from React (Reactivity API for Vue 3 users), you will always
want to use the latest value instead of the one when defining the pipeline.

Almost all combinators provided by this library accept lazy values. So we could
rewrite `getUserProfile` into

```ts
import { mkRequest, runFetchMFlippedP } from '@equt/fetch'
import {
  asJSON,
  withHeaders,
  withURLSearchParams,
} from '@equt/fetch/combinators'

type Err = 'NETWORK_ERROR' | 'MALFORMED_JSON'

const getUserProfile = pipe(
  mkRequest((): Err => 'NETWORK_ERROR'),
  withHeaders(() => ({
    Authorization: `BEARER ${user.access_token}`,
  })),
  withURLSearchParams(() => ({
    id: user.id,
  })),
  asJSON((): Err => 'MALFORMED_JSON'),
  runFetchMFlippedP,
)
```

### Code Reusing

We could write more APIs just like `getUserProfile`, and we'll soon find out
some common patterns shared among them, e.g., `withHeaders` that set user's
authorization code, which could be reused in the whole codebase.

This could be easily done by moving the `withHeaders` into a standalone
function.

```ts
import type { Combinator } from '@equt/fetch'

const withAuthorization = <E, A>(token: string): Combinator<E, A> =>
  withHeaders({
    Authorization: `BEARER ${token}`,
  })
```

Congrats, you've created your first combinator. This combinator doesn't change
anything in the type level, i.e., neither changes the response `A` from the
previous combinator's output, nor changes the possible error type.

## Advanced Topics

### Differences between `contactlab/appy`

This package could be viewed as a fork of `contactlab/appy` but with some
opinionated enhancements.

The main problem of `appy` is forcing the user to adapt the only two error types
built inside, and this makes the `Either` type completely no sense. Due to being
a superset of JavaScript, TypeScript lacks tons of modern features, but with a
custom type, user can create a discriminated union and using the `switch` to
mimic the pattern matching.

Another weird decision is `appy` parses response into a string, and always throw
an error when the response status is not 200. This package instead allows you to
parse the response body into whatever you want, and let you determine what to do
on different status code using the combinator `ensureStatus`.

This package also allows some combinators be called multiple times. Combinators
like `withHeaders`, `withForm`, and `withURLSearchParams` will merge the new
values into the old one, which is more intuitive in my opinion.

Considering the changeset is relatively large, I rewrote it from scratch.
