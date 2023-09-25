export type ErrorType = 'UniqueConstraintViolation' | 'ServerError'

export type AppError = ReturnType<ErrorParser['toJSON']>

export class ErrorParser extends Error {
  static fromError = (e: unknown) => {
    if (e instanceof Error && 'code' in e) {
      switch (e.code) {
        case 'P2002':
          return new ErrorParser('UniqueConstraintViolation', e.message)
      }
    }

    return new ErrorParser(
      'ServerError',
      e instanceof Error ? e.message : String(e)
    )
  }

  constructor(
    public type: ErrorType,
    message: string
  ) {
    super(message)
  }

  toJSON() {
    return {
      type: this.type,
      message: this.message
    }
  }
}
