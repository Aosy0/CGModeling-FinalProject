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
/* harmony import */ var cannon_es__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! cannon-es */ "./node_modules/cannon-es/dist/cannon-es.js");





class ThreeJSContainer {
    scene;
    //private renderer: THREE.WebGLRenderer;
    light;
    isDragging = false;
    physicsEnabled = true;
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
        // ドラッグ中はOrbitControlsを無効にし、物理同期を止める
        dragControls.addEventListener('dragstart', (event) => {
            orbitControls.enabled = false;
            this.isDragging = true;
        });
        dragControls.addEventListener('dragend', (event) => {
            orbitControls.enabled = true;
            this.isDragging = false;
            // diskMeshに対応する物理ボディを更新
            if (event.object && event.object.userData && event.object.userData.diskBody) {
                const mesh = event.object;
                const body = mesh.userData.diskBody;
                body.position.set(mesh.position.x, mesh.position.y, mesh.position.z);
                body.quaternion.set(mesh.quaternion.x, mesh.quaternion.y, mesh.quaternion.z, mesh.quaternion.w);
                body.velocity.set(0, 0, 0);
                body.angularVelocity.set(0, 0, 0);
            }
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
        // 物理演算有効/無効トグル
        const params = { physicsEnabled: this.physicsEnabled };
        const physicsFolder = gui.addFolder('Physics');
        physicsFolder.add(params, 'physicsEnabled').name('Enable Physics').onChange((v) => {
            this.physicsEnabled = v;
        });
        physicsFolder.open();
        const world = new cannon_es__WEBPACK_IMPORTED_MODULE_5__.World({ gravity: new cannon_es__WEBPACK_IMPORTED_MODULE_5__.Vec3(0, -9.82, 0) });
        world.defaultContactMaterial.friction = 0.3;
        world.defaultContactMaterial.restitution = 0.0;
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
        // 物理演算の空間にも平面を作成
        const planeShape = new cannon_es__WEBPACK_IMPORTED_MODULE_5__.Plane();
        const planeBody = new cannon_es__WEBPACK_IMPORTED_MODULE_5__.Body({ mass: 0 });
        planeBody.addShape(planeShape);
        planeBody.position.set(plane.position.x, plane.position.y, plane.position.z);
        planeBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        world.addBody(planeBody);
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
            ior: 1.33,
            thickness: 1.0,
            dispersion: 5.0,
        });
        // メッシュの作成
        const diskMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(diskGeometry, material);
        //diskMesh.castShadow = true; // 影を落とす
        //diskMesh.receiveShadow = true; // 影を受ける
        diskMesh.position.set(positionParams.x, positionParams.y, positionParams.z); // パラメータから位置を設定
        this.scene.add(diskMesh);
        // 物理演算の空間では円柱で代用
        const diskShape = new cannon_es__WEBPACK_IMPORTED_MODULE_5__.Cylinder(shapeParams.radius, shapeParams.radius, shapeParams.thickness, shapeParams.capSegments);
        const diskBody = new cannon_es__WEBPACK_IMPORTED_MODULE_5__.Body({ mass: 1 });
        diskBody.addShape(diskShape);
        diskBody.position.set(positionParams.x, positionParams.y, positionParams.z);
        world.addBody(diskBody);
        // diskMeshとdiskBodyを紐付け
        diskMesh.userData.diskBody = diskBody;
        // diskMeshをドラッグ可能なオブジェクトに追加
        if (draggableObjects) {
            draggableObjects.push(diskMesh);
        }
        // GUIコントロールの追加
        // 形状フォルダー
        const shapeFolder = gui.addFolder('Shape Parameters');
        // ジオメトリの更新関数
        const updateGeometry = () => {
            // diskMeshのジオメトリを更新
            const newGeometry = this.creatediskGeometry(shapeParams.thickness, shapeParams.radius, shapeParams.capSegments, shapeParams.radialSegments);
            diskMesh.geometry.dispose(); // 古いジオメトリを削除
            diskMesh.geometry = newGeometry;
            // diskBodyのShapeも更新
            if (diskMesh.userData.diskBody) {
                const body = diskMesh.userData.diskBody;
                // 既存のShapeをすべて削除
                while (body.shapes.length > 0) {
                    body.removeShape(body.shapes[0]);
                }
                // 新しいShapeを追加
                const newShape = new cannon_es__WEBPACK_IMPORTED_MODULE_5__.Cylinder(shapeParams.radius, shapeParams.radius, shapeParams.thickness + shapeParams.thickness * 1, shapeParams.capSegments);
                body.addShape(newShape);
                // 位置・回転を維持
                body.position.set(diskMesh.position.x, diskMesh.position.y, diskMesh.position.z);
                body.quaternion.set(diskMesh.quaternion.x, diskMesh.quaternion.y, diskMesh.quaternion.z, diskMesh.quaternion.w);
                body.velocity.set(0, 0, 0);
                body.angularVelocity.set(0, 0, 0);
            }
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
            if (this.physicsEnabled) {
                world.fixedStep();
                planeBody.position.set(plane.position.x, plane.position.y, plane.position.z);
                planeBody.quaternion.set(plane.quaternion.x, plane.quaternion.y, plane.quaternion.z, plane.quaternion.w);
                // ドラッグ中でなければ物理→Three.js同期
                if (!this.isDragging) {
                    diskMesh.position.set(diskBody.position.x, diskBody.position.y, diskBody.position.z);
                    diskMesh.quaternion.set(diskBody.quaternion.x, diskBody.quaternion.y, diskBody.quaternion.z, diskBody.quaternion.w);
                }
            }
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_cannon-es_dist_cannon-es_js-node_modules_lil-gui_dist_lil-gui_esm_js-nod-04f398"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LEtBQUs7V0FDTDtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDM0JBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxNQUFNLHFCQUFxQjtXQUMzQjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7Ozs7VUVoREE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2NncHJlbmRlcmluZy8uL3NyYy9hcHAudHMiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IE9yYml0Q29udHJvbHMgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL2NvbnRyb2xzL09yYml0Q29udHJvbHNcIjtcbmltcG9ydCB7IERyYWdDb250cm9scyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvRHJhZ0NvbnRyb2xzXCI7XG5pbXBvcnQgR1VJIGZyb20gJ2xpbC1ndWknO1xuaW1wb3J0ICogYXMgQ0FOTk9OIGZyb20gJ2Nhbm5vbi1lcyc7XG5cbmNsYXNzIFRocmVlSlNDb250YWluZXIge1xuICAgIHByaXZhdGUgc2NlbmU6IFRIUkVFLlNjZW5lO1xuICAgIC8vcHJpdmF0ZSByZW5kZXJlcjogVEhSRUUuV2ViR0xSZW5kZXJlcjtcbiAgICBwcml2YXRlIGxpZ2h0OiBUSFJFRS5MaWdodDtcbiAgICBwcml2YXRlIGlzRHJhZ2dpbmc6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIHBoeXNpY3NFbmFibGVkOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgfVxuXG4gICAgLy8g55S76Z2i6YOo5YiG44Gu5L2c5oiQKOihqOekuuOBmeOCi+aeoOOBlOOBqOOBqykqXG4gICAgcHVibGljIGNyZWF0ZVJlbmRlcmVyRE9NID0gKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBjYW1lcmFQb3M6IFRIUkVFLlZlY3RvcjMpID0+IHtcbiAgICAgICAgY29uc3QgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcigpO1xuICAgICAgICByZW5kZXJlci5zZXRTaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICByZW5kZXJlci5zZXRDbGVhckNvbG9yKG5ldyBUSFJFRS5Db2xvcigweDQ5NWVkKSk7XG4gICAgICAgIHJlbmRlcmVyLnNoYWRvd01hcC5lbmFibGVkID0gdHJ1ZTsgLy/jgrfjg6Pjg4njgqbjg57jg4Pjg5fjgpLmnInlirnjgavjgZnjgotcblxuXG4gICAgICAgIC8v44Kr44Oh44Op44Gu6Kit5a6aXG4gICAgICAgIGNvbnN0IGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg3NSwgd2lkdGggLyBoZWlnaHQsIDAuMSwgMTAwMCk7XG4gICAgICAgIGNhbWVyYS5wb3NpdGlvbi5jb3B5KGNhbWVyYVBvcyk7XG4gICAgICAgIGNhbWVyYS5sb29rQXQobmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMCkpO1xuXG4gICAgICAgIGNvbnN0IG9yYml0Q29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gICAgICAgIC8vIOODieODqeODg+OCsOWPr+iDveOBquOCquODluOCuOOCp+OCr+ODiOOBrumFjeWIl1xuICAgICAgICBjb25zdCBkcmFnZ2FibGVPYmplY3RzOiBUSFJFRS5PYmplY3QzRFtdID0gW107XG5cbiAgICAgICAgdGhpcy5jcmVhdGVTY2VuZShkcmFnZ2FibGVPYmplY3RzKTtcblxuICAgICAgICAvLyBEcmFnQ29udHJvbHPjga7oqK3lrppcbiAgICAgICAgY29uc3QgZHJhZ0NvbnRyb2xzID0gbmV3IERyYWdDb250cm9scyhkcmFnZ2FibGVPYmplY3RzLCBjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gICAgICAgIC8vIOODieODqeODg+OCsOS4reOBr09yYml0Q29udHJvbHPjgpLnhKHlirnjgavjgZfjgIHniannkIblkIzmnJ/jgpLmraLjgoHjgotcbiAgICAgICAgZHJhZ0NvbnRyb2xzLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgb3JiaXRDb250cm9scy5lbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmlzRHJhZ2dpbmcgPSB0cnVlO1xuICAgICAgICB9KTtcblxuICAgICAgICBkcmFnQ29udHJvbHMuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2VuZCcsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgb3JiaXRDb250cm9scy5lbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuaXNEcmFnZ2luZyA9IGZhbHNlO1xuICAgICAgICAgICAgLy8gZGlza01lc2jjgavlr77lv5zjgZnjgovniannkIbjg5zjg4fjgqPjgpLmm7TmlrBcbiAgICAgICAgICAgIGlmIChldmVudC5vYmplY3QgJiYgZXZlbnQub2JqZWN0LnVzZXJEYXRhICYmIGV2ZW50Lm9iamVjdC51c2VyRGF0YS5kaXNrQm9keSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1lc2ggPSBldmVudC5vYmplY3Q7XG4gICAgICAgICAgICAgICAgY29uc3QgYm9keSA9IG1lc2gudXNlckRhdGEuZGlza0JvZHk7XG4gICAgICAgICAgICAgICAgYm9keS5wb3NpdGlvbi5zZXQobWVzaC5wb3NpdGlvbi54LCBtZXNoLnBvc2l0aW9uLnksIG1lc2gucG9zaXRpb24ueik7XG4gICAgICAgICAgICAgICAgYm9keS5xdWF0ZXJuaW9uLnNldChtZXNoLnF1YXRlcm5pb24ueCwgbWVzaC5xdWF0ZXJuaW9uLnksIG1lc2gucXVhdGVybmlvbi56LCBtZXNoLnF1YXRlcm5pb24udyk7XG4gICAgICAgICAgICAgICAgYm9keS52ZWxvY2l0eS5zZXQoMCwgMCwgMCk7XG4gICAgICAgICAgICAgICAgYm9keS5hbmd1bGFyVmVsb2NpdHkuc2V0KDAsIDAsIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuXG4gICAgICAgIC8vIOavjuODleODrOODvOODoOOBrnVwZGF0ZeOCkuWRvOOCk+OBp++8jHJlbmRlclxuICAgICAgICAvLyByZXFlc3RBbmltYXRpb25GcmFtZSDjgavjgojjgormrKHjg5Xjg6zjg7zjg6DjgpLlkbzjgbZcbiAgICAgICAgY29uc3QgcmVuZGVyOiBGcmFtZVJlcXVlc3RDYWxsYmFjayA9ICh0aW1lKSA9PiB7XG4gICAgICAgICAgICBvcmJpdENvbnRyb2xzLnVwZGF0ZSgpO1xuXG4gICAgICAgICAgICByZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZSwgY2FtZXJhKTtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xuXG4gICAgICAgIHJlbmRlcmVyLmRvbUVsZW1lbnQuc3R5bGUuY3NzRmxvYXQgPSBcImxlZnRcIjtcbiAgICAgICAgcmVuZGVyZXIuZG9tRWxlbWVudC5zdHlsZS5tYXJnaW4gPSBcIjEwcHhcIjtcbiAgICAgICAgcmV0dXJuIHJlbmRlcmVyLmRvbUVsZW1lbnQ7XG4gICAgfVxuXG4gICAgLy8g44K344O844Oz44Gu5L2c5oiQKOWFqOS9k+OBpzHlm54pXG4gICAgcHJpdmF0ZSBjcmVhdGVTY2VuZSA9IChkcmFnZ2FibGVPYmplY3RzPzogVEhSRUUuT2JqZWN0M0RbXSkgPT4ge1xuICAgICAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG5cbiAgICAgICAgbGV0IGd1aSA9IG5ldyBHVUkoKTsgLy8gR1VJ55So44Gu44Kk44Oz44K544K/44Oz44K544Gu55Sf5oiQXG5cbiAgICAgICAgLy8g54mp55CG5ryU566X5pyJ5Yq5L+eEoeWKueODiOOCsOODq1xuICAgICAgICBjb25zdCBwYXJhbXMgPSB7IHBoeXNpY3NFbmFibGVkOiB0aGlzLnBoeXNpY3NFbmFibGVkIH07XG4gICAgICAgIGNvbnN0IHBoeXNpY3NGb2xkZXIgPSBndWkuYWRkRm9sZGVyKCdQaHlzaWNzJyk7XG4gICAgICAgIHBoeXNpY3NGb2xkZXIuYWRkKHBhcmFtcywgJ3BoeXNpY3NFbmFibGVkJykubmFtZSgnRW5hYmxlIFBoeXNpY3MnKS5vbkNoYW5nZSgodjogYm9vbGVhbikgPT4ge1xuICAgICAgICAgICAgdGhpcy5waHlzaWNzRW5hYmxlZCA9IHY7XG4gICAgICAgIH0pO1xuICAgICAgICBwaHlzaWNzRm9sZGVyLm9wZW4oKTtcbiAgICAgICAgY29uc3Qgd29ybGQgPSBuZXcgQ0FOTk9OLldvcmxkKHsgZ3Jhdml0eTogbmV3IENBTk5PTi5WZWMzKDAsIC05LjgyLCAwKSB9KTtcbiAgICAgICAgd29ybGQuZGVmYXVsdENvbnRhY3RNYXRlcmlhbC5mcmljdGlvbiA9IDAuMztcbiAgICAgICAgd29ybGQuZGVmYXVsdENvbnRhY3RNYXRlcmlhbC5yZXN0aXR1dGlvbiA9IDAuMDtcblxuICAgICAgICAvLyDlvaLnirbjg5Hjg6njg6Hjg7zjgr9cbiAgICAgICAgbGV0IHNoYXBlUGFyYW1zID0ge1xuICAgICAgICAgICAgdGhpY2tuZXNzOiAwLjEsXG4gICAgICAgICAgICByYWRpdXM6IDEsXG4gICAgICAgICAgICBjYXBTZWdtZW50czogMzIsXG4gICAgICAgICAgICByYWRpYWxTZWdtZW50czogNjRcbiAgICAgICAgfTtcblxuICAgICAgICAvLyDkvY3nva7jg5Hjg6njg6Hjg7zjgr9cbiAgICAgICAgbGV0IHBvc2l0aW9uUGFyYW1zID0ge1xuICAgICAgICAgICAgeDogMCxcbiAgICAgICAgICAgIHk6IDAuMixcbiAgICAgICAgICAgIHo6IDBcbiAgICAgICAgfTtcblxuXG4gICAgICAgIC8vIOW5s+mdouOBruODhuOCr+OCueODgeODo+WIh+OCiuabv+OBiOeUqFxuICAgICAgICBjb25zdCBwbGFuZUdlb21ldHJ5ID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkoNSwgNSk7XG4gICAgICAgIGNvbnN0IGxvYWRlciA9IG5ldyBUSFJFRS5UZXh0dXJlTG9hZGVyKCk7XG4gICAgICAgIGNvbnN0IHBsYW5lVGV4dHVyZXMgPSB7XG4gICAgICAgICAgICAnRHJhZ1RvTW92ZSc6IGxvYWRlci5sb2FkKCdEcmFnVG9Nb3ZlLnBuZycpLFxuICAgICAgICAgICAgJ1NwYWNlJzogbG9hZGVyLmxvYWQoJ3NwYWNlLmpwZWcnKSxcbiAgICAgICAgICAgICdEaXNwZXJzaW9uJzogbG9hZGVyLmxvYWQoJ0RJU1BFUlNJT04ucG5nJylcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IHBsYW5lTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBtYXA6IHBsYW5lVGV4dHVyZXNbJ0RyYWdUb01vdmUnXSB9KTtcbiAgICAgICAgY29uc3QgcGxhbmUgPSBuZXcgVEhSRUUuTWVzaChwbGFuZUdlb21ldHJ5LCBwbGFuZU1hdGVyaWFsKTtcbiAgICAgICAgcGxhbmUucm90YXRpb24ueCA9IC1NYXRoLlBJIC8gMjtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQocGxhbmUpO1xuXG4gICAgICAgIC8vIOeJqeeQhua8lOeul+OBruepuumWk+OBq+OCguW5s+mdouOCkuS9nOaIkFxuICAgICAgICBjb25zdCBwbGFuZVNoYXBlID0gbmV3IENBTk5PTi5QbGFuZSgpO1xuICAgICAgICBjb25zdCBwbGFuZUJvZHkgPSBuZXcgQ0FOTk9OLkJvZHkoeyBtYXNzOiAwIH0pO1xuICAgICAgICBwbGFuZUJvZHkuYWRkU2hhcGUocGxhbmVTaGFwZSk7XG4gICAgICAgIHBsYW5lQm9keS5wb3NpdGlvbi5zZXQocGxhbmUucG9zaXRpb24ueCwgcGxhbmUucG9zaXRpb24ueSwgcGxhbmUucG9zaXRpb24ueik7XG4gICAgICAgIHBsYW5lQm9keS5xdWF0ZXJuaW9uLnNldEZyb21FdWxlcigtTWF0aC5QSSAvIDIsIDAsIDApO1xuICAgICAgICB3b3JsZC5hZGRCb2R5KHBsYW5lQm9keSk7XG5cblxuICAgICAgICAvLyDjgrfjg7Pjg5fjg6vjgarog4zmma/oqK3lrppcbiAgICAgICAgdGhpcy5zY2VuZS5iYWNrZ3JvdW5kID0gbmV3IFRIUkVFLkNvbG9yKDB4NDA0MDQwKTtcbiAgICAgICAgdGhpcy5zY2VuZS5lbnZpcm9ubWVudCA9IG51bGw7IC8vIOeSsOWig+WFieOCkueEoeWKueWMllxuXG4gICAgICAgIC8vIOWIneacn+iDjOaZr+OBruioreWumuWujOS6hlxuXG4gICAgICAgIC8vIOOCuOOCquODoeODiOODquOBrueUn+aIkFxuICAgICAgICBjb25zdCBkaXNrR2VvbWV0cnkgPSB0aGlzLmNyZWF0ZWRpc2tHZW9tZXRyeShzaGFwZVBhcmFtcy50aGlja25lc3MsIHNoYXBlUGFyYW1zLnJhZGl1cywgc2hhcGVQYXJhbXMuY2FwU2VnbWVudHMsIHNoYXBlUGFyYW1zLnJhZGlhbFNlZ21lbnRzKTtcblxuICAgICAgICAvLyDjg57jg4bjg6rjgqLjg6vjga7oqK3lrppcbiAgICAgICAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBoeXNpY2FsTWF0ZXJpYWwoe1xuICAgICAgICAgICAgY29sb3I6IDB4ZmZmZmZmLFxuICAgICAgICAgICAgbWV0YWxuZXNzOiAwLjAsXG4gICAgICAgICAgICByb3VnaG5lc3M6IDAuMCxcbiAgICAgICAgICAgIHRyYW5zbWlzc2lvbjogMS4zLFxuICAgICAgICAgICAgaW9yOiAxLjMzLFxuICAgICAgICAgICAgdGhpY2tuZXNzOiAxLjAsXG4gICAgICAgICAgICBkaXNwZXJzaW9uOiA1LjAsXG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgLy8g44Oh44OD44K344Ol44Gu5L2c5oiQXG4gICAgICAgIGNvbnN0IGRpc2tNZXNoID0gbmV3IFRIUkVFLk1lc2goZGlza0dlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgICAgIC8vZGlza01lc2guY2FzdFNoYWRvdyA9IHRydWU7IC8vIOW9seOCkuiQveOBqOOBmVxuICAgICAgICAvL2Rpc2tNZXNoLnJlY2VpdmVTaGFkb3cgPSB0cnVlOyAvLyDlvbHjgpLlj5fjgZHjgotcbiAgICAgICAgZGlza01lc2gucG9zaXRpb24uc2V0KHBvc2l0aW9uUGFyYW1zLngsIHBvc2l0aW9uUGFyYW1zLnksIHBvc2l0aW9uUGFyYW1zLnopOyAvLyDjg5Hjg6njg6Hjg7zjgr/jgYvjgonkvY3nva7jgpLoqK3lrppcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoZGlza01lc2gpO1xuXG4gICAgICAgIC8vIOeJqeeQhua8lOeul+OBruepuumWk+OBp+OBr+WGhuafseOBp+S7o+eUqFxuICAgICAgICBjb25zdCBkaXNrU2hhcGUgPSBuZXcgQ0FOTk9OLkN5bGluZGVyKHNoYXBlUGFyYW1zLnJhZGl1cywgc2hhcGVQYXJhbXMucmFkaXVzLCBzaGFwZVBhcmFtcy50aGlja25lc3MsIHNoYXBlUGFyYW1zLmNhcFNlZ21lbnRzKTtcbiAgICAgICAgY29uc3QgZGlza0JvZHkgPSBuZXcgQ0FOTk9OLkJvZHkoeyBtYXNzOiAxIH0pO1xuICAgICAgICBkaXNrQm9keS5hZGRTaGFwZShkaXNrU2hhcGUpO1xuICAgICAgICBkaXNrQm9keS5wb3NpdGlvbi5zZXQocG9zaXRpb25QYXJhbXMueCwgcG9zaXRpb25QYXJhbXMueSwgcG9zaXRpb25QYXJhbXMueik7XG4gICAgICAgIHdvcmxkLmFkZEJvZHkoZGlza0JvZHkpO1xuXG4gICAgICAgIC8vIGRpc2tNZXNo44GoZGlza0JvZHnjgpLntJDku5jjgZFcbiAgICAgICAgZGlza01lc2gudXNlckRhdGEuZGlza0JvZHkgPSBkaXNrQm9keTtcblxuICAgICAgICAvLyBkaXNrTWVzaOOCkuODieODqeODg+OCsOWPr+iDveOBquOCquODluOCuOOCp+OCr+ODiOOBq+i/veWKoFxuICAgICAgICBpZiAoZHJhZ2dhYmxlT2JqZWN0cykge1xuICAgICAgICAgICAgZHJhZ2dhYmxlT2JqZWN0cy5wdXNoKGRpc2tNZXNoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEdVSeOCs+ODs+ODiOODreODvOODq+OBrui/veWKoFxuICAgICAgICAvLyDlvaLnirbjg5Xjgqnjg6vjg4Djg7xcbiAgICAgICAgY29uc3Qgc2hhcGVGb2xkZXIgPSBndWkuYWRkRm9sZGVyKCdTaGFwZSBQYXJhbWV0ZXJzJyk7XG5cbiAgICAgICAgLy8g44K444Kq44Oh44OI44Oq44Gu5pu05paw6Zai5pWwXG4gICAgICAgIGNvbnN0IHVwZGF0ZUdlb21ldHJ5ID0gKCkgPT4ge1xuICAgICAgICAgICAgLy8gZGlza01lc2jjga7jgrjjgqrjg6Hjg4jjg6rjgpLmm7TmlrBcbiAgICAgICAgICAgIGNvbnN0IG5ld0dlb21ldHJ5ID0gdGhpcy5jcmVhdGVkaXNrR2VvbWV0cnkoXG4gICAgICAgICAgICAgICAgc2hhcGVQYXJhbXMudGhpY2tuZXNzLFxuICAgICAgICAgICAgICAgIHNoYXBlUGFyYW1zLnJhZGl1cyxcbiAgICAgICAgICAgICAgICBzaGFwZVBhcmFtcy5jYXBTZWdtZW50cyxcbiAgICAgICAgICAgICAgICBzaGFwZVBhcmFtcy5yYWRpYWxTZWdtZW50c1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGRpc2tNZXNoLmdlb21ldHJ5LmRpc3Bvc2UoKTsgLy8g5Y+k44GE44K444Kq44Oh44OI44Oq44KS5YmK6ZmkXG4gICAgICAgICAgICBkaXNrTWVzaC5nZW9tZXRyeSA9IG5ld0dlb21ldHJ5O1xuXG4gICAgICAgICAgICAvLyBkaXNrQm9keeOBrlNoYXBl44KC5pu05pawXG4gICAgICAgICAgICBpZiAoZGlza01lc2gudXNlckRhdGEuZGlza0JvZHkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBib2R5ID0gZGlza01lc2gudXNlckRhdGEuZGlza0JvZHk7XG4gICAgICAgICAgICAgICAgLy8g5pei5a2Y44GuU2hhcGXjgpLjgZnjgbnjgabliYrpmaRcbiAgICAgICAgICAgICAgICB3aGlsZSAoYm9keS5zaGFwZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBib2R5LnJlbW92ZVNoYXBlKGJvZHkuc2hhcGVzWzBdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8g5paw44GX44GEU2hhcGXjgpLov73liqBcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdTaGFwZSA9IG5ldyBDQU5OT04uQ3lsaW5kZXIoXG4gICAgICAgICAgICAgICAgICAgIHNoYXBlUGFyYW1zLnJhZGl1cyxcbiAgICAgICAgICAgICAgICAgICAgc2hhcGVQYXJhbXMucmFkaXVzLFxuICAgICAgICAgICAgICAgICAgICBzaGFwZVBhcmFtcy50aGlja25lc3MgKyBzaGFwZVBhcmFtcy50aGlja25lc3MgKiAxLFxuICAgICAgICAgICAgICAgICAgICBzaGFwZVBhcmFtcy5jYXBTZWdtZW50c1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgYm9keS5hZGRTaGFwZShuZXdTaGFwZSk7XG4gICAgICAgICAgICAgICAgLy8g5L2N572u44O75Zue6Lui44KS57at5oyBXG4gICAgICAgICAgICAgICAgYm9keS5wb3NpdGlvbi5zZXQoZGlza01lc2gucG9zaXRpb24ueCwgZGlza01lc2gucG9zaXRpb24ueSwgZGlza01lc2gucG9zaXRpb24ueik7XG4gICAgICAgICAgICAgICAgYm9keS5xdWF0ZXJuaW9uLnNldChkaXNrTWVzaC5xdWF0ZXJuaW9uLngsIGRpc2tNZXNoLnF1YXRlcm5pb24ueSwgZGlza01lc2gucXVhdGVybmlvbi56LCBkaXNrTWVzaC5xdWF0ZXJuaW9uLncpO1xuICAgICAgICAgICAgICAgIGJvZHkudmVsb2NpdHkuc2V0KDAsIDAsIDApO1xuICAgICAgICAgICAgICAgIGJvZHkuYW5ndWxhclZlbG9jaXR5LnNldCgwLCAwLCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBzaGFwZUZvbGRlci5hZGQoc2hhcGVQYXJhbXMsICd0aGlja25lc3MnLCAwLjAxLCAwLjUsIDAuMDEpLm5hbWUoJ1RoaWNrbmVzcycpLm9uQ2hhbmdlKHVwZGF0ZUdlb21ldHJ5KTtcbiAgICAgICAgc2hhcGVGb2xkZXIuYWRkKHNoYXBlUGFyYW1zLCAncmFkaXVzJywgMC41LCA1LjAsIDAuMSkubmFtZSgnUmFkaXVzJykub25DaGFuZ2UodXBkYXRlR2VvbWV0cnkpO1xuICAgICAgICBzaGFwZUZvbGRlci5hZGQoc2hhcGVQYXJhbXMsICdjYXBTZWdtZW50cycsIDgsIDY0LCAxKS5uYW1lKCdDYXAgU2VnbWVudHMnKS5vbkNoYW5nZSh1cGRhdGVHZW9tZXRyeSk7XG4gICAgICAgIHNoYXBlRm9sZGVyLmFkZChzaGFwZVBhcmFtcywgJ3JhZGlhbFNlZ21lbnRzJywgMTYsIDEyOCwgMSkubmFtZSgnUmFkaWFsIFNlZ21lbnRzJykub25DaGFuZ2UodXBkYXRlR2VvbWV0cnkpO1xuXG4gICAgICAgIC8vIOODnuODhuODquOCouODq+ODkeODqeODoeODvOOCv1xuICAgICAgICBjb25zdCBtYXRlcmlhbEZvbGRlciA9IGd1aS5hZGRGb2xkZXIoJ01hdGVyaWFsJyk7XG4gICAgICAgIG1hdGVyaWFsRm9sZGVyLmFkZChtYXRlcmlhbCwgJ3JvdWdobmVzcycsIDAuMCwgMS4wLCAwLjAxKS5uYW1lKCdSb3VnaG5lc3MnKTtcbiAgICAgICAgbWF0ZXJpYWxGb2xkZXIuYWRkKG1hdGVyaWFsLCAndHJhbnNtaXNzaW9uJywgMC4wLCAxLjUsIDAuMDEpLm5hbWUoJ1RyYW5zbWlzc2lvbicpO1xuICAgICAgICBtYXRlcmlhbEZvbGRlci5hZGQobWF0ZXJpYWwsICdpb3InLCAxLjAsIDIuNSwgMC4wMSkubmFtZSgnSU9SJyk7XG4gICAgICAgIG1hdGVyaWFsRm9sZGVyLmFkZChtYXRlcmlhbCwgJ3RoaWNrbmVzcycsIDAuMCwgNS4wLCAwLjAxKS5uYW1lKCdUaGlja25lc3MnKTtcbiAgICAgICAgbWF0ZXJpYWxGb2xkZXIuYWRkKG1hdGVyaWFsLCAnZGlzcGVyc2lvbicsIDAuMCwgMTAuMCwgMC4wMSkubmFtZSgnRGlzcGVyc2lvbicpO1xuICAgICAgICAvLyBzcGVjdWxhckludGVuc2l0eVxuICAgICAgICBpZiAoJ3NwZWN1bGFySW50ZW5zaXR5JyBpbiBtYXRlcmlhbCkge1xuICAgICAgICAgICAgbWF0ZXJpYWxGb2xkZXIuYWRkKG1hdGVyaWFsLCAnc3BlY3VsYXJJbnRlbnNpdHknLCAwLjAsIDEuMCwgMC4wMSkubmFtZSgnU3BlY3VsYXIgSW50ZW5zaXR5Jyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gc3BlY3VsYXJDb2xvclxuICAgICAgICBpZiAoJ3NwZWN1bGFyQ29sb3InIGluIG1hdGVyaWFsKSB7XG4gICAgICAgICAgICBjb25zdCBzcGVjdWxhckNvbG9yT2JqID0geyBjb2xvcjogJyNmZmZmZmYnIH07XG4gICAgICAgICAgICBzcGVjdWxhckNvbG9yT2JqLmNvbG9yID0gJyMnICsgbWF0ZXJpYWwuc3BlY3VsYXJDb2xvci5nZXRIZXhTdHJpbmcoKTtcbiAgICAgICAgICAgIG1hdGVyaWFsRm9sZGVyLmFkZENvbG9yKHNwZWN1bGFyQ29sb3JPYmosICdjb2xvcicpLm5hbWUoJ1NwZWN1bGFyIENvbG9yJykub25DaGFuZ2UoKHZhbHVlOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICBtYXRlcmlhbC5zcGVjdWxhckNvbG9yLnNldCh2YWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOW5s+mdouODhuOCr+OCueODgeODo+WIh+OCiuabv+OBiFxuICAgICAgICBjb25zdCBwbGFuZUZvbGRlciA9IGd1aS5hZGRGb2xkZXIoJ1BsYW5lIFRleHR1cmUnKTtcbiAgICAgICAgY29uc3QgcGxhbmVUZXh0dXJlUGFyYW1zID0geyB0ZXh0dXJlOiAnRHJhZ1RvTW92ZScgfTtcbiAgICAgICAgcGxhbmVGb2xkZXIuYWRkKHBsYW5lVGV4dHVyZVBhcmFtcywgJ3RleHR1cmUnLCBbJ0RyYWdUb01vdmUnLCAnU3BhY2UnLCAnRGlzcGVyc2lvbiddKS5uYW1lKCdUZXh0dXJlJykub25DaGFuZ2UoKHZhbHVlOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIHBsYW5lTWF0ZXJpYWwubWFwID0gcGxhbmVUZXh0dXJlc1t2YWx1ZV07XG4gICAgICAgICAgICBwbGFuZU1hdGVyaWFsLm5lZWRzVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHBsYW5lRm9sZGVyLm9wZW4oKTtcblxuICAgICAgICAvLyDkvY3nva7jg5Xjgqnjg6vjg4Djg7xcbiAgICAgICAgY29uc3QgcG9zaXRpb25Gb2xkZXIgPSBndWkuYWRkRm9sZGVyKCdQb3NpdGlvbicpO1xuICAgICAgICBwb3NpdGlvbkZvbGRlci5hZGQocG9zaXRpb25QYXJhbXMsICd5JywgMCwgMS41LCAwLjEpLm5hbWUoJ1knKS5vbkNoYW5nZSgodmFsdWU6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgZGlza01lc2gucG9zaXRpb24ueSA9IHZhbHVlO1xuICAgICAgICB9KTtcblxuICAgICAgICBzaGFwZUZvbGRlci5vcGVuKCk7XG4gICAgICAgIG1hdGVyaWFsRm9sZGVyLm9wZW4oKTtcbiAgICAgICAgcG9zaXRpb25Gb2xkZXIub3BlbigpO1xuXG5cbiAgICAgICAgLy8g44Kw44Oq44OD44OJ6KGo56S6XG4gICAgICAgIGNvbnN0IGdyaWRIZWxwZXIgPSBuZXcgVEhSRUUuR3JpZEhlbHBlcigxMCwgMjAsKTtcbiAgICAgICAgZ3JpZEhlbHBlci5wb3NpdGlvbi55ID0gMC4wMTsgLy8g5bmz6Z2i44Gu5LiK44Gr6YWN572uXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGdyaWRIZWxwZXIpO1xuXG4gICAgICAgIC8vIOi7uOihqOekulxuICAgICAgICBjb25zdCBheGVzSGVscGVyID0gbmV3IFRIUkVFLkF4ZXNIZWxwZXIoNSk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGF4ZXNIZWxwZXIpO1xuXG4gICAgICAgIC8v44Op44Kk44OI44Gu6Kit5a6aXG4gICAgICAgIHRoaXMubGlnaHQgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZiwgMS4wKTtcbiAgICAgICAgY29uc3QgbHZlYyA9IG5ldyBUSFJFRS5WZWN0b3IzKDEsIDEsIDEpLm5vcm1hbGl6ZSgpO1xuICAgICAgICB0aGlzLmxpZ2h0LnBvc2l0aW9uLnNldChsdmVjLnggKiA1LCBsdmVjLnkgKiA1LCBsdmVjLnogKiA1KTtcbiAgICAgICAgdGhpcy5saWdodC5jYXN0U2hhZG93ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQodGhpcy5saWdodCk7XG5cbiAgICAgICAgLy8g6L+95Yqg44Gu55Kw5aKD5YWJ77yI44K344Oz44OX44Or44Op44Kk44OG44Kj44Oz44Kw55So77yJXG4gICAgICAgIGNvbnN0IGFtYmllbnRMaWdodCA9IG5ldyBUSFJFRS5BbWJpZW50TGlnaHQoMHg0MDQwNDAsIDAuMyk7IC8vIOW8seOBhOeSsOWig+WFiVxuICAgICAgICB0aGlzLnNjZW5lLmFkZChhbWJpZW50TGlnaHQpO1xuXG4gICAgICAgIC8vIOi/veWKoOOBruODleOCo+ODq+ODqeOCpOODiFxuICAgICAgICBjb25zdCBmaWxsTGlnaHQgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZiwgMC4zKTtcbiAgICAgICAgZmlsbExpZ2h0LnBvc2l0aW9uLnNldCgtMSwgMC41LCAtMSk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGZpbGxMaWdodCk7XG5cbiAgICAgICAgbGV0IHVwZGF0ZTogRnJhbWVSZXF1ZXN0Q2FsbGJhY2sgPSAodGltZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMucGh5c2ljc0VuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICB3b3JsZC5maXhlZFN0ZXAoKTtcbiAgICAgICAgICAgICAgICBwbGFuZUJvZHkucG9zaXRpb24uc2V0KHBsYW5lLnBvc2l0aW9uLngsIHBsYW5lLnBvc2l0aW9uLnksIHBsYW5lLnBvc2l0aW9uLnopO1xuICAgICAgICAgICAgICAgIHBsYW5lQm9keS5xdWF0ZXJuaW9uLnNldChwbGFuZS5xdWF0ZXJuaW9uLngsIHBsYW5lLnF1YXRlcm5pb24ueSwgcGxhbmUucXVhdGVybmlvbi56LCBwbGFuZS5xdWF0ZXJuaW9uLncpO1xuXG4gICAgICAgICAgICAgICAgLy8g44OJ44Op44OD44Kw5Lit44Gn44Gq44GR44KM44Gw54mp55CG4oaSVGhyZWUuanPlkIzmnJ9cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNEcmFnZ2luZykge1xuICAgICAgICAgICAgICAgICAgICBkaXNrTWVzaC5wb3NpdGlvbi5zZXQoZGlza0JvZHkucG9zaXRpb24ueCwgZGlza0JvZHkucG9zaXRpb24ueSwgZGlza0JvZHkucG9zaXRpb24ueik7XG4gICAgICAgICAgICAgICAgICAgIGRpc2tNZXNoLnF1YXRlcm5pb24uc2V0KGRpc2tCb2R5LnF1YXRlcm5pb24ueCwgZGlza0JvZHkucXVhdGVybmlvbi55LCBkaXNrQm9keS5xdWF0ZXJuaW9uLnosIGRpc2tCb2R5LnF1YXRlcm5pb24udyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVkaXNrR2VvbWV0cnkocmFkaXVzOiBudW1iZXIgPSAxLCBsZW5ndGg6IG51bWJlciA9IDIsIGNhcFNlZ21lbnRzOiBudW1iZXIgPSAxNiwgcmFkaWFsU2VnbWVudHM6IG51bWJlciA9IDMyKTogVEhSRUUuTGF0aGVHZW9tZXRyeSB7XG4gICAgICAgIGNvbnN0IHBvaW50czogVEhSRUUuVmVjdG9yMltdID0gW107XG4gICAgICAgIGNvbnN0IGhhbGZMZW5ndGggPSBsZW5ndGggLyAyO1xuXG4gICAgICAgIHBvaW50cy5wdXNoKG5ldyBUSFJFRS5WZWN0b3IyKDAsIHJhZGl1cyAqIE1hdGguc2luKC1NYXRoLlBJIC8gMikpKTtcbiAgICAgICAgLy9wb2ludHMucHVzaChuZXcgVEhSRUUuVmVjdG9yMihyYWRpdXMsIHJhZGl1cyAqIE1hdGguc2luKC1NYXRoLlBJIC8gMiArIChNYXRoLlBJICogMCkgLyBjYXBTZWdtZW50cykpKTtcblxuICAgICAgICAvLyDljYrlhoZcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gY2FwU2VnbWVudHM7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgYW5nbGUgPSAtTWF0aC5QSSAvIDIgKyAoTWF0aC5QSSAqIGkpIC8gY2FwU2VnbWVudHM7XG4gICAgICAgICAgICAvL2NvbnN0IGFuZ2xlID0gKE1hdGguUEkgKiBpKSAvIGNhcFNlZ21lbnRzO1xuICAgICAgICAgICAgcG9pbnRzLnB1c2gobmV3IFRIUkVFLlZlY3RvcjIocmFkaXVzICogTWF0aC5jb3MoYW5nbGUpICsgaGFsZkxlbmd0aCwgcmFkaXVzICogTWF0aC5zaW4oYW5nbGUpKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwb2ludHMucHVzaChuZXcgVEhSRUUuVmVjdG9yMigwLCByYWRpdXMgKiBNYXRoLnNpbihNYXRoLlBJIC8gMikpKTtcblxuICAgICAgICAvLyBwb2ludHPjga7kvY3nva7jgpLooajnpLpcbiAgICAgICAgLy8gbGV0IHNwaGVyZUdlb21ldHJ5ID0gbmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5KDAuMDI1KTtcbiAgICAgICAgLy8gbGV0IHJlZE1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgY29sb3I6IDB4ZmYwMDAwIH0pO1xuICAgICAgICAvLyBmb3IgKGxldCBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgICAvLyAgICAgbGV0IG1lc2ggPSBuZXcgVEhSRUUuTWVzaChzcGhlcmVHZW9tZXRyeSwgcmVkTWF0ZXJpYWwpO1xuICAgICAgICAvLyAgICAgbWVzaC5wb3NpdGlvbi5zZXQocG9pbnRzW2ldLngsIHBvaW50c1tpXS55LCAwKTtcbiAgICAgICAgLy8gICAgIHRoaXMuc2NlbmUuYWRkKG1lc2gpO1xuICAgICAgICAvLyB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBUSFJFRS5MYXRoZUdlb21ldHJ5KHBvaW50cywgcmFkaWFsU2VnbWVudHMpO1xuICAgIH1cblxufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgaW5pdCk7XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gICAgbGV0IGNvbnRhaW5lciA9IG5ldyBUaHJlZUpTQ29udGFpbmVyKCk7XG5cbiAgICBsZXQgdmlld3BvcnQgPSBjb250YWluZXIuY3JlYXRlUmVuZGVyZXJET00oNjQwLCA0ODAsIG5ldyBUSFJFRS5WZWN0b3IzKDAsIDMsIDApKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHZpZXdwb3J0KTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rY2dwcmVuZGVyaW5nXCJdID0gc2VsZltcIndlYnBhY2tDaHVua2NncHJlbmRlcmluZ1wiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9ycy1ub2RlX21vZHVsZXNfY2Fubm9uLWVzX2Rpc3RfY2Fubm9uLWVzX2pzLW5vZGVfbW9kdWxlc19saWwtZ3VpX2Rpc3RfbGlsLWd1aV9lc21fanMtbm9kLTA0ZjM5OFwiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9hcHAudHNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==