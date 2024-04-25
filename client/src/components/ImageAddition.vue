<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { trpc } from '../trpc'
import { compressImage } from '../utils/compressImage'
import Loading from './Loading.vue'
import Error from './Error.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const props = defineProps(['pizzaId'])
const emit = defineEmits(['close'])

const rating = ref(1)
const error = ref('')
const loading = ref(false)
const imageUrl = ref('')
const filePath = ref('')
const message = ref('')
const ratings = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
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
        userStore.authUserId &&
          (await trpc.pizza.update.mutate({
            imagePath: filePath.value,
            imageUrl: imageUrl.value,
            pizzaId: props.pizzaId,
            rating: rating.value,
            userId: userStore.authUserId
          }))
        loading.value = false
      }
    }
  }
  reader.readAsDataURL(imageBlob)
  emit('close')
}
</script>

<template>
  <div class="relative">
    <Loading :status="loading"></Loading>
    <form
      enctype="multipart/form-data"
      @submit.prevent="handleSubmit"
      class="max-w-md mx-auto p-4 grid gap-2"
    >
      <div class="mb-4">
        <select v-model="rating" required class="border rounded p-2 text-center w-full">
          <option v-for="rating in ratings" :key="rating" :value="rating">{{ rating }}</option>
        </select>
      </div>
      <div class="mb-4">
        <input
          type="file"
          name="image"
          id="image"
          accept="image/*"
          capture="environment"
          @change="imageUploadHandler"
          class="w-full"
        />
      </div>
      <div v-if="previewSource" class="mb-4">
        <img :src="previewSource" alt="preview" fill :style="{ objectFit: 'contain' }" />
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

      <button
        type="submit"
        class="w-full border-blue-500 border px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500"
        @click="$emit('close')"
      >
        Cancel
      </button>
    </form>
  </div>
</template>
