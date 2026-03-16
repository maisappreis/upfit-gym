import { createApp } from "vue";
import { createPinia } from "pinia";
import { useAuthStore } from "@/stores/auth";
import App from "./App.vue";
import router from "./router/index";
import "./assets/css/global.css";

import { library } from "@/icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const app = createApp(App);
const pinia = createPinia();

app.component("font-awesome-icon", FontAwesomeIcon)
app.use(library);
app.use(router);
app.use(pinia);

const authStore = useAuthStore();
authStore.checkAuthentication();

app.mount("#app");