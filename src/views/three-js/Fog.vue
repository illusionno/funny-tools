<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { onMounted, ref, onBeforeUnmount } from "vue";
import VContainer from "@/components/v-container/Container.vue";

const threeRef = ref();
let renderer = null;
let scene = null;
let controls = null;
let square = null;

const init = () => {
  // 场景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xececec);

  // 雾化效果 (线性物)
  // scene.fog = new THREE.Fog(0xcccccc, 3,20); // 参数：颜色, 近截面, 远截面; 在距离小于3时 物体不受雾影响
  // 雾化效果 (指数雾)
  scene.fog = new THREE.FogExp2(0xececec, 0.05); // 参数：颜色, 密度

  // 透视相机
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(12, 12, 12);
  scene.add(camera);

  // 渲染器
  renderer = new THREE.WebGLRenderer({
    antialias: true, // 抗锯齿
  });
  renderer.setSize(window.innerWidth, window.innerHeight); // 设置渲染器大小
  renderer.setPixelRatio(window.devicePixelRatio); // // 适应不同的设备屏幕
  threeRef.value.append(renderer.domElement); // 将渲染器添加到DOM中

  // 正方形
  const squareGeo = new THREE.BoxGeometry(2, 2, 2);
  const squareMat = new THREE.MeshStandardMaterial({
    color: 0xd072ff,
  });
  square = new THREE.Mesh(squareGeo, squareMat);
  square.position.y = 5;
  scene.add(square);
  // 平行光
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 20, 10);
  scene.add(light);

  const grid = new THREE.GridHelper(100, 100);
  scene.add(grid);
  function animate() {
    requestAnimationFrame(animate);
    square.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();
  // 轨道控制器
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; //开启阻尼（惯性效果，视觉更自然）
  controls.dampingFactor = 0.25; //阻尼系数
  //  窗口响应式
  window.onresize = function () {
    camera.aspect = window.innerWidth / window.innerHeight; // 更新相机纵横比
    camera.updateProjectionMatrix(); // 用新的纵横比重算投影矩阵
    renderer.setSize(window.innerWidth, window.innerHeight); // 更新渲染器的大小
  };
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
  <VContainer title="雾化">
    <div ref="threeRef" class="three-wrapper"></div>
  </VContainer>
</template>
<style scoped>

</style>
