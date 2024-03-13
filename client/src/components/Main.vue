<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref } from 'vue'
import { trpc } from '../trpc'
import { compressImage } from '../utils/compressImage'
const pizza = ref('')
const brand = ref('')
const country = ref('')
const rating = ref(0)
const error = ref('')
const loading = ref(false)
const imageUrl = ref('')
const imageUploadHandler = async (event: Event) => {
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
      loading.value = true
      if (reader.result) {
        const raw = reader.result as string
        // Remove base64 prefix
        const base64Image = raw.replace(/^data:(.*;base64,)?/, '')
        // Send `base64Image` to the server using tRPC
        const response = await trpc.fileStorage.upload.mutate({ base64Image, name: file.name })
        loading.value = false
        if (response) {
          imageUrl.value = response
        }
      }
    }
    reader.readAsDataURL(imageBlob)
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
        <select v-model="rating" id="rating">
          <option disabled value="">Rate this pizza</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <button type="submit">Submit</button>
      </form>
      <div v-if="loading"><h2>Uploading image...</h2></div>
      <div v-else>
        <img :src="imageUrl" alt="" />
      </div>
    </div>
  </div>
</template>
