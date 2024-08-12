import { createApp } from 'vue';
import App from './App.vue';
import './assets/variables.css';
import './assets/global.css';

import { library } from './icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { globalVariablesMixin } from './utils/variables.js';

import { globalMethods } from './utils/methods.js';
import { globalComputed } from './utils/computed.js';

const app = createApp(App);
app.mixin(globalVariablesMixin);
app.component('font-awesome-icon', FontAwesomeIcon)
app.config.globalProperties.$methods = globalMethods.methods;
app.config.globalProperties.$computed = globalComputed.computed;
app.use(library);

app.mount('#app');