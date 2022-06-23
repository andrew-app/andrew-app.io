import * as THREE from 'three';
import "./style.css";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import gltfPath from "../assets/title.gltf";

function main() {
    const canvas:HTMLCanvasElement = document.querySelector('#c')!;
    const renderer = new THREE.WebGLRenderer({canvas, alpha: true, antialias: true});
    
  
    function makeScene(elem:Element) {
      const scene = new THREE.Scene();
  
      const fov = 50;
      const aspect = 2;  // the canvas default
      const near = 0.1;
      const far = 5;
      const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      camera.position.set(0, 0, 2);
      camera.lookAt(0, 0, 0);
      {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
      }

      const mesh = new THREE.Object3D
  
      return {scene, camera, elem, mesh};
    }

    function setupTitle() {
      const sceneInfo = makeScene(document.querySelector('#title')!);

      const loader = new GLTFLoader();
      
      loader.load(gltfPath, (gltf: { scene: any; }) => {
        const model = gltf.scene;
        sceneInfo.scene.add(model);
    });

      sceneInfo.camera.position.set(1.6,0.3,1);

      
      const color = new THREE.Color("rgb(0, 0, 0)")
      sceneInfo.scene.background = color;
      return sceneInfo;
    }
  
    function setupScene1() {
      const sceneInfo = makeScene(document.querySelector('#box')!);
      const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
      const material = new THREE.MeshPhongMaterial({color: 'red'});
      const color = new THREE.Color("rgb(0, 0, 0)")
      sceneInfo.scene.background = color;
      const mesh = new THREE.Mesh(geometry, material);
      sceneInfo.mesh = mesh;
      sceneInfo.scene.add(mesh);
      return sceneInfo;
    }
  
    function setupScene2() {
      var sceneInfo = makeScene(document.querySelector('#pyramid')!);
      const radius = .8;
      const widthSegments = 4;
      const heightSegments = 2;
      const geometry = new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments);
      const material = new THREE.MeshPhongMaterial({
        color: 'blue',
        flatShading: true,
      });
      const color = new THREE.Color("rgb(0, 0, 0)")
      sceneInfo.scene.background = color;
      const mesh= new THREE.Mesh(geometry, material);
      sceneInfo.mesh = mesh;
      sceneInfo.scene.add(mesh)
      return sceneInfo;
    }
    
    const sceneTitle = setupTitle();
    const sceneInfo1 = setupScene1();
    const sceneInfo2 = setupScene2();
    
    
  
    function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
      const canvas = renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }
  
    function rendenerSceneInfo(sceneInfo: { scene: THREE.Scene; camera: THREE.PerspectiveCamera; elem: Element; mesh:THREE.Object3D }) {
      const {scene, camera, elem} = sceneInfo;
  
      // get the viewport relative position opf this element
      const {left, right, top, bottom, width, height} =
          elem.getBoundingClientRect();
  
      const isOffscreen =
          bottom < 0 ||
          top > renderer.domElement.clientHeight ||
          right < 0 ||
          left > renderer.domElement.clientWidth;
  
      if (isOffscreen) {
        return;
      }
  
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
  
      const positiveYUpBottom = renderer.domElement.clientHeight - bottom;
      renderer.setScissor(left, positiveYUpBottom, width, height);
      renderer.setViewport(left, positiveYUpBottom, width, height);
  
      renderer.render(scene, camera);
    }
  
    function render(time: number) {
      time *= 0.01;
  
      resizeRendererToDisplaySize(renderer);
  
      renderer.setScissorTest(false);
      renderer.clear(true, true);
      renderer.setScissorTest(true);
  
      sceneInfo1.mesh.rotation.y = time * .1;
      sceneInfo2.mesh.rotation.y = time * .1;
      
      rendenerSceneInfo(sceneInfo1);
      rendenerSceneInfo(sceneInfo2);
      rendenerSceneInfo(sceneTitle);
      renderer.setClearColor( 0x000000, 0 );
  
      requestAnimationFrame(render);
    }
  
    requestAnimationFrame(render);
  }
  
  main();