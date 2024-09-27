import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { resolve } from "path";
import UnoCSS from "unocss/vite";

const srcPath = resolve(__dirname, "src");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      script: {
        defineModel: true, //允许在单文件组件（SFC）的 <script setup> 语法中更方便地使用 v-model 双向绑定。
      },
    }),
    // 自定引入hook:https://github.com/unplugin/unplugin-auto-import
    AutoImport({
      imports: [
        "vue",
        "@vueuse/core",
        {
          "naive-ui": [
            "useDialog",
            "useMessage",
            "useNotification",
            "useLoadingBar",
          ],
        },
      ],
      // dts: '/auto-imports.d.ts',//防止类型不识别
      dts: true, // 正确提示类型
      // dirs: ["src/composables/**", "src/utils/**"], //自定义导入该文件夹下的文件
      vueTemplate: true,
      eslintrc: {
        enabled: true, // <-- this
      },
    }),
    UnoCSS(),
    // 按需加载组件
    Components({
      //自动注册图标组件
      resolvers: [
        IconsResolver({
          prefix: false,
          alias: { park: "icon-park" },
          enabledCollections: [
            "ep", // element-plus https://icones.netlify.app/collection/ep
            "icon-park", // icon-park https://icones.netlify.app/collection/icon-park
            "mdi", // Material Design Icons https://icones.netlify.app/collection/mdi
          ],
        }),
        // 自动注册element-plus组件
        ElementPlusResolver({
          importStyle: false,
        }),
        // Naive UI
        NaiveUiResolver(),
      ],
    }),
    // 图标：https://github.com/unplugin/unplugin-icons
    Icons({
      autoInstall: true, // Auto install components
      scale: 1.2, // Scale of icons against 1em
      defaultStyle: "", // Style apply to icons
      defaultClass: "v-icon", // Class names apply to icons
      compiler: "vue3", // 'vue2', 'vue3', 'jsx'
      jsx: "react", // 'react' or 'preact'
    }),
  ],
  resolve: {
    alias: {
      "@/": `${srcPath}/`,
    },
  },
});
