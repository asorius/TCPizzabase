<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <header
    class="w-full flex bg-gray-100 text-black p-4 drop-shadow-md font-bold tracking-normal text-xl z-40"
  >
    <div class="flex-grow">
      <RouterLink
        to="/"
        data-testid="logo"
        title="Home"
        class="transition hover:text-fuchsia-600 hover:tracking-widest"
        >PizzaBase</RouterLink
      >
    </div>
    <div class="flex-none">
      <RouterLink
        to="/login"
        data-testid="logo"
        title="Home"
        class="bg-blue-500 hover:bg-blue-700 text-white font-semibold hover:text-white py-1 px-4 border border-blue-500 hover:border-transparent rounded"
        >Login</RouterLink
      >
      <RouterLink
        to="/signup"
        data-testid="logo"
        title="Home"
        class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-4 border border-blue-500 hover:border-transparent rounded"
        >Sign Up</RouterLink
      >
    </div>
  </header>
</template>
