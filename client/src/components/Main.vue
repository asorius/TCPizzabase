<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'
import { trpc } from '../trpc'
import PizzaSmall from '../components/PizzaSmall.vue'
import { RouterLink } from 'vue-router'
const pizzas = ref<any[] | []>([])
const page = ref(0)
const countryOptions = ref<string[]>([])
const brandOptions = ref<string[]>([])

onBeforeMount(async () => {
  try {
    // Load all possible search values
    const { countries, brands } = await trpc.pizza.searchOptions.query()
    countryOptions.value = countries
    brandOptions.value = brands
    console.log(countries, brands)
  } catch (e) {
    console.log(e)
  }
})

const countryFilter = ref()
const brandFilter = ref()

watch(
  page,
  async () => {
    // should query the next batch whenever page is changed theoretically
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

watch([countryFilter, brandFilter], async () => {
  // should update pizzas list with filtered data whenever these filter values change
  // does not work at the moment
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
})
console.log(countryFilter.value)
</script>

<template>
  <header class="h-80 w-full flex justify-center items-center bg-hero-image bg-center bg-cover">
    <h1
      class="bg-white w-1/2 max-w-80 text-4xl md:text-7xl font-bold p-4 rounded-lg text-black mix-blend-screen"
    >
      <span class="block">Pizza</span>
      <span class="block">Base</span>
    </h1>
  </header>
  <div class="grid place-content-center w-full">
    <div class="grid place-content-center w-10/12 m-auto p-2 gap-10">
      <div class="font-thin grid gap-4 py-4">
        <p>Check *real* *unedited* pizzas.</p>
        <p>Compare between different brands.</p>
        <p>Compare between different countries.</p>
      </div>
      <div>
        <div class="bg-white p-4 rounded-lg shadow-md grid place-content-center">
          <p class="text-center text-2xl font-bold mb-4">Add your own pizza toppings to the</p>
          <p class="text-center text-4xl font-extrabold">
            🍕
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-500">
              Pizza Base
            </span>
            🌶️
          </p>
          <RouterLink
            to="/create"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-3/4 mx-auto my-5 text-center"
          >
            <button>Create New Pizza</button>
          </RouterLink>
        </div>
      </div>
    </div>
    <div v-if="pizzas.length">
      <h3 class="w-1/2 mx-auto text-center text-2xl py-4">Current base</h3>
      <div class="grid place-content-center grid-flow-row md:grid-flow-col gap-6">
        <!-- These select does not bind how they should for some reason -->
        <label for="countryFilter">Filter by country</label>
        <select id="countryFilter" v-bind="countryFilter" class="border rounded py-2">
          <option value="" selected>All</option>
          <option v-for="country in countryOptions" :key="country" :value="country">
            {{ country }}
          </option>
        </select>
        <label for="brandFilter">Filter by brand</label>
        <select id="brandFilter" v-bind="brandFilter" class="border rounded py-2">
          <option value="" selected>All</option>
          <option v-for="brand in brandOptions" :key="brand" :value="brand">
            {{ brand }}
          </option>
        </select>
      </div>
      <div class="grid md:grid-flow-col auto-cols-max gap-4 w-3/4 place-content-center h-full">
        <PizzaSmall
          v-for="pizza in pizzas"
          :id="pizza.id"
          :pizza-name="pizza.name"
          :brand="pizza.brand.title"
          :country="pizza.brand.country.name"
          :image-url="pizza.images[0].source"
          :images="pizza.images"
          :key="pizza.name"
        ></PizzaSmall>
      </div>
    </div>
  </div>
</template>
