import * as THREE from 'three';
import { AxesHelper } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Stats from 'three/examples/jsm/libs/stats.module';
import {
  CSS2DRenderer,
  CSS2DObject
} from 'three/examples/jsm/renderers/CSS2DRenderer';

const scene = new THREE.Scene();
scene.add(new AxesHelper(5));

const light = new THREE.SpotLight();
light.position.set(12.5, 12.5, 12.5);
light.castShadow = true;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
scene.add(light);

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(15, 15, 15);

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(labelRenderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const pickableObjects: THREE.Mesh[] = [];

const loader = new GLTFLoader();

loader.load('models/simplescene.glb', (gltf) => {
  gltf.scene.traverse((child) => {
    if ((<THREE.Mesh>child).isMesh) {
      const m = <THREE.Mesh>child;
      switch(m.name) {
        case 'Plane':
          m.receiveShadow = true;
          break;
        default:
          m.castShadow = true;
      }
      pickableObjects.push(m);
    }
  });
  scene.add(gltf.scene);
});

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

let ctrlDown = false;
let lineId = 0;
let line: THREE.Line;
let drawingLine = false;
const measurementLabels: { [key: number]: CSS2DObject } = {};

window.addEventListener('keydown', function (event) {
  if (event.key === 'Control') {
    ctrlDown = true;
    controls.enabled = false;
    renderer.domElement.style.cursor = 'crosshair';
  }
});

window.addEventListener('keyup', function (event) {
  if (event.key === 'Control') {
    ctrlDown = false;
    controls.enabled = true;
    renderer.domElement.style.cursor = 'pointer';
    if (drawingLine) {
      scene.remove(line);
      scene.remove(measurementLabels[lineId]);
      drawingLine = false;
    }
  }
});

const stats = Stats();
document.body.appendChild(stats.dom);

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  render();

  stats.update();
}

function render() {
  renderer.render(scene, camera);
}

animate();
