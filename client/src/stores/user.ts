import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { trpc } from '../trpc'
import { clearStoredAccessToken, getStoredAccessToken, storeAccessToken } from '@/utils/auth'

const authToken = ref(getStoredAccessToken(localStorage))
export const isLoggedIn = computed(() => !!authToken.value)

export const useUserStore = defineStore('user', () => {
  async function logIn({ email, password }: { email: string; password: string }) {
    const { accessToken } = await trpc.user.login.mutate({
      email,
      password
    })

    authToken.value = accessToken
    storeAccessToken(localStorage, accessToken)
  }
  function logOut() {
    authToken.value = null
    clearStoredAccessToken(localStorage)
  }

  return { isLoggedIn, logIn, logOut }
})
