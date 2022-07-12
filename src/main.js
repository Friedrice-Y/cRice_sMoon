import { createApp } from "vue";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import FSubMenu from "~/layout/components/FSubMenu.vue";

import App from "./App.vue";

import router from "./router";
import store from "./store";

const app = createApp(App);

app.use(store);
app.use(router);
app.use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.component(FSubMenu.name, FSubMenu);

import "virtual:windi.css";

import "./permission";

import "nprogress/nprogress.css";

import permission from "~/directives/permission.js";

app.use(permission);

app.mount("#app");
