[![codecov](https://codecov.io/gh/equt/fetch/branch/main/graph/badge.svg?token=EgscdLwP1m)](https://codecov.io/gh/equt/fetch)

Let's do something like

```typescript
const uploadAvatar = pipe(
  post,
  withForm({
    name: 'Sienna',
    avatar: new Blob(/* (>_<) */),
  }),
  withHeaders({
    Authorization: `Bearer ${import.meta.env.YOUR_TOP_SECRET}`,
  }),
  withTimeout(3_000),
  withDecoder(
    z.object({
      message: z.string().optional(),
      redirection: z.string().url(),
    })
  )
)
```

This repo is a fork of https://github.com/contactlab/appy. In brief, `Req<A>` in
appy is equal to `fetchM<Identity, A>` in this repo.
