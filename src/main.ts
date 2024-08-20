import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router/index';
import './assets/variables.css';
import './assets/global.css';
import axios from './axiosConfig';

import { library } from './icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { globalVariablesMixin } from './utils/variables.js';

import { globalMethods } from './utils/methods.js';
import { globalComputed } from './utils/computed.js';

const app = createApp(App);
const pinia = createPinia();

app.mixin(globalVariablesMixin);
app.component('font-awesome-icon', FontAwesomeIcon)
app.config.globalProperties.$methods = globalMethods.methods;
app.config.globalProperties.$computed = globalComputed.computed;
app.config.globalProperties.$axios = axios;
app.use(library);
app.use(router);
app.use(pinia);

app.mount('#app');