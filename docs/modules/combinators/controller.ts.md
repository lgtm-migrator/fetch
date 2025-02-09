---
title: combinators/controller.ts
nav_order: 2
parent: Modules
---

## controller overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [combinators](#combinators)
  - [withSignal](#withsignal)
  - [withTimeout](#withtimeout)

---

# combinators

## withSignal

Set an abort signal.

Even though you could create multiple abort signals (including both `withSignal` and `withTimeout`),
the request will be aborted if any of them is aborted. And only the last combinator will receive the
error for handling.

**Signature**

```ts
export declare function withSignal<E, A, F>(signal: AbortSignal, mapError: MapError<F>): Combinator<E, A, E | F>
export declare function withSignal<E, A>(signal: AbortSignal): Combinator<E, A>
```

Added in v1.0.0

## withTimeout

Set the request timeout.

Even though you could create multiple abort signals (including both `withSignal` and `withTimeout`),
the request will be aborted if any of them is aborted. And only the last combinator will receive the
error for handling.

**Signature**

```ts
export declare function withTimeout<E, A, F>(milliseconds: number, mapError: MapError<F>): Combinator<E, A, E | F>
export declare function withTimeout<E, A>(milliseconds: number): Combinator<E, A>
```

Added in v1.0.0
