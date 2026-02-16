<template>
  <div class="login-area">
    <div class="login-form">
      <img class="logo-area" :src="logoUpfit" alt="Logotype company" />
      <form class="form-area" @submit.prevent="loginUser">
        <div class="form-field">
          <label for="name">Username:</label>
          <input type="text" id="username" name="username" v-model="form.username" required />
        </div>
        <div class="form-field">
          <label for="password">Senha:</label>
          <input type="password" id="password" name="password" v-model="form.password" required />
        </div>
        <div class="button-area">
          <BaseButton type="submit" size="lg" :disabled="disable">
            Entrar
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { usePageStore } from "@/stores/page";
import { useAlertStore } from "@/stores/alert";
import { useLoadingStore } from "@/stores/loading";

import BaseButton from "@/components/base/BaseButton.vue";
import logoUpfit from "@/assets/logo-upfit.png";

const router = useRouter();
const authStore = useAuthStore();
const pageStore = usePageStore();
const alertStore = useAlertStore();
const loadingStore = useLoadingStore();

const form = reactive({
  username: "",
  password: ""
});

const disable = computed(
  () => !form.username || !form.password
);

const loginUser = async () => {
  try {
    loadingStore.start();

    await authStore.login(form);

    alertStore.success("Login realizado com sucesso!");
    pageStore.openPage("metrics");

    router.push("/");
  } catch (err) {
    alertStore.error("Erro ao fazer login.", err);
  } finally {
    loadingStore.stop();
  }
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