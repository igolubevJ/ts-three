import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'dat.gui';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min';

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5));

const light1 = new THREE.PointLight();
light1.position.set(2.5, 2.5, 2.5);

scene.add(light1);

const light2 = new THREE.PointLight();
light2.position.set(-2.5, 5, 2.5);

scene.add(light2);

const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.set(0.8, 1.5, 1.0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1, 0);

let mixer: THREE.AnimationMixer;
let modelReady = false;

const animationActions: THREE.AnimationAction[] = [];
let activeAction: THREE.AnimationAction;
let lastAction: THREE.AnimationAction;
const gltfLoader = new GLTFLoader();

gltfLoader.load('models/Kachujin/Kachujin.glb', (gltf) => {
  scene.add(gltf.scene);

  mixer = new THREE.AnimationMixer(gltf.scene);

  const animationAction = mixer.clipAction((gltf as any).animations[0]);
  animationActions.push(animationAction);
  animationsFolder.add(animations, 'default');
  activeAction = animationActions[0];

  // add animation from another file
  gltfLoader.load('models/Kachujin/Kachujin@kick.glb', (gltf) => {
    console.log('Load kick');
    const animationAction = mixer.clipAction(
      (gltf as any).animations[0]
    );
    animationActions.push(animationAction);
    animationsFolder.add(animations, 'kick');

    // add animation from another file
    gltfLoader.load('models/Kachujin/Kachujin@walking.glb', (gltf) => {
      console.log('Load walking');
      const animationAction = mixer.clipAction(
        (gltf as any).animations[0]
      );
      animationActions.push(animationAction);
      animationsFolder.add(animations, 'walk');

      modelReady = true;
    });
  });
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

const animations = {
  default: function() {
    setAction(animationActions[0]);
  },
  kick: function() {
    setAction(animationActions[1]);
  },
  walk: function() {
    setAction(animationActions[2]);
  },
};

const setAction = (toAction: THREE.AnimationAction) => {
  if (toAction != activeAction) {
    lastAction = activeAction;
    activeAction = toAction;
    // lastAction.stop();
    lastAction.fadeOut(0.2);
    activeAction.reset();
    activeAction.fadeIn(0.2);
    activeAction.play();
  }
};

const gui = new GUI();
const animationsFolder = gui.addFolder('Animations');
animationsFolder.open();

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate)

  controls.update();

  if (modelReady) {
    mixer.update(clock.getDelta());
  }

  render();

  stats.update();
}

function render() {
  renderer.render(scene, camera);
}
animate();