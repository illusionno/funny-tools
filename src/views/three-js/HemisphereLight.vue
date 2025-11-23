<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { onMounted, ref, onBeforeUnmount } from "vue";
import VContainer from "@/components/v-container/Container.vue";

const threeRef = ref();
let renderer = null;
let scene = null;
let controls = null;
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
  camera.position.set(-3, 3, 25);

  // 渲染器
  renderer = new THREE.WebGLRenderer({
    antialias: true, // 抗锯齿
  });
  renderer.setSize(window.innerWidth, window.innerHeight); // 设置渲染器大小
  renderer.setPixelRatio(window.devicePixelRatio); // // 适应不同的设备屏幕
  renderer.shadowMap.enabled = true; //开启阴影
  threeRef.value.append(renderer.domElement); // 将渲染器添加到DOM中

  // 添加半球光
  const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0xffffff, 1.2); // 参数：天空颜色, 地面颜色, 强度
  scene.add(hemiLight);
  //添加一个平行光
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(0, 10, 5);
  dirLight.castShadow = true; //光源投射阴影
  scene.add(dirLight);

  //  添加一个地面
  const groundGeo = new THREE.PlaneGeometry(200, 200);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.receiveShadow = true; //接收阴影
  ground.rotation.x = -Math.PI / 2;//水平放置
  ground.position.y = -2;
  scene.add(ground);

  //   添加一个球体，便于更好观察半球光
  const sphereGeo = new THREE.SphereGeometry(2);
  const sphereMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.5,
    metalness: 0.1,
  });
  const sphere = new THREE.Mesh(sphereGeo, sphereMat);
  sphere.castShadow = true;//投射阴影
  sphere.position.y = 5;
  scene.add(sphere);

  // 雪花粒子
  const snowCount = 4000;
  const positions = new Float32Array(snowCount * 3);

  for (let i = 0; i < snowCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 200; // x
    positions[i + 1] = Math.random() * 100; // y
    positions[i + 2] = (Math.random() - 0.5) * 200; // z
  }

  const snowGeometry = new THREE.BufferGeometry();
  snowGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  // 加载雪花纹理
  const textureLoader = new THREE.TextureLoader();
  const snowFlakeTexture = textureLoader.load("/image/snowflake2.png");

  const snowMaterial = new THREE.PointsMaterial({
    size: 1,
    map: snowFlakeTexture,
    transparent: true,
    opacity: 0.8,
    alphaTest: 0.01,
    blending: THREE.AdditiveBlending,
  });
  const snow = new THREE.Points(snowGeometry, snowMaterial);
  scene.add(snow);

  // 轨道控制器
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; //开启阻尼（惯性效果，视觉更自然）
  controls.dampingFactor = 0.25; //阻尼系数

  // 雪花下落动画
  function animate() {
    requestAnimationFrame(animate);

    const pos = snowGeometry.attributes.position.array;
    for (let i = 0; i < pos.length; i += 3) {
      pos[i + 1] -= 0.04; // y 方向下降
      if (pos[i + 1] < -2) pos[i + 1] = 50; // 重置到上方
    }
    snowGeometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }
  animate();

  // 窗口响应式
  window.onresize = function () {
    camera.aspect = window.innerWidth / window.innerHeight; // 更新相机纵横比
    camera.updateProjectionMatrix(); // 更新纵横比
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
  <VContainer title="半球光">
    <div ref="threeRef" class="three-wrapper"></div>
  </VContainer>
</template>
<style scoped>
</style>
