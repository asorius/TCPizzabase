<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
const props = defineProps({ pizzaName: String, brand: String, country: String, imageUrl: String })
</script>
<template>
  <div class="bg-white rounded-lg shadow-md p-4">
    <img :src="props.imageUrl" alt="Pizza Image" class="w-full h-32 object-cover rounded-md mb-2" />
    <h2 class="text-xl font-semibold text-gray-800 mb-1">{{ props.pizzaName }}</h2>
    <p class="text-gray-600 text-sm mb-2">Brand: {{ props.brand }}</p>
    <p class="text-gray-600 text-sm">Country: {{ props.country }}</p>
  </div>
</template>
