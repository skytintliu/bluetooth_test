import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

const pinia = createPinia();

const app = createApp(App);
app.use(pinia as any);

app.mount('#app');