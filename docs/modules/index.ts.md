---
title: index.ts
nav_order: 10
parent: Modules
---

## index overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [mkRequest](#mkrequest)
  - [request](#request)
- [destructors](#destructors)
  - [runFetchM](#runfetchm)
  - [runFetchMFlipped](#runfetchmflipped)
  - [runFetchMFlippedP](#runfetchmflippedp)
  - [runFetchMFlippedPT](#runfetchmflippedpt)
  - [runFetchMFlippedPTL](#runfetchmflippedptl)
  - [runFetchMP](#runfetchmp)
  - [runFetchMPT](#runfetchmpt)
  - [runFetchMPTL](#runfetchmptl)
- [error handlers](#error-handlers)
  - [bail](#bail)
- [types](#types)
  - [Combinator (type alias)](#combinator-type-alias)
  - [Config (type alias)](#config-type-alias)
  - [FetchM (type alias)](#fetchm-type-alias)
  - [InspectError (type alias)](#inspecterror-type-alias)
  - [InspectReturn (type alias)](#inspectreturn-type-alias)
  - [MapError (type alias)](#maperror-type-alias)

---

# constructors

## mkRequest

Create an instance of [`FetchM`](#fetchm-type-alias) by providing how to map possible errors and optional `fetch` implementation.

**Signature**

```ts
export declare const mkRequest: <E>(
  mapError: MapError<E, unknown>,
  fetchImpl?: typeof fetch | undefined
) => FetchM<E, Response>
```

Added in v1.0.0

## request

A special instance of [`FetchM`](#fetchm-type-alias) which always [`bail`](#bail)s errors and utilizes global `fetch`.

**Signature**

```ts
export declare const request: FetchM<never, Response>
```

Added in v1.0.0

# destructors

## runFetchM

Run the main Monad [`FetchM`](#fetchm-type-alias).

This is the same as calling `fetch` function, or the Monad [`FetchM`](#fetchm-type-alias) itself.

**Signature**

```ts
export declare const runFetchM: <E, A>(
  input: string,
  init?: RequestInit | undefined
) => (m: FetchM<E, A>) => TaskEither<E, A>
```

Added in v1.0.0

## runFetchMFlipped

The flipped version of [`runFetchM`](runfetchm).

**Signature**

```ts
export declare const runFetchMFlipped: <E, A>(
  m: FetchM<E, A>
) => (input: string, init?: RequestInit | undefined) => TaskEither<E, A>
```

Added in v2.7.0

## runFetchMFlippedP

Call [`runFetchMFlipped`](#runfetchmflipped) returned `TaskEither` to produce a `Promise`.

**Signature**

```ts
export declare const runFetchMFlippedP: <E, A>(
  m: FetchM<E, A>
) => (input: string, init?: RequestInit | undefined) => Promise<Either<E, A>>
```

Added in v2.9.0

## runFetchMFlippedPT

Throw the left value from [`runFetchMFlippedP`](#runfetchmflippedpt).

**Signature**

```ts
export declare const runFetchMFlippedPT: <E, A>(
  m: FetchM<E, A>
) => (input: string, init?: RequestInit | undefined) => Promise<A>
```

Added in v2.9.0

## runFetchMFlippedPTL

Lazy version of [`runFetchMFlippedP`](#runfetchmflippedp).

**Signature**

```ts
export declare const runFetchMFlippedPTL: <E, A>(
  m: FetchM<E, A>
) => (input: string, init?: RequestInit | undefined) => () => Promise<A>
```

Added in v2.15.0

## runFetchMP

Call [`runFetchM`](#runfetchm) returned `TaskEither` to produce a `Promise`.

**Signature**

```ts
export declare const runFetchMP: <E, A>(
  input: string,
  init?: RequestInit | undefined
) => (m: FetchM<E, A>) => Promise<Either<E, A>>
```

Added in v2.11.0

## runFetchMPT

Throw the left value from [`runFetchMP`](#runfetchmp).

**Signature**

```ts
export declare const runFetchMPT: <E, A>(
  input: string,
  init?: RequestInit | undefined
) => (m: FetchM<E, A>) => Promise<A>
```

Added in v2.11.0

## runFetchMPTL

Lazy version of [`runFetchMPT`](#runfetchmpt).

**Signature**

```ts
export declare const runFetchMPTL: <E, A>(
  input: string,
  init?: RequestInit | undefined
) => (m: FetchM<E, A>) => () => Promise<A>
```

Added in v2.15.0

# error handlers

## bail

A built-in instance for [`MapError`](#maperror-type-alias).

This will directly throw any error.

**Signature**

```ts
export declare const bail: MapError<never, unknown>
```

Added in v1.0.0

# types

## Combinator (type alias)

Transform from one [`FetchM`](#fetchm-type-alias) to another [`FetchM`](#fetchm-type-alias).

A combinator is an alias for a function mapping from one [`FetchM`](#fetchm-type-alias) to
another [`FetchM`](#fetchm-type-alias).

Before 2.2.0, previous errors union will always get preserved. But starting
from 2.2.0, the type signature is relaxed to allow you to create combinators that
recover the errors, or conditionally applied.

**Signature**

```ts
export type Combinator<E1, A, E2 = E1, B = A> = (m: FetchM<E1, A>) => FetchM<E2, B>
```

Added in v1.0.0

## Config (type alias)

[`FetchM`](#fetchm-type-alias) Monad Environment.

This is the same as the parameters of the `fetch` function.

**Signature**

```ts
export type Config = [string, RequestInit]
```

Added in v1.0.0

## FetchM (type alias)

Main Monad of this package. The stack contains

- A Reader of [`Config`](#config-type-alias)
- A `TaskEither` represents an asynchronous computation which can yield result `A` or raise an Error of type `E` eventually.

**Signature**

```ts
export type FetchM<E, A> = ReaderTaskEither<Config, E, A>
```

Added in v1.0.0

## InspectError (type alias)

Inspect the error type for a [`FetchM`](#fetchm-type-alias).

**Signature**

```ts
export type InspectError<M> = M extends FetchM<infer E, unknown> ? E : never
```

Added in v2.10.0

## InspectReturn (type alias)

Inspect the return type for a [`FetchM`](#fetchm-type-alias).

**Signature**

```ts
export type InspectReturn<M> = M extends FetchM<unknown, infer A> ? A : never
```

Added in v2.10.0

## MapError (type alias)

A mapping from type `S` to an arbitrary error type `E`.

**Signature**

```ts
export type MapError<E, S = unknown> = (s: S) => E
```

Added in v1.0.0
