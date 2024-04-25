import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { trpc } from '../trpc'
import {
  clearStoredAccessToken,
  getStoredAccessToken,
  getStoredEmail,
  getUserIdFromToken,
  storeAccessToken,
  storeUserEmail,
  clearStoredEmail
} from '@/utils/auth'

export const useUserStore = defineStore('user', () => {
  const authToken = ref(getStoredAccessToken(localStorage))
  const authUserId = computed(() => (authToken.value ? getUserIdFromToken(authToken.value) : null))
  const isLoggedIn = computed(() => !!authToken.value)
  const userEmail = ref(getStoredEmail(localStorage))

  async function logIn({ email, password }: { email: string; password: string }) {
    const { accessToken } = await trpc.user.login.mutate({
      email,
      password
    })
    userEmail.value = email
    authToken.value = accessToken
    storeUserEmail(localStorage, userEmail.value)
    storeAccessToken(localStorage, accessToken)
  }

  async function signUp({ email, password }: { email: string; password: string }) {
    const signupResult = await trpc.user.signup.mutate({
      email,
      password
    })
    return signupResult
  }

  function logOut() {
    authToken.value = null
    userEmail.value = null
    clearStoredAccessToken(localStorage)
    clearStoredEmail(localStorage)
  }

  return { isLoggedIn, userEmail, authUserId, logIn, logOut, signUp }
})
