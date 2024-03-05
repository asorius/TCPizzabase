// import { getDownloadURL, ref } from 'firebase-admin/storage'
import { bucket } from '.'

export default async ({ file, name }) => {
  const filePath = `images/${name}`
  // const imagesRef = ref(bucket, filePath)
  // bucket.upload()
  // const fileRef = bucket.file('my-file')
  console.log({ file, name })
  const metadata = {
    contentType: 'image/jpeg',
    cacheControl: 'public, max-age=31536000',
  }
  const uploaded = await bucket.file(filePath).save(file, { metadata })
  console.log(uploaded)
  // const downloadURL = await getDownloadURL(filePath)

  // return downloadURL
}
