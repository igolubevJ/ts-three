import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'dat.gui';

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5));

const light1 = new THREE.PointLight();
light1.position.set(2.5, 2.5, 2.5);
scene.add(light1);

const light2 = new THREE.PointLight();
light2.position.set(-2.5, 2.5, 2.5);
scene.add(light2);

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0.8, 1.4, 1.0);

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
let lastAction: THREE.AnimationAction
const gltfLoader = new GLTFLoader();

gltfLoader.load(
  'models/eve.glb',
  (gltf) => {
    mixer = new THREE.AnimationMixer(gltf.scene);

    const animationAction = mixer.clipAction((<any>gltf).animations[0]);
    animationActions.push(animationAction);
    animationsFolder.add(animations, 'default');
    activeAction = animationActions[0];

    scene.add(gltf.scene);

    // add animations another file
    gltfLoader.load(
      'models/eve-angry.glb',
      (gltf) => {
        const animationAction = mixer.clipAction(
          (<any>gltf).animations[0]
        );
        animationActions.push(animationAction);
        animationsFolder.add(animations, "angry");

        modelReady = true;
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded angry');
      },
      (err) => {
        console.log(err);
      }
    )
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
  },
  (err) => {
    console.log(err);
  }
)

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
  default: function () {
    setAction(animationActions[0]);
  },
  angry: function () {
    setAction(animationActions[1]);
  },
  clapping: function () {
    setAction(animationActions[2]);
  }, 
  dancing: function () {
    setAction(animationActions[3]);
  }
}

function setAction(toAction: THREE.AnimationAction) {
  if (toAction !== activeAction) {
    lastAction = activeAction;
    activeAction = toAction;
    //lastAction.stop();
    lastAction.fadeOut(1);
    activeAction.reset();
    activeAction.fadeIn(1);
    activeAction.play();
  }
}

const gui = new GUI();
const animationsFolder = gui.addFolder("Animation");
animationsFolder.open();

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  if (modelReady) mixer.update(clock.getDelta());

  render();

  stats.update();
}

function render() {
  renderer.render(scene, camera)
}

animate();
