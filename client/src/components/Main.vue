<script setup lang="ts">
import { ref } from 'vue'
import { trpc } from '../trpc'
import { compressImage } from '../utils/compressImage'
const pizza = ref('')
const brand = ref('')
const country = ref('')
const rating = ref(0)
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

const handleSubmit = (event: Event) => {
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
    <form enctype="multipart/form-data" @submit.prevent="handleSubmit">
      <input
        type="file"
        name="image"
        id="image"
        accept="image/*"
        capture="environment"
        @change="changeHandler2"
      />
      <input type="text" id="pizza" v-model="pizza" />
      <input type="text" id="brand" v-model="brand" />
      <input type="text" id="country" v-model="country" />
      <select v-model="rating" id="rating">
        <option value="1" default>1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
      <button type="submit">go</button>
    </form>
  </div>
</template>
