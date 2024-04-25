<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'
import Error from './Error.vue'
import Loading from './Loading.vue'
const router = useRouter()

const userStore = useUserStore()

const password = ref('')
const confirmPassword = ref('')
const email = ref('')
const error = ref('')
const loading = ref(false)
async function submitForm() {
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    setTimeout(() => {
      error.value = ''
    }, 2000)
    return
  }
  try {
    loading.value = true
    await userStore.signUp({
      email: email.value,
      password: password.value
    })
    loading.value = false
    router.push({ name: 'Login' })
  } catch (e: any) {
    loading.value = false
    error.value = e.message
  }
  setTimeout(() => {
    error.value = ''
  }, 2000)
}
</script>

<template>
  <div class="w-full min-h-screen flex items-center justify-center">
    <div class="bg-white p-8 rounded shadow-md w-11/12 max-w-md relative overflow-hidden">
      <Loading :status="loading"></Loading>
      <h2 class="text-2xl font-semibold mb-4">Create new account</h2>
      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            name="email"
            class="mt-1 p-2 border rounded w-full"
            required
          />
        </div>
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            v-model="password"
            type="password"
            id="password"
            name="password"
            class="mt-1 p-2 border rounded w-full"
            required
            minlength="8"
          />
        </div>
        <div class="mb-4">
          <label for="password-confirm" class="block text-sm font-medium text-gray-700"
            >Confirm password</label
          >
          <input
            type="password"
            id="password-confirm"
            name="password-confirm"
            v-model="confirmPassword"
            class="mt-1 p-2 border rounded w-full"
            required
            minlength="8"
          />
        </div>
        <Error :message="error"></Error>
        <div class="flex justify-around md:w-1/2 m-auto">
          <button
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Sign up
          </button>
          <RouterLink to="/">
            <button
              type="submit"
              class="bg-transparent hover:bg-blue-500 text-blue-500 hover:text-white border border-blue-500 rounded px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              Cancel
            </button>
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>
