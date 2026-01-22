<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { onMounted, ref, onBeforeUnmount } from "vue";
import VContainer from "@/components/v-container/Container.vue";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

const threeRef = ref();
let renderer = null;
let scene = null;
let controls = null;
let camera = null;
let textMesh = null;
let meshs = [];
const init = () => {
  // 场景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x512da8);

  // 相机
  camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    1,
    20000
  );
  camera.position.set(5, 5, 10);
  camera.lookAt(0, 0, 0);
  
  // 灯光
  // const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  // scene.add(ambientLight);
  // 1，加载字体（字体资源：https://github.com/mrdoob/three.js/tree/dev/examples/fonts）
  const fontLoader = new FontLoader();
  fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
    console.log("字体加载完成");
    // 2，创建几何体
    const textGeometry = new TextGeometry("Hello Three.js", {
      font,
      size: 1,
      height: 0.2,
      curveSegments: 5, // 曲线分段数，越大越圆滑
      bevelEnabled: true, // 是否启用倒角
      bevelThickness: 0.03, // 倒角厚度
      bevelSize: 0.02, // 倒角大小
      bevelSegments: 3, // 倒角分段
      depth: 0.2, // 深度
    });
    // 3，几何体居中
    textGeometry.center(); // 几何体居中 （默认原点在文字的左下角）

    // 4，创建材质
    // a. 简单颜色
    // const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

    // b. Matcap 材质（有金属质感）
    // 图片地址:https://github.com/mrdoob/three.js/blob/dev/examples/textures/matcaps/matcap-porcelain-white.jpg
    const matcap = new THREE.TextureLoader().load(
      "/image/matcap-porcelain-white.jpg"
    );
    const material = new THREE.MeshMatcapMaterial({ matcap });
    // 3. 组合文字网格
    textMesh = new THREE.Mesh(textGeometry, material);
    scene.add(textMesh);

    // 创建周边小元素
    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
    const boxGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    // 图片地址：https://github.com/nidorx/matcaps/blob/master/256/046363_0CC3C3_049B9B_04ACAC-256px.png
    const matcapBlock = new THREE.TextureLoader().load(
      "/image/blue-matcap.png"
      // "/image/9.png"
    );
    const materialBlue = new THREE.MeshMatcapMaterial({ matcap: matcapBlock });
    for (let i = 0; i < 50; i++) {
      let mesh;
      if (i % 2) {
        mesh = new THREE.Mesh(donutGeometry, materialBlue);
      } else {
        mesh = new THREE.Mesh(boxGeometry, materialBlue);
      }
      mesh.position.set(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15
      );
      // 随机旋转
      mesh.setRotationFromEuler(
        new THREE.Euler(
          Math.PI * Math.random(),
          Math.PI * Math.random(),
          Math.PI * Math.random()
        )
      );
      // 随机放大
      const radomeScale = Math.random() * 0.5 + 0.5;
      mesh.scale.set(radomeScale, radomeScale, radomeScale);
      meshs.push(mesh);
    }

    scene.add(...meshs);
  });
  const pointLight = new THREE.PointLight(0xffffff, 1.2);
  pointLight.position.set(10, 10, 10);
  scene.add(pointLight);
  // 渲染器
  renderer = new THREE.WebGLRenderer({
    antialias: true, // 抗锯齿
  });
  renderer.setSize(window.innerWidth, window.innerHeight); // 设置渲染器大小
  renderer.setPixelRatio(window.devicePixelRatio); // // 适应不同的设备屏幕
  threeRef.value.appendChild(renderer.domElement); // 将渲染器添加到DOM中

  // 轨道控制器
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; //开启阻尼（惯性效果，视觉更自然）
  controls.dampingFactor = 0.25; //阻尼系数

  function animate() {
    requestAnimationFrame(animate);
    if (textMesh) {
      textMesh.rotation.y += 0.01;
    }
    meshs?.forEach((mesh) => {
      mesh.rotation.y += 0.01;
      mesh.rotation.x += 0.01;
      mesh.rotation.z += 0.01;
    });
    controls.update(); // 更新控制器
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
  <VContainer title="3D文字" blogLink="">
    <div ref="threeRef" class="three-wrapper"></div>
  </VContainer>
</template>
<style scoped></style>
