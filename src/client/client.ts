import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Stats from 'three/examples/jsm/libs/stats.module';

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5));

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer();
renderer.physicallyCorrectLights = true;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
const points = new Array();
points.push(new THREE.Vector3(0, 0, 0));
points.push(new THREE.Vector3(0, 0, 0.25));
const geometry = new THREE.BufferGeometry().setFromPoints(points);
const line = new THREE.Line(geometry, material);
scene.add(line);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const raycaster = new THREE.Raycaster();
const sceneMeshes: THREE.Mesh[] = [];

const gltfLoader = new GLTFLoader();

gltfLoader.load('models/monkey_textured.glb', 
  (gltf) => {
    gltf.scene.traverse(function (child) {
      if ((child as THREE.Mesh).isMesh) {
        let m = child as THREE.Mesh;
        m.receiveShadow = true;
        m.castShadow = true;
        // (m.material as THREE.MeshStandardMaterial).flatShading = true;
        sceneMeshes.push(m);
      }

      if ((child as THREE.Light).isLight) {
        let l = child as THREE.Light;
        l.castShadow = true;
        l.shadow.bias = -0.003;
        l.shadow.mapSize.width = 2048;
        l.shadow.mapSize.height = 2048;
      }
    });

    scene.add(gltf.scene);
    // sceneMeshes.push(gltf.scene);
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

renderer.domElement.addEventListener('mousemove', onMouseMove, false);

function onMouseMove(event: MouseEvent) {
  const mouse = new THREE.Vector2(); 
  mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

  // console.log(mouse);

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(sceneMeshes, false);

  if (intersects.length > 0) {
    // console.log(`${sceneMeshes.length} ${intersects.length}`);
    // console.log(intersects[0]);
    // console.log(intersects[0].object.userData.name + " " + intersects[0].distance + " ");
    // console.log((intersects[0].face as THREE.Face).normal);

    line.position.set(0, 0, 0);
    line.lookAt((intersects[0].face as THREE.Face).normal);
    line.position.copy(intersects[0].point);
  }
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
