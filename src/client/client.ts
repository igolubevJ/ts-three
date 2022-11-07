import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'dat.gui';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min';

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5));

const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.set(0.8, 1.5, 1.0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1, 0);

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
  requestAnimationFrame(animate)

  controls.update();

  render();

  stats.update();
}

function render() {
  renderer.render(scene, camera);
}
animate();