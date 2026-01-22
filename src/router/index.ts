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
  },{
    path:'/what-eat',
    name:'what-eat',
    component: () => import("@/views/what-eat/WhatEat.vue"),

  },
  {
    path: "/linux-command",
    name: "linux-command",
    component: () => import("@/views/linux-command/LinuxCommand.vue"),
  },
  {
    path: "/qrcode-generator",
    name: "qrcode-generator",
    component: () => import("@/views/qrcode-generator/QrcodeGenerator.vue"),
  },
  {
    path: "/qrcode-generator",
    name: "qrcode-generator",
    component: () => import("@/views/qrcode-generator/QrcodeGenerator.vue"),
  },
  // {
  //   path: "/timestamp-convert",
  //   name: "timestamp-convert",
  //   component: () => import("@/views/timestamp-convert/index.vue"),
  // },
  {
    path: "/uuid-generate",
    name: "uuid-generate",
    component: () => import("@/views/uuid-generate/index.vue"),
  },
  {
    path: "/chinese-converter",
    name: "chinese-converter",
    component: () => import("@/views/chinese-converter/index.vue"),
  },
  {
    path: "/typing-speed",
    name: "typing-speed",
    component: () => import("@/views/typing-speed/index.vue"),
  },
  {
    path: "/tax-compute",
    name: "tax-compute",
    component: () => import("@/views/tax-compute/index.vue"),
  },
  {
    path: "/anniversary",
    name: "anniversary",
    component: () => import("@/views/anniversary/index.vue"),
  },
  {
    path: "/watermark",
    name: "watermark",
    component: () => import("@/views/watermark/index.vue"),
  },
  {
    path: "/json-format",
    name: "json-format",
    component: () => import("@/views/json-format/index.vue"),
  },
  {
    path: "/markdown-editor",
    name: "markdown-editor",
    component: () => import("@/views/markdown-editor/index.vue"),
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
   {
    path: "/three-fog",
    name: "three-fog",
    component: () => import("@/views/three-js/Fog.vue"),
  },
  {
    path: "/three-particle",
    name: "three-particle",
    component: () => import("@/views/three-js/ParticleSystem.vue"),
  },
  {
    path: "/three-hemisphere-light",
    name: "three-hemisphere-light",
    component: () => import("@/views/three-js/HemisphereLight.vue"),
  },
  // {
  //   path: "/three-raycaster",
  //   name: "three-raycaster",
  //   component: () => import("@/views/three-js/Raycaster.vue"),
  // },
  {
    path: "/three-3d-text",
    name: "three-3d-text",
    component: () => import("@/views/three-js/3dText.vue"),
  },
  {
    path: "/three-water",
    name: "three-water",
    component: () => import("@/views/three-js/Water.vue"),
  },
   // 我的收藏夹
  {
    path:"/front-end-sites",
    name:"front-end-sites",
    component: () => import("@/views/site-collection/FrontEndSites.vue"),
  },{
    path:'/aesthetic-inspiration',
    name:'aesthetic-inspiration',
    component: () => import("@/views/site-collection/AestheticInspiration.vue"),
  },{
    path:'/ui-ux-learning',
    name:'ui-ux-learning',
    component: () => import("@/views/site-collection/UiUx.vue"),
  },{
    path:'/small-language-learning',
    name:'small-language-learning',
    component: () => import("@/views/site-collection/SmallLanguage.vue"),
  }
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
export default router;