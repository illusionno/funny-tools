import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/home",
    meta: {
      title: "加载页",
    },
  },
  {
    path: "/home",
    name: "home",
    component: () => import("@/views/home/HomeIndex.vue"),
  },
  {
    path: "/index",
    name: "index",
    component: () => import("@/views/index/index.vue"),
  },
  {
    path: "/index/pixel-art",
    name: "pixel-art",
    component: () => import("@/views/Pixel-art/PixelArt.vue"),
  },
  {
    path: "/index/life-grid",
    name: "life-grid",
    component: () => import("@/views/life-grid/LifeGrid.vue"),
  },
  {
    path: "/index/color-identify",
    name: "color-identify",
    component: () => import("@/views/color-identify/ColorIdentifyIndex.vue"),
  },
  {
    path: "/index/ip-compute",
    name: "ip-compute",
    component: () => import("@/views/ip-compute/IpCompute.vue"),
  },
  {
    path: "/index/dom-display",
    name: "dom-display",
    component: () => import("@/views/dom-display/DomDisplay.vue"),
  },
  // {

  //     path: '/layout', name: 'layout', component: () => import('@/views/layout/LayoutIndex.vue'),
  //     children: [{
  //         // 主页
  //         path: '/home', name: 'home', compoent: () => import('@/views/home/homeIndex.vue')
  //     }, {
  //         // 前端-javascript
  //         path: '/javascript', name: 'javascript', component: () => import('@/views/font-end/javascript/JavascriptIndex.vue')
  //     }]
  // },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
export default router;
