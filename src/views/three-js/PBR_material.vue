<script setup>
// PBR基于物理材质的渲染
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
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  threeRef.value.appendChild(renderer.domElement);

  // 灯光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // 环境光（模拟间接光照）
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1); //平行光（模拟太阳光）
  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);
  //  添加环境贴图（为了更好展示PBR效果）
  const loader = new THREE.CubeTextureLoader(); //创建一个立方体贴图加载器
  const envTexture = loader
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
  envTexture.colorSpace = THREE.SRGBColorSpace; // 新版本写法
  scene.environment = envTexture; // 设置环境光照

  // 基础PRB
  const sphereGeometry = new THREE.SphereGeometry(1.5, 64, 32);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x667eea,
    roughness: 0.5, //粗糙度
    metalness: 0.0, //金属度
  });
  const standardSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  standardSphere.position.set(-8, 2, 0);
  scene.add(standardSphere);

  // 玻璃材质
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.0, // 0.0（绝缘体/电介质）到 1.0（纯金属）
    roughness: 0.0,
    transmission: 1.0, // 透射率（0-1）
    thickness: 0.5, // 厚度
    ior: 1.5, // 折射率（玻璃约1.5）
    envMap: envTexture, // 环境贴图
  });
  const glassSphere = new THREE.Mesh(sphereGeometry, glassMaterial);
  glassSphere.position.set(-4, 2, 0);
  scene.add(glassSphere);

  // 清漆层效果
  const clearcoatMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x4ecdc4,
    metalness: 0.0,
    roughness: 0.8,
    clearcoat: 1.0, // 清漆层强度（0-1）
    clearcoatRoughness: 0.1, // 清漆层粗糙度
    envMap: envTexture,
  });
  const clearcoatSphere = new THREE.Mesh(sphereGeometry, clearcoatMaterial);
  clearcoatSphere.position.set(0, 2, 0);
  scene.add(clearcoatSphere);

  // 织物效果
  const fabricMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xe6e6fa,
    metalness: 0.0,
    roughness: 0.6,
    sheen: 1.0, // 光泽强度
    sheenColor: new THREE.Color(0xffffff), // 光泽颜色
    sheenRoughness: 0.15, // 光泽粗糙度
    envMap: envTexture,
  });
  const fabricSphere = new THREE.Mesh(sphereGeometry, fabricMaterial);
  fabricSphere.position.set(4, 2, 0);

  // 宝石效果
  const gemMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x10b981,
    metalness: 0.0,
    roughness: 0.0,
    transmission: 0.9,
    thickness: 1.0,
    ior: 2.4, // 钻石的折射率约2.4
    dispersion: 0.1, // 色散效果（彩虹色）
    envMap: envTexture,
  });
  const gemSphere = new THREE.Mesh(sphereGeometry, gemMaterial);
  gemSphere.position.set(-4, -3, 0);
  scene.add(gemSphere);

  // 液体效果
  const liquidMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x3b82f6,
    metalness: 0.0,
    roughness: 0.1,
    transmission: 0.8,
    thickness: 2.0,
    ior: 1.33, // 水的折射率
    attenuationColor: new THREE.Color(0x0066cc), // 衰减颜色
    attenuationDistance: 1.0, // 衰减距离
    envMap: envTexture,
  });
  const liquidSphere = new THREE.Mesh(sphereGeometry, liquidMaterial);
  liquidSphere.position.set(0, -3, 0);
  scene.add(liquidSphere);

  // 添加标签文字
  const addLabel = (text, position) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = 256;
    canvas.height = 64;
    context.fillStyle = "white";
    context.font = "46px Arial";
    context.textAlign = "center";
    context.fillText(text, 128, 40);
    // 将Canvas转换为Three.js可用的纹理对象（为了在3D场景中使用2D文字）
    const texture = new THREE.CanvasTexture(canvas);
    // 创建精灵材质和对象
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    sprite.position.copy(position); // 复制传入的位置
    sprite.position.y -= 2.5;
    sprite.scale.set(2, 0.5, 1);
    scene.add(sprite);
  };
  addLabel("基础PRB", new THREE.Vector3(-8, 2, 0));
  addLabel("玻璃", new THREE.Vector3(-4, 2, 0));
  addLabel("清漆", new THREE.Vector3(0, 2, 0));
  addLabel("织物", new THREE.Vector3(4, 2, 0));
  addLabel("液体", new THREE.Vector3(0, -3, 0));
  addLabel("宝石", new THREE.Vector3(-4, -3, 0));

  controls = new OrbitControls(camera, renderer.domElement);
  // ？？
  controls.enableDamping = true; // 启用阻尼
  controls.dampingFactor = 0.05; // 阻尼因子
  // 连续渲染
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);// 每帧都渲染
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
  <VContainer title="PBR基于物理材质的渲染">
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