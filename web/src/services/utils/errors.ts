export type ErrorType =
  | 'UniqueConstraintViolation'
  | 'ServerError'
  | 'Forbidden'
  | 'NotFound'
const ErrorTypeStatusMap: Record<ErrorType, number> = {
  UniqueConstraintViolation: 400,
  ServerError: 500,
  Forbidden: 403,
  NotFound: 404
}

export type AppErrorJSON = ReturnType<AppError['toJSON']>

export class AppError extends Error {
  static fromError = (e: unknown) => {
    if (e instanceof AppError) return e

    if (e instanceof Error && 'code' in e) {
      switch (e.code) {
        case 'P2002':
          return new AppError('UniqueConstraintViolation', e.message)
      }
    }

    return new AppError(
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
      message: this.message,
      status: this.status
    }
  }

  get status() {
    return ErrorTypeStatusMap[this.type]
  }
}
