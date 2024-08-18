<template>
  <div class="login-area">
    <div class="login-form">
      <img class="logo-area" :src="logoUpfit" alt="Logotype company" />
      <form class="form-area" @submit.prevent="loginUser">
        <div class="form-field">
          <label for="name">Username:</label>
          <input type="text" id="username" name="username" v-model="username" required />
        </div>
        <div class="form-field">
          <label for="password">Senha:</label>
          <input type="password" id="password" name="password" v-model="password" required />
        </div>
        <div class="button-area">
          <DefaultButton type="submit" :disable="disable">Entrar</DefaultButton>
        </div>
      </form>
    </div>
    <RequestAlert
      v-if="responseMessage"
      :responseMessage="responseMessage"
      @closeMessage="responseMessage = ''"
    >
      {{ responseMessage }}
    </RequestAlert>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useApiStore } from '@/stores/api'
import axios from 'axios'
import DefaultButton from '../components/common/DefaultButton.vue'
import RequestAlert from '../components/common/RequestAlert.vue'
import logoUpfit from '../assets/logo-upfit.png'

const username = ref('')
const password = ref('')
const csrfToken = ref('')
const responseMessage = ref('')
const router = useRouter()
const apiStore = useApiStore()

const disable = computed(() => {
  return username.value == '' || password.value == ''
})

const fetchCsrfToken = async () => {
  const response = await axios.get(`${apiStore.apiURL}/accounts/set-csrf-token/`, {
    withCredentials: true
  })
  const csrfToken = response.data.csrfToken || document.cookie.match(/csrftoken=([^;]+)/)[1]
  return csrfToken
}

const loginUser = async () => {
  try {
    let login = {
      username: username.value,
      password: password.value
    }
    const response = await axios.post(`${apiStore.apiURL}/accounts/login/`, login, {
      headers: {
        'X-CSRFToken': csrfToken.value,
        'content-type': 'application/x-www-form-urlencoded'
      },
      withCredentials: true
    })

    const token = response.data.token

    if (token) {
      localStorage.setItem('authToken', token)

      responseMessage.value = 'Login realizado com sucesso!'

      setTimeout(() => {
        router.push('/')
      }, 800)
      apiStore.checkAuthentication()
    }
  } catch (error) {
    console.error(error)
    responseMessage.value = 'Erro ao fazer login.'
  }
}

onMounted(async () => {
  // Check if the user is already logged in.
  apiStore.getCSRFToken()
  if (apiStore.tokenCSRF) {
    responseMessage.value = 'Você já está logado! Redirecionando...'
    setTimeout(() => {
      router.push('/')
    }, 2000)
  } else {
    const route = useRoute()
    apiStore.getPath(route.path)
    if (route.path == '/login') {
      apiStore.checkAuthentication()
      csrfToken.value = await fetchCsrfToken()
    }
  }
})
</script>

<style scoped>
.login-area {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
}

.logo-area {
  margin: 20px;
  height: 80px;
}

.login-form {
  background-color: white;
  width: 35vw;
  height: fit-content;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.3);
}

.form-field {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

label {
  text-align: left;
  font-size: 18px;
  margin-bottom: 10px;
}

input {
  padding: 5px;
  border-radius: 5px;
  border: 2px solid #b4b4b4;
  font-size: 16px;
  height: 30px;
}

.button-area {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

@media only screen and (max-width: 1000px) {
  .logo-area {
    margin: 0;
    height: 30px;
  }

  .login-form {
    width: 50vw;
    padding: 20px;
  }

  .form-field {
    margin-bottom: 10px;
  }

  label {
    font-size: 14px;
    margin-bottom: 10px;
  }

  input {
    padding: 5px;
    font-size: 14px;
    height: 20px;
  }
}
</style>