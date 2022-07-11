![codecov](https://badgen.net/codecov/c/github/equt/fetch)
[![npm](https://badgen.net/npm/v/@equt/fetch)](https://www.npmjs.com/package/@equt/fetch)

Inspired by [`contactlab/appy`](https://github.com/contactlab/appy).

```ts
pipe(
  mkRequest(() => 'Network error'),
  withBaseURL('https://example.com', () => 'Invalid URL'),
  withURLSearchParams({
    foo: 'bar',
  }),
  withTimeout(5_000, () => 'Out of time'),
  withJSON({
    foo: 'bar',
  }),
  ensureStatus(
    n => n === 200,
    () => 'Unexpected status code',
  ),
  asJSON(() => 'Invalid response body'),
  runFetchMPT('/path'),
)
```

instead of

```ts
const controller = new AbortController()

const id = setTimeout(() => controller.abort(), 5_000)

try {
  const resp = await fetch('https://example.com/path?foo=bar', {
    body: JSON.stringify({ foo: 'bar' }),
    headers: {
      'Content-Type': 'application/json',
    },
    signal: controller.signal,
  })

  clearTimeout(id)

  if (resp.status !== 200) {
    throw new Error('Request failed')
  }

  const json = await resp.json()
} catch (e) {
  // Handle error
}
```
