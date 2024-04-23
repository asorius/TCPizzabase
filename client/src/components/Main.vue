<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { trpc } from '../trpc'
import PizzaSmall from '../components/PizzaSmall.vue'
// import type { Pizza } from '@server/shared/entities'
import { RouterLink } from 'vue-router'
const pizzas = ref<any[] | []>([])
const page = ref(0)
const error = ref('')
const loading = ref(false)
const message = ref('')

watch(
  page,
  async () => {
    try {
      const ll = await trpc.pizza.get.query({ country: '', brand: '', page: page.value })
      pizzas.value = ll
      console.log(ll)
    } catch (e) {
      console.log(e)
    }
  },
  { immediate: true }
)
</script>

<template>
  <div>
    <header class="h-60">
      <h1>Pizza Base</h1>
    </header>
    <RouterLink to="/create">
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Create new pizza
      </button>
    </RouterLink>
    <h3>Current base:</h3>
    <div class="grid grid-flow-col auto-cols-max">
      <PizzaSmall
        v-for="pizza in pizzas"
        :pizza-name="pizza.name"
        :brand="pizza.brand.title"
        :country="pizza.brand.country.name"
        :image-url="pizza.images[0].source"
        :key="pizza.name"
      ></PizzaSmall>
    </div>

    <div v-if="error">{{ error }}</div>
  </div>
</template>
