import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import TDesign from 'tdesign-vue-next'
import 'tdesign-vue-next/es/style/index.css'
import LayoutContent from "./components/LayoutContent.vue";
import store from './store'
const app = createApp(App).use(router).use(TDesign).use(store)
app.component('LayoutContent', LayoutContent)
app.mount('#app')
