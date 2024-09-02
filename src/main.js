// import './src/assets/main.css'
import './assets/styles.css';

import { createApp } from 'vue'
import App from './App.vue';
import router from './router';
import { auth, db } from './config/firebaseConfig';

import './assets/materialize.min.css';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      }).catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
    });
  }
  

const app = createApp(App);

app.use(router);

// 將 Firebase 服務添加到全局屬性
app.config.globalProperties.$auth = auth;
app.config.globalProperties.$db = db;

app.mount('#app');