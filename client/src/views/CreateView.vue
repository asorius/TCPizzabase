<script setup lang="ts">
import Create from '../components/Create.vue'
import Navbar from '../components/Navbar.vue'
</script>

<template>
  <main class="bg-gray-200 min-h-screen">
    <Navbar></Navbar>
    <div class="container">
      <div class="text-4xl p-4 text-center">🍕</div>
      <Create></Create>
      <div class="text-4xl p-4 text-center">🌶️</div>
    </div>
  </main>
</template>
