<script setup lang="ts">
import { ref } from 'vue'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
// @ts-ignore - importing through direct path propagates types faster
import type { AppRouter } from '@server/shared/trpc'
import { apiBase } from '@/config'
// import { getStoredAccessToken } from '@/utils/auth'
import SuperJSON from 'superjson'

const trpc = createTRPCProxyClient<AppRouter>({
  // auto convert Date <-> string
  transformer: SuperJSON,
  links: [
    httpBatchLink({
      url: apiBase,

      // send the access token with every request
      headers: () => {
        const token2 = 'asdfasdfasdfasdfgagdfasdf'
        return {
          Authorization: `Bearer ${token2}`
        }
      }
    })
  ]
})

const compressImage = async ({
  file,
  quality = 1,
  type = 'image/jpeg'
}: {
  file: File
  quality: Number
  type: String
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
const changeHandler2 = async (event: Event) => {
  if (event.target && event.target.files) {
    const file = event.target.files[0]
    console.log(file.size)
    if (!file.type.startsWith('image')) {
      console.log('no image type')
      return
    }
    const img = await compressImage({ file, quality: 0.3 })
    console.log(img.size)
    // await trpc.user.login.mutate(userLogin)
    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64String = reader.result.replace(/^data:(.*;base64,)?/, '')
      // Now you can send `base64String` to the server using tRPC
      const response = await trpc.cloud.upload.mutate({ img: base64String, name: file.name })
      console.log({ response })
    }
    reader.readAsDataURL(img)
  }
}

const handlesubmit = (event) => {
  console.log(event)
}
</script>

<template>
  <div class="greetings">
    <h1 class="green">Add a pizza</h1>
    <h3>
      You've successfully created a project with
      <a href="https://vitejs.dev/" target="_blank" rel="noopener">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>. What's next?
    </h3>
    <form enctype="multipart/form-data" @submit.prevent="handlesubmit">
      <input
        type="file"
        name="image"
        id="image"
        accept="image/*"
        capture="environment"
        @change="changeHandler2"
      />
      <button type="submit">go</button>
    </form>
  </div>
</template>
