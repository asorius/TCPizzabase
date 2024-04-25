<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
defineProps(['status'])
</script>

<template>
  <div
    v-if="status"
    class="absolute inset-0 bg-black opacity-20 grid place-content-center text-3xl"
  >
    ⌛
  </div>
</template>
