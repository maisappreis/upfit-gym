<template>
  <div class="header-area">
    <div class="text-box">
      <div class="header-title">
        <font-awesome-icon :icon="icon" class="icon" />
        <h2 class="title">{{ title }}</h2>
      </div>
      <p class="subtitle">{{ subtitle }}</p>
    </div>
    <div v-if="authStore.isAuthenticated" id="login" @click="showDropdown">
      <span>Olá, <strong>Renan</strong></span>
      <font-awesome-icon icon="fa-solid fa-circle-user" style="margin-left: 10px; zoom: 1.3" />
    </div>
    <RouterLink v-else to="/login">
      <font-awesome-icon icon="fa-solid fa-right-to-bracket" id="login-icon" />
    </RouterLink>
    <div v-if="openDropdown" class="dropdown" @click="authStore.logout">
      <font-awesome-icon icon="fa-solid fa-right-to-bracket" style="margin-right: 10px" />
      Logout
    </div>
  </div>
  <AlertMessage
    v-if="responseMessage"
    :responseMessage="responseMessage"
    @close-message="responseMessage = ''"
  >
    {{ responseMessage }}
  </AlertMessage>
  <RouterView />
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { RouterLink, RouterView } from "vue-router";
import { usePageStore } from "@/stores/page";
import { useAuthStore } from "@/stores/auth";
import AlertMessage from "@/components/common/AlertMessage.vue";

const authStore = useAuthStore();
const pageStore = usePageStore();

const icon = ref<string>("fa-solid fa-chart-line");
const title = ref<string>("Métricas");
const subtitle = ref<string>("Visualização gráfica de receita, despesas, lucro e clientes");
const openDropdown = ref<boolean>(false);
const responseMessage = ref<string>("");

const showDropdown = () => {
  openDropdown.value = !openDropdown.value;
};

watch(
  () => pageStore.currentPage,
  (newVal) => {
    switch (newVal) {
      case "metrics":
        icon.value = "fa-solid fa-chart-line";
        title.value = "Métricas";
        subtitle.value = "Visualização gráfica de receita, despesas, lucro e clientes";
        break;
      case "customers":
        icon.value = "fa-solid fa-users";
        title.value = "Clientes";
        subtitle.value = "Cadastramento dos clientes";
        break;
      case "revenue":
        icon.value = "fa-solid fa-hand-holding-dollar";
        title.value = "Receitas";
        subtitle.value = "Controle do recebimento das mensalidades dos clientes";
        break;
      case "expenses":
        icon.value = "fa-solid fa-money-bill-transfer";
        title.value = "Despesas";
        subtitle.value = "Controle do pagamento das contas";
        break;
      default:
        icon.value = "";
        title.value = "";
        subtitle.value = "";
    }
  }
);
</script>

<style scoped>
.header-area {
  position: fixed;
  top: 0;
  background-color: rgb(235, 235, 235);
  box-shadow: 0 8px 6px -6px rgb(99, 99, 99);
  height: 80px;
  width: 100%;
  z-index: 9;

  display: flex;
  justify-content: space-between;
}

.text-box {
  text-align: left;
  margin-left: 240px;
}

.header-title {
  display: flex;
}

.title {
  margin: 15px 0 0 0;
}

.icon {
  margin: 15px 15px 10px 15px;
  font-size: 25px;
}

.subtitle {
  margin: 0 5px 5px 15px;
  padding-bottom: 5px;
}

#login {
  margin: 25px 20px 0 0;
  font-size: 20px;
  color: black;
  cursor: pointer;
}

#login-icon {
  margin: 20px 20px 0 0;
  zoom: 1.5;
  color: black;
  cursor: pointer;
}

.dropdown {
  position: absolute;
  top: 70px;
  right: 10px;
  z-index: 10;
  background-color: rgb(235, 235, 235);
  padding: 20px 40px;
  box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

@media only screen and (max-width: 1300px) {
  .text-box {
    text-align: left;
    margin-left: 110px;
  }
}

@media only screen and (max-width: 1000px) {
  .header-area {
    height: 40px;
  }

  .text-box {
    margin-left: 75px;
  }

  .title {
    margin: 6px 6px 10px 6px;
    font-size: 20px;
  }

  .subtitle {
    display: none;
  }

  .icon {
    margin: 10px 5px 0 10px;
    font-size: 20px;
  }

  #login {
    margin: 6px 20px 0 0;
    font-size: 18px;
    color: black;
  }

  #login-icon {
    margin: 5px 20px 0 0;
  }

  .dropdown {
    position: absolute;
    top: 40px;
    right: 15px;
    padding: 10px 20px;
  }
}
</style>