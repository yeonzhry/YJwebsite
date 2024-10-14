'./style.css'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/Addons.js';
import { RenderPass } from 'three/examples/jsm/Addons.js';
import { GlitchPass } from 'three/examples/jsm/Addons.js';

const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    effectComposer.setSize(sizes.width, sizes.height)
});

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0.1, 0.5, 10);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const renderTarget = new THREE.WebGLRenderTarget(
    800,
    600, {
        samples: 8
    }
)

const effectComposer = new EffectComposer(renderer, renderTarget)
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
effectComposer.setSize(sizes.width, sizes.height)

const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)

const glitchPass = new GlitchPass()
effectComposer.addPass(glitchPass)

const loader = new THREE.TextureLoader();
loader.load('../logo.png', (texture) => {
    const planeGeometry = new THREE.PlaneGeometry(4, 1);
    const planeMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const imagePlane = new THREE.Mesh(planeGeometry, planeMaterial);
    imagePlane.position.set(0, 0.9, 0)
    imagePlane.scale.set(3.3, 3.3, 3.3);
    scene.add(imagePlane);
});

const tick = () => {

    effectComposer.render()

    window.requestAnimationFrame(tick);
};

tick();