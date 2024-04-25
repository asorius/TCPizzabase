<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { trpc } from '@/trpc'
import { onBeforeMount, ref } from 'vue'
import { Pizza } from '@server/entities'
import ImageAddition from './ImageAddition.vue'
import { useUserStore } from '@/stores/user'
import Loading from './Loading.vue'
const route = useRoute()
const router = useRouter()
const loading = ref(false)
const showImageAdd = ref(false)
const userStore = useUserStore()
const pizza = ref<Pizza | null>(null)

onBeforeMount(async () => {
  try {
    if (!route.params.id) {
      router.push({ name: 'NotFound' })
      return
    }

    const storedPizza = await trpc.pizza.getById.query(Number(route.params.id))
    pizza.value = storedPizza
  } catch (e) {
    router.push({ name: 'NotFound' })
  }
})

async function deleteImageHandler(filePath: string) {
  if (!pizza.value) {
    return
  }
  if (pizza.value.images.length === 1) {
    const confirmation = window.confirm(
      'Deleting the last image will delete entire pizza. Continue?'
    )
    if (!confirmation) {
      return
    }
  }
  loading.value = true
  const firebase_response = await trpc.fileStorage.deleteImage.mutate({ path: filePath })
  console.log(firebase_response)
  if (firebase_response === 204) {
    await trpc.pizza.deleteImage.mutate({
      pizzaId: pizza.value.id,
      imageUrl: filePath
    })
    const updatedPizza = await trpc.pizza.getById.query(Number(route.params.id))
    if (updatedPizza.images.length === 0) {
      await trpc.pizza.deleteById.mutate(updatedPizza.id)
      router.push({ name: 'Home' })
    }
    loading.value = false
    pizza.value = updatedPizza
  }
}
async function onClose() {
  const updatedPizza = await trpc.pizza.getById.query(Number(route.params.id))
  pizza.value = updatedPizza
  showImageAdd.value = false
}
</script>
<template>
  <div class="bg-gray-100 p-4">
    <div v-if="pizza" class="max-w-md mx-auto bg-white rounded-lg shadow-md p-2">
      <h1 class="text-2xl font-semibold">{{ pizza.name }}</h1>
      <div class="mt-4">
        <h2 class="text-lg">{{ pizza.brand.title }}</h2>
        <h3 class="text-gray-600">{{ pizza.brand.country.name }}</h3>
      </div>
      <div v-if="userStore.isLoggedIn" class="mt-4 text-center">
        <button
          @click="() => (showImageAdd = true)"
          class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add your review
        </button>
        <div v-if="showImageAdd" class="mt-4">
          <ImageAddition :pizza-id="pizza.id" @close="onClose" />
        </div>
      </div>
      <div class="mt-4">
        <div
          v-for="image in pizza.images"
          :key="image.path as string"
          class="mt-4 border rounded-lg p-4 relative"
        >
          <Loading :status="loading"></Loading>
          <img :src="image.source as string" alt="Pizza Image" class="w-full" />
          <div class="mt-2 grid grid-flow-col place-content-center">
            <div>{{ image.rating }} / 10 ⭐</div>
            <button
              v-if="image.user.id === userStore.authUserId"
              @click="() => deleteImageHandler(image.path as string)"
              class="text-red-500 hover:text-red-700 ml-4 border border-red px-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center mt-4">🍕 Loading...⌛</div>
  </div>
</template>
