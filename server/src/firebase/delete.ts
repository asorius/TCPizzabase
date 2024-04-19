import { bucket } from '.'

export default async ({ path }: { path: string }): Promise<number> => {
  if (!bucket) {
    return 500
  }
  const result = await bucket.file(path).delete()

  return result[0].statusCode
}
