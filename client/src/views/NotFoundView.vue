<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="container h-screen grid place-content-center">
    <h1 class="text-6xl">Not Found</h1>
    <p class="py-8">Oops, the page you were looking for was not found.</p>
    <p>
      <RouterLink to="/"
        ><button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Back to homepage
        </button></RouterLink
      >
    </p>
  </main>
</template>
