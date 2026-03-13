<template>
  <div class="login-area">
    <div class="login-box">
      <div class="text-center">
        <h3>
          Entrar na aplicação como usuário demo
        </h3>
        <h4>
          Log in to the application as a demo user
        </h4>
      </div>
      <div class="text-center">
        <p>
          Essa aplicação faz parte de um portfólio do Github,
          por isso possibilita acesso no modo demostração.
        </p>
        <p>
          This application is part of a Github portfolio,
          therefore it allows access in demo mode.
        </p>
      </div>
      <div class="button-area">
        <BaseButton size="lg" @click="loginDemoUser">
          Entrar
        </BaseButton>
      </div>
    </div>

    <div class="login-box">
      <img class="logo-area" :src="logoUpfit" alt="Logotype company" />
      <form id="loginForm" class="form-area" @submit.prevent="loginRealUser">
        <div class="form-field">
          <label for="name">Username:</label>
          <input type="text" id="username" name="username" v-model="form.username" required />
        </div>

        <div class="form-field">
          <label for="password">Senha:</label>
          <input type="password" id="password" name="password" v-model="form.password" required />
        </div>
      </form>
      <div class="button-area">
        <BaseButton form="loginForm" type="submit" size="lg" :disabled="disable">
          Entrar
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useAlertStore } from "@/stores/alert";
import { useLogin } from "@/composables/useLogin";

import BaseButton from "@/components/BaseButton.vue";
import logoUpfit from "@/assets/images/logo-black.png";

const router = useRouter();
const authStore = useAuthStore();
const alertStore = useAlertStore();
const { login } = useLogin();

const form = reactive({
  username: "",
  password: ""
});

const disable = computed(
  () => !form.username || !form.password
);

const loginRealUser = async () => {
  const success = await login(form);

  if (success) router.push("/metricas");
};

const loginDemoUser = async () => {
  const success = await login({
    username: "demo",
    password: "demo123"
  });

  if (success) router.push("/metricas");
};

onMounted(() => {
  authStore.checkAuthentication();

  if (authStore.isAuthenticated) {
    alertStore.success("Você já está logado! Redirecionando...");
    router.push("/");
  }
});
</script>

<style scoped>
.login-area {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;

  min-height: 100vh;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

.login-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  min-height: 60vh;
  background-color: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.3);
}

.logo-area {
  margin: 20px auto;
  height: 80px;
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

.text-center {
  text-align: center;
}

@media only screen and (max-width: 1000px) {
  .login-area {
    flex-direction: column;
    margin: 10vh auto;
  }

  .login-box {
    width: 50vw;
  }

  .logo-area {
    margin: 10px auto;
    height: 50px;
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

@media only screen and (max-width: 500px) {
  .login-area {
    flex-direction: column;
    margin: 30px auto;
  }

  .login-box {
    width: 70vw;
    padding: 20px;
  }

  .logo-area {
    margin: 0 auto 0 auto;
    height: 60px;
  }
}
</style>