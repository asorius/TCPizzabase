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
  <select v-model="country" id="country" class="w-full border rounded p-2" required>
    <option value="" selected disabled>Select a country</option>
    <option v-for="country in countries" :key="country.label" :value="country.label">
      {{ country.label }}, {{ country.code }}
    </option>
  </select>
</template>
