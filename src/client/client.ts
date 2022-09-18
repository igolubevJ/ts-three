import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'dat.gui';

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5));

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.x = -2;
camera.position.y = 4;
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

const boxGeometry = new THREE.BoxGeometry();

console.log(boxGeometry);

const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true
});

const cube = new THREE.Mesh(boxGeometry, material);
scene.add(cube);

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

const stats = Stats();
document.body.appendChild(stats.dom);

const gui = new GUI();

const cubeFolder = gui.addFolder('Cube');
const cubeRotationFolder = cubeFolder.addFolder('Rotation');
cubeRotationFolder.add(cube.rotation, 'x', 0, Math.PI * 2, 0.01);
cubeRotationFolder.add(cube.rotation, 'y', 0, Math.PI * 2, 0.01);
cubeRotationFolder.add(cube.rotation, 'z', 0, Math.PI * 2, 0.01);

const cubePositionFolder = cubeFolder.addFolder('Position');
cubePositionFolder.add(cube.position, 'x', -10, 10);
cubePositionFolder.add(cube.position, 'y', -10, 10);
cubePositionFolder.add(cube.position, 'z', -10, 10);

const cubeScaleFolder = cubeFolder.addFolder('Scale');
cubeScaleFolder.add(cube.scale, 'x', -5, 5, 0.1); //.onFinishChange(() => console.dir(cube.geometry))
cubeScaleFolder.add(cube.scale, 'y', -5, 5, 0.1);
cubeScaleFolder.add(cube.scale, 'z', -5, 5, 0.1);
cubeFolder.add(cube, 'visible', true);
cubeFolder.open();

const cubeData = {
    width: 1,
    height: 1,
    depth: 1,
    widthSegments: 1,
    heightSegments: 1,
    depthSegments: 1,
};

const cubePropertiesFolder = cubeFolder.addFolder('Properties')
cubePropertiesFolder
    .add(cubeData, 'width', 1, 30)
    .onChange(regenerateBoxGeometry)
    .onFinishChange(() => console.dir(cube.geometry))
cubePropertiesFolder.add(cubeData, 'height', 1, 30).onChange(regenerateBoxGeometry)
cubePropertiesFolder.add(cubeData, 'depth', 1, 30).onChange(regenerateBoxGeometry)
cubePropertiesFolder.add(cubeData, 'widthSegments', 1, 30).onChange(regenerateBoxGeometry)
cubePropertiesFolder.add(cubeData, 'heightSegments', 1, 30).onChange(regenerateBoxGeometry)
cubePropertiesFolder.add(cubeData, 'depthSegments', 1, 30).onChange(regenerateBoxGeometry)

function regenerateBoxGeometry() {
    const newGeometry = new THREE.BoxGeometry(
        cubeData.width,
        cubeData.height,
        cubeData.depth,
        cubeData.widthSegments,
        cubeData.heightSegments,
        cubeData.depthSegments
    )
    cube.geometry.dispose()
    cube.geometry = newGeometry
}

const cameraFolder = gui.addFolder("Camera");
cameraFolder.add(camera.position, "z", 0, 20);
cameraFolder.open();

const debug = <HTMLDivElement>document.querySelector("#debug1")

function animate() {
  requestAnimationFrame(animate);
  render();

  debug.innerText = 'Matrix\n' + cube.matrix.elements.toString().replace(/,/g, '\n')
    
  stats.update();
}

function render() {
  renderer.render(scene, camera);
}

animate();
