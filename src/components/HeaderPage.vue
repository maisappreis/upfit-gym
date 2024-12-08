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

<script>
import { RouterLink, RouterView } from 'vue-router'
import { mapStores, mapState } from 'pinia'
import { usePageStore } from '@/stores/page'
import { useApiStore } from '@/stores/api'
import { useAuthStore } from '@/stores/auth'
import AlertMessage from './common/AlertMessage.vue'

export default {
  name: 'HeaderPage',
  components: {
    RouterLink,
    RouterView,
    AlertMessage
  },
  data() {
    return {
      icon: 'fa-solid fa-chart-line',
      title: 'Métricas',
      subtitle: 'Visualização gráfica de receita, despesas, lucro e clientes',
      openDropdown: false,
      responseMessage: ''
    }
  },
  computed: {
    ...mapStores(useApiStore, useAuthStore),
    ...mapState(usePageStore, ['currentPage'])
  },

  methods: {
    showDropdown() {
      this.openDropdown = !this.openDropdown
    }
  },
  watch: {
    currentPage(newVal) {
      switch (newVal) {
        case 'metrics':
          this.icon = 'fa-solid fa-chart-line'
          this.title = 'Métricas'
          this.subtitle = 'Visualização gráfica de receita, despesas, lucro e clientes'
          break
        case 'customers':
          this.icon = 'fa-solid fa-users'
          this.title = 'Clientes'
          this.subtitle = 'Cadastramento dos clientes'
          break
        case 'revenue':
          this.icon = 'fa-solid fa-hand-holding-dollar'
          this.title = 'Receitas'
          this.subtitle = 'Controle do recebimento das mensalidades dos clientes'
          break
        case 'expenses':
          this.icon = 'fa-solid fa-money-bill-transfer'
          this.title = 'Despesas'
          this.subtitle = 'Controle do pagamento das contas'
          break
        default:
          this.icon = ''
          this.title = ''
          this.subtitle = ''
      }
    }
  }
}
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