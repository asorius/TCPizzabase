<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, watch } from 'vue'

import countries from '../utils/countryList'
const emit = defineEmits(['selectCountry'])
const country = ref('')
watch(country, () => {
  emit('selectCountry', country.value)
})
</script>

<template>
  <div>
    <label for="country">Select a country</label>
    <select v-model="country" id="country">
      <option v-for="country in countries" :key="country.label" :value="country.label">
        {{ country.label }}, {{ country.code }}
      </option>
    </select>
  </div>
</template>
<style scoped>
li div {
  width: 20px;
}
image {
  display: block;
  width: 100%;
}
</style>
