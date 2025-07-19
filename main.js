/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.core.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
/* harmony import */ var three_examples_jsm_controls_DragControls__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! three/examples/jsm/controls/DragControls */ "./node_modules/three/examples/jsm/controls/DragControls.js");
/* harmony import */ var lil_gui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lil-gui */ "./node_modules/lil-gui/dist/lil-gui.esm.js");




class ThreeJSContainer {
    scene;
    //private renderer: THREE.WebGLRenderer;
    light;
    constructor() {
    }
    // 画面部分の作成(表示する枠ごとに)*
    createRendererDOM = (width, height, cameraPos) => {
        const renderer = new three__WEBPACK_IMPORTED_MODULE_0__.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_1__.Color(0x495ed));
        renderer.shadowMap.enabled = true; //シャドウマップを有効にする
        //カメラの設定
        const camera = new three__WEBPACK_IMPORTED_MODULE_1__.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(0, 0, 0));
        const orbitControls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_2__.OrbitControls(camera, renderer.domElement);
        // ドラッグ可能なオブジェクトの配列
        const draggableObjects = [];
        this.createScene(draggableObjects);
        // DragControlsの設定
        const dragControls = new three_examples_jsm_controls_DragControls__WEBPACK_IMPORTED_MODULE_3__.DragControls(draggableObjects, camera, renderer.domElement);
        // ドラッグ中はOrbitControlsを無効にする
        dragControls.addEventListener('dragstart', () => {
            orbitControls.enabled = false;
        });
        dragControls.addEventListener('dragend', () => {
            orbitControls.enabled = true;
        });
        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        const render = (time) => {
            orbitControls.update();
            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    };
    // シーンの作成(全体で1回)
    createScene = (draggableObjects) => {
        this.scene = new three__WEBPACK_IMPORTED_MODULE_1__.Scene();
        let gui = new lil_gui__WEBPACK_IMPORTED_MODULE_4__["default"](); // GUI用のインスタンスの生成
        // 形状パラメータ
        let shapeParams = {
            thickness: 0.1,
            radius: 1,
            capSegments: 32,
            radialSegments: 64
        };
        // 位置パラメータ
        let positionParams = {
            x: 0,
            y: 0.2,
            z: 0
        };
        // 平面のテクスチャ切り替え用
        const planeGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.PlaneGeometry(5, 5);
        const loader = new three__WEBPACK_IMPORTED_MODULE_1__.TextureLoader();
        const planeTextures = {
            'DragToMove': loader.load('DragToMove.png'),
            'Space': loader.load('space.jpeg'),
            'Dispersion': loader.load('DISPERSION.png')
        };
        let planeMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshBasicMaterial({ map: planeTextures['DragToMove'] });
        const plane = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        this.scene.add(plane);
        // シンプルな背景設定
        this.scene.background = new three__WEBPACK_IMPORTED_MODULE_1__.Color(0x404040);
        this.scene.environment = null; // 環境光を無効化
        // 初期背景の設定完了
        // ジオメトリの生成
        const diskGeometry = this.creatediskGeometry(shapeParams.thickness, shapeParams.radius, shapeParams.capSegments, shapeParams.radialSegments);
        // マテリアルの設定
        const material = new three__WEBPACK_IMPORTED_MODULE_1__.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0.0,
            roughness: 0.0,
            transmission: 1.3,
            ior: 1.6,
            thickness: 1.0,
            dispersion: 5.0,
        });
        // メッシュの作成
        const diskMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(diskGeometry, material);
        //diskMesh.castShadow = true; // 影を落とす
        //diskMesh.receiveShadow = true; // 影を受ける
        diskMesh.position.set(positionParams.x, positionParams.y, positionParams.z); // パラメータから位置を設定
        this.scene.add(diskMesh);
        // diskMeshをドラッグ可能なオブジェクトに追加
        if (draggableObjects) {
            draggableObjects.push(diskMesh);
        }
        // GUIコントロールの追加
        // 形状フォルダー
        const shapeFolder = gui.addFolder('Shape Parameters');
        // ジオメトリの更新関数
        const updateGeometry = () => {
            const newGeometry = this.creatediskGeometry(shapeParams.thickness, shapeParams.radius, shapeParams.capSegments, shapeParams.radialSegments);
            diskMesh.geometry.dispose(); // 古いジオメトリを削除
            diskMesh.geometry = newGeometry;
        };
        shapeFolder.add(shapeParams, 'thickness', 0.01, 0.5, 0.01).name('Thickness').onChange(updateGeometry);
        shapeFolder.add(shapeParams, 'radius', 0.5, 5.0, 0.1).name('Radius').onChange(updateGeometry);
        shapeFolder.add(shapeParams, 'capSegments', 8, 64, 1).name('Cap Segments').onChange(updateGeometry);
        shapeFolder.add(shapeParams, 'radialSegments', 16, 128, 1).name('Radial Segments').onChange(updateGeometry);
        // マテリアルパラメータ
        const materialFolder = gui.addFolder('Material');
        materialFolder.add(material, 'roughness', 0.0, 1.0, 0.01).name('Roughness');
        materialFolder.add(material, 'transmission', 0.0, 1.5, 0.01).name('Transmission');
        materialFolder.add(material, 'ior', 1.0, 2.5, 0.01).name('IOR');
        materialFolder.add(material, 'thickness', 0.0, 5.0, 0.01).name('Thickness');
        materialFolder.add(material, 'dispersion', 0.0, 10.0, 0.01).name('Dispersion');
        // specularIntensity
        if ('specularIntensity' in material) {
            materialFolder.add(material, 'specularIntensity', 0.0, 1.0, 0.01).name('Specular Intensity');
        }
        // specularColor
        if ('specularColor' in material) {
            const specularColorObj = { color: '#ffffff' };
            specularColorObj.color = '#' + material.specularColor.getHexString();
            materialFolder.addColor(specularColorObj, 'color').name('Specular Color').onChange((value) => {
                material.specularColor.set(value);
            });
        }
        // 平面テクスチャ切り替え
        const planeFolder = gui.addFolder('Plane Texture');
        const planeTextureParams = { texture: 'DragToMove' };
        planeFolder.add(planeTextureParams, 'texture', ['DragToMove', 'Space', 'Dispersion']).name('Texture').onChange((value) => {
            planeMaterial.map = planeTextures[value];
            planeMaterial.needsUpdate = true;
        });
        planeFolder.open();
        // 位置フォルダー
        const positionFolder = gui.addFolder('Position');
        positionFolder.add(positionParams, 'y', 0, 1.5, 0.1).name('Y').onChange((value) => {
            diskMesh.position.y = value;
        });
        shapeFolder.open();
        materialFolder.open();
        positionFolder.open();
        // グリッド表示
        const gridHelper = new three__WEBPACK_IMPORTED_MODULE_1__.GridHelper(10, 20);
        gridHelper.position.y = 0.01; // 平面の上に配置
        this.scene.add(gridHelper);
        // 軸表示
        const axesHelper = new three__WEBPACK_IMPORTED_MODULE_1__.AxesHelper(5);
        this.scene.add(axesHelper);
        //ライトの設定
        this.light = new three__WEBPACK_IMPORTED_MODULE_1__.DirectionalLight(0xffffff, 1.0);
        const lvec = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x * 5, lvec.y * 5, lvec.z * 5);
        this.light.castShadow = true;
        this.scene.add(this.light);
        // 追加の環境光（シンプルライティング用）
        const ambientLight = new three__WEBPACK_IMPORTED_MODULE_1__.AmbientLight(0x404040, 0.3); // 弱い環境光
        this.scene.add(ambientLight);
        // 追加のフィルライト
        const fillLight = new three__WEBPACK_IMPORTED_MODULE_1__.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-1, 0.5, -1);
        this.scene.add(fillLight);
        let update = (time) => {
            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    };
    creatediskGeometry(radius = 1, length = 2, capSegments = 16, radialSegments = 32) {
        const points = [];
        const halfLength = length / 2;
        points.push(new three__WEBPACK_IMPORTED_MODULE_1__.Vector2(0, radius * Math.sin(-Math.PI / 2)));
        //points.push(new THREE.Vector2(radius, radius * Math.sin(-Math.PI / 2 + (Math.PI * 0) / capSegments)));
        // 半円
        for (let i = 0; i <= capSegments; i++) {
            const angle = -Math.PI / 2 + (Math.PI * i) / capSegments;
            //const angle = (Math.PI * i) / capSegments;
            points.push(new three__WEBPACK_IMPORTED_MODULE_1__.Vector2(radius * Math.cos(angle) + halfLength, radius * Math.sin(angle)));
        }
        points.push(new three__WEBPACK_IMPORTED_MODULE_1__.Vector2(0, radius * Math.sin(Math.PI / 2)));
        // pointsの位置を表示
        // let sphereGeometry = new THREE.SphereGeometry(0.025);
        // let redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        // for (let i = 0; i < points.length; ++i) {
        //     let mesh = new THREE.Mesh(sphereGeometry, redMaterial);
        //     mesh.position.set(points[i].x, points[i].y, 0);
        //     this.scene.add(mesh);
        // }
        return new three__WEBPACK_IMPORTED_MODULE_1__.LatheGeometry(points, radialSegments);
    }
}
window.addEventListener("DOMContentLoaded", init);
function init() {
    let container = new ThreeJSContainer();
    let viewport = container.createRendererDOM(640, 480, new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(0, 3, 0));
    document.body.appendChild(viewport);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcgprendering"] = self["webpackChunkcgprendering"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_lil-gui_dist_lil-gui_esm_js-node_modules_three_build_three_module_js-nod-49c081"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQStCO0FBQzJDO0FBQ0Y7QUFDOUM7QUFFMUIsTUFBTSxnQkFBZ0I7SUFDVixLQUFLLENBQWM7SUFDM0Isd0NBQXdDO0lBQ2hDLEtBQUssQ0FBYztJQUUzQjtJQUVBLENBQUM7SUFFRCxxQkFBcUI7SUFDZCxpQkFBaUIsR0FBRyxDQUFDLEtBQWEsRUFBRSxNQUFjLEVBQUUsU0FBd0IsRUFBRSxFQUFFO1FBQ25GLE1BQU0sUUFBUSxHQUFHLElBQUksZ0RBQW1CLEVBQUUsQ0FBQztRQUMzQyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNoQyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksd0NBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ2pELFFBQVEsQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLGVBQWU7UUFHbEQsUUFBUTtRQUNSLE1BQU0sTUFBTSxHQUFHLElBQUksb0RBQXVCLENBQUMsRUFBRSxFQUFFLEtBQUssR0FBRyxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSwwQ0FBYSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUxQyxNQUFNLGFBQWEsR0FBRyxJQUFJLG9GQUFhLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUVyRSxtQkFBbUI7UUFDbkIsTUFBTSxnQkFBZ0IsR0FBcUIsRUFBRSxDQUFDO1FBRTlDLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUVuQyxrQkFBa0I7UUFDbEIsTUFBTSxZQUFZLEdBQUcsSUFBSSxrRkFBWSxDQUFDLGdCQUFnQixFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFckYsNEJBQTRCO1FBQzVCLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO1lBQzVDLGFBQWEsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ2xDLENBQUMsQ0FBQyxDQUFDO1FBRUgsWUFBWSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUU7WUFDMUMsYUFBYSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDakMsQ0FBQyxDQUFDLENBQUM7UUFHSCwwQkFBMEI7UUFDMUIsbUNBQW1DO1FBQ25DLE1BQU0sTUFBTSxHQUF5QixDQUFDLElBQUksRUFBRSxFQUFFO1lBQzFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUV2QixRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDcEMscUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbEMsQ0FBQztRQUNELHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTlCLFFBQVEsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUM7UUFDNUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUMxQyxPQUFPLFFBQVEsQ0FBQyxVQUFVLENBQUM7SUFDL0IsQ0FBQztJQUVELGdCQUFnQjtJQUNSLFdBQVcsR0FBRyxDQUFDLGdCQUFtQyxFQUFFLEVBQUU7UUFDMUQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLHdDQUFXLEVBQUUsQ0FBQztRQUUvQixJQUFJLEdBQUcsR0FBRyxJQUFJLCtDQUFHLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQjtRQUV0QyxVQUFVO1FBQ1YsSUFBSSxXQUFXLEdBQUc7WUFDZCxTQUFTLEVBQUUsR0FBRztZQUNkLE1BQU0sRUFBRSxDQUFDO1lBQ1QsV0FBVyxFQUFFLEVBQUU7WUFDZixjQUFjLEVBQUUsRUFBRTtTQUNyQixDQUFDO1FBRUYsVUFBVTtRQUNWLElBQUksY0FBYyxHQUFHO1lBQ2pCLENBQUMsRUFBRSxDQUFDO1lBQ0osQ0FBQyxFQUFFLEdBQUc7WUFDTixDQUFDLEVBQUUsQ0FBQztTQUNQLENBQUM7UUFHRixnQkFBZ0I7UUFDaEIsTUFBTSxhQUFhLEdBQUcsSUFBSSxnREFBbUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDcEQsTUFBTSxNQUFNLEdBQUcsSUFBSSxnREFBbUIsRUFBRSxDQUFDO1FBQ3pDLE1BQU0sYUFBYSxHQUFHO1lBQ2xCLFlBQVksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDO1lBQzNDLE9BQU8sRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztZQUNsQyxZQUFZLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztTQUM5QyxDQUFDO1FBQ0YsSUFBSSxhQUFhLEdBQUcsSUFBSSxvREFBdUIsQ0FBQyxFQUFFLEdBQUcsRUFBRSxhQUFhLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RGLE1BQU0sS0FBSyxHQUFHLElBQUksdUNBQVUsQ0FBQyxhQUFhLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDM0QsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV0QixZQUFZO1FBQ1osSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsSUFBSSx3Q0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxDQUFDLFVBQVU7UUFFekMsWUFBWTtRQUVaLFdBQVc7UUFDWCxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRTdJLFdBQVc7UUFDWCxNQUFNLFFBQVEsR0FBRyxJQUFJLHVEQUEwQixDQUFDO1lBQzVDLEtBQUssRUFBRSxRQUFRO1lBQ2YsU0FBUyxFQUFFLEdBQUc7WUFDZCxTQUFTLEVBQUUsR0FBRztZQUNkLFlBQVksRUFBRSxHQUFHO1lBQ2pCLEdBQUcsRUFBRSxHQUFHO1lBQ1IsU0FBUyxFQUFFLEdBQUc7WUFDZCxVQUFVLEVBQUUsR0FBRztTQUNsQixDQUFDLENBQUM7UUFHSCxVQUFVO1FBQ1YsTUFBTSxRQUFRLEdBQUcsSUFBSSx1Q0FBVSxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN4RCxzQ0FBc0M7UUFDdEMseUNBQXlDO1FBQ3pDLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsY0FBYyxDQUFDLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlO1FBRzVGLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXpCLDRCQUE0QjtRQUM1QixJQUFJLGdCQUFnQixFQUFFO1lBQ2xCLGdCQUFnQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNuQztRQUVELGVBQWU7UUFDZixVQUFVO1FBQ1YsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBRXRELGFBQWE7UUFDYixNQUFNLGNBQWMsR0FBRyxHQUFHLEVBQUU7WUFDeEIsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUN2QyxXQUFXLENBQUMsU0FBUyxFQUNyQixXQUFXLENBQUMsTUFBTSxFQUNsQixXQUFXLENBQUMsV0FBVyxFQUN2QixXQUFXLENBQUMsY0FBYyxDQUM3QixDQUFDO1lBQ0YsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLGFBQWE7WUFDMUMsUUFBUSxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUM7UUFDcEMsQ0FBQyxDQUFDO1FBRUYsV0FBVyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUN0RyxXQUFXLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzlGLFdBQVcsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLGFBQWEsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDcEcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFNUcsYUFBYTtRQUNiLE1BQU0sY0FBYyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDakQsY0FBYyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzVFLGNBQWMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLGNBQWMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNsRixjQUFjLENBQUMsR0FBRyxDQUFDLFFB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OztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0scUJBQXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nLy4vc3JjL2FwcC50cyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9sc1wiO1xuaW1wb3J0IHsgRHJhZ0NvbnRyb2xzIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9jb250cm9scy9EcmFnQ29udHJvbHNcIjtcbmltcG9ydCBHVUkgZnJvbSAnbGlsLWd1aSc7XG5cbmNsYXNzIFRocmVlSlNDb250YWluZXIge1xuICAgIHByaXZhdGUgc2NlbmU6IFRIUkVFLlNjZW5lO1xuICAgIC8vcHJpdmF0ZSByZW5kZXJlcjogVEhSRUUuV2ViR0xSZW5kZXJlcjtcbiAgICBwcml2YXRlIGxpZ2h0OiBUSFJFRS5MaWdodDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgfVxuXG4gICAgLy8g55S76Z2i6YOo5YiG44Gu5L2c5oiQKOihqOekuuOBmeOCi+aeoOOBlOOBqOOBqykqXG4gICAgcHVibGljIGNyZWF0ZVJlbmRlcmVyRE9NID0gKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBjYW1lcmFQb3M6IFRIUkVFLlZlY3RvcjMpID0+IHtcbiAgICAgICAgY29uc3QgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcigpO1xuICAgICAgICByZW5kZXJlci5zZXRTaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICByZW5kZXJlci5zZXRDbGVhckNvbG9yKG5ldyBUSFJFRS5Db2xvcigweDQ5NWVkKSk7XG4gICAgICAgIHJlbmRlcmVyLnNoYWRvd01hcC5lbmFibGVkID0gdHJ1ZTsgLy/jgrfjg6Pjg4njgqbjg57jg4Pjg5fjgpLmnInlirnjgavjgZnjgotcblxuXG4gICAgICAgIC8v44Kr44Oh44Op44Gu6Kit5a6aXG4gICAgICAgIGNvbnN0IGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg3NSwgd2lkdGggLyBoZWlnaHQsIDAuMSwgMTAwMCk7XG4gICAgICAgIGNhbWVyYS5wb3NpdGlvbi5jb3B5KGNhbWVyYVBvcyk7XG4gICAgICAgIGNhbWVyYS5sb29rQXQobmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMCkpO1xuXG4gICAgICAgIGNvbnN0IG9yYml0Q29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gICAgICAgIC8vIOODieODqeODg+OCsOWPr+iDveOBquOCquODluOCuOOCp+OCr+ODiOOBrumFjeWIl1xuICAgICAgICBjb25zdCBkcmFnZ2FibGVPYmplY3RzOiBUSFJFRS5PYmplY3QzRFtdID0gW107XG5cbiAgICAgICAgdGhpcy5jcmVhdGVTY2VuZShkcmFnZ2FibGVPYmplY3RzKTtcblxuICAgICAgICAvLyBEcmFnQ29udHJvbHPjga7oqK3lrppcbiAgICAgICAgY29uc3QgZHJhZ0NvbnRyb2xzID0gbmV3IERyYWdDb250cm9scyhkcmFnZ2FibGVPYmplY3RzLCBjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gICAgICAgIC8vIOODieODqeODg+OCsOS4reOBr09yYml0Q29udHJvbHPjgpLnhKHlirnjgavjgZnjgotcbiAgICAgICAgZHJhZ0NvbnRyb2xzLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsICgpID0+IHtcbiAgICAgICAgICAgIG9yYml0Q29udHJvbHMuZW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICBkcmFnQ29udHJvbHMuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2VuZCcsICgpID0+IHtcbiAgICAgICAgICAgIG9yYml0Q29udHJvbHMuZW5hYmxlZCA9IHRydWU7XG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgLy8g5q+O44OV44Os44O844Og44GudXBkYXRl44KS5ZG844KT44Gn77yMcmVuZGVyXG4gICAgICAgIC8vIHJlcWVzdEFuaW1hdGlvbkZyYW1lIOOBq+OCiOOCiuasoeODleODrOODvOODoOOCkuWRvOOBtlxuICAgICAgICBjb25zdCByZW5kZXI6IEZyYW1lUmVxdWVzdENhbGxiYWNrID0gKHRpbWUpID0+IHtcbiAgICAgICAgICAgIG9yYml0Q29udHJvbHMudXBkYXRlKCk7XG5cbiAgICAgICAgICAgIHJlbmRlcmVyLnJlbmRlcih0aGlzLnNjZW5lLCBjYW1lcmEpO1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XG4gICAgICAgIH1cbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XG5cbiAgICAgICAgcmVuZGVyZXIuZG9tRWxlbWVudC5zdHlsZS5jc3NGbG9hdCA9IFwibGVmdFwiO1xuICAgICAgICByZW5kZXJlci5kb21FbGVtZW50LnN0eWxlLm1hcmdpbiA9IFwiMTBweFwiO1xuICAgICAgICByZXR1cm4gcmVuZGVyZXIuZG9tRWxlbWVudDtcbiAgICB9XG5cbiAgICAvLyDjgrfjg7zjg7Pjga7kvZzmiJAo5YWo5L2T44GnMeWbnilcbiAgICBwcml2YXRlIGNyZWF0ZVNjZW5lID0gKGRyYWdnYWJsZU9iamVjdHM/OiBUSFJFRS5PYmplY3QzRFtdKSA9PiB7XG4gICAgICAgIHRoaXMuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcblxuICAgICAgICBsZXQgZ3VpID0gbmV3IEdVSSgpOyAvLyBHVUnnlKjjga7jgqTjg7Pjgrnjgr/jg7Pjgrnjga7nlJ/miJBcblxuICAgICAgICAvLyDlvaLnirbjg5Hjg6njg6Hjg7zjgr9cbiAgICAgICAgbGV0IHNoYXBlUGFyYW1zID0ge1xuICAgICAgICAgICAgdGhpY2tuZXNzOiAwLjEsXG4gICAgICAgICAgICByYWRpdXM6IDEsXG4gICAgICAgICAgICBjYXBTZWdtZW50czogMzIsXG4gICAgICAgICAgICByYWRpYWxTZWdtZW50czogNjRcbiAgICAgICAgfTtcblxuICAgICAgICAvLyDkvY3nva7jg5Hjg6njg6Hjg7zjgr9cbiAgICAgICAgbGV0IHBvc2l0aW9uUGFyYW1zID0ge1xuICAgICAgICAgICAgeDogMCxcbiAgICAgICAgICAgIHk6IDAuMixcbiAgICAgICAgICAgIHo6IDBcbiAgICAgICAgfTtcblxuXG4gICAgICAgIC8vIOW5s+mdouOBruODhuOCr+OCueODgeODo+WIh+OCiuabv+OBiOeUqFxuICAgICAgICBjb25zdCBwbGFuZUdlb21ldHJ5ID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkoNSwgNSk7XG4gICAgICAgIGNvbnN0IGxvYWRlciA9IG5ldyBUSFJFRS5UZXh0dXJlTG9hZGVyKCk7XG4gICAgICAgIGNvbnN0IHBsYW5lVGV4dHVyZXMgPSB7XG4gICAgICAgICAgICAnRHJhZ1RvTW92ZSc6IGxvYWRlci5sb2FkKCdEcmFnVG9Nb3ZlLnBuZycpLFxuICAgICAgICAgICAgJ1NwYWNlJzogbG9hZGVyLmxvYWQoJ3NwYWNlLmpwZWcnKSxcbiAgICAgICAgICAgICdEaXNwZXJzaW9uJzogbG9hZGVyLmxvYWQoJ0RJU1BFUlNJT04ucG5nJylcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IHBsYW5lTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBtYXA6IHBsYW5lVGV4dHVyZXNbJ0RyYWdUb01vdmUnXSB9KTtcbiAgICAgICAgY29uc3QgcGxhbmUgPSBuZXcgVEhSRUUuTWVzaChwbGFuZUdlb21ldHJ5LCBwbGFuZU1hdGVyaWFsKTtcbiAgICAgICAgcGxhbmUucm90YXRpb24ueCA9IC1NYXRoLlBJIC8gMjtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQocGxhbmUpO1xuXG4gICAgICAgIC8vIOOCt+ODs+ODl+ODq+OBquiDjOaZr+ioreWumlxuICAgICAgICB0aGlzLnNjZW5lLmJhY2tncm91bmQgPSBuZXcgVEhSRUUuQ29sb3IoMHg0MDQwNDApO1xuICAgICAgICB0aGlzLnNjZW5lLmVudmlyb25tZW50ID0gbnVsbDsgLy8g55Kw5aKD5YWJ44KS54Sh5Yq55YyWXG5cbiAgICAgICAgLy8g5Yid5pyf6IOM5pmv44Gu6Kit5a6a5a6M5LqGXG5cbiAgICAgICAgLy8g44K444Kq44Oh44OI44Oq44Gu55Sf5oiQXG4gICAgICAgIGNvbnN0IGRpc2tHZW9tZXRyeSA9IHRoaXMuY3JlYXRlZGlza0dlb21ldHJ5KHNoYXBlUGFyYW1zLnRoaWNrbmVzcywgc2hhcGVQYXJhbXMucmFkaXVzLCBzaGFwZVBhcmFtcy5jYXBTZWdtZW50cywgc2hhcGVQYXJhbXMucmFkaWFsU2VnbWVudHMpO1xuXG4gICAgICAgIC8vIOODnuODhuODquOCouODq+OBruioreWumlxuICAgICAgICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGh5c2ljYWxNYXRlcmlhbCh7XG4gICAgICAgICAgICBjb2xvcjogMHhmZmZmZmYsXG4gICAgICAgICAgICBtZXRhbG5lc3M6IDAuMCxcbiAgICAgICAgICAgIHJvdWdobmVzczogMC4wLFxuICAgICAgICAgICAgdHJhbnNtaXNzaW9uOiAxLjMsXG4gICAgICAgICAgICBpb3I6IDEuNixcbiAgICAgICAgICAgIHRoaWNrbmVzczogMS4wLFxuICAgICAgICAgICAgZGlzcGVyc2lvbjogNS4wLFxuICAgICAgICB9KTtcblxuXG4gICAgICAgIC8vIOODoeODg+OCt+ODpeOBruS9nOaIkFxuICAgICAgICBjb25zdCBkaXNrTWVzaCA9IG5ldyBUSFJFRS5NZXNoKGRpc2tHZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgICAgICAvL2Rpc2tNZXNoLmNhc3RTaGFkb3cgPSB0cnVlOyAvLyDlvbHjgpLokL3jgajjgZlcbiAgICAgICAgLy9kaXNrTWVzaC5yZWNlaXZlU2hhZG93ID0gdHJ1ZTsgLy8g5b2x44KS5Y+X44GR44KLXG4gICAgICAgIGRpc2tNZXNoLnBvc2l0aW9uLnNldChwb3NpdGlvblBhcmFtcy54LCBwb3NpdGlvblBhcmFtcy55LCBwb3NpdGlvblBhcmFtcy56KTsgLy8g44OR44Op44Oh44O844K/44GL44KJ5L2N572u44KS6Kit5a6aXG5cblxuICAgICAgICB0aGlzLnNjZW5lLmFkZChkaXNrTWVzaCk7XG5cbiAgICAgICAgLy8gZGlza01lc2jjgpLjg4njg6njg4PjgrDlj6/og73jgarjgqrjg5bjgrjjgqfjgq/jg4jjgavov73liqBcbiAgICAgICAgaWYgKGRyYWdnYWJsZU9iamVjdHMpIHtcbiAgICAgICAgICAgIGRyYWdnYWJsZU9iamVjdHMucHVzaChkaXNrTWVzaCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBHVUnjgrPjg7Pjg4jjg63jg7zjg6vjga7ov73liqBcbiAgICAgICAgLy8g5b2i54q244OV44Kp44Or44OA44O8XG4gICAgICAgIGNvbnN0IHNoYXBlRm9sZGVyID0gZ3VpLmFkZEZvbGRlcignU2hhcGUgUGFyYW1ldGVycycpO1xuXG4gICAgICAgIC8vIOOCuOOCquODoeODiOODquOBruabtOaWsOmWouaVsFxuICAgICAgICBjb25zdCB1cGRhdGVHZW9tZXRyeSA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5ld0dlb21ldHJ5ID0gdGhpcy5jcmVhdGVkaXNrR2VvbWV0cnkoXG4gICAgICAgICAgICAgICAgc2hhcGVQYXJhbXMudGhpY2tuZXNzLFxuICAgICAgICAgICAgICAgIHNoYXBlUGFyYW1zLnJhZGl1cyxcbiAgICAgICAgICAgICAgICBzaGFwZVBhcmFtcy5jYXBTZWdtZW50cyxcbiAgICAgICAgICAgICAgICBzaGFwZVBhcmFtcy5yYWRpYWxTZWdtZW50c1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGRpc2tNZXNoLmdlb21ldHJ5LmRpc3Bvc2UoKTsgLy8g5Y+k44GE44K444Kq44Oh44OI44Oq44KS5YmK6ZmkXG4gICAgICAgICAgICBkaXNrTWVzaC5nZW9tZXRyeSA9IG5ld0dlb21ldHJ5O1xuICAgICAgICB9O1xuXG4gICAgICAgIHNoYXBlRm9sZGVyLmFkZChzaGFwZVBhcmFtcywgJ3RoaWNrbmVzcycsIDAuMDEsIDAuNSwgMC4wMSkubmFtZSgnVGhpY2tuZXNzJykub25DaGFuZ2UodXBkYXRlR2VvbWV0cnkpO1xuICAgICAgICBzaGFwZUZvbGRlci5hZGQoc2hhcGVQYXJhbXMsICdyYWRpdXMnLCAwLjUsIDUuMCwgMC4xKS5uYW1lKCdSYWRpdXMnKS5vbkNoYW5nZSh1cGRhdGVHZW9tZXRyeSk7XG4gICAgICAgIHNoYXBlRm9sZGVyLmFkZChzaGFwZVBhcmFtcywgJ2NhcFNlZ21lbnRzJywgOCwgNjQsIDEpLm5hbWUoJ0NhcCBTZWdtZW50cycpLm9uQ2hhbmdlKHVwZGF0ZUdlb21ldHJ5KTtcbiAgICAgICAgc2hhcGVGb2xkZXIuYWRkKHNoYXBlUGFyYW1zLCAncmFkaWFsU2VnbWVudHMnLCAxNiwgMTI4LCAxKS5uYW1lKCdSYWRpYWwgU2VnbWVudHMnKS5vbkNoYW5nZSh1cGRhdGVHZW9tZXRyeSk7XG5cbiAgICAgICAgLy8g44Oe44OG44Oq44Ki44Or44OR44Op44Oh44O844K/XG4gICAgICAgIGNvbnN0IG1hdGVyaWFsRm9sZGVyID0gZ3VpLmFkZEZvbGRlcignTWF0ZXJpYWwnKTtcbiAgICAgICAgbWF0ZXJpYWxGb2xkZXIuYWRkKG1hdGVyaWFsLCAncm91Z2huZXNzJywgMC4wLCAxLjAsIDAuMDEpLm5hbWUoJ1JvdWdobmVzcycpO1xuICAgICAgICBtYXRlcmlhbEZvbGRlci5hZGQobWF0ZXJpYWwsICd0cmFuc21pc3Npb24nLCAwLjAsIDEuNSwgMC4wMSkubmFtZSgnVHJhbnNtaXNzaW9uJyk7XG4gICAgICAgIG1hdGVyaWFsRm9sZGVyLmFkZChtYXRlcmlhbCwgJ2lvcicsIDEuMCwgMi41LCAwLjAxKS5uYW1lKCdJT1InKTtcbiAgICAgICAgbWF0ZXJpYWxGb2xkZXIuYWRkKG1hdGVyaWFsLCAndGhpY2tuZXNzJywgMC4wLCA1LjAsIDAuMDEpLm5hbWUoJ1RoaWNrbmVzcycpO1xuICAgICAgICBtYXRlcmlhbEZvbGRlci5hZGQobWF0ZXJpYWwsICdkaXNwZXJzaW9uJywgMC4wLCAxMC4wLCAwLjAxKS5uYW1lKCdEaXNwZXJzaW9uJyk7XG4gICAgICAgIC8vIHNwZWN1bGFySW50ZW5zaXR5XG4gICAgICAgIGlmICgnc3BlY3VsYXJJbnRlbnNpdHknIGluIG1hdGVyaWFsKSB7XG4gICAgICAgICAgICBtYXRlcmlhbEZvbGRlci5hZGQobWF0ZXJpYWwsICdzcGVjdWxhckludGVuc2l0eScsIDAuMCwgMS4wLCAwLjAxKS5uYW1lKCdTcGVjdWxhciBJbnRlbnNpdHknKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBzcGVjdWxhckNvbG9yXG4gICAgICAgIGlmICgnc3BlY3VsYXJDb2xvcicgaW4gbWF0ZXJpYWwpIHtcbiAgICAgICAgICAgIGNvbnN0IHNwZWN1bGFyQ29sb3JPYmogPSB7IGNvbG9yOiAnI2ZmZmZmZicgfTtcbiAgICAgICAgICAgIHNwZWN1bGFyQ29sb3JPYmouY29sb3IgPSAnIycgKyBtYXRlcmlhbC5zcGVjdWxhckNvbG9yLmdldEhleFN0cmluZygpO1xuICAgICAgICAgICAgbWF0ZXJpYWxGb2xkZXIuYWRkQ29sb3Ioc3BlY3VsYXJDb2xvck9iaiwgJ2NvbG9yJykubmFtZSgnU3BlY3VsYXIgQ29sb3InKS5vbkNoYW5nZSgodmFsdWU6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgIG1hdGVyaWFsLnNwZWN1bGFyQ29sb3Iuc2V0KHZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g5bmz6Z2i44OG44Kv44K544OB44Oj5YiH44KK5pu/44GIXG4gICAgICAgIGNvbnN0IHBsYW5lRm9sZGVyID0gZ3VpLmFkZEZvbGRlcignUGxhbmUgVGV4dHVyZScpO1xuICAgICAgICBjb25zdCBwbGFuZVRleHR1cmVQYXJhbXMgPSB7IHRleHR1cmU6ICdEcmFnVG9Nb3ZlJyB9O1xuICAgICAgICBwbGFuZUZvbGRlci5hZGQocGxhbmVUZXh0dXJlUGFyYW1zLCAndGV4dHVyZScsIFsnRHJhZ1RvTW92ZScsICdTcGFjZScsICdEaXNwZXJzaW9uJ10pLm5hbWUoJ1RleHR1cmUnKS5vbkNoYW5nZSgodmFsdWU6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgcGxhbmVNYXRlcmlhbC5tYXAgPSBwbGFuZVRleHR1cmVzW3ZhbHVlXTtcbiAgICAgICAgICAgIHBsYW5lTWF0ZXJpYWwubmVlZHNVcGRhdGUgPSB0cnVlO1xuICAgICAgICB9KTtcbiAgICAgICAgcGxhbmVGb2xkZXIub3BlbigpO1xuXG4gICAgICAgIC8vIOS9jee9ruODleOCqeODq+ODgOODvFxuICAgICAgICBjb25zdCBwb3NpdGlvbkZvbGRlciA9IGd1aS5hZGRGb2xkZXIoJ1Bvc2l0aW9uJyk7XG4gICAgICAgIHBvc2l0aW9uRm9sZGVyLmFkZChwb3NpdGlvblBhcmFtcywgJ3knLCAwLCAxLjUsIDAuMSkubmFtZSgnWScpLm9uQ2hhbmdlKCh2YWx1ZTogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICBkaXNrTWVzaC5wb3NpdGlvbi55ID0gdmFsdWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNoYXBlRm9sZGVyLm9wZW4oKTtcbiAgICAgICAgbWF0ZXJpYWxGb2xkZXIub3BlbigpO1xuICAgICAgICBwb3NpdGlvbkZvbGRlci5vcGVuKCk7XG5cblxuICAgICAgICAvLyDjgrDjg6rjg4Pjg4nooajnpLpcbiAgICAgICAgY29uc3QgZ3JpZEhlbHBlciA9IG5ldyBUSFJFRS5HcmlkSGVscGVyKDEwLCAyMCwpO1xuICAgICAgICBncmlkSGVscGVyLnBvc2l0aW9uLnkgPSAwLjAxOyAvLyDlubPpnaLjga7kuIrjgavphY3nva5cbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoZ3JpZEhlbHBlcik7XG5cbiAgICAgICAgLy8g6Lu46KGo56S6XG4gICAgICAgIGNvbnN0IGF4ZXNIZWxwZXIgPSBuZXcgVEhSRUUuQXhlc0hlbHBlcig1KTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoYXhlc0hlbHBlcik7XG5cbiAgICAgICAgLy/jg6njgqTjg4jjga7oqK3lrppcbiAgICAgICAgdGhpcy5saWdodCA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmLCAxLjApO1xuICAgICAgICBjb25zdCBsdmVjID0gbmV3IFRIUkVFLlZlY3RvcjMoMSwgMSwgMSkubm9ybWFsaXplKCk7XG4gICAgICAgIHRoaXMubGlnaHQucG9zaXRpb24uc2V0KGx2ZWMueCAqIDUsIGx2ZWMueSAqIDUsIGx2ZWMueiAqIDUpO1xuICAgICAgICB0aGlzLmxpZ2h0LmNhc3RTaGFkb3cgPSB0cnVlO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLmxpZ2h0KTtcblxuICAgICAgICAvLyDov73liqDjga7nkrDlooPlhYnvvIjjgrfjg7Pjg5fjg6vjg6njgqTjg4bjgqPjg7PjgrDnlKjvvIlcbiAgICAgICAgY29uc3QgYW1iaWVudExpZ2h0ID0gbmV3IFRIUkVFLkFtYmllbnRMaWdodCgweDQwNDA0MCwgMC4zKTsgLy8g5byx44GE55Kw5aKD5YWJXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGFtYmllbnRMaWdodCk7XG5cbiAgICAgICAgLy8g6L+95Yqg44Gu44OV44Kj44Or44Op44Kk44OIXG4gICAgICAgIGNvbnN0IGZpbGxMaWdodCA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmLCAwLjMpO1xuICAgICAgICBmaWxsTGlnaHQucG9zaXRpb24uc2V0KC0xLCAwLjUsIC0xKTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoZmlsbExpZ2h0KTtcblxuICAgICAgICBsZXQgdXBkYXRlOiBGcmFtZVJlcXVlc3RDYWxsYmFjayA9ICh0aW1lKSA9PiB7XG5cbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlZGlza0dlb21ldHJ5KHJhZGl1czogbnVtYmVyID0gMSwgbGVuZ3RoOiBudW1iZXIgPSAyLCBjYXBTZWdtZW50czogbnVtYmVyID0gMTYsIHJhZGlhbFNlZ21lbnRzOiBudW1iZXIgPSAzMik6IFRIUkVFLkxhdGhlR2VvbWV0cnkge1xuICAgICAgICBjb25zdCBwb2ludHM6IFRIUkVFLlZlY3RvcjJbXSA9IFtdO1xuICAgICAgICBjb25zdCBoYWxmTGVuZ3RoID0gbGVuZ3RoIC8gMjtcblxuICAgICAgICBwb2ludHMucHVzaChuZXcgVEhSRUUuVmVjdG9yMigwLCByYWRpdXMgKiBNYXRoLnNpbigtTWF0aC5QSSAvIDIpKSk7XG4gICAgICAgIC8vcG9pbnRzLnB1c2gobmV3IFRIUkVFLlZlY3RvcjIocmFkaXVzLCByYWRpdXMgKiBNYXRoLnNpbigtTWF0aC5QSSAvIDIgKyAoTWF0aC5QSSAqIDApIC8gY2FwU2VnbWVudHMpKSk7XG5cbiAgICAgICAgLy8g5Y2K5YaGXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IGNhcFNlZ21lbnRzOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gLU1hdGguUEkgLyAyICsgKE1hdGguUEkgKiBpKSAvIGNhcFNlZ21lbnRzO1xuICAgICAgICAgICAgLy9jb25zdCBhbmdsZSA9IChNYXRoLlBJICogaSkgLyBjYXBTZWdtZW50cztcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKG5ldyBUSFJFRS5WZWN0b3IyKHJhZGl1cyAqIE1hdGguY29zKGFuZ2xlKSArIGhhbGZMZW5ndGgsIHJhZGl1cyAqIE1hdGguc2luKGFuZ2xlKSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcG9pbnRzLnB1c2gobmV3IFRIUkVFLlZlY3RvcjIoMCwgcmFkaXVzICogTWF0aC5zaW4oTWF0aC5QSSAvIDIpKSk7XG5cbiAgICAgICAgLy8gcG9pbnRz44Gu5L2N572u44KS6KGo56S6XG4gICAgICAgIC8vIGxldCBzcGhlcmVHZW9tZXRyeSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSgwLjAyNSk7XG4gICAgICAgIC8vIGxldCByZWRNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IGNvbG9yOiAweGZmMDAwMCB9KTtcbiAgICAgICAgLy8gZm9yIChsZXQgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgLy8gICAgIGxldCBtZXNoID0gbmV3IFRIUkVFLk1lc2goc3BoZXJlR2VvbWV0cnksIHJlZE1hdGVyaWFsKTtcbiAgICAgICAgLy8gICAgIG1lc2gucG9zaXRpb24uc2V0KHBvaW50c1tpXS54LCBwb2ludHNbaV0ueSwgMCk7XG4gICAgICAgIC8vICAgICB0aGlzLnNjZW5lLmFkZChtZXNoKTtcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIHJldHVybiBuZXcgVEhSRUUuTGF0aGVHZW9tZXRyeShwb2ludHMsIHJhZGlhbFNlZ21lbnRzKTtcbiAgICB9XG5cbn1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGluaXQpO1xuXG5mdW5jdGlvbiBpbml0KCkge1xuICAgIGxldCBjb250YWluZXIgPSBuZXcgVGhyZWVKU0NvbnRhaW5lcigpO1xuXG4gICAgbGV0IHZpZXdwb3J0ID0gY29udGFpbmVyLmNyZWF0ZVJlbmRlcmVyRE9NKDY0MCwgNDgwLCBuZXcgVEhSRUUuVmVjdG9yMygwLCAzLCAwKSk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh2aWV3cG9ydCk7XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsInZhciBkZWZlcnJlZCA9IFtdO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuXHRpZihjaHVua0lkcykge1xuXHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuXHRcdGRlZmVycmVkW2ldID0gW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgbm90RnVsZmlsbGVkID0gSW5maW5pdHk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaHVua0lkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuXHRcdFx0XHRjaHVua0lkcy5zcGxpY2Uoai0tLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihwcmlvcml0eSA8IG5vdEZ1bGZpbGxlZCkgbm90RnVsZmlsbGVkID0gcHJpb3JpdHk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWQuc3BsaWNlKGktLSwgMSlcblx0XHRcdHZhciByID0gZm4oKTtcblx0XHRcdGlmIChyICE9PSB1bmRlZmluZWQpIHJlc3VsdCA9IHI7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbl9fd2VicGFja19yZXF1aXJlX18uTy5qID0gKGNodW5rSWQpID0+IChpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApO1xuXG4vLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbnZhciB3ZWJwYWNrSnNvbnBDYWxsYmFjayA9IChwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiwgZGF0YSkgPT4ge1xuXHR2YXIgW2NodW5rSWRzLCBtb3JlTW9kdWxlcywgcnVudGltZV0gPSBkYXRhO1xuXHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcblx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG5cdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDA7XG5cdGlmKGNodW5rSWRzLnNvbWUoKGlkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2lkXSAhPT0gMCkpKSB7XG5cdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihydW50aW1lKSB2YXIgcmVzdWx0ID0gcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0fVxuXHRpZihwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbikgcGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24oZGF0YSk7XG5cdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKCk7XG5cdFx0fVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG5cdH1cblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uTyhyZXN1bHQpO1xufVxuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua2NncHJlbmRlcmluZ1wiXSA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtjZ3ByZW5kZXJpbmdcIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgZGVwZW5kcyBvbiBvdGhlciBsb2FkZWQgY2h1bmtzIGFuZCBleGVjdXRpb24gbmVlZCB0byBiZSBkZWxheWVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcInZlbmRvcnMtbm9kZV9tb2R1bGVzX2xpbC1ndWlfZGlzdF9saWwtZ3VpX2VzbV9qcy1ub2RlX21vZHVsZXNfdGhyZWVfYnVpbGRfdGhyZWVfbW9kdWxlX2pzLW5vZC00OWMwODFcIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvYXBwLnRzXCIpKSlcbl9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=