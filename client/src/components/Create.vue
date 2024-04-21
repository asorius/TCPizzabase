<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref } from 'vue'
import { trpc } from '../trpc'
import { compressImage } from '../utils/compressImage'
import CountryDropdown from './CountryDropdown.vue'
const pizza = ref('')
const brand = ref('')
const country = ref('')
const rating = ref(0)
const error = ref('')
const loading = ref(false)
const imageUrl = ref('')
const filePath = ref('')
const message = ref('')
async function imageUploadHandler(event: Event) {
  loading.value = true
  const target = event.target as HTMLInputElement
  if (target && target.files) {
    const file = target.files[0]
    console.log(file.size)
    if (!file.type.startsWith('image')) {
      console.log('File is not an image')
      return
    }
    const imageBlob = await compressImage({ file, quality: 0.3 })
    if (!imageBlob) {
      error.value = 'Failed to compress image, try again'
      return
    }
    console.log({
      originalSize: file.size * 0.0009765625,
      compressedSize: imageBlob.size * 0.0009765625
    })
    const reader = new FileReader()
    reader.onloadend = async () => {
      message.value = 'Uploading image...'
      if (reader.result) {
        const raw = reader.result as string
        // Remove base64 prefix
        const base64Image = raw.replace(/^data:(.*;base64,)?/, '')
        // Send `base64Image` to the server using tRPC
        const response = await trpc.fileStorage.uploadImage.mutate({ base64Image, name: file.name })
        loading.value = false
        if (response && response !== 500) {
          imageUrl.value = response.downloadURL
          filePath.value = response.filePath
          loading.value = false
        }
      }
    }
    reader.readAsDataURL(imageBlob)
  }
}
async function deleteImageHandler(event: Event) {
  loading.value = true
  message.value = 'Deleting image...'
  const response = (await trpc.fileStorage.deleteImage.mutate({ path: filePath.value })) as number
  console.log({ response })
  if (response === 204) {
    imageUrl.value = ''
    filePath.value = ''
    message.value = ''
    loading.value = false
  }
}
const handleSubmit = (event: Event) => {
  console.log(event)
}
</script>

<template>
  <div class="greetings">
    <h1 class="green">Add a pizza</h1>
    <h3>Placeholder</h3>
    <div v-if="error">{{ error }}</div>
    <div>
      <form enctype="multipart/form-data" @submit.prevent="handleSubmit">
        <input
          type="file"
          name="image"
          id="image"
          accept="image/*"
          capture="environment"
          @change="imageUploadHandler"
        />
        <input type="text" id="pizza" v-model="pizza" placeholder="Pizza name" />
        <input type="text" id="brand" v-model="brand" placeholder="Brand" />
        <input type="text" id="country" v-model="country" placeholder="Country" />
        <CountryDropdown></CountryDropdown>
        <button type="submit">Submit</button>
      </form>
      <div v-if="loading">
        <h2>{{ message }}</h2>
      </div>
      <div v-else>
        <img :src="imageUrl" alt="" style="display: block; max-width: 20rem" />
        <button v-if="filePath" @click="deleteImageHandler">Delete</button>
      </div>
    </div>
  </div>
</template>
