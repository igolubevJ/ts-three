import * as THREE from 'three';
import { AxesHelper } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Stats from 'three/examples/jsm/libs/stats.module';

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

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const pickableObjects: THREE.Mesh[] = [];
let intersectedObject: THREE.Object3D | null;
const originalMaterials: { [id: string]: THREE.Material | THREE.Material[] } = {};
const hightlightedMaterial = new THREE.MeshBasicMaterial({
  wireframe: true,
  color: 0x00ff00
});

const loader = new GLTFLoader();

loader.load('models/simplescene.glb', (gltf) => {
  gltf.scene.traverse((child) => {
    if ((<THREE.Mesh>child).isMesh) {
      const m = <THREE.Mesh>child;
      switch(m.name) {
        case 'Plane':
          m.receiveShadow = true;
          break;
        case 'Sphere':
          m.castShadow = true;
          break;
        default:
          m.castShadow = true;
          pickableObjects.push(m);
          originalMaterials[m.name] = (<THREE.Mesh>m).material;
      }
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

const raycaster = new THREE.Raycaster();
let intersects: THREE.Intersection[];

document.addEventListener('mousemove', onDocumentMouseMove, false);
function onDocumentMouseMove(event: MouseEvent) {
  const pointer = new THREE.Vector2();
  pointer.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
  pointer.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  intersects = raycaster.intersectObjects(pickableObjects, false);

  if (intersects.length > 0) {
    intersectedObject = intersects[0].object;
  } else {
    intersectedObject = null;
  }

  pickableObjects.forEach((o: THREE.Mesh, i) => {
    if (intersectedObject && intersectedObject.name === o.name) {
      pickableObjects[i].material = hightlightedMaterial;
    } else {
      pickableObjects[i].material = originalMaterials[o.name];
    }
  });
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
