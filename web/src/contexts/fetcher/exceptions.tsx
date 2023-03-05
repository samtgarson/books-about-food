'use client'

export class RequestException extends Error {
  constructor(public status: number) {
    super('Request failed')
    this.name = 'RequestException'
  }
}
