<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue'
import { trpc } from '../trpc'
import PizzaSmall from '../components/PizzaSmall.vue'
import { RouterLink } from 'vue-router'
const pizzas = ref<any[] | []>([])
const page = ref(0)
const countryOptions = ref<string[]>([])
const brandOptions = ref<string[]>([])
watchEffect(async () => {
  try {
    const { countries, brands } = await trpc.pizza.searchOptions.query()
    countryOptions.value = countries
    brandOptions.value = brands
  } catch (e) {
    console.log(e)
  }
})
const error = ref('')
const countryFilter = ref()
const brandFilter = ref()
watch(
  page,
  async () => {
    try {
      const rawList = await trpc.pizza.get.query({
        country: countryFilter.value,
        brand: brandFilter.value,
        page: page.value
      })
      pizzas.value = rawList
    } catch (e) {
      console.log(e)
    }
  },
  { immediate: true }
)
</script>

<template>
  <div>
    <header class="h-60 grid place-content-center">
      <h1>Pizza Base</h1>
    </header>
    <div class="container grid place-content-center">
      <RouterLink to="/create">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Create new pizza
        </button>
      </RouterLink>
      <div v-if="pizzas.length">
        <h3>Current base:</h3>
        <select v-bind="countryFilter">
          <option disabled value="">Select by country</option>
          <option v-for="country in countryOptions" :key="country" :value="country">
            {{ country }}
          </option>
        </select>
        <select v-bind="brandFilter">
          <option disabled value="">Select by brand</option>
          <option v-for="brand in brandOptions" :key="brand" :value="brand">
            {{ brand }}
          </option>
        </select>
        <div class="grid grid-flow-col auto-cols-max w-3/4 h-full">
          <PizzaSmall
            v-for="pizza in pizzas"
            :pizza-name="pizza.name"
            :brand="pizza.brand.title"
            :country="pizza.brand.country.name"
            :image-url="pizza.images[0].source"
            :key="pizza.name"
          ></PizzaSmall>
        </div>
      </div>
      <div v-if="error">{{ error }}</div>
    </div>
  </div>
</template>
