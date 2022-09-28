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

Set the request body as {@link FormData}.

**Signature**

```ts
export declare const withForm: <E, A>(form: Formable) => Combinator<E, A, E, A>
```

Added in v2.1.0

## withJSON

Set the request body as JSON.

Note, this combinator will set `Content-Type` header automatically.
You could use the {@link withJSONBody} combinator if this behavior is not desired.

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

Note, this combinator will not set `Content-Type` header automatically.
You should use the {@link withJSON} combinator if that behavior is desired.

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

Collect a {@link FormData} into a {@link Formable}.

**Signature**

```ts
export declare const collectFormable: (form: FormData) => Formable
```

Added in v2.1.0

## mkFormData

Create a {@link FormData} from a form like object {@link Formable}.

**Signature**

```ts
export declare const mkFormData: (form: Formable) => FormData
```

Added in v1.1.0
