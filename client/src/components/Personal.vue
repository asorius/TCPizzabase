<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { trpc } from '../trpc'
import PizzaSmall from '../components/PizzaSmall.vue'
import { useUserStore } from '../stores/user'
const userStore = useUserStore()
const pizzas = ref<any[] | []>([])

onBeforeMount(async () => {
  try {
    const list = await trpc.pizza.getByUser.query(Number(userStore.authUserId))
    pizzas.value = list
  } catch (e) {
    console.log(e)
  }
})
</script>

<template>
  <div class="grid place-content-center w-full">
    <h3 class="w-1/2 mx-auto text-center text-2xl py-4">Current base</h3>
    <p>Pizzas you've created or have uploaded a review</p>
    <div v-if="pizzas.length">
      <div
        class="grid mx-auto md:grid-flow-row md:grid-cols-2 lg:grid-cols-4 auto-rows-auto gap-4 w-3/4 place-content-center h-full lg:w-full lg:max-w-4xl border"
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
