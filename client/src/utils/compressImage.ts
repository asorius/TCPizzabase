export const compressImage = async ({
  file,
  quality = 1,
  type = 'image/jpeg'
}: {
  file: File
  quality: number
  type: string
}) => {
  // Get as image data
  const imageBitmap = await createImageBitmap(file)

  // Draw to canvas
  const canvas = document.createElement('canvas')
  canvas.width = imageBitmap.width
  canvas.height = imageBitmap.height
  const ctx = canvas.getContext('2d')
  if (canvas && ctx) {
    ctx.drawImage(imageBitmap, 0, 0)

    // Turn into Blob
    const blob: any = await new Promise((resolve, reject) => canvas.toBlob(resolve, type, quality))
    // Turn Blob into File

    return new File([blob], file.name, {
      type: blob.type
    })
  }
}
