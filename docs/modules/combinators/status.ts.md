---
title: combinators/status.ts
nav_order: 8
parent: Modules
---

## status overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [combinators](#combinators)
  - [ensureStatus](#ensurestatus)

---

# combinators

## ensureStatus

Guard the `Response` status code.

**Signature**

```ts
export declare const ensureStatus: <E, F>(
  statusIsValid: Predicate<number>,
  otherwise: MapError<F, Response>
) => Combinator<E, Response, E | F, Response>
```

Added in v1.0.0
