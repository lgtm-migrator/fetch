export const unreachable = (): never => {
  throw new Error('What!? How could you get there?')
}

export class NonExistError extends Error {
  constructor(message: string) {
    super(message)
    throw new Error('What!? How could you ever create a non-existing error?')
  }
}
