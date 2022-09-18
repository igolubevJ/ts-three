import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  1,
  0.1,
  1000
);

camera.position.z = 2;

const canvas1 = <HTMLCanvasElement>document.querySelector('#c1');
const canvas2 = <HTMLCanvasElement>document.querySelector('#c2');
const canvas3 = <HTMLCanvasElement>document.querySelector('#c3');
const canvas4 = <HTMLCanvasElement>document.querySelector('#c4');

const renderer1 = new THREE.WebGLRenderer({ canvas: canvas1 });
renderer1.setSize(200, 200);
// document.body.appendChild(renderer.domElement);

const renderer2 = new THREE.WebGLRenderer({ canvas: canvas2 });
renderer2.setSize(200, 200);

const renderer3 = new THREE.WebGLRenderer({ canvas: canvas3 });
renderer3.setSize(200, 200);

const renderer4 = new THREE.WebGLRenderer({ canvas: canvas4 });
renderer4.setSize(200, 200);

new OrbitControls(camera, renderer1.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,  
});

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// window.addEventListener('resize', onWindowResize, false);
// function onWindowResize() {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   render();
// }

function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  render();
}

function render() {
  renderer1.render(scene, camera);
  renderer2.render(scene, camera);
  renderer3.render(scene, camera);
  renderer4.render(scene, camera);
}

animate();
