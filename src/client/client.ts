import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import Stats from 'three/examples/jsm/libs/stats.module';

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5));

const light = new THREE.PointLight();
light.position.set(2.5, 7.5, 15);
scene.add(light);

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

const mtlLoader = new MTLLoader();

mtlLoader.load(
  'models/monkey.mtl',
  (materials) => {
    materials.preload();

    const objLoader = new OBJLoader();
    objLoader.load(
      'models/monkey.obj',
      (object) => {
        object.position.x = 1.5;
        scene.add(object);
      },
      (xhr) => {
        console.log(((xhr.loaded / xhr.total) * 100 )+ '% loaded obj monkey');
      },
      (err) => console.log(err)
    );
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + '% loaded mtl monkey')
  },
  (err) => {
    console.log(err)
  }
);

mtlLoader.load(
  'models/monkeyTextured.mtl',
  (material) => {
    material.preload();

    const objLoader = new OBJLoader();
    objLoader.load(
      'models/monkeyTextured.obj',
      (object) => {
        object.position.x = -1.5;
        scene.add(object);
      },
      (xhr) => {
        console.log(((xhr.loaded / xhr.total) * 100 )+ '% loaded obj monkey textured');
      },
      (err) => console.log(err)
    )
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + '% loaded mtl monkey textured')
  },
  (err) => {
    console.log(err)
  }
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
