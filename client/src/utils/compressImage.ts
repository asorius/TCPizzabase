export const compressImage = async ({
  file,
  quality = 1,
  type = 'image/jpeg'
}: {
  file: File
  quality: number
  type?: string
}): Promise<File | undefined> => {
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
    const blob: any = await new Promise((resolve) => canvas.toBlob(resolve, type, quality))
    return blob
  }
}
