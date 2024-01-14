import type { Prisma } from '@prisma/client'
export type ErrorType = keyof typeof ErrorTypeStatusMap
const ErrorTypeStatusMap = {
  UniqueConstraintViolation: 400,
  ServerError: 500,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  InvalidInput: 400
}

export type AppErrorJSON = ReturnType<AppError['toJSON']>

const isPrismaError = (
  e: unknown
): e is Prisma.PrismaClientKnownRequestError => {
  return typeof e === 'object' && e !== null && 'code' in e
}

export class AppError extends Error {
  static fromError = (e: unknown) => {
    if (e instanceof AppError) return e

    if (isPrismaError(e)) {
      switch (e.code) {
        case 'P2002':
          return new AppError(
            'UniqueConstraintViolation',
            e.message,
            (e.meta?.target as string[] | undefined)?.[0]
          )
      }
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

  toJSON() {
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
