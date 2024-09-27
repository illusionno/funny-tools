import { createApp } from "vue";
import 'uno.css';
import "./style.css";
import 'normalize.css/normalize.css'
import 'element-plus/dist/index.css'
import 'animate.css';
import App from "./App.vue";
import  router  from "./router";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@/assets/fonts.css'
const app = createApp(App)
// @ts-ignore
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(router).mount("#app");
