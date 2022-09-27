import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5));

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const raycaster = new THREE.Raycaster();

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshNormalMaterial({ side: THREE.DoubleSide })
);
floor.rotateX(Math.PI / 2);
floor.position.y = -1;
scene.add(floor);

const ceiling = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshNormalMaterial({ side: THREE.DoubleSide })
);
ceiling.rotateX(Math.PI / 2);
ceiling.position.y = 3;
scene.add(ceiling);

const wall1 = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  new THREE.MeshNormalMaterial({ side: THREE.DoubleSide })
);
wall1.position.x = 4;
wall1.rotateY(-Math.PI / 2);
scene.add(wall1);

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

  controls.update();

  render();

  stats.update();
}

function render() {
  renderer.render(scene, camera);
}

animate();
