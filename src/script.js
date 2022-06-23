import "./style.css";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import gltfPath from "../assets/title.gltf";

const params = {
    exposure: 1.1,
    bloomStrength: 1.3,
    bloomThreshold: 0,
    bloomRadius: 0
};

const container = document.querySelector("#container");
const renderer = new THREE.WebGLRenderer( {antialias: true } );

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.toneMapping = THREE.ReinhardToneMapping;
container.appendChild( renderer.domElement );

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
scene.add( camera );

scene.add( new THREE.AmbientLight( 0x404040 ) );

const pointLight = new THREE.PointLight( 0xffffff, 1 );
camera.add( pointLight );

const renderScene = new RenderPass( scene, camera );

const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );

bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;

const em = new THREE.MeshStandardMaterial({color:0xffc409,emissive:0xf9f06b})
const composer = new EffectComposer( renderer );
composer.addPass( renderScene );
composer.addPass( bloomPass );


const loader = new GLTFLoader();


loader.load(gltfPath, gltf => {
    // called when the resource is loaded
    const model = gltf.scene;
    model.traverse((o) => {
        if (o.isMesh) o.material = em;
      });

    camera.position.x = 2.5;
    camera.position.z = 5;
    
    scene.add( model );
},
( xhr ) => {
    // called while loading is progressing
    console.log( `${( xhr.loaded / xhr.total * 100 )}% loaded` );
},
( error ) => {
    // called when loading has errors
    console.error( 'An error happened', error );
},
);

window.addEventListener('resize', onWindowResize, false);

var temp = 0.9;

function animate() {
	requestAnimationFrame( animate );
	composer.render();
    
    renderer.toneMappingExposure = Math.pow( temp, 4.0 );
    temp += 0.075;

    if (temp >= 1.2){
        temp = 0.9
    }
}
animate();

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
 }
