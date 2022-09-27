import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Stats from 'three/examples/jsm/libs/stats.module'

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(15, 15, 15);

const renderer = new THREE.WebGLRenderer();
renderer.physicallyCorrectLights = true;
renderer.shadowMap.enabled = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const sceneMeshes: THREE.Mesh[] = [];

const loader = new GLTFLoader();
loader.load('models/monkey_textured.glb', (gltf) => {
  gltf.scene.traverse(function(child) {
    if ((child as THREE.Mesh).isMesh) {
      const m = child as THREE.Mesh;
      m.receiveShadow = true;
      m.castShadow = true;
      sceneMeshes.push(m);
    }

    if ((child as THREE.Light).isLight) {
      const l = child as THREE.Light;
      l.castShadow = true;
      l.shadow.bias = -0.003;
      l.shadow.mapSize.width = 2048;
      l.shadow.mapSize.height = 2048;
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

animate()