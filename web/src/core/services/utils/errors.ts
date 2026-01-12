import z from 'zod'
export type ErrorType = keyof typeof ErrorTypeStatusMap
const ErrorTypeStatusMap = {
  UniqueConstraintViolation: 400,
  ServerError: 500,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  InvalidInput: 400
}

export type AppErrorJSON = {
  type: ErrorType
  message: string
  status: number
  field?: string
}

export class AppError extends Error {
  static fromError = (e: unknown) => {
    if (e instanceof AppError) return e

    if (e instanceof z.ZodError) {
      return new AppError(
        'InvalidInput',
        e.issues[0].message,
        e.issues[0].path[0]?.toString()
      )
    }

    return new AppError(
      'ServerError',
      e instanceof Error ? e.message : String(e)
    )
  }

  constructor(
    public type: ErrorType,
    message: string,
    public field?: string
  ) {
    super(message)
  }

  toJSON(): AppErrorJSON {
    return {
      type: this.type,
      message: this.message,
      status: this.status,
      field: this.field
    }
  }

  static fromJSON(json: AppErrorJSON) {
    return new AppError(json.type, json.message, json.field)
  }

  get status() {
    return ErrorTypeStatusMap[this.type]
  }
}
