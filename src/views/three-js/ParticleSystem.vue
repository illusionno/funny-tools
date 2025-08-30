<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { onMounted, ref, onBeforeUnmount } from "vue";
import VContainer from "@/components/v-container/Container.vue";

const threeRef = ref();
let renderer = null;
let scene = null;
let controls = null;
let particles = null;
let particleGeometry = null;
let count = 300; //粒子数量
let time = 0;
let particleType = null;

// 基础粒子(粒子看起来是个小方块)
const getBasicParticle = () => {
  particleType = "basic";
  //1.创建几何体
  particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);

  // 2.生成随机分布的坐标
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10; // x [-5, 5]
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10; // y [-5, 5]
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // z [-5, 5]
  }
  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  // 3.创建材质
  const particleMaterial = new THREE.PointsMaterial({
    size: 0.05, //大小
    blending: THREE.AdditiveBlending, //加法混合，颜色相加，越叠越亮。
    color: 0xffffff,
  });
  // 4.生成粒子系统
  particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);
};
// 圆形粒子
const getCircleParticle = (texture = "/image/circle.png") => {
  particleType = "circle";
  //1.创建几何体
  particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const originalPositions = new Float32Array(count * 3); // 保存原始位置（后面动画效果需要用到）

  // 2.生成随机分布的坐标
  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 10; // x [-5, 5]
    const y = (Math.random() - 0.5) * 10; // y [-5, 5]
    const z = (Math.random() - 0.5) * 10; // z [-5, 5]
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // 保存原始位置
    originalPositions[i * 3] = x;
    originalPositions[i * 3 + 1] = y;
    originalPositions[i * 3 + 2] = z;
  }
  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  particleGeometry.userData = { originalPositions }; // 保存原始位置

  //   3.加载纹理
  const textureLoader = new THREE.TextureLoader();
  const circleTexture = textureLoader.load(texture);
  const particleMaterial = new THREE.PointsMaterial({
    size: 0.1, //大小
    map: circleTexture, // 纹理贴图
    transparent: true, // 透明
    alphaTest: 0.01, // 避免黑边
    blending: THREE.AdditiveBlending, // 叠加光效
  });
  //4.生成粒子系统
  particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);
};

// 雪花粒子
const getSnowParticle = () => {
  particleType = "snow";
  //1.创建几何体
  particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);

  // 2.生成随机分布的坐标
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 200; // x [-100, 100]
    positions[i * 3 + 1] = Math.random() * 200; // y [0, 200]
    positions[i * 3 + 2] = (Math.random() - 0.5) * 200; // z [-100, 100]
  }
  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  // 3，加载雪花纹理
  const textureLoader = new THREE.TextureLoader();
  const snowFlakeTexture = textureLoader.load("/image/snowflake2.png");

  // 4. 创建材质
  const particleMaterial = new THREE.PointsMaterial({
    size: 3, //大小
    map: snowFlakeTexture, // 纹理贴图
    transparent: true, // 透明
    opacity: 0.8,
    alphaTest: 0.01, // 避免黑边
    blending: THREE.AdditiveBlending,
  });

  // 5.生成粒子系统
  particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);
};
const init = (initParticle) => {
  // 场景
  scene = new THREE.Scene();

  // 透视相机
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight
  );
  camera.position.set(0, 5, 5);

  // 渲染器
  renderer = new THREE.WebGLRenderer({
    antialias: true, // 抗锯齿
  });
  renderer.setSize(window.innerWidth, window.innerHeight); // 设置渲染器大小
  renderer.setPixelRatio(window.devicePixelRatio); // // 适应不同的设备屏幕
  threeRef.value.append(renderer.domElement); // 将渲染器添加到DOM中

  // 生成基础粒子
  initParticle();

  // 轨道控制器
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; //开启阻尼（惯性效果，视觉更自然）
  controls.dampingFactor = 0.25; //阻尼系数

  // 连续渲染
  function animate() {
    requestAnimationFrame(animate);

    // 粒子动画效果
    if (particleType === "circle") {
      time += 0.01; // 时间递增
      animateParticles();
    }
    if (particleType === "snow") {
      animateDownParticles();
    }
    // particles.position.z -= 0.006;
    controls.update(); // 如果开启了阻尼（enableDamping = true），记得在 animate 里调用 controls.update()：进行过渡计算
    renderer.render(scene, camera); // 每帧都渲染
  }
  animate();
  // 窗口响应式
  window.onresize = function () {
    camera.aspect = window.innerWidth / window.innerHeight; // 更新相机纵横比
    camera.updateProjectionMatrix(); // 更新纵横比
    renderer.setSize(window.innerWidth, window.innerHeight); // 更新渲染器的大小
  };
};
// 粒子动画效果
function animateParticles() {
  const positions = particleGeometry.attributes.position.array;
  const originalPositions = particleGeometry.userData.originalPositions;

  for (let i = 0; i < positions.length; i += 3) {
    // 上下浮动动画
    // positions[i + 1] = originalPositions[i + 1] + Math.sin(time + i * 0.01) * 0.5;

    // 螺旋动画
    positions[i] = originalPositions[i] + Math.cos(time + i * 0.01) * 0.3;
    positions[i + 2] =
      originalPositions[i + 2] + Math.sin(time + i * 0.01) * 0.3;
  }

  // 通知 Three.js 更新位置数据
  particleGeometry.attributes.position.needsUpdate = true;
}
// 粒子降落动画
function animateDownParticles() {
  const positions = particleGeometry.attributes.position.array;
  for (let i = 0; i < count; i++) {
    positions[i * 3 + 1] -= 0.1; // y 坐标下降, 模拟重力 （值越小，降落速度越慢）
    positions[i * 3 + 0] += Math.sin(Date.now() * 0.001 + i) * 0.01; //左右轻轻摇摆

    if (positions[i * 3 + 1] < -100) {
      positions[i * 3 + 1] = 200; // 掉到下面就重置到顶部
    }
  }
  particleGeometry.attributes.position.needsUpdate = true;
}

onMounted(() => {
  init(getCircleParticle);
});
// 卸载
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
  <VContainer title="粒子系统">
    <div ref="threeRef" class="three-wrapper"></div>
  </VContainer>
</template>
<style scoped>
</style>
