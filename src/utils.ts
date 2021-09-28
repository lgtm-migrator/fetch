export const assert: {
  TypeError: (e: unknown) => asserts e is TypeError
  DOMException: (e: unknown) => asserts e is DOMException
} = {
  TypeError: e => {
    if (!(e instanceof TypeError)) {
      throw new Error(`Unexpected error: ${e}`)
    }
  },
  DOMException: e => {
    if (!(e instanceof DOMException)) {
      throw new Error(`Unexpected error: ${e}`)
    }
  },
}
