![codecov](https://badgen.net/codecov/c/github/equt/fetch)
[![npm](https://badgen.net/npm/v/@equt/fetch)](https://www.npmjs.com/package/@equt/fetch)

```typescript
type Error = 'InternalError' | 'ServerError'

const base = pipe(
  mkRequest((): Error => 'InternalError'),
  withBaseURL(process.env.BASE_URL, (): Error => 'InternalError'),
  withTimeout(3_000),
  asJSON((): Error => 'ServerError')
)

export const createUser = (username: string, password: string) =>
  pipe(
    base,
    withMethod('POST'),
    withJSON({
      username,
      password,
    }),
    runFetchM('user')
  )

export const getUserAvatar = (username: string, size: string = '1x') =>
  pipe(
    base,
    withURLSearchParams({
      username,
      size,
    }),
    runFetchM('avatar')
  )

export const authorized = pipe(
  base,
  withHeaders({
    Authorization: `Bearer SECRETS`,
  })
)

export const listCollection =
  (cursor: number, size: number = 10) =>
  (collection: string) =>
    pipe(
      authorized,
      withURLSearchParams({
        collection,
        cursor,
        size,
      }),
      runFetch('collection')
    )
```

In addition to all the features provided by
[`contactlab/appy`](https://github.com/contactlab/appy), this package

- Support custom error type `E`, instead of just providing
  [two built-in error types](https://github.com/contactlab/appy/blob/c65d49b652221eba3009b32a88c7a22d9b6d2364/src/request.ts#L60).
- Full access to `Response`, instead of directly parsing into `string`
  (`contactlab/appy`
  [instead](https://github.com/contactlab/appy/blob/c65d49b652221eba3009b32a88c7a22d9b6d2364/src/request.ts#L123)
  forced you to parse everything into a `string`, even for `JSON` and binary
  data format).
- Choose to continue the procedure without an error if the `Response.ok` is
  `false` (`contactlab/appy`
  [instead](https://github.com/contactlab/appy/blob/c65d49b652221eba3009b32a88c7a22d9b6d2364/src/request.ts#L116-L121)
  only allows you to handle an ok `Response`)
- A neat helper `runFetchM` to run the Monad instance, accepting the same
  parameters just like the plain `fetch` function,
  [no more unexpected pair type](https://github.com/contactlab/appy/blob/c65d49b652221eba3009b32a88c7a22d9b6d2364/README.md#L44-L51).
- More useful combinators
  - `withBaseURL` to set a base URL
  - `withForm` to set the `Request` to a `FormData`, and could be built from
    arbitrary valid `Record`
  - Also combinators to handle `Request` & `Response` body in binary format
- Minor changes
  - Combinator setting the `JSON` `Request` body will automatically set a
    corresponding `Content-Type` header
