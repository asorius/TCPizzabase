<script setup lang="ts">
import { RouterView } from 'vue-router'
const hash = localStorage.getItem('accessToken')
</script>

<template>
  <RouterView />
  <div>{{ hash }}</div>
</template>
