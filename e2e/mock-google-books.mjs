if (process.env.E2E_GOOGLE_BOOKS_FIXTURES === '1') {
  if (process.env.RAILWAY_ENVIRONMENT_NAME === 'production') {
    throw new Error('Google Books test fixtures must not run in production')
  }

  const { default: book } = await import('./fixtures/google-book.json', {
    with: { type: 'json' }
  })
  const originalFetch = globalThis.fetch

  globalThis.fetch = async (input, init) => {
    const url = new URL(
      typeof input === 'string' || input instanceof URL ? input : input.url
    )
    if (
      url.hostname !== 'www.googleapis.com' ||
      !url.pathname.startsWith('/books/v1/volumes')
    ) {
      return originalFetch(input, init)
    }

    let requestHeaders
    try {
      // Node's ESM loader requires the extension for this package subpath.
      // eslint-disable-next-line import-x/extensions
      const { headers } = await import('next/headers.js')
      requestHeaders = await headers()
    } catch {
      return originalFetch(input, init)
    }
    if (requestHeaders.get('x-e2e-google-books') !== '1') {
      return originalFetch(input, init)
    }

    if (url.pathname === `/books/v1/volumes/${book.id}`) {
      return Response.json(book)
    }
    if (
      url.searchParams.get('q')?.toLowerCase().includes('a good day to bake')
    ) {
      return Response.json({ items: [book] })
    }
    return originalFetch(input, init)
  }
}
