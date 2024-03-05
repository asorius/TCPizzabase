// import { getDownloadURL, ref } from 'firebase-admin/storage'
import { bucket } from '.'

export default async (file: any) => {
  const filePath = `images/${file.name}`
  // const imagesRef = ref(bucket, filePath)
  // bucket.upload()
  // const fileRef = bucket.file('my-file')
  const uploaded = await bucket.upload(filePath)
  console.log(uploaded)
  // const downloadURL = await getDownloadURL(filePath)

  // return downloadURL
}
