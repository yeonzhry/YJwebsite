'./style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { EffectComposer } from 'three/examples/jsm/Addons.js';
import { RenderPass } from 'three/examples/jsm/Addons.js';
import { DotScreenPass } from 'three/examples/jsm/Addons.js';
import { GlitchPass } from 'three/examples/jsm/Addons.js';
import { FilmPass } from 'three/examples/jsm/Addons.js';

const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

const ambientLight = new THREE.AmbientLight(0xffffff, 7.2)
scene.add(ambientLight)

const directionLight = new THREE.DirectionalLight(0xffffff, 8.3)
scene.add(directionLight)

const spotLight = new THREE.SpotLight(0xffffff, 3.0)
scene.add(spotLight)

let model = null;

gltfLoader.load(
    '../video/tv.glb',
    (gltf) => {
        model = gltf.scene;

        model.traverse((child) => {
            if (child.isMesh) {
                child.position.x = 0.01
                child.position.y = -0.25;
                child.position.z = 0.03;
            }
        });
        model.scale.set(4.5, 4.5, 4.5);
        scene.add(model);

        const video = document.createElement('video');
        video.src = '../video/vid.mp4';
        video.loop = true;
        video.muted = true;
        video.play();

        const videoTexture = new THREE.VideoTexture(video);

        const planeGeometry = new THREE.PlaneGeometry(1.58, 1);
        const planeMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });
        const videoPlane = new THREE.Mesh(planeGeometry, planeMaterial);

        videoPlane.position.set(-0.053, 0.015, 0.2225);
        videoPlane.scale.set(0.226, 0.27, 0.21)
        model.add(videoPlane);
    }
);

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
camera.position.set(0.1, 0.5, 3);
if (model) {
    camera.lookAt(model)
}
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const renderTarget = new THREE.WebGLRenderTarget(
    800,
    600, {
        samples: 2
    }
)

const effectComposer = new EffectComposer(renderer, renderTarget)
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
effectComposer.setSize(sizes.width, sizes.height)

const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)

const flimPass = new FilmPass()
effectComposer.addPass(flimPass)

const glitchPass = new GlitchPass()
glitchPass.curF = 100
effectComposer.addPass(glitchPass)

const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    controls.update();

    effectComposer.render()

    window.requestAnimationFrame(tick);
};

tick();

let activeTab = document.getElementById('tap-J');


gsap.to(activeTab, {
    duration: 0,
    color: '#000',
});

gsap.to(activeTab.querySelector('.hover-bg'), {
    duration: 0,
    opacity: 1,
    scale: 1.1,
});

gsap.to(activeTab.querySelector('.hover-text'), {
    duration: 0,
    opacity: 1,
});

document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');

    let activeTab = document.getElementById('tap-J');

    if (activeTab) {
        gsap.to(activeTab, {
            duration: 0,
            color: '#000',
        });

        gsap.to(activeTab.querySelector('.hover-bg'), {
            duration: 0,
            opacity: 1,
            scale: 1.1,
        });

        gsap.to(activeTab.querySelector('.hover-text'), {
            duration: 0,
            opacity: 1,
        });
    }

    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            if (item !== activeTab) {
                gsap.to(item, {
                    duration: 0.3,
                    color: '#000',
                });

                gsap.to(item.querySelector('.hover-bg'), {
                    duration: 0.3,
                    opacity: 1,
                    scale: 1.1,
                });

                gsap.to(item.querySelector('.hover-text'), {
                    duration: 0.3,
                    opacity: 1,
                });
            }
        });

        item.addEventListener('mouseleave', () => {
            if (item !== activeTab) {
                gsap.to(item, {
                    duration: 0.3,
                    color: '#fff',
                });

                gsap.to(item.querySelector('.hover-bg'), {
                    duration: 0.3,
                    opacity: 0,
                    scale: 1,
                });

                gsap.to(item.querySelector('.hover-text'), {
                    duration: 0.3,
                    opacity: 0,
                });
            }
        });

        item.addEventListener('click', () => {
            activeTab = item;
        });
    });
});