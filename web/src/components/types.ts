export interface PageProps<
  Params extends Record<string, string | string[]> = never
> {
  params: Params
  searchParams: { [key: string]: string | string[] | undefined }
}
