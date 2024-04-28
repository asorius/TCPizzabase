<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import type { Image } from '@server/entities'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
const props = defineProps(['pizzaName', 'brand', 'country', 'id', 'imageUrl', 'images'])
const average = computed(() => {
  const sum = props.images.reduce(
    (accumulator: number, imageItem: Image) => accumulator + Number(imageItem.rating),
    0
  )
  return Math.round(sum / props.images.length)
})
</script>
<template>
  <RouterLink :to="'/pizza/' + props.id" :id="'pizza' + props.id">
    <div class="bg-white rounded-lg shadow-md p-4">
      <img
        :src="props.imageUrl"
        alt="Pizza Image"
        class="w-full h-32 object-cover rounded-md mb-2"
      />
      <h2 class="text-xl font-semibold text-gray-800 mb-1">{{ pizzaName }}</h2>
      <p class="text-gray-600 text-sm mb-2">Brand: {{ brand }}</p>
      <p class="text-gray-600 text-sm">Country: {{ country }}</p>
      <p class="text-gray-600 text-sm py-4">Average: {{ average }} / 10 ⭐</p>
    </div>
  </RouterLink>
</template>
