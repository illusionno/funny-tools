<template>
  <VContainer title="纹理贴图">
    <div ref="threeRef" class="three-wrapper"></div>
  </VContainer>
</template>
zz
<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { onMounted, ref, onBeforeUnmount } from "vue";

import VContainer from "@/components/v-container/Container.vue";

const threeRef = ref();
let renderer = null;
let scene = null;
let controls = null;
let sphere = null;
const init = () => {
  // 场景
  scene = new THREE.Scene();
  // 透视相机
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000

  );
  // 设置相机位置
  camera.position.set(0, 5, 10);
  // 渲染器
  renderer = new THREE.WebGLRenderer({
    antialias: true, // 抗锯齿
  });
  renderer.setSize(window.innerWidth, window.innerHeight); // 设置渲染器大小
  renderer.setPixelRatio(window.devicePixelRatio); // // 适应不同的设备屏幕
  threeRef.value.append(renderer.domElement); // 将渲染器添加到DOM中

  // 添加平行光
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(2, 5, 2); //y轴在上方
  scene.add(light);
  // 添加环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  //纹理加载
  const textureLoader = new THREE.TextureLoader();
  // 图片放在public目录下的image文件夹中
  // 颜色贴图
  const colorMap = textureLoader.load(
    "/image/earth_atmos_2048.jpg",
    () => {
      console.log("加载完成");
    },
    undefined,
    () => {
      console.log("加载失败");
    }
  );
  colorMap.colorSpace = THREE.SRGBColorSpace; //颜色贴图需要设置颜色空间
  //  法线贴图
  const normalMap = textureLoader.load("/image/earth_normal_2048.jpg");
  // 高光贴图
  const specularMap = textureLoader.load("/image/earth_specular_2048.jpg");

  // 球体材质
  const material = new THREE.MeshStandardMaterial({
    map: colorMap,
    normalMap: normalMap, // 让平滑表面看起来有凹凸感
    specularMap: specularMap, // 高光贴图
    specular: new THREE.Color(0x0000ff), // 高光颜色
    shininess: 100, // 光泽度：一般用于MeshPhongMaterial 和 MeshLambertMaterial，控制高光反射的锐利程度。
  });
  sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), material);
  sphere.position.set(0, 1, 0);
  scene.add(sphere);
  camera.lookAt(sphere.position);
  function animate() {
    requestAnimationFrame(animate);
    const time = performance.now() * 0.001;
    sphere.rotation.y = time; // 让球体按y轴旋转
    renderer.render(scene, camera); //执行渲染操作
  }
  animate();

  // 允许用户通过鼠标拖拽/滚轮缩放等操作 
  controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", function () {
    renderer.render(scene, camera);
  });

  //  窗口响应式
  window.onresize = function () {
    camera.aspect = window.innerWidth / window.innerHeight; // 更新相机纵横比
    camera.updateProjectionMatrix();// 更新纵横比
    renderer.setSize(window.innerWidth, window.innerHeight); // 更新渲染器的大小
  };
};

onMounted(() => {
  init();
});
// 在WebGL中创建的资源（几何体、材质、贴图等）不会被JavaScript的垃圾回收器自动回收，需要手动释放
onBeforeUnmount(() => {
  controls?.dispose();
  renderer?.dispose();
  scene?.traverse((obj) => {
    //遍历场景中资源并清除
    if (obj.isMesh) {
      obj.geometry.dispose();
      if (obj.material.map) obj.material.map.dispose();
      obj.material.dispose();
    }
  });
  window.onresize = null;
});
</script>
<style scoped>
.three-wrapper {
  width: 100%;
  height: calc(100vh - 200px); /* 调整高度以适应容器 */
  overflow: hidden;
}
</style>