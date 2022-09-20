import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
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

const material = new THREE.MeshBasicMaterial({ color: 0xe57c92, wireframe: true });

const objLoader = new OBJLoader();
objLoader.load(
  'models/monkey.obj', 
  (object) => {
    // (<THREE.Mesh>object.children[0]).material = material;
    object.traverse(function (child) {
      if ((<THREE.Mesh>child).isMesh) {
        (<THREE.Mesh>child).material = material;
      }
    });

    scene.add(object);
  },
  (xhr) => {
    console.log(((xhr.loaded / xhr.total) * 100) + ' % loaded monkey');
  },
  (err) => {
    console.log(err);
  });

objLoader.load(
  'models/cube.obj',
  (object) => {
    object.position.x = -3;
    scene.add(object);
  },
  (xhr) => {
    console.log(((xhr.loaded / xhr.total) * 100) + ' % loaded cube');
  },
  (err) => {
    console.log(err);
  });

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
