import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
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
controls.target.set(0, 1, 0);

const planeGeometry = new THREE.PlaneGeometry(25, 25);
const texture = new THREE.TextureLoader().load('img/grid.png');
const plane: THREE.Mesh = new THREE.Mesh(
  planeGeometry,
  new THREE.MeshPhongMaterial({ map: texture })
);
plane.rotateX(-Math.PI / 2);
plane.receiveShadow = true;
scene.add(plane);

let mixer: THREE.AnimationMixer;
let modelReady = false;
const gltfLoader = new GLTFLoader();

gltfLoader.load('models/eve.@pounchglb.glb', 
  (gltf) => {
    gltf.scene.traverse(function(child) {
      if((child as THREE.Mesh).isMesh) {
        
      }
    });

    mixer = new THREE.AnimationMixer(gltf.scene);
    mixer.clipAction((gltf as any).animations[0]).play();

    scene.add(gltf.scene);
    modelReady = true;
  },
  (xhr) => console.log(((xhr.loaded / xhr.total) * 100) + '% loaded'), 
  (error) => console.log(error)
);

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

  if (modelReady) {
    mixer.update(clock.getDelta());
  }

  render();

  stats.update();
}

function render() {
  renderer.render(scene, camera)
}

animate();
