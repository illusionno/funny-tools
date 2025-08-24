<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { onMounted, ref, onBeforeUnmount } from "vue";
import VContainer from "@/components/v-container/Container.vue";

const threeRef = ref();
let renderer = null;
let scene = null;
let controls = null;
let camera = null;

const init = () => {
  // 场景
  scene = new THREE.Scene();
  // 透视相机
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 10);
  // 渲染器
  renderer = new THREE.WebGLRenderer({
    antialias: true, // 抗锯齿
  });
  renderer.setSize(window.innerWidth, window.innerHeight); // 设置渲染器大小
  renderer.setPixelRatio(window.devicePixelRatio); // // 适应不同的设备屏幕
  threeRef.value.append(renderer.domElement); // 将渲染器添加到DOM中

  // 1. 加载天空盒纹理
  const loader = new THREE.CubeTextureLoader(); //创建一个立方体贴图加载器
  const texture = loader
    .setPath(
      // 图片放在public/cube/
      "/cube/"
    )
    .load([
      "posx.jpg", //右 +X
      "negx.jpg", //左 -X
      "posy.jpg", //上 +Y
      "negy.jpg", //下 -Y
      "posz.jpg", //前 +Z
      "negz.jpg", //后 -Z
    ]);
    // 在Three.js v152之前使用texture.encoding = THREE.sRGBEncoding; 
  texture.colorSpace = THREE.SRGBColorSpace; //设置纹理和渲染器颜色空间一致
  // 2. 设置场景背景
  scene.background = texture;

  // 球体表面会像镜子一样反射周围的天空盒环境
  const material = new THREE.MeshStandardMaterial({
    envMap: texture,
    metalness: 1.0, // 金属度（0-1），1为完全金属
    roughness: 0.0, // 粗糙度（0-1），0为完全光滑
  });
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), material);
  sphere.position.set(0, 1, 0);
  scene.add(sphere);

  // 3. 初始化控制器
  controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", function () {
    renderer.render(scene, camera);
  });

  // 4. 窗口响应式
  window.onresize = function () {
    camera.aspect = window.innerWidth / window.innerHeight; // 更新相机纵横比
    camera.updateProjectionMatrix(); // 更新纵横比
    renderer.setSize(window.innerWidth, window.innerHeight); // 更新渲染器的大小
  };

  // 5. 开始动画循环
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
};

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  controls?.dispose();
  renderer?.dispose();
  scene?.traverse((obj) => {
    if (obj.isMesh) {
      obj.geometry.dispose();
    }
  });
  window.onresize = null;
});
</script>
<template>
  <VContainer title="天空盒">
    <div ref="threeRef" class="three-wrapper"></div> </VContainer
  >;
</template>
<style scoped>
.three-wrapper {
  width: 100%;
  height: calc(100vh - 200px); /* 调整高度以适应容器 */
  overflow: hidden;
}
</style>