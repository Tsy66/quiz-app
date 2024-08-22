// import './src/assets/main.css'
import './assets/styles.css';

import { createApp } from 'vue'
import App from './App.vue';
import router from './router';
import { auth, db } from './config/firebaseConfig';

import './assets/materialize.min.css';

const app = createApp(App);

app.use(router);

// 將 Firebase 服務添加到全局屬性
app.config.globalProperties.$auth = auth;
app.config.globalProperties.$db = db;

app.mount('#app');