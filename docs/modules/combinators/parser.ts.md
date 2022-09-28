---
title: combinators/parser.ts
nav_order: 7
parent: Modules
---

## parser overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [combinators](#combinators)
  - [asBlob](#asblob)
  - [asJSON](#asjson)
  - [asText](#astext)
  - [decodeAs](#decodeas)

---

# combinators

## asBlob

Parse the `Response` body as `Blob`

**Signature**

```ts
export declare function asBlob<E, F>(accept: string, mapError: MapError<F>): Combinator<E, Response, E | F, Blob>
export declare function asBlob<E>(accept: string): Combinator<E, Response, E, Blob>
```

Added in v1.0.0

## asJSON

Parse the `Response` body as JSON

**Signature**

```ts
export declare function asJSON<E, F>(mapError: MapError<F>): Combinator<E, Response, E | F, Json>
export declare function asJSON<E>(): Combinator<E, Response, E, Json>
```

Added in v1.0.0

## asText

Parse the `Response` body as `string`

**Signature**

```ts
export declare function asText<E, F>(mapError: MapError<F>): Combinator<E, Response, E | F, string>
export declare function asText<E>(): Combinator<E, Response, E, string>
```

Added in v1.0.0

## decodeAs

Decode a `Json` type using [`io-ts`](https://github.com/gcanti/io-ts)

Using this combinator will require [`io-ts`](https://github.com/gcanti/io-ts) to be installed.

**Signature**

```ts
export declare function decodeAs<E, F, C extends Mixed>(
  codeC: C,
  mapError: MapError<F, Errors>
): Combinator<E, Json, E | F, TypeOf<C>>
export declare function decodeAs<E, C extends Mixed>(codeC: C): Combinator<E, Json, E, TypeOf<C>>
```

Added in v2.5.0
