<template>
  <aside class="sidebar-area">
    <div>
      <LogoType class="logo-area" />

      <div class="divider"></div>

      <ul>
        <li
          v-for="item in menuItems"
          :key="item.page"
          class="option pad"
        >
          <RouterLink
            :to="`/${item.page}`"
            class="router-link">
            <font-awesome-icon
              :icon="item.icon"
              class="icon"
            />
            <span class="option-text">
              {{ item.label }}
            </span>
          </RouterLink>
        </li>
      </ul>
    </div>

    <div style="margin-bottom: 20px;">
      <div class="divider"></div>

      <span class="sidebar-footer">
        Desenvolvido com
        <font-awesome-icon icon="fa-solid fa-heart" class="red" /> por <span class="red">Maisa</span>.
      </span>
    </div>
  </aside>
</template>

<script setup lang="ts">
import LogoType from "./LogoType.vue";

type PageName =
  | "metricas"
  | "clientes"
  | "receitas"
  | "despesas";

interface MenuItem {
  page: PageName;
  label: string;
  icon: string;
}

const menuItems: MenuItem[] = [
  {
    page: "metricas",
    label: "Métricas",
    icon: "fa-solid fa-chart-line",
  },
  {
    page: "clientes",
    label: "Clientes",
    icon: "fa-solid fa-users",
  },
  {
    page: "receitas",
    label: "Receitas",
    icon: "fa-solid fa-hand-holding-dollar",
  },
  {
    page: "despesas",
    label: "Despesas",
    icon: "fa-solid fa-money-bill-transfer",
  },
];
</script>

<style scoped>

/* ===== SIDEBAR ===== */

.sidebar-area {
  position: fixed;
  inset: 0 auto 0 0;

  width: var(--sidebar-width);
  height: 100%;

  border-radius: 0 40px 0 0;
  background: var(--primary-color);
  z-index: 10;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  overflow-y: auto;
  overflow-x: hidden;
}

/* ===== LOGO ===== */

.logo-area {
  margin: 30px auto 24px;
  width: 50%;
  max-width: 160px;
  height: auto;
}

/* ===== LIST ===== */

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* ===== MENU ITEM ===== */

.option {
  width: 100%;
}

/* LINK (área clicável real) */
.router-link {
  display: flex;
  align-items: center;
  gap: 12px;

  width: 100%;
  min-height: 70px;

  padding: 0 18px;
  margin: 20px 0 20px 20px;

  color: white;
  text-decoration: none;

  font-size: 1rem;
  font-weight: 500;

  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.icon {
  flex-shrink: 0;
  font-size: 20px;
  color: currentColor;
}

/* ===== STATES ===== */

.router-link:hover {
  background: var(--secondary-color);
  border-radius: 15px 0 0 15px;
}

.router-link-exact-active {
  background: var(--gray-medium);
  color: black;
  font-weight: 600;

  position: relative;
  border-radius: 15px 0 0 15px;
  z-index: 1;
}

/* ===== TEXT ===== */

.option-text {
  white-space: nowrap;
}

.sidebar-footer {
  margin: 40px 20px;
  color: white;
  font-size: 10px;
  text-align: center;
}

/* ===== RESPONSIVE ===== */

@media (max-width: 1300px) {

  .logo-area {
    width: 60%;
  }

  .option-text {
    display: none;
  }

  .icon {
    font-size: 24px;
  }

  .sidebar-footer {
    display: none;
  }
}

@media (max-width: 1000px) {

  .logo-area {
    width: 75%;
  }

  .router-link {
    min-height: 50px;
    margin: 8px 0 8px 10px;
  }

  .icon {
    font-size: 20px;
  }
}
</style>