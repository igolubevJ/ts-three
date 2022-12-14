import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Stats from 'three/examples/jsm/libs/stats.module';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min';

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

const raycaster = new THREE.Raycaster();

renderer.domElement.addEventListener('dblclick', onDoubleClick, false);
function onDoubleClick(event: MouseEvent) {
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(sceneMeshes, false);
  if (intersects.length > 0) {
    const p = intersects[0].point;
    // controls.target.set(p.x, p.y, p.z);
    // new TWEEN.Tween(controls.target)
    //   .to({ x: p.x, y: p.y, z: p.z }, 500)
    //   // .delay(1000)
    //   .easing(TWEEN.Easing.Cubic.Out)
    //   .start();

    new TWEEN.Tween(sceneMeshes[1].position)
      .to({
        x: p.x,
        // y: p.y + 1,
        z: p.z
      },
      500
    ).start();

    new TWEEN.Tween(sceneMeshes[1].position)
      .to({
        // x: p.x,
        y: p.y + 3,
        // z: p.z
      }, 250)
      .delay(1000)
      .easing(TWEEN.Easing.Cubic.Out)
      // .onUpdate(() => render())
      .start()
      .onComplete(() => {
        new TWEEN.Tween(sceneMeshes[1].position)
          .to(
            {
              // x: p.x,
              y: p.y + 1,
              // z: p.z
            },
            250
          ).easing(TWEEN.Easing.Bounce.Out)
          .start();
      });
  }
}

const stats = Stats();
document.body.appendChild(stats.dom);

function animate() {
    requestAnimationFrame(animate);

    controls.update();

    TWEEN.update();

    render();

    stats.update();
}

function render() {
    renderer.render(scene, camera);
}

animate()