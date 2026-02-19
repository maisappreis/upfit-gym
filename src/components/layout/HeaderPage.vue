<template>
  <div class="header-area">
    <div class="text-box">
      <div class="header-title">
        <font-awesome-icon :icon="pageConfig.icon" class="icon" />
        <h2 class="title">{{ pageConfig.title }}</h2>
      </div>
      <p class="subtitle">{{ pageConfig.subtitle }}</p>
    </div>

    <div v-if="authStore.isAuthenticated" class="login" @click="showDropdown">
      <span>Olá, <strong>Renan</strong></span>
      <font-awesome-icon icon="fa-solid fa-circle-user" style="margin-left: 10px; zoom: 1.3" />
    </div>

    <RouterLink v-else to="/login">
      <font-awesome-icon icon="fa-solid fa-right-to-bracket" class="login-icon" />
    </RouterLink>

    <div v-if="openDropdown" class="dropdown" @click="authStore.logout">
      <font-awesome-icon icon="fa-solid fa-right-to-bracket" style="margin-right: 10px" />
      Logout
    </div>
  </div>
  <RouterView />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const authStore = useAuthStore();

const openDropdown = ref<boolean>(false);

const showDropdown = () => {
  openDropdown.value = !openDropdown.value;
};

const pageConfig = computed(() => {
  return route.meta as {
    icon?: string;
    title?: string;
    subtitle?: string;
  };
});
</script>

<style scoped>
.header-area {
  position: fixed;
  top: 0;
  left: 0;

  width: 80%;
  height: var(--header-height);

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 5vw 0 calc(var(--sidebar-width) + 30px);
  background: var(--gray-lighter);
  box-shadow: 0 8px 6px -6px var(--secondary-color);
  z-index: 10;
}

/* ===== TEXT AREA ===== */

.text-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon {
  font-size: 24px;
}

.title {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
}

.subtitle {
  margin: 8px 0 0 0;
  font-size: 1rem;
  font-weight: 500;
  color: var(--gray-darker);
}

/* ===== LOGIN AREA ===== */

.login {
  display: flex;
  align-items: center;
  gap: 10px;

  font-size: 1.05rem;
  color: black;
  cursor: pointer;
}

.login-icon {
  font-size: 1.5rem;
  color: black;
}

/* ===== DROPDOWN ===== */

.dropdown {
  position: absolute;
  top: calc(var(--header-height) - 5px);
  right: 12px;

  display: flex;
  align-items: center;
  gap: 10px;

  padding: 12px 18px;

  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgb(0 0 0 / 18%);

  cursor: pointer;
  transition: background 0.2s ease;
}

.dropdown:hover {
  background: rgb(245, 245, 245);
}

@media (max-width: 1200px) {
  .header-area {
    width: 85%;
    padding: 0 5vw 0 calc(var(--sidebar-width) + 20px);
  }

  .subtitle {
    display: none;
  }
}
</style>