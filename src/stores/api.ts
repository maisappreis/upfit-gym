import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useApiStore = defineStore('api', () => {
  const isAuthenticated = ref(false)
  const apiURL = ref('')
  const currentPath = ref('')

  const getPath = (path: string) => {
    currentPath.value = path
  }

  const checkAuthentication = () => {
    const token = localStorage.getItem('authToken')
 
    if (currentPath.value === '/login' && token == null) {
      apiURL.value = `${import.meta.env.VITE_API_URL}`
    } else {
      if (token) {
        isAuthenticated.value = true
        apiURL.value = `${import.meta.env.VITE_API_URL}`
      } else {
        isAuthenticated.value = false
        apiURL.value = `${import.meta.env.VITE_API_URL}/test`
      }
    }
  }

  const getCSRFToken = () => {
    const csrfCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken'));
    return csrfCookie ? csrfCookie.split('=')[1] : null;
  };

  checkAuthentication()

  return {
    isAuthenticated,
    apiURL,
    checkAuthentication,
    getPath,
    getCSRFToken
  }
})
