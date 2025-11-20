import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'; 
// 创建pinia实例
const store = createPinia()
store.use(piniaPluginPersistedstate)
// 导出pinia实例，供main.js使用
export default store
