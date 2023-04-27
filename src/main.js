import { createApp } from 'vue';
import App from './App.vue';
// import router from './routes/index.js';
import router from './routes'; //index.js 경로를 축약 가능하다
// import store from './store/index.js';
import store from './store';
import loadImage from './plugins/loadImage';

createApp(App).use(router).use(store).use(loadImage).mount('#app');