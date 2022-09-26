import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Stats from 'three/examples/jsm/libs/stats.module';

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5));

const light1 = new THREE.PointLight();
light1.position.set(2.5, 2.5, 2.5);
light1.castShadow = true;
scene.add(light1);

const light2 = new THREE.PointLight();
light2.position.set(-2.5, 2.5, 2.5);
light2.castShadow = true;
scene.add(light2);

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0.8, 1.4, 1.0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

let mixer: THREE.AnimationMixer;
let modelReady = false;

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

const stats = Stats();
document.body.appendChild(stats.dom);

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  if (modelReady) mixer.update(clock.getDelta());

  render();

  stats.update();
}

function render() {
  renderer.render(scene, camera)
}

animate();
