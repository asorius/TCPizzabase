<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const showMenu = ref(false)

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}
</script>

<template>
  <header class="w-full bg-gray-100 text-black p-4 drop-shadow-md">
    <div class="container flex mx-auto">
      <div class="flex-grow">
        <RouterLink
          to="/"
          data-testid="logo"
          title="Home"
          class="transition hover:text-fuchsia-600 hover:tracking-widest font-bold tracking-normal text-xl"
          >PizzaBase</RouterLink
        >
      </div>

      <div v-if="userStore.isLoggedIn" class="user-menu relative">
        <button
          @click="toggleMenu"
          class="menu-button bg-blue-500 text-white px-4 py-2 rounded-md text-ellipsis"
        >
          {{ userStore.userEmail }}
        </button>
        <ul
          v-if="showMenu"
          class="menu-list absolute z-80 top-10 right-0 bg-white border border-gray-300 rounded-md shadow-md p-6 grid gap-6"
        >
          <li>
            <a href="#" class="block px-4 py-2 text-gray-800 hover:bg-blue-100 underline"
              >View Your Base</a
            >
          </li>
          <li>
            <button
              class="border rounded p-1 px-2 mx-auto block text-gray-800 hover:bg-blue-100"
              @click="userStore.logOut"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
      <div v-else class="flex-none grid gap-4 grid-flow-col">
        <RouterLink
          to="/login"
          data-testid="logo"
          title="Home"
          class="bg-blue-500 hover:bg-blue-700 text-white text-sm font-normal hover:text-white py-1 px-4 border border-blue-500 hover:border-transparent rounded"
          >Login</RouterLink
        >
        <RouterLink
          to="/signup"
          data-testid="logo"
          title="Home"
          class="bg-transparent hover:bg-blue-500 text-blue-700 text-sm font-normal hover:text-white py-1 px-4 border border-blue-500 hover:border-transparent rounded"
          >Sign Up</RouterLink
        >
      </div>
    </div>
  </header>
</template>
