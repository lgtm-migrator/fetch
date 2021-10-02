[![codecov](https://codecov.io/gh/equt/fetch/branch/main/graph/badge.svg?token=EgscdLwP1m)](https://codecov.io/gh/equt/fetch)

> This repository is a fork of https://github.com/contactlab/appy. `Req<A>` in
> appy is equal to `FetchM<Identity, A>` in this package.

## Installation

This package requires [`fp-ts`](https://github.com/gcanti/fp-ts) as its peer
dependency. You have to install it before using this package.

```sh
pnpm add fp-ts @equt/fetch
```

## Introduction

Check the monad type `FetchM` and the combinator type `Combinator`.

Some common combinators are provided in the [combinators](/src/combinators)
directory.

Use `runFetchM` just like `fetch` to get a `TaskEither`.

See the [examples](/src/examples) to get a basic intuition.
