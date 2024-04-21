<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { trpc } from '../trpc'
import { RouterLink } from 'vue-router'
const pizza = ref('')
const page = ref(0)
const error = ref('')
const loading = ref(false)
const message = ref('')

watch(
  page,
  async () => {
    try {
      const ll = await trpc.pizza.get.query({ country: '', brand: '', page: page.value })
      console.log(ll)
    } catch (e) {
      console.log(e)
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="greetings">
    <RouterLink to="/create">
      <h1 class="green">Add a pizza</h1>
    </RouterLink>
    <h3>Placeholder</h3>
    <div v-if="error">{{ error }}</div>
  </div>
</template>
