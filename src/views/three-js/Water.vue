<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Water } from "three/examples/jsm/objects/Water.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import { onMounted, ref, onBeforeUnmount } from "vue";
import VContainer from "@/components/v-container/Container.vue";

const threeRef = ref();
let renderer = null;
let scene = null;
let controls = null;
let camera = null;
let sky, sun;

const init = () => {
  // 场景
  scene = new THREE.Scene();
  // 相机
  camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    1,
    20000
  );
  camera.position.set(30, 30, 100);
  scene.add(camera);

  // 渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate); // 自动动画刷新
  renderer.toneMapping = THREE.ACESFilmicToneMapping; //色彩映射，电影色调映射
  renderer.toneMappingExposure = 1.5; //让色彩不过曝或欠曝
  threeRef.value.appendChild(renderer.domElement);

  // 加载水面法线贴图
  const textureLoader = new THREE.TextureLoader();
  const waterNormals = textureLoader.load(
    "/image/waternormals.jpg",
    function (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping; // 让法线贴图可以重复
    }
  );

  // 创建水面
  const waterGeometry = new THREE.PlaneGeometry(1000, 1000);
  // 使用Water 材质
  const water = new Water(waterGeometry, {
    textureWidth: 512, // 生成的反射/折射纹理宽度
    textureHeight: 512, // 生成的反射/折射纹理高度
    waterNormals: waterNormals, // 法线贴图
    alpha: 1.0, // 水面的透明度
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff, // “太阳光”颜色
    waterColor: 0x9ee7f7, // 水体颜色
    distortionScale: 3.7, // 失真程度，决定波纹起伏的大小
    fog: scene.fog !== undefined, // 是否结合场景雾效
  });
  water.rotation.x = -Math.PI / 2; //让水面水平
  scene.add(water); //

  // 添加天空
  sky = new Sky();
  sky.scale.setScalar(10000); //设置天空大小
  scene.add(sky);
  // 设置大气效果
  const skyUniforms = sky.material.uniforms;
  skyUniforms["turbidity"].value = 10; //（浑浊度）→ 决定天空雾化
  skyUniforms["rayleigh"].value = 2; //瑞利散射→ 控制蓝色强度
  skyUniforms["mieCoefficient"].value = 0.005; //米氏散射→ 影响光晕
  skyUniforms["mieDirectionalG"].value = 0.8; //散射方向→太阳光扩散角度

  // 太阳
  sun = new THREE.Vector3();

  // 添加环境光照
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const sceneEnv = new THREE.Scene();
  let renderTarget;

  // 太阳位置改变时，天空颜色和水面反射也同步更新
  function updateSun() {
    const phi = THREE.MathUtils.degToRad(90 - 2); //太阳相对于天顶的角度
    const theta = THREE.MathUtils.degToRad(180); //太阳绕场景水平旋转的角度。

    sun.setFromSphericalCoords(1, phi, theta); //转成笛卡尔坐标

    sky.material.uniforms["sunPosition"].value.copy(sun); //更新天/空材质
    water.material.uniforms["sunDirection"].value.copy(sun).normalize(); //更新水面材质
    if (renderTarget !== undefined) renderTarget.dispose();

    sceneEnv.add(sky); // 创建一个场景，放入天空
    renderTarget = pmremGenerator.fromScene(sceneEnv); //生成环境贴图
    scene.add(sky); // 设置到主场景

    scene.environment = renderTarget.texture; //
  }

  updateSun();

  // 添加方块
  const geometry = new THREE.BoxGeometry(30, 30, 30);
  const material = new THREE.MeshStandardMaterial({ roughness: 0 });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // 添加动画
  function animate() {
    const time = performance.now() * 0.001; //performance.now()返回从页面加载开始到现在的毫秒数
    /**
     * Math.sin(time) 会生成一个周期性波动（-1 到 1）。
     * 20 放大振幅 → 上下浮动幅度 ±20。
     * 5 调整基准高度 → mesh 不会落到 y=0。
     */
    mesh.position.y = Math.sin(time) * 20 + 5; // 让方块上下移动
    mesh.rotation.x = time * 0.5; // 让方块旋转
    mesh.rotation.z = time * 0.51; // 让方块旋转

    // 让水面波纹动起来，内部水面材质会根据 time 进行偏移
    water.material.uniforms["time"].value += 1.0 / 60.0;

    renderer.render(scene, camera);
  }

  // 控制器
  controls = new OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI * 0.495;
  controls.target.set(0, 10, 0);
  controls.update();

  // 窗口自适应
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
  <div>
    <VContainer title="水波纹与天空" blogLink="test">
      <div ref="threeRef" class="three-wrapper"></div>
    </VContainer>
  </div>
</template>
<style scoped></style>
