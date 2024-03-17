import { getDownloadURL } from 'firebase-admin/storage'
import { bucket } from '.'

export default async ({ file, name }: { file: Buffer; name: string }) => {
  const filePath = `images/${name}`

  const metadata = {
    contentType: 'image/jpeg',
  }

  await bucket.file(filePath).save(file, { metadata })

  const downloadURL = await getDownloadURL(bucket.file(filePath))

  return { downloadURL, filePath }
}
