<template>
  <VContainer title="阴影效果">
    <div ref="threeRef" class="three-wrapper"></div>
  </VContainer>
</template>
<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { onMounted, ref, onBeforeUnmount } from "vue";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import VContainer from "@/components/v-container/Container.vue";

const threeRef = ref();
let renderer = null;
let scene = null;
let controls = null;
let gui = null;

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

  // 渲染器
  renderer = new THREE.WebGLRenderer({
    antialias: true, // 抗锯齿
  });
  renderer.shadowMap.enabled = true; // ✨渲染器开启阴影
  renderer.setSize(window.innerWidth, window.innerHeight); // 设置渲染器大小
  renderer.setPixelRatio(window.devicePixelRatio); // // 适应不同的设备屏幕
  threeRef.value.append(renderer.domElement); // 将渲染器添加到DOM中

  // 灯光
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 5);
  light.castShadow = true; // ✨灯光投射阴影
  scene.add(light);

  // 地面（接受阴影）
  const groundGeo = new THREE.PlaneGeometry(100, 100);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x888888,
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;
  ground.receiveShadow = true; // ✨地面接收阴影
  scene.add(ground);

  // 球体
  const ballGeo = new THREE.SphereGeometry(1, 32, 32);
  const ballMat = new THREE.MeshStandardMaterial({// 材质必须是 支持光照的材质
    color: 0xff0000,
  });

  const ball = new THREE.Mesh(ballGeo, ballMat);
  ball.position.set(0, 1, 0);
  ball.castShadow = true; // 球体能投射阴影或者被投射阴影
  ball.receiveShadow = true;
  scene.add(ball);

  camera.position.set(0, 5, 10);
  camera.lookAt(ball.position); // 相机朝向球体

  function animate() {
    requestAnimationFrame(animate);
    const time = performance.now() * 0.001;
    ball.position.y = Math.abs(Math.sin(time)) * 2 + 1; // 让球体上下移动
    renderer.render(scene, camera); //执行渲染操作
  }
  animate();

  // 添加坐标轴辅助器
  const dirLightHelper = new THREE.DirectionalLightHelper(light, 1, 0xff0000); //参数1：光源，参数2：长度，参数3：颜色
  scene.add(dirLightHelper);

  // 在页面上生成调试面板，动态调整对象属性
  gui = new GUI();
  const lightFolder = gui.addFolder("DirectionalLight Position");
  lightFolder.add(light.position, "x", -20, 20);
  lightFolder.add(light.position, "y", 0, 20);
  lightFolder.add(light.position, "z", -20, 20);
  lightFolder.open();

  // 用于相机交互控制，响应鼠标/触摸事件，实现旋转、缩放、平移等，让用户操控视角。
  controls = new OrbitControls(camera, renderer.domElement); //轨道控制
  controls.addEventListener("change", function () {
    renderer.render(scene, camera);
  });

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

// 在WebGL中创建的资源（几何体、材质、贴图等）不会被JavaScript的垃圾回收器自动回收，需要手动释放
onBeforeUnmount(() => {
  // 清理gui调试面板
  gui?.destroy();

  // 清理控制器
  controls?.dispose();

  // 清理渲染器
  renderer?.dispose();

  // 清理场景中的资源
  scene?.traverse((obj) => {
    // 遍历场景中的所有对象
    if (obj.isMesh) {
      obj.geometry.dispose();
      if (obj.material.map) obj.material.map.dispose(); // 清理贴图
      obj.material.dispose();
    }
  });

  // 移除窗口resize事件监听器
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
