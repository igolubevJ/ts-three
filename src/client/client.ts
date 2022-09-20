import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'dat.gui';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87b8ce);
scene.add(new THREE.AxesHelper(5));

const light = new THREE.PointLight();
light.position.set(2.5, 7.5, 15);
light.intensity = 2.5;
scene.add(light);

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
let lastAction: THREE.AnimationAction;

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
    // lastAction.stop();
    lastAction.fadeOut(1);
    activeAction.reset();
    activeAction.fadeIn(1);
    activeAction.play();
  }
}

const loader = new FBXLoader();
loader.load(
  'models/eve.fbx',
  (object) => {
    object.scale.set(0.01, 0.01, 0.01);
    mixer = new THREE.AnimationMixer(object);

    const animationAction = mixer.clipAction(
      (<THREE.Object3D>object).animations[0]
    );
    animationActions.push(animationAction);
    animationFolder.add(animations, 'default');
    activeAction = animationActions[0];
    scene.add(object);

    // add an animation from another file
    loader.load('models/Angry.fbx', (object) => {
      console.log("Load Angry");

      const animationAction = mixer.clipAction(
        (<THREE.Object3D>object).animations[0]
      );
      animationActions.push(animationAction);
      animationFolder.add(animations, "angry");

      loader.load('models/Clapping.fbx', (object) => {
        console.log("Load Clapping");

        const animationAction = mixer.clipAction(
          (<THREE.Object3D>object).animations[0]
        );
        animationActions.push(animationAction);
        animationFolder.add(animations, "clapping");

        loader.load('models/Silly Dancing.fbx', (object) => {
          console.log("Load Silly Dancing");

          const animationAction = mixer.clipAction(
            (<THREE.Object3D>object).animations[0]
          );
          animationActions.push(animationAction);
          animationFolder.add(animations, "dancing");

          modelReady = true;
        })
      });
    });


  },
  (xhr) => console.log('loaded'), 
  (err) => console.log(err)
);

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
const animationFolder = gui.addFolder("Animation");
animationFolder.open();

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
