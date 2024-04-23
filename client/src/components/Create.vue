<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, ref } from 'vue'
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
const selectedFile = ref<File | null>(null)
const previewSource = computed(() => selectedFile.value && URL.createObjectURL(selectedFile.value))
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
    selectedFile.value = file
    console.log(previewSource.value)
    // const imageBlob = await compressImage({ file, quality: 0.3 })
    // if (!imageBlob) {
    //   error.value = 'Failed to compress image, try again'
    //   return
    // }
    // console.log({
    //   originalSize: file.size * 0.0009765625,
    //   compressedSize: imageBlob.size * 0.0009765625
    // })
    // const reader = new FileReader()
    // reader.onloadend = async () => {
    //   message.value = 'Uploading image...'
    //   if (reader.result) {
    //     const raw = reader.result as string
    //     // Remove base64 prefix
    //     const base64Image = raw.replace(/^data:(.*;base64,)?/, '')
    //     // Send `base64Image` to the server using tRPC
    //     const response = await trpc.fileStorage.uploadImage.mutate({ base64Image, name: file.name })
    //     loading.value = false
    //     if (response && response !== 500) {
    //       imageUrl.value = response.downloadURL
    //       filePath.value = response.filePath
    //       loading.value = false
    //     }
    //   }
    // }
    // reader.readAsDataURL(imageBlob)
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
const handleSubmit = async (event: Event) => {
  // UPLOAD IMAGE
  if (!selectedFile.value) {
    console.log('no file selected')
    return
  }
  const imageBlob = await compressImage({ file: selectedFile.value, quality: 0.3 })
  if (!imageBlob) {
    error.value = 'Failed to compress image, try again'
    return
  }
  console.log({
    originalSize: selectedFile.value.size * 0.0009765625,
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
      const response = await trpc.fileStorage.uploadImage.mutate({
        base64Image,
        name: selectedFile.value?.name || 'default name'
      })
      loading.value = false
      if (response && response !== 500) {
        imageUrl.value = response.downloadURL
        filePath.value = response.filePath
        const creationResponse = await trpc.pizza.create.mutate({
          brand: brand.value,
          country: country.value,
          name: pizza.value,
          rating: 7,
          imagePath: filePath.value,
          imageSource: imageUrl.value
        })
        loading.value = false
        console.log(creationResponse)
      }
    }
  }
  reader.readAsDataURL(imageBlob)

  //
}
</script>

<template>
  <div class="bg-gray-100 p-6 rounded-lg shadow-md">
    <h1 class="text-2xl font-semibold mb-4">Create a New Pizza</h1>
    <div v-if="error" class="text-red-500">{{ error }}</div>
    <form enctype="multipart/form-data" @submit.prevent="handleSubmit">
      <input
        type="file"
        name="image"
        id="image"
        accept="image/*"
        capture="environment"
        @change="imageUploadHandler"
        class="mb-4"
      />
      <input
        type="text"
        id="pizza"
        v-model="pizza"
        placeholder="Pizza name"
        class="w-full p-2 border rounded-md mb-4"
      />
      <input
        type="text"
        id="brand"
        v-model="brand"
        placeholder="Brand"
        class="w-full p-2 border rounded-md mb-4"
      />

      <CountryDropdown @select-country="(val) => (country = val)"></CountryDropdown>
      <button
        type="submit"
        class="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
    <img
      v-if="previewSource"
      :src="previewSource"
      alt="preview"
      fill
      :style="{ objectFit: 'contain' }"
    />
    <div v-if="loading" class="mt-4">
      <h2 class="text-gray-700">{{ message }}</h2>
    </div>
    <div v-else>
      <img :src="imageUrl" alt="" class="block max-w-xs mx-auto mt-4" />
      <button v-if="filePath" @click="deleteImageHandler" class="text-red-500 hover:underline mt-2">
        Delete
      </button>
    </div>
  </div>
</template>
