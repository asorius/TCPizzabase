<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import countries from '../utils/countryList'

const emit = defineEmits(['selectCountry'])

const countrySearch = ref('')
const showSearch = ref(false)
const matchingCountries = computed(() => {
  return countries.filter(({ label }) =>
    label.toLocaleLowerCase().includes(countrySearch.value.toLocaleLowerCase())
  )
})

const potentialMatch = computed(() => matchingCountries.value[0])
function selectOnEnter(key: KeyboardEvent) {
  if (key.code === 'Enter') {
    countrySearch.value = potentialMatch.value.label
    showSearch.value = false
    emit('selectCountry', countrySearch.value)
  }
}
function selectOnClick(value: string) {
  countrySearch.value = value
  showSearch.value = false
  emit('selectCountry', countrySearch.value)
}
</script>

<template>
  <div class="relative">
    <input
      type="search"
      id="searchCountries"
      v-model="countrySearch"
      placeholder="Select country"
      autocomplete="false"
      @focus="showSearch = true"
      class="block w-full border rounded p-2"
      @keydown="selectOnEnter"
      required
    />
    <ul
      v-if="showSearch"
      class="absolute top-full w-10/12 mx-auto left-0 inset-0 bg-white border rounded p-2 min-h-min max-h-60 overflow-y-scroll"
    >
      <li
        v-for="country in matchingCountries"
        :key="country.label"
        class="cursor-pointer hover:bg-slate-100 p-1"
        @click="() => selectOnClick(country.label)"
      >
        {{ country.label }}, {{ country.code }}
      </li>
    </ul>
  </div>
</template>
