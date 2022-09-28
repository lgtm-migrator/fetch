---
title: combinators/method.ts
nav_order: 6
parent: Modules
---

## method overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [combinators](#combinators)
  - [withMethod](#withmethod)
- [types](#types)
  - [HTTPMethod (type alias)](#httpmethod-type-alias)

---

# combinators

## withMethod

Set the request HTTP method.

**Signature**

```ts
export declare const withMethod: <E, A>(method: HTTPMethod) => Combinator<E, A, E, A>
```

Added in v1.0.0

# types

## HTTPMethod (type alias)

All possible HTTP methods

**Signature**

```ts
export type HTTPMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'HEAD'
  | 'DELETE'
  | 'OPTION'
  | 'PATCH'
  | (string & Record<never, never>)
```

Added in v1.0.0
