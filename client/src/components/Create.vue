<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { trpc } from '../trpc'
import { compressImage } from '../utils/compressImage'
import CountryDropdown from './CountryDropdown.vue'
import Loading from './Loading.vue'
import { RouterLink, useRouter } from 'vue-router'
import Error from './Error.vue'
const router = useRouter()
const pizza = ref('')
const brand = ref('')
const country = ref('')
const rating = ref(1)
const ratings = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const error = ref('')
const loading = ref(false)
const imageUrl = ref('')
const filePath = ref('')
const message = ref('')
const selectedFile = ref<File | null>(null)
const previewSource = computed(() => selectedFile.value && URL.createObjectURL(selectedFile.value))

async function imageUploadHandler(event: Event) {
  const target = event.target as HTMLInputElement
  if (target && target.files) {
    const file = target.files[0]

    if (!file.type.startsWith('image')) {
      console.log('File is not an image')
      return
    }

    selectedFile.value = file
  }
}

const handleSubmit = async () => {
  if (!selectedFile.value) {
    error.value = 'Please select an image'
    setTimeout(() => {
      error.value = ''
    }, 2000)
    return
  }
  const imageBlob = await compressImage({ file: selectedFile.value, quality: 0.3 })
  if (!imageBlob) {
    error.value = 'Failed to compress image, try again'
    return
  }
  loading.value = true
  try {
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
          await trpc.pizza.create.mutate({
            brand: brand.value,
            country: country.value,
            name: pizza.value,
            rating: rating.value,
            imagePath: filePath.value,
            imageSource: imageUrl.value
          })
          router.push({ name: 'Home' })
          loading.value = false
        }
      }
    }
    reader.readAsDataURL(imageBlob)
  } catch (e) {
    console.log('error from client')
    error.value = 'Something went wrong, please try again'
  }
}
</script>

<template>
  <div class="w-11/12 md:w-1/2 max-w-lg bg-white p-6 rounded-lg shadow-md mx-auto relative">
    <Loading :status="loading"></Loading>
    <h1 class="text-2xl font-semibold mb-4">Create a New Pizza</h1>

    <form
      enctype="multipart/form-data"
      @submit.prevent="handleSubmit"
      class="max-w-md mx-auto p-4 grid gap-2"
    >
      <div class="mb-4">
        <input
          type="text"
          id="pizzaName"
          v-model="pizza"
          placeholder="Pizza name"
          required
          minlength="3"
          maxlength="20"
          class="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>
      <div class="mb-4">
        <input
          type="text"
          id="brandName"
          v-model="brand"
          placeholder="Brand"
          required
          minlength="3"
          maxlength="20"
          class="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>
      <div class="mb-4">
        <CountryDropdown @select-country="(val) => (country = val)" />
      </div>
      <div class="mb-4">
        <input
          type="file"
          name="image"
          id="imageInput"
          accept="image/*"
          capture="environment"
          @change="imageUploadHandler"
          class="w-full"
        />
      </div>
      <div v-if="previewSource" class="mb-4">
        <img :src="previewSource" alt="preview" fill :style="{ objectFit: 'contain' }" />
      </div>
      <div class="mb-4 text-center">
        <label for="rating">Rate your pizza:</label>
        <select
          id="rating"
          v-model="rating"
          required
          class="border rounded p-2 text-center w-full md:w-12 md:mx-4"
        >
          <option v-for="rate in ratings" :key="rate" :value="rate">{{ rate }}</option>
        </select>
      </div>
      <div class="mb-4">
        <Error :message="error"></Error>
      </div>
      <button
        type="submit"
        class="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500"
      >
        Submit
      </button>
      <RouterLink to="/">
        <button
          type="submit"
          class="w-full border-blue-500 border px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500"
        >
          Cancel
        </button>
      </RouterLink>
    </form>
  </div>
</template>
