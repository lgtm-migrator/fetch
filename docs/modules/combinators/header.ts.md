---
title: combinators/header.ts
nav_order: 4
parent: Modules
---

## header overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [combinators](#combinators)
  - [withHeaders](#withheaders)
- [utils](#utils)
  - [merge](#merge)
  - [toRecord](#torecord)

---

# combinators

## withHeaders

Set request headers

Calling this combinator multiple times will merge all of them instead of overriding.

**Signature**

```ts
export declare const withHeaders: <E, A>(headers: HeadersInit) => Combinator<E, A, E, A>
```

Added in v1.0.0

# utils

## merge

Merge two `HeadersInit` into one `HeadersInit`.

**Signature**

```ts
export declare const merge: (into: HeadersInit, from: HeadersInit) => HeadersInit
```

Added in v1.0.0

## toRecord

Collect `HeadersInit` as `Record`, where keys and values are both `string`

**Signature**

```ts
export declare const toRecord: (headers: HeadersInit) => Record<string, string>
```

Added in v1.0.0
