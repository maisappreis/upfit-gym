<template>
  <div class="login-area">
    <div class="login-form">
      <img class="logo-area" :src="logoUpfit" alt="Logotype company" />
      <form class="form-area" @submit.prevent="loginUser">
        <div class="form-field">
          <label for="name">E-mail:</label>
          <input type="text" id="email" name="email" v-model="email" required />
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { globalVariablesMixin } from '../utils/variables'
import axios from 'axios'
import DefaultButton from '../components/common/DefaultButton.vue'
import RequestAlert from '../components/common/RequestAlert.vue'
import logoUpfit from '../assets/logo-upfit.png'

const email = ref('')
const password = ref('')
const responseMessage = ref('')
const router = useRouter()
const apiURL = globalVariablesMixin.data().apiURL

const disable = computed(() => {
  return email.value == '' || password.value == ''
})

const loginUser = async () => {
  try {
    let login = {
      email: email,
      password: password
    }

    await axios.post(`${apiURL}/login/`, login)
    responseMessage.value = 'Login realizado com sucesso!'

    setTimeout(() => {
      router.push('/')
    }, 800)
  } catch (error) {
    console.error(error)
    responseMessage.value = 'Erro ao fazer login.'
  }
}
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