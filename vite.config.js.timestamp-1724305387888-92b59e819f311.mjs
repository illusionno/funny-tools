// vite.config.js
import { defineConfig } from "file:///D:/my-project/my-app/node_modules/.pnpm/vite@5.4.0_sass@1.77.8/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/my-project/my-app/node_modules/.pnpm/@vitejs+plugin-vue@5.1.2_vite@5.4.0_sass@1.77.8__vue@3.4.36/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import AutoImport from "file:///D:/my-project/my-app/node_modules/.pnpm/unplugin-auto-import@0.17.8_@vueuse+core@10.11.0_vue@3.4.36__rollup@4.20.0/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///D:/my-project/my-app/node_modules/.pnpm/unplugin-vue-components@0.26.0_@babel+parser@7.25.3_rollup@4.20.0_vue@3.4.36/node_modules/unplugin-vue-components/dist/vite.js";
import { NaiveUiResolver } from "file:///D:/my-project/my-app/node_modules/.pnpm/unplugin-vue-components@0.26.0_@babel+parser@7.25.3_rollup@4.20.0_vue@3.4.36/node_modules/unplugin-vue-components/dist/resolvers.js";
import Icons from "file:///D:/my-project/my-app/node_modules/.pnpm/unplugin-icons@0.18.5_@vue+compiler-sfc@3.4.36/node_modules/unplugin-icons/dist/vite.js";
import IconsResolver from "file:///D:/my-project/my-app/node_modules/.pnpm/unplugin-icons@0.18.5_@vue+compiler-sfc@3.4.36/node_modules/unplugin-icons/dist/resolver.js";
import { ElementPlusResolver } from "file:///D:/my-project/my-app/node_modules/.pnpm/unplugin-vue-components@0.26.0_@babel+parser@7.25.3_rollup@4.20.0_vue@3.4.36/node_modules/unplugin-vue-components/dist/resolvers.js";
import { resolve } from "path";
import UnoCSS from "file:///D:/my-project/my-app/node_modules/.pnpm/unocss@0.61.9_postcss@8.4.41_rollup@4.20.0_vite@5.4.0_sass@1.77.8_/node_modules/unocss/dist/vite.mjs";
var __vite_injected_original_dirname = "D:\\my-project\\my-app";
var srcPath = resolve(__vite_injected_original_dirname, "src");
var vite_config_default = defineConfig({
  plugins: [
    vue({
      script: {
        defineModel: true
        //允许在单文件组件（SFC）的 <script setup> 语法中更方便地使用 v-model 双向绑定。
      }
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
            "useLoadingBar"
          ]
        }
      ],
      // dts: '/auto-imports.d.ts',//防止类型不识别
      dts: true,
      // 正确提示类型
      // dirs: ["src/composables/**", "src/utils/**"], //自定义导入该文件夹下的文件
      vueTemplate: true,
      eslintrc: {
        enabled: true
        // <-- this
      }
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
            "ep",
            // element-plus https://icones.netlify.app/collection/ep
            "icon-park",
            // icon-park https://icones.netlify.app/collection/icon-park
            "mdi"
            // Material Design Icons https://icones.netlify.app/collection/mdi
          ]
        }),
        // 自动注册element-plus组件
        ElementPlusResolver({
          importStyle: false
        }),
        // Naive UI
        NaiveUiResolver()
      ]
    }),
    // 图标：https://github.com/unplugin/unplugin-icons
    Icons({
      autoInstall: true,
      // Auto install components
      scale: 1.2,
      // Scale of icons against 1em
      defaultStyle: "",
      // Style apply to icons
      defaultClass: "v-icon",
      // Class names apply to icons
      compiler: "vue3",
      // 'vue2', 'vue3', 'jsx'
      jsx: "react"
      // 'react' or 'preact'
    })
  ],
  resolve: {
    alias: {
      "@/": `${srcPath}/`
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxteS1wcm9qZWN0XFxcXG15LWFwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcbXktcHJvamVjdFxcXFxteS1hcHBcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L215LXByb2plY3QvbXktYXBwL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB2dWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiO1xuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSBcInVucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGVcIjtcbmltcG9ydCBDb21wb25lbnRzIGZyb20gXCJ1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlXCI7XG5pbXBvcnQgeyBOYWl2ZVVpUmVzb2x2ZXIgfSBmcm9tIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzXCI7XG5pbXBvcnQgSWNvbnMgZnJvbSBcInVucGx1Z2luLWljb25zL3ZpdGVcIjtcbmltcG9ydCBJY29uc1Jlc29sdmVyIGZyb20gXCJ1bnBsdWdpbi1pY29ucy9yZXNvbHZlclwiO1xuaW1wb3J0IHsgRWxlbWVudFBsdXNSZXNvbHZlciB9IGZyb20gXCJ1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnNcIjtcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IFVub0NTUyBmcm9tIFwidW5vY3NzL3ZpdGVcIjtcblxuY29uc3Qgc3JjUGF0aCA9IHJlc29sdmUoX19kaXJuYW1lLCBcInNyY1wiKTtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICB2dWUoe1xuICAgICAgc2NyaXB0OiB7XG4gICAgICAgIGRlZmluZU1vZGVsOiB0cnVlLCAvL1x1NTE0MVx1OEJCOFx1NTcyOFx1NTM1NVx1NjU4N1x1NEVGNlx1N0VDNFx1NEVGNlx1RkYwOFNGQ1x1RkYwOVx1NzY4NCA8c2NyaXB0IHNldHVwPiBcdThCRURcdTZDRDVcdTRFMkRcdTY2RjRcdTY1QjlcdTRGQkZcdTU3MzBcdTRGN0ZcdTc1Mjggdi1tb2RlbCBcdTUzQ0NcdTU0MTFcdTdFRDFcdTVCOUFcdTMwMDJcbiAgICAgIH0sXG4gICAgfSksXG4gICAgLy8gXHU4MUVBXHU1QjlBXHU1RjE1XHU1MTY1aG9vazpodHRwczovL2dpdGh1Yi5jb20vdW5wbHVnaW4vdW5wbHVnaW4tYXV0by1pbXBvcnRcbiAgICBBdXRvSW1wb3J0KHtcbiAgICAgIGltcG9ydHM6IFtcbiAgICAgICAgXCJ2dWVcIixcbiAgICAgICAgXCJAdnVldXNlL2NvcmVcIixcbiAgICAgICAge1xuICAgICAgICAgIFwibmFpdmUtdWlcIjogW1xuICAgICAgICAgICAgXCJ1c2VEaWFsb2dcIixcbiAgICAgICAgICAgIFwidXNlTWVzc2FnZVwiLFxuICAgICAgICAgICAgXCJ1c2VOb3RpZmljYXRpb25cIixcbiAgICAgICAgICAgIFwidXNlTG9hZGluZ0JhclwiLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgLy8gZHRzOiAnL2F1dG8taW1wb3J0cy5kLnRzJywvL1x1OTYzMlx1NkI2Mlx1N0M3Qlx1NTc4Qlx1NEUwRFx1OEJDNlx1NTIyQlxuICAgICAgZHRzOiB0cnVlLCAvLyBcdTZCNjNcdTc4NkVcdTYzRDBcdTc5M0FcdTdDN0JcdTU3OEJcbiAgICAgIC8vIGRpcnM6IFtcInNyYy9jb21wb3NhYmxlcy8qKlwiLCBcInNyYy91dGlscy8qKlwiXSwgLy9cdTgxRUFcdTVCOUFcdTRFNDlcdTVCRkNcdTUxNjVcdThCRTVcdTY1ODdcdTRFRjZcdTU5MzlcdTRFMEJcdTc2ODRcdTY1ODdcdTRFRjZcbiAgICAgIHZ1ZVRlbXBsYXRlOiB0cnVlLFxuICAgICAgZXNsaW50cmM6IHtcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSwgLy8gPC0tIHRoaXNcbiAgICAgIH0sXG4gICAgfSksXG4gICAgVW5vQ1NTKCksXG4gICAgLy8gXHU2MzA5XHU5NzAwXHU1MkEwXHU4RjdEXHU3RUM0XHU0RUY2XG4gICAgQ29tcG9uZW50cyh7XG4gICAgICAvL1x1ODFFQVx1NTJBOFx1NkNFOFx1NTE4Q1x1NTZGRVx1NjgwN1x1N0VDNFx1NEVGNlxuICAgICAgcmVzb2x2ZXJzOiBbXG4gICAgICAgIEljb25zUmVzb2x2ZXIoe1xuICAgICAgICAgIHByZWZpeDogZmFsc2UsXG4gICAgICAgICAgYWxpYXM6IHsgcGFyazogXCJpY29uLXBhcmtcIiB9LFxuICAgICAgICAgIGVuYWJsZWRDb2xsZWN0aW9uczogW1xuICAgICAgICAgICAgXCJlcFwiLCAvLyBlbGVtZW50LXBsdXMgaHR0cHM6Ly9pY29uZXMubmV0bGlmeS5hcHAvY29sbGVjdGlvbi9lcFxuICAgICAgICAgICAgXCJpY29uLXBhcmtcIiwgLy8gaWNvbi1wYXJrIGh0dHBzOi8vaWNvbmVzLm5ldGxpZnkuYXBwL2NvbGxlY3Rpb24vaWNvbi1wYXJrXG4gICAgICAgICAgICBcIm1kaVwiLCAvLyBNYXRlcmlhbCBEZXNpZ24gSWNvbnMgaHR0cHM6Ly9pY29uZXMubmV0bGlmeS5hcHAvY29sbGVjdGlvbi9tZGlcbiAgICAgICAgICBdLFxuICAgICAgICB9KSxcbiAgICAgICAgLy8gXHU4MUVBXHU1MkE4XHU2Q0U4XHU1MThDZWxlbWVudC1wbHVzXHU3RUM0XHU0RUY2XG4gICAgICAgIEVsZW1lbnRQbHVzUmVzb2x2ZXIoe1xuICAgICAgICAgIGltcG9ydFN0eWxlOiBmYWxzZSxcbiAgICAgICAgfSksXG4gICAgICAgIC8vIE5haXZlIFVJXG4gICAgICAgIE5haXZlVWlSZXNvbHZlcigpLFxuICAgICAgXSxcbiAgICB9KSxcbiAgICAvLyBcdTU2RkVcdTY4MDdcdUZGMUFodHRwczovL2dpdGh1Yi5jb20vdW5wbHVnaW4vdW5wbHVnaW4taWNvbnNcbiAgICBJY29ucyh7XG4gICAgICBhdXRvSW5zdGFsbDogdHJ1ZSwgLy8gQXV0byBpbnN0YWxsIGNvbXBvbmVudHNcbiAgICAgIHNjYWxlOiAxLjIsIC8vIFNjYWxlIG9mIGljb25zIGFnYWluc3QgMWVtXG4gICAgICBkZWZhdWx0U3R5bGU6IFwiXCIsIC8vIFN0eWxlIGFwcGx5IHRvIGljb25zXG4gICAgICBkZWZhdWx0Q2xhc3M6IFwidi1pY29uXCIsIC8vIENsYXNzIG5hbWVzIGFwcGx5IHRvIGljb25zXG4gICAgICBjb21waWxlcjogXCJ2dWUzXCIsIC8vICd2dWUyJywgJ3Z1ZTMnLCAnanN4J1xuICAgICAganN4OiBcInJlYWN0XCIsIC8vICdyZWFjdCcgb3IgJ3ByZWFjdCdcbiAgICB9KSxcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkAvXCI6IGAke3NyY1BhdGh9L2AsXG4gICAgfSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFvUCxTQUFTLG9CQUFvQjtBQUNqUixPQUFPLFNBQVM7QUFDaEIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUyx1QkFBdUI7QUFDaEMsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sbUJBQW1CO0FBQzFCLFNBQVMsMkJBQTJCO0FBQ3BDLFNBQVMsZUFBZTtBQUN4QixPQUFPLFlBQVk7QUFUbkIsSUFBTSxtQ0FBbUM7QUFXekMsSUFBTSxVQUFVLFFBQVEsa0NBQVcsS0FBSztBQUd4QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsTUFDRixRQUFRO0FBQUEsUUFDTixhQUFhO0FBQUE7QUFBQSxNQUNmO0FBQUEsSUFDRixDQUFDO0FBQUE7QUFBQSxJQUVELFdBQVc7QUFBQSxNQUNULFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxVQUNFLFlBQVk7QUFBQSxZQUNWO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUE7QUFBQSxNQUVBLEtBQUs7QUFBQTtBQUFBO0FBQUEsTUFFTCxhQUFhO0FBQUEsTUFDYixVQUFVO0FBQUEsUUFDUixTQUFTO0FBQUE7QUFBQSxNQUNYO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxPQUFPO0FBQUE7QUFBQSxJQUVQLFdBQVc7QUFBQTtBQUFBLE1BRVQsV0FBVztBQUFBLFFBQ1QsY0FBYztBQUFBLFVBQ1osUUFBUTtBQUFBLFVBQ1IsT0FBTyxFQUFFLE1BQU0sWUFBWTtBQUFBLFVBQzNCLG9CQUFvQjtBQUFBLFlBQ2xCO0FBQUE7QUFBQSxZQUNBO0FBQUE7QUFBQSxZQUNBO0FBQUE7QUFBQSxVQUNGO0FBQUEsUUFDRixDQUFDO0FBQUE7QUFBQSxRQUVELG9CQUFvQjtBQUFBLFVBQ2xCLGFBQWE7QUFBQSxRQUNmLENBQUM7QUFBQTtBQUFBLFFBRUQsZ0JBQWdCO0FBQUEsTUFDbEI7QUFBQSxJQUNGLENBQUM7QUFBQTtBQUFBLElBRUQsTUFBTTtBQUFBLE1BQ0osYUFBYTtBQUFBO0FBQUEsTUFDYixPQUFPO0FBQUE7QUFBQSxNQUNQLGNBQWM7QUFBQTtBQUFBLE1BQ2QsY0FBYztBQUFBO0FBQUEsTUFDZCxVQUFVO0FBQUE7QUFBQSxNQUNWLEtBQUs7QUFBQTtBQUFBLElBQ1AsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLE1BQU0sR0FBRyxPQUFPO0FBQUEsSUFDbEI7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
