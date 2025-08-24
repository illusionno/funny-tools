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
    path: "/pixel-art",
    name: "pixel-art",
    component: () => import("@/views/Pixel-art/PixelArt.vue"),
  },
  {
    path: "/life-grid",
    name: "life-grid",
    component: () => import("@/views/life-grid/LifeGrid.vue"),
  },
  {
    path: "/color-identify",
    name: "color-identify",
    component: () => import("@/views/color-identify/ColorIdentifyIndex.vue"),
  },
  {
    path: "/ip-compute",
    name: "ip-compute",
    component: () => import("@/views/ip-compute/IpCompute.vue"),
  },
  {
    path: "/dom-display",
    name: "dom-display",
    component: () => import("@/views/dom-display/DomDisplay.vue"),
  },
  {
    path: "/daily-fortune",
    name: "daily-fortune",
    component: () => import("@/views/daily-fortune/DailyFortune.vue"),
  },
  {
    path: "/linux-command",
    name: "linux-command",
    component: () => import("@/views/linux-command/LinuxCommand.vue"),
  },
  {
    path: "/three-shadow",
    name: "three-shadow",
    component: () => import("@/views/three-js/Shadow.vue"),
  },
  {
    path: "/three-texture",
    name: "three-texture",
    component: () => import("@/views/three-js/Texture.vue"),
  },
  {
    path: "/three-skybox",
    name: "three-skybox",
    component: () => import("@/views/three-js/SkyBox.vue"),
  },
  {
    path: "/three-pbr",
    name: "three-pbr",
    component: () => import("@/views/three-js/PBR_material.vue"),
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
export default router;