import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const camera1 = new THREE.PerspectiveCamera(
  75,
  1,
  0.1,
  1000
);

const camera2 = new THREE.OrthographicCamera(
  -1,   // left
  1,    // right
  1,    // top
  -1    // bottom
);

const camera3 = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
const camera4 = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);

camera1.position.z = 2;
camera2.position.y = 2;
camera2.lookAt(new THREE.Vector3()); // look top down to the cube

camera3.position.x = -2;
camera3.lookAt(new THREE.Vector3()); // look right to the cube

camera4.position.z = 2;              // look front to the cube

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

new OrbitControls(camera1, renderer1.domElement);

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
  renderer1.render(scene, camera1);
  renderer2.render(scene, camera2);
  renderer3.render(scene, camera3);
  renderer4.render(scene, camera4);
}

animate();
