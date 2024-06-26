<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'
import { trpc } from '../trpc'
import PizzaSmall from '../components/PizzaSmall.vue'
import { RouterLink } from 'vue-router'
const pizzas = ref<any[] | []>([])
const page = ref(0)
const nextPage = ref(false)
const countryOptions = ref<string[]>([])
const brandOptions = ref<string[]>([])

onBeforeMount(async () => {
  try {
    // Load all possible search values
    const { countries, brands } = await trpc.pizza.searchOptions.query()
    countryOptions.value = countries
    brandOptions.value = brands
  } catch (e) {
    console.log(e)
  }
})

const countryFilter = ref('')
const brandFilter = ref('')

watch(
  [page, countryFilter, brandFilter],
  async () => {
    // should query the next batch whenever page value changes
    try {
      const [rawList, rawListSecondPage] = await Promise.all([
        trpc.pizza.get.query({
          country: countryFilter.value,
          brand: brandFilter.value,
          page: page.value
        }),
        trpc.pizza.get.query({
          country: countryFilter.value,
          brand: brandFilter.value,
          page: page.value + 1
        })
      ])
      // check if there even is a next page
      if (rawListSecondPage.length) {
        nextPage.value = true
      } else {
        nextPage.value = false
      }
      pizzas.value = rawList
    } catch (e) {
      console.log(e)
    }
  },
  { immediate: true }
)

watch([countryFilter, brandFilter], async () => {
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
</script>

<template>
  <header
    class="h-80 lg:h-96 w-full flex justify-center items-center bg-hero-image bg-center bg-cover"
  >
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
            id="createNew"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-3/4 mx-auto my-5 text-center"
          >
            <button>Create New Pizza</button>
          </RouterLink>
        </div>
      </div>
    </div>
    <div v-if="pizzas.length">
      <h3 class="w-1/2 mx-auto text-center text-2xl py-4">Current base</h3>
      <div class="grid place-content-center w-32 grid-flow-col gap-3 mx-auto">
        <!-- to set page to previous one -->
        <button
          class="text-gray-400 hover:underline hover:text-black"
          v-if="page - 1 >= 0"
          @click="page--"
        >
          {{ page }}
        </button>
        <!-- current page display -->
        <div v-if="nextPage" class="underline border p-2">{{ page + 1 }}</div>
        <!-- to set page to next -->
        <button
          class="text-gray-400 hover:underline hover:text-black"
          v-if="nextPage"
          @click="page++"
        >
          {{ page + 2 }}
        </button>
      </div>
      <div class="grid place-content-center grid-flow-row md:grid-flow-col gap-6">
        <!-- These select does not bind how they should for some reason -->
        <label for="countryFilter" class="grid place-content-center">Filter by country</label>
        <select id="countryFilter" v-model="countryFilter" class="border rounded py-2">
          <option value="" selected>All</option>
          <option v-for="country in countryOptions" :key="country" :value="country">
            {{ country }}
          </option>
        </select>
        <label for="brandFilter" class="grid place-content-center">Filter by brand</label>
        <select id="brandFilter" v-model="brandFilter" class="border rounded py-2">
          <option value="" selected>All</option>
          <option v-for="brand in brandOptions" :key="brand" :value="brand">
            {{ brand }}
          </option>
        </select>
      </div>
      <div
        class="grid mx-auto md:grid-flow-row md:grid-cols-2 lg:grid-cols-4 auto-rows-auto gap-4 w-3/4 place-content-center h-full lg:w-full lg:max-w-4xl"
      >
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
