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
      // apiURL.value = `${import.meta.env.VITE_API_URL}`
      apiURL.value = `https://django-apis-two.vercel.app/api`
    } else {
      if (token) {
        isAuthenticated.value = true
        // apiURL.value = `${import.meta.env.VITE_API_URL}`
        apiURL.value = `https://django-apis-two.vercel.app/api`
      } else {
        isAuthenticated.value = false
        // apiURL.value = `${import.meta.env.VITE_API_URL}/test`
        apiURL.value = `https://django-apis-two.vercel.app/api/test`
      }
    }
  }

  const getCSRFToken = () => {
    console.log('document.cookie', document.cookie)
    const csrfCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken'));
    console.log('csrfCookie', csrfCookie)
    return csrfCookie ? csrfCookie.split('=')[1] : null;
  };

  // const getCSRFToken = () => {
  //   console.log('document', document)
  //   const csrfCookie = document.cookie
  //     .split('; ')
  //     .find(row => row.startsWith('csrftoken='));
  //   return csrfCookie ? csrfCookie.split('=')[1] : null;
  // };

  checkAuthentication()

  return {
    isAuthenticated,
    apiURL,
    checkAuthentication,
    getPath,
    getCSRFToken
  }
})
