---
title: combinators/body.ts
nav_order: 1
parent: Modules
---

## body overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [combinators](#combinators)
  - [withBlob](#withblob)
  - [withForm](#withform)
  - [withJSON](#withjson)
  - [withJSONBody](#withjsonbody)
- [types](#types)
  - [Formable (type alias)](#formable-type-alias)
- [utils](#utils)
  - [collectFormable](#collectformable)
  - [mkFormData](#mkformdata)

---

# combinators

## withBlob

Set the request body as Blob.

**Signature**

```ts
export declare const withBlob: <E extends Error, A>(blob: Blob, contentType: string) => Combinator<E, A, E, A>
```

Added in v1.0.0

## withForm

Set the request body as `FormData`.

Calling this combinator multiple times will merge all of them instead of overriding.
If the body is not a `FormData`, the existing body will be discarded.

**Signature**

```ts
export declare const withForm: <E, A>(form: Formable) => Combinator<E, A, E, A>
```

Added in v2.1.0

## withJSON

Set the request body as JSON.

This combinator will override the current existing body and `Content-Type` header.
If setting the `Content-Type` is not desired, use the [`withJSONBody`](#withjsonbody) combinator instead.

**Signature**

```ts
export declare function withJSON<E, A>(
  json: Json,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  replacer?: (this: any, key: string, value: any) => any,
  space?: string | number
): Combinator<E, A>
export declare function withJSON<E, A>(
  json: Json,
  replacer?: Array<number | string>,
  space?: string | number
): Combinator<E, A>
```

Added in v1.0.0

## withJSONBody

Set the request body as JSON.

This combinator will override the current existing body.
You may want to use [`withJSON`](#withjson) if the auto `Content-Type` setting is desired.

**Signature**

```ts
export declare function withJSONBody<E, A>(
  json: Json,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  replacer?: (this: any, key: string, value: any) => any,
  space?: string | number
): Combinator<E, A>
export declare function withJSONBody<E, A>(
  json: Json,
  replacer?: Array<number | string>,
  space?: string | number
): Combinator<E, A>
```

Added in v1.0.0

# types

## Formable (type alias)

Form like object.

**Signature**

```ts
export type Formable = Record<string, string | Blob | FormBlob>
```

Added in v1.1.0

# utils

## collectFormable

Transform `FormData` into an intermediate [`Formable`](#formable-type-alias) object.

**Signature**

```ts
export declare const collectFormable: (form: FormData) => Formable
```

Added in v2.1.0

## mkFormData

Translate the intermediate [`Formable`](#formable-type-alias) into a `FormData`.

**Signature**

```ts
export declare const mkFormData: (form: Formable) => FormData
```

Added in v1.1.0
