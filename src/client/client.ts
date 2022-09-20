import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import Stats from 'three/examples/jsm/libs/stats.module';

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5));

// const light = new THREE.PointLight();
// light.position.set(0, 7.5, 15);
// scene.add(light);

// const light = new THREE.SpotLight();
// light.position.set(5, 5, 5);
// scene.add(light);

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer();
renderer.physicallyCorrectLights = true;
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('js/libs/draco/');

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);
loader.load(
  'models/monkey_compressed.glb',
  function (gltf) {
    gltf.scene.traverse(function (child) {
      if ((child as THREE.Mesh).isMesh) {
        const m = <THREE.Mesh>child;
        m.receiveShadow = true;
        m.castShadow = true;
      }

      if ((child as THREE.Light).isLight) {
        const l = <THREE.Light>child;
        l.castShadow = true;
        l.shadow.bias = -0.003;
        l.shadow.mapSize.width = 2048;
        l.shadow.mapSize.height = 2048;
      }
    });
    scene.add(gltf.scene);
  },
  (xhr) => console.log(((xhr.loaded / xhr.total) * 100) + '% loaded'),
  (err) => console.log(err)
);

const backgroundTexture = new THREE.CubeTextureLoader().load([
  'img/px_eso0932a.jpg',
  'img/nx_eso0932a.jpg',
  'img/py_eso0932a.jpg',
  'img/ny_eso0932a.jpg',
  'img/pz_eso0932a.jpg',
  'img/nz_eso0932a.jpg',
]);
scene.background = backgroundTexture;

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

const stats = Stats();
document.body.appendChild(stats.dom);

function animate() {
  requestAnimationFrame(animate);

  render();

  stats.update();
}

function render() {
  renderer.render(scene, camera)
}

animate();
