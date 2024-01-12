import { createApp } from 'vue';
import App from './App.vue';
import './styles/variables.css';
import './styles/global.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import { faHandHoldingDollar } from '@fortawesome/free-solid-svg-icons';
import { faMoneyBillTrendUp } from '@fortawesome/free-solid-svg-icons';
import { faMoneyBillTransfer } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';


library.add(faHeart)
library.add(faUsers)
library.add(faChartLine)
library.add(faHandHoldingDollar)
library.add(faMoneyBillTrendUp)
library.add(faMoneyBillTransfer)
library.add(faPlus)
library.add(faPenToSquare)
library.add(faTrashCan)
library.add(faCheck)
library.add(faXmark)

createApp(App)
.component('font-awesome-icon', FontAwesomeIcon)
.mount('#app')
