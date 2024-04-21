<script setup lang="ts">
import Create from '../components/Create.vue'
import { RouterLink } from 'vue-router'
</script>

<template>
  <main>
    <RouterLink to="/">
      <p class="green">back</p>
    </RouterLink>
    <Create />
  </main>
</template>
