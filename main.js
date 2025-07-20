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
    // 呼び出すときに数値を指定するからデフォルト値に意味はないけど一応設定しておく
    // GUI上では(thickness, radius, capSegments, radialSegments)になる 直す時間がない
    creatediskGeometry(radius = 1, length = 2, capSegments = 16, radialSegments = 32) {
        const points = [];
        const halfLength = length / 2;
        // 下側の中心
        points.push(new three__WEBPACK_IMPORTED_MODULE_1__.Vector2(0, radius * Math.sin(-Math.PI / 2)));
        // 半円
        for (let i = 0; i <= capSegments; i++) {
            const angle = -Math.PI / 2 + (Math.PI * i) / capSegments;
            points.push(new three__WEBPACK_IMPORTED_MODULE_1__.Vector2(radius * Math.cos(angle) + halfLength, radius * Math.sin(angle)));
        }
        // 上側の中心
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFxQjtXQUN2QztXQUNBO1dBQ0EsS0FBSztXQUNMO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0MzQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0scUJBQXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nLy4vc3JjL2FwcC50cyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9sc1wiO1xuaW1wb3J0IHsgRHJhZ0NvbnRyb2xzIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9jb250cm9scy9EcmFnQ29udHJvbHNcIjtcbmltcG9ydCBHVUkgZnJvbSAnbGlsLWd1aSc7XG5pbXBvcnQgKiBhcyBDQU5OT04gZnJvbSAnY2Fubm9uLWVzJztcblxuY2xhc3MgVGhyZWVKU0NvbnRhaW5lciB7XG4gICAgcHJpdmF0ZSBzY2VuZTogVEhSRUUuU2NlbmU7XG4gICAgLy9wcml2YXRlIHJlbmRlcmVyOiBUSFJFRS5XZWJHTFJlbmRlcmVyO1xuICAgIHByaXZhdGUgbGlnaHQ6IFRIUkVFLkxpZ2h0O1xuICAgIHByaXZhdGUgaXNEcmFnZ2luZzogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHByaXZhdGUgcGh5c2ljc0VuYWJsZWQ6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB9XG5cbiAgICAvLyDnlLvpnaLpg6jliIbjga7kvZzmiJAo6KGo56S644GZ44KL5p6g44GU44Go44GrKSpcbiAgICBwdWJsaWMgY3JlYXRlUmVuZGVyZXJET00gPSAod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIGNhbWVyYVBvczogVEhSRUUuVmVjdG9yMykgPT4ge1xuICAgICAgICBjb25zdCByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKCk7XG4gICAgICAgIHJlbmRlcmVyLnNldFNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgIHJlbmRlcmVyLnNldENsZWFyQ29sb3IobmV3IFRIUkVFLkNvbG9yKDB4NDk1ZWQpKTtcbiAgICAgICAgcmVuZGVyZXIuc2hhZG93TWFwLmVuYWJsZWQgPSB0cnVlOyAvL+OCt+ODo+ODieOCpuODnuODg+ODl+OCkuacieWKueOBq+OBmeOCi1xuXG5cbiAgICAgICAgLy/jgqvjg6Hjg6njga7oqK3lrppcbiAgICAgICAgY29uc3QgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB3aWR0aCAvIGhlaWdodCwgMC4xLCAxMDAwKTtcbiAgICAgICAgY2FtZXJhLnBvc2l0aW9uLmNvcHkoY2FtZXJhUG9zKTtcbiAgICAgICAgY2FtZXJhLmxvb2tBdChuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAwKSk7XG5cbiAgICAgICAgY29uc3Qgb3JiaXRDb250cm9scyA9IG5ldyBPcmJpdENvbnRyb2xzKGNhbWVyYSwgcmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgICAgICAgLy8g44OJ44Op44OD44Kw5Y+v6IO944Gq44Kq44OW44K444Kn44Kv44OI44Gu6YWN5YiXXG4gICAgICAgIGNvbnN0IGRyYWdnYWJsZU9iamVjdHM6IFRIUkVFLk9iamVjdDNEW10gPSBbXTtcblxuICAgICAgICB0aGlzLmNyZWF0ZVNjZW5lKGRyYWdnYWJsZU9iamVjdHMpO1xuXG4gICAgICAgIC8vIERyYWdDb250cm9sc+OBruioreWumlxuICAgICAgICBjb25zdCBkcmFnQ29udHJvbHMgPSBuZXcgRHJhZ0NvbnRyb2xzKGRyYWdnYWJsZU9iamVjdHMsIGNhbWVyYSwgcmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgICAgICAgLy8g44OJ44Op44OD44Kw5Lit44GvT3JiaXRDb250cm9sc+OCkueEoeWKueOBq+OBl+OAgeeJqeeQhuWQjOacn+OCkuatouOCgeOCi1xuICAgICAgICBkcmFnQ29udHJvbHMuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBvcmJpdENvbnRyb2xzLmVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuaXNEcmFnZ2luZyA9IHRydWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRyYWdDb250cm9scy5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW5kJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBvcmJpdENvbnRyb2xzLmVuYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5pc0RyYWdnaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAvLyBkaXNrTWVzaOOBq+WvvuW/nOOBmeOCi+eJqeeQhuODnOODh+OCo+OCkuabtOaWsFxuICAgICAgICAgICAgaWYgKGV2ZW50Lm9iamVjdCAmJiBldmVudC5vYmplY3QudXNlckRhdGEgJiYgZXZlbnQub2JqZWN0LnVzZXJEYXRhLmRpc2tCb2R5KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWVzaCA9IGV2ZW50Lm9iamVjdDtcbiAgICAgICAgICAgICAgICBjb25zdCBib2R5ID0gbWVzaC51c2VyRGF0YS5kaXNrQm9keTtcbiAgICAgICAgICAgICAgICBib2R5LnBvc2l0aW9uLnNldChtZXNoLnBvc2l0aW9uLngsIG1lc2gucG9zaXRpb24ueSwgbWVzaC5wb3NpdGlvbi56KTtcbiAgICAgICAgICAgICAgICBib2R5LnF1YXRlcm5pb24uc2V0KG1lc2gucXVhdGVybmlvbi54LCBtZXNoLnF1YXRlcm5pb24ueSwgbWVzaC5xdWF0ZXJuaW9uLnosIG1lc2gucXVhdGVybmlvbi53KTtcbiAgICAgICAgICAgICAgICBib2R5LnZlbG9jaXR5LnNldCgwLCAwLCAwKTtcbiAgICAgICAgICAgICAgICBib2R5LmFuZ3VsYXJWZWxvY2l0eS5zZXQoMCwgMCwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgLy8g5q+O44OV44Os44O844Og44GudXBkYXRl44KS5ZG844KT44Gn77yMcmVuZGVyXG4gICAgICAgIC8vIHJlcWVzdEFuaW1hdGlvbkZyYW1lIOOBq+OCiOOCiuasoeODleODrOODvOODoOOCkuWRvOOBtlxuICAgICAgICBjb25zdCByZW5kZXI6IEZyYW1lUmVxdWVzdENhbGxiYWNrID0gKHRpbWUpID0+IHtcbiAgICAgICAgICAgIG9yYml0Q29udHJvbHMudXBkYXRlKCk7XG5cbiAgICAgICAgICAgIHJlbmRlcmVyLnJlbmRlcih0aGlzLnNjZW5lLCBjYW1lcmEpO1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XG4gICAgICAgIH1cbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XG5cbiAgICAgICAgcmVuZGVyZXIuZG9tRWxlbWVudC5zdHlsZS5jc3NGbG9hdCA9IFwibGVmdFwiO1xuICAgICAgICByZW5kZXJlci5kb21FbGVtZW50LnN0eWxlLm1hcmdpbiA9IFwiMTBweFwiO1xuICAgICAgICByZXR1cm4gcmVuZGVyZXIuZG9tRWxlbWVudDtcbiAgICB9XG5cbiAgICAvLyDjgrfjg7zjg7Pjga7kvZzmiJAo5YWo5L2T44GnMeWbnilcbiAgICBwcml2YXRlIGNyZWF0ZVNjZW5lID0gKGRyYWdnYWJsZU9iamVjdHM/OiBUSFJFRS5PYmplY3QzRFtdKSA9PiB7XG4gICAgICAgIHRoaXMuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcblxuICAgICAgICBsZXQgZ3VpID0gbmV3IEdVSSgpOyAvLyBHVUnnlKjjga7jgqTjg7Pjgrnjgr/jg7Pjgrnjga7nlJ/miJBcblxuICAgICAgICAvLyDniannkIbmvJTnrpfmnInlirkv54Sh5Yq544OI44Kw44OrXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IHsgcGh5c2ljc0VuYWJsZWQ6IHRoaXMucGh5c2ljc0VuYWJsZWQgfTtcbiAgICAgICAgY29uc3QgcGh5c2ljc0ZvbGRlciA9IGd1aS5hZGRGb2xkZXIoJ1BoeXNpY3MnKTtcbiAgICAgICAgcGh5c2ljc0ZvbGRlci5hZGQocGFyYW1zLCAncGh5c2ljc0VuYWJsZWQnKS5uYW1lKCdFbmFibGUgUGh5c2ljcycpLm9uQ2hhbmdlKCh2OiBib29sZWFuKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBoeXNpY3NFbmFibGVkID0gdjtcbiAgICAgICAgfSk7XG4gICAgICAgIHBoeXNpY3NGb2xkZXIub3BlbigpO1xuICAgICAgICBjb25zdCB3b3JsZCA9IG5ldyBDQU5OT04uV29ybGQoeyBncmF2aXR5OiBuZXcgQ0FOTk9OLlZlYzMoMCwgLTkuODIsIDApIH0pO1xuICAgICAgICB3b3JsZC5kZWZhdWx0Q29udGFjdE1hdGVyaWFsLmZyaWN0aW9uID0gMC4zO1xuICAgICAgICB3b3JsZC5kZWZhdWx0Q29udGFjdE1hdGVyaWFsLnJlc3RpdHV0aW9uID0gMC4wO1xuXG4gICAgICAgIC8vIOW9oueKtuODkeODqeODoeODvOOCv1xuICAgICAgICBsZXQgc2hhcGVQYXJhbXMgPSB7XG4gICAgICAgICAgICB0aGlja25lc3M6IDAuMSxcbiAgICAgICAgICAgIHJhZGl1czogMSxcbiAgICAgICAgICAgIGNhcFNlZ21lbnRzOiAzMixcbiAgICAgICAgICAgIHJhZGlhbFNlZ21lbnRzOiA2NFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIOS9jee9ruODkeODqeODoeODvOOCv1xuICAgICAgICBsZXQgcG9zaXRpb25QYXJhbXMgPSB7XG4gICAgICAgICAgICB4OiAwLFxuICAgICAgICAgICAgeTogMC4yLFxuICAgICAgICAgICAgejogMFxuICAgICAgICB9O1xuXG5cbiAgICAgICAgLy8g5bmz6Z2i44Gu44OG44Kv44K544OB44Oj5YiH44KK5pu/44GI55SoXG4gICAgICAgIGNvbnN0IHBsYW5lR2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSg1LCA1KTtcbiAgICAgICAgY29uc3QgbG9hZGVyID0gbmV3IFRIUkVFLlRleHR1cmVMb2FkZXIoKTtcbiAgICAgICAgY29uc3QgcGxhbmVUZXh0dXJlcyA9IHtcbiAgICAgICAgICAgICdEcmFnVG9Nb3ZlJzogbG9hZGVyLmxvYWQoJ0RyYWdUb01vdmUucG5nJyksXG4gICAgICAgICAgICAnU3BhY2UnOiBsb2FkZXIubG9hZCgnc3BhY2UuanBlZycpLFxuICAgICAgICAgICAgJ0Rpc3BlcnNpb24nOiBsb2FkZXIubG9hZCgnRElTUEVSU0lPTi5wbmcnKVxuICAgICAgICB9O1xuICAgICAgICBsZXQgcGxhbmVNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IG1hcDogcGxhbmVUZXh0dXJlc1snRHJhZ1RvTW92ZSddIH0pO1xuICAgICAgICBjb25zdCBwbGFuZSA9IG5ldyBUSFJFRS5NZXNoKHBsYW5lR2VvbWV0cnksIHBsYW5lTWF0ZXJpYWwpO1xuICAgICAgICBwbGFuZS5yb3RhdGlvbi54ID0gLU1hdGguUEkgLyAyO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChwbGFuZSk7XG5cbiAgICAgICAgLy8g54mp55CG5ryU566X44Gu56m66ZaT44Gr44KC5bmz6Z2i44KS5L2c5oiQXG4gICAgICAgIGNvbnN0IHBsYW5lU2hhcGUgPSBuZXcgQ0FOTk9OLlBsYW5lKCk7XG4gICAgICAgIGNvbnN0IHBsYW5lQm9keSA9IG5ldyBDQU5OT04uQm9keSh7IG1hc3M6IDAgfSk7XG4gICAgICAgIHBsYW5lQm9keS5hZGRTaGFwZShwbGFuZVNoYXBlKTtcbiAgICAgICAgcGxhbmVCb2R5LnBvc2l0aW9uLnNldChwbGFuZS5wb3NpdGlvbi54LCBwbGFuZS5wb3NpdGlvbi55LCBwbGFuZS5wb3NpdGlvbi56KTtcbiAgICAgICAgcGxhbmVCb2R5LnF1YXRlcm5pb24uc2V0RnJvbUV1bGVyKC1NYXRoLlBJIC8gMiwgMCwgMCk7XG4gICAgICAgIHdvcmxkLmFkZEJvZHkocGxhbmVCb2R5KTtcblxuXG4gICAgICAgIC8vIOOCt+ODs+ODl+ODq+OBquiDjOaZr+ioreWumlxuICAgICAgICB0aGlzLnNjZW5lLmJhY2tncm91bmQgPSBuZXcgVEhSRUUuQ29sb3IoMHg0MDQwNDApO1xuICAgICAgICB0aGlzLnNjZW5lLmVudmlyb25tZW50ID0gbnVsbDsgLy8g55Kw5aKD5YWJ44KS54Sh5Yq55YyWXG5cbiAgICAgICAgLy8g5Yid5pyf6IOM5pmv44Gu6Kit5a6a5a6M5LqGXG5cbiAgICAgICAgLy8g44K444Kq44Oh44OI44Oq44Gu55Sf5oiQXG4gICAgICAgIGNvbnN0IGRpc2tHZW9tZXRyeSA9IHRoaXMuY3JlYXRlZGlza0dlb21ldHJ5KHNoYXBlUGFyYW1zLnRoaWNrbmVzcywgc2hhcGVQYXJhbXMucmFkaXVzLCBzaGFwZVBhcmFtcy5jYXBTZWdtZW50cywgc2hhcGVQYXJhbXMucmFkaWFsU2VnbWVudHMpO1xuXG4gICAgICAgIC8vIOODnuODhuODquOCouODq+OBruioreWumlxuICAgICAgICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGh5c2ljYWxNYXRlcmlhbCh7XG4gICAgICAgICAgICBjb2xvcjogMHhmZmZmZmYsXG4gICAgICAgICAgICBtZXRhbG5lc3M6IDAuMCxcbiAgICAgICAgICAgIHJvdWdobmVzczogMC4wLFxuICAgICAgICAgICAgdHJhbnNtaXNzaW9uOiAxLjMsXG4gICAgICAgICAgICBpb3I6IDEuMzMsXG4gICAgICAgICAgICB0aGlja25lc3M6IDEuMCxcbiAgICAgICAgICAgIGRpc3BlcnNpb246IDUuMCxcbiAgICAgICAgfSk7XG5cblxuICAgICAgICAvLyDjg6Hjg4Pjgrfjg6Xjga7kvZzmiJBcbiAgICAgICAgY29uc3QgZGlza01lc2ggPSBuZXcgVEhSRUUuTWVzaChkaXNrR2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgICAgLy9kaXNrTWVzaC5jYXN0U2hhZG93ID0gdHJ1ZTsgLy8g5b2x44KS6JC944Go44GZXG4gICAgICAgIC8vZGlza01lc2gucmVjZWl2ZVNoYWRvdyA9IHRydWU7IC8vIOW9seOCkuWPl+OBkeOCi1xuICAgICAgICBkaXNrTWVzaC5wb3NpdGlvbi5zZXQocG9zaXRpb25QYXJhbXMueCwgcG9zaXRpb25QYXJhbXMueSwgcG9zaXRpb25QYXJhbXMueik7IC8vIOODkeODqeODoeODvOOCv+OBi+OCieS9jee9ruOCkuioreWumlxuICAgICAgICB0aGlzLnNjZW5lLmFkZChkaXNrTWVzaCk7XG5cbiAgICAgICAgLy8g54mp55CG5ryU566X44Gu56m66ZaT44Gn44Gv5YaG5p+x44Gn5Luj55SoXG4gICAgICAgIGNvbnN0IGRpc2tTaGFwZSA9IG5ldyBDQU5OT04uQ3lsaW5kZXIoc2hhcGVQYXJhbXMucmFkaXVzLCBzaGFwZVBhcmFtcy5yYWRpdXMsIHNoYXBlUGFyYW1zLnRoaWNrbmVzcywgc2hhcGVQYXJhbXMuY2FwU2VnbWVudHMpO1xuICAgICAgICBjb25zdCBkaXNrQm9keSA9IG5ldyBDQU5OT04uQm9keSh7IG1hc3M6IDEgfSk7XG4gICAgICAgIGRpc2tCb2R5LmFkZFNoYXBlKGRpc2tTaGFwZSk7XG4gICAgICAgIGRpc2tCb2R5LnBvc2l0aW9uLnNldChwb3NpdGlvblBhcmFtcy54LCBwb3NpdGlvblBhcmFtcy55LCBwb3NpdGlvblBhcmFtcy56KTtcbiAgICAgICAgd29ybGQuYWRkQm9keShkaXNrQm9keSk7XG5cbiAgICAgICAgLy8gZGlza01lc2jjgahkaXNrQm9keeOCkue0kOS7mOOBkVxuICAgICAgICBkaXNrTWVzaC51c2VyRGF0YS5kaXNrQm9keSA9IGRpc2tCb2R5O1xuXG4gICAgICAgIC8vIGRpc2tNZXNo44KS44OJ44Op44OD44Kw5Y+v6IO944Gq44Kq44OW44K444Kn44Kv44OI44Gr6L+95YqgXG4gICAgICAgIGlmIChkcmFnZ2FibGVPYmplY3RzKSB7XG4gICAgICAgICAgICBkcmFnZ2FibGVPYmplY3RzLnB1c2goZGlza01lc2gpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gR1VJ44Kz44Oz44OI44Ot44O844Or44Gu6L+95YqgXG4gICAgICAgIC8vIOW9oueKtuODleOCqeODq+ODgOODvFxuICAgICAgICBjb25zdCBzaGFwZUZvbGRlciA9IGd1aS5hZGRGb2xkZXIoJ1NoYXBlIFBhcmFtZXRlcnMnKTtcblxuICAgICAgICAvLyDjgrjjgqrjg6Hjg4jjg6rjga7mm7TmlrDplqLmlbBcbiAgICAgICAgY29uc3QgdXBkYXRlR2VvbWV0cnkgPSAoKSA9PiB7XG4gICAgICAgICAgICAvLyBkaXNrTWVzaOOBruOCuOOCquODoeODiOODquOCkuabtOaWsFxuICAgICAgICAgICAgY29uc3QgbmV3R2VvbWV0cnkgPSB0aGlzLmNyZWF0ZWRpc2tHZW9tZXRyeShcbiAgICAgICAgICAgICAgICBzaGFwZVBhcmFtcy50aGlja25lc3MsXG4gICAgICAgICAgICAgICAgc2hhcGVQYXJhbXMucmFkaXVzLFxuICAgICAgICAgICAgICAgIHNoYXBlUGFyYW1zLmNhcFNlZ21lbnRzLFxuICAgICAgICAgICAgICAgIHNoYXBlUGFyYW1zLnJhZGlhbFNlZ21lbnRzXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZGlza01lc2guZ2VvbWV0cnkuZGlzcG9zZSgpOyAvLyDlj6TjgYTjgrjjgqrjg6Hjg4jjg6rjgpLliYrpmaRcbiAgICAgICAgICAgIGRpc2tNZXNoLmdlb21ldHJ5ID0gbmV3R2VvbWV0cnk7XG5cbiAgICAgICAgICAgIC8vIGRpc2tCb2R544GuU2hhcGXjgoLmm7TmlrBcbiAgICAgICAgICAgIGlmIChkaXNrTWVzaC51c2VyRGF0YS5kaXNrQm9keSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGJvZHkgPSBkaXNrTWVzaC51c2VyRGF0YS5kaXNrQm9keTtcbiAgICAgICAgICAgICAgICAvLyDml6LlrZjjga5TaGFwZeOCkuOBmeOBueOBpuWJiumZpFxuICAgICAgICAgICAgICAgIHdoaWxlIChib2R5LnNoYXBlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGJvZHkucmVtb3ZlU2hhcGUoYm9keS5zaGFwZXNbMF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyDmlrDjgZfjgYRTaGFwZeOCkui/veWKoFxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1NoYXBlID0gbmV3IENBTk5PTi5DeWxpbmRlcihcbiAgICAgICAgICAgICAgICAgICAgc2hhcGVQYXJhbXMucmFkaXVzLFxuICAgICAgICAgICAgICAgICAgICBzaGFwZVBhcmFtcy5yYWRpdXMsXG4gICAgICAgICAgICAgICAgICAgIHNoYXBlUGFyYW1zLnRoaWNrbmVzcyArIHNoYXBlUGFyYW1zLnRoaWNrbmVzcyAqIDEsXG4gICAgICAgICAgICAgICAgICAgIHNoYXBlUGFyYW1zLmNhcFNlZ21lbnRzXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBib2R5LmFkZFNoYXBlKG5ld1NoYXBlKTtcbiAgICAgICAgICAgICAgICAvLyDkvY3nva7jg7vlm57ou6LjgpLntq3mjIFcbiAgICAgICAgICAgICAgICBib2R5LnBvc2l0aW9uLnNldChkaXNrTWVzaC5wb3NpdGlvbi54LCBkaXNrTWVzaC5wb3NpdGlvbi55LCBkaXNrTWVzaC5wb3NpdGlvbi56KTtcbiAgICAgICAgICAgICAgICBib2R5LnF1YXRlcm5pb24uc2V0KGRpc2tNZXNoLnF1YXRlcm5pb24ueCwgZGlza01lc2gucXVhdGVybmlvbi55LCBkaXNrTWVzaC5xdWF0ZXJuaW9uLnosIGRpc2tNZXNoLnF1YXRlcm5pb24udyk7XG4gICAgICAgICAgICAgICAgYm9keS52ZWxvY2l0eS5zZXQoMCwgMCwgMCk7XG4gICAgICAgICAgICAgICAgYm9keS5hbmd1bGFyVmVsb2NpdHkuc2V0KDAsIDAsIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHNoYXBlRm9sZGVyLmFkZChzaGFwZVBhcmFtcywgJ3RoaWNrbmVzcycsIDAuMDEsIDAuNSwgMC4wMSkubmFtZSgnVGhpY2tuZXNzJykub25DaGFuZ2UodXBkYXRlR2VvbWV0cnkpO1xuICAgICAgICBzaGFwZUZvbGRlci5hZGQoc2hhcGVQYXJhbXMsICdyYWRpdXMnLCAwLjUsIDUuMCwgMC4xKS5uYW1lKCdSYWRpdXMnKS5vbkNoYW5nZSh1cGRhdGVHZW9tZXRyeSk7XG4gICAgICAgIHNoYXBlRm9sZGVyLmFkZChzaGFwZVBhcmFtcywgJ2NhcFNlZ21lbnRzJywgOCwgNjQsIDEpLm5hbWUoJ0NhcCBTZWdtZW50cycpLm9uQ2hhbmdlKHVwZGF0ZUdlb21ldHJ5KTtcbiAgICAgICAgc2hhcGVGb2xkZXIuYWRkKHNoYXBlUGFyYW1zLCAncmFkaWFsU2VnbWVudHMnLCAxNiwgMTI4LCAxKS5uYW1lKCdSYWRpYWwgU2VnbWVudHMnKS5vbkNoYW5nZSh1cGRhdGVHZW9tZXRyeSk7XG5cbiAgICAgICAgLy8g44Oe44OG44Oq44Ki44Or44OR44Op44Oh44O844K/XG4gICAgICAgIGNvbnN0IG1hdGVyaWFsRm9sZGVyID0gZ3VpLmFkZEZvbGRlcignTWF0ZXJpYWwnKTtcbiAgICAgICAgbWF0ZXJpYWxGb2xkZXIuYWRkKG1hdGVyaWFsLCAncm91Z2huZXNzJywgMC4wLCAxLjAsIDAuMDEpLm5hbWUoJ1JvdWdobmVzcycpO1xuICAgICAgICBtYXRlcmlhbEZvbGRlci5hZGQobWF0ZXJpYWwsICd0cmFuc21pc3Npb24nLCAwLjAsIDEuNSwgMC4wMSkubmFtZSgnVHJhbnNtaXNzaW9uJyk7XG4gICAgICAgIG1hdGVyaWFsRm9sZGVyLmFkZChtYXRlcmlhbCwgJ2lvcicsIDEuMCwgMi41LCAwLjAxKS5uYW1lKCdJT1InKTtcbiAgICAgICAgbWF0ZXJpYWxGb2xkZXIuYWRkKG1hdGVyaWFsLCAndGhpY2tuZXNzJywgMC4wLCA1LjAsIDAuMDEpLm5hbWUoJ1RoaWNrbmVzcycpO1xuICAgICAgICBtYXRlcmlhbEZvbGRlci5hZGQobWF0ZXJpYWwsICdkaXNwZXJzaW9uJywgMC4wLCAxMC4wLCAwLjAxKS5uYW1lKCdEaXNwZXJzaW9uJyk7XG4gICAgICAgIC8vIHNwZWN1bGFySW50ZW5zaXR5XG4gICAgICAgIGlmICgnc3BlY3VsYXJJbnRlbnNpdHknIGluIG1hdGVyaWFsKSB7XG4gICAgICAgICAgICBtYXRlcmlhbEZvbGRlci5hZGQobWF0ZXJpYWwsICdzcGVjdWxhckludGVuc2l0eScsIDAuMCwgMS4wLCAwLjAxKS5uYW1lKCdTcGVjdWxhciBJbnRlbnNpdHknKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBzcGVjdWxhckNvbG9yXG4gICAgICAgIGlmICgnc3BlY3VsYXJDb2xvcicgaW4gbWF0ZXJpYWwpIHtcbiAgICAgICAgICAgIGNvbnN0IHNwZWN1bGFyQ29sb3JPYmogPSB7IGNvbG9yOiAnI2ZmZmZmZicgfTtcbiAgICAgICAgICAgIHNwZWN1bGFyQ29sb3JPYmouY29sb3IgPSAnIycgKyBtYXRlcmlhbC5zcGVjdWxhckNvbG9yLmdldEhleFN0cmluZygpO1xuICAgICAgICAgICAgbWF0ZXJpYWxGb2xkZXIuYWRkQ29sb3Ioc3BlY3VsYXJDb2xvck9iaiwgJ2NvbG9yJykubmFtZSgnU3BlY3VsYXIgQ29sb3InKS5vbkNoYW5nZSgodmFsdWU6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgIG1hdGVyaWFsLnNwZWN1bGFyQ29sb3Iuc2V0KHZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g5bmz6Z2i44OG44Kv44K544OB44Oj5YiH44KK5pu/44GIXG4gICAgICAgIGNvbnN0IHBsYW5lRm9sZGVyID0gZ3VpLmFkZEZvbGRlcignUGxhbmUgVGV4dHVyZScpO1xuICAgICAgICBjb25zdCBwbGFuZVRleHR1cmVQYXJhbXMgPSB7IHRleHR1cmU6ICdEcmFnVG9Nb3ZlJyB9O1xuICAgICAgICBwbGFuZUZvbGRlci5hZGQocGxhbmVUZXh0dXJlUGFyYW1zLCAndGV4dHVyZScsIFsnRHJhZ1RvTW92ZScsICdTcGFjZScsICdEaXNwZXJzaW9uJ10pLm5hbWUoJ1RleHR1cmUnKS5vbkNoYW5nZSgodmFsdWU6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgcGxhbmVNYXRlcmlhbC5tYXAgPSBwbGFuZVRleHR1cmVzW3ZhbHVlXTtcbiAgICAgICAgICAgIHBsYW5lTWF0ZXJpYWwubmVlZHNVcGRhdGUgPSB0cnVlO1xuICAgICAgICB9KTtcbiAgICAgICAgcGxhbmVGb2xkZXIub3BlbigpO1xuXG4gICAgICAgIC8vIOS9jee9ruODleOCqeODq+ODgOODvFxuICAgICAgICBjb25zdCBwb3NpdGlvbkZvbGRlciA9IGd1aS5hZGRGb2xkZXIoJ1Bvc2l0aW9uJyk7XG4gICAgICAgIHBvc2l0aW9uRm9sZGVyLmFkZChwb3NpdGlvblBhcmFtcywgJ3knLCAwLCAxLjUsIDAuMSkubmFtZSgnWScpLm9uQ2hhbmdlKCh2YWx1ZTogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICBkaXNrTWVzaC5wb3NpdGlvbi55ID0gdmFsdWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNoYXBlRm9sZGVyLm9wZW4oKTtcbiAgICAgICAgbWF0ZXJpYWxGb2xkZXIub3BlbigpO1xuICAgICAgICBwb3NpdGlvbkZvbGRlci5vcGVuKCk7XG5cblxuICAgICAgICAvLyDjgrDjg6rjg4Pjg4nooajnpLpcbiAgICAgICAgY29uc3QgZ3JpZEhlbHBlciA9IG5ldyBUSFJFRS5HcmlkSGVscGVyKDEwLCAyMCwpO1xuICAgICAgICBncmlkSGVscGVyLnBvc2l0aW9uLnkgPSAwLjAxOyAvLyDlubPpnaLjga7kuIrjgavphY3nva5cbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoZ3JpZEhlbHBlcik7XG5cbiAgICAgICAgLy8g6Lu46KGo56S6XG4gICAgICAgIGNvbnN0IGF4ZXNIZWxwZXIgPSBuZXcgVEhSRUUuQXhlc0hlbHBlcig1KTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoYXhlc0hlbHBlcik7XG5cbiAgICAgICAgLy/jg6njgqTjg4jjga7oqK3lrppcbiAgICAgICAgdGhpcy5saWdodCA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmLCAxLjApO1xuICAgICAgICBjb25zdCBsdmVjID0gbmV3IFRIUkVFLlZlY3RvcjMoMSwgMSwgMSkubm9ybWFsaXplKCk7XG4gICAgICAgIHRoaXMubGlnaHQucG9zaXRpb24uc2V0KGx2ZWMueCAqIDUsIGx2ZWMueSAqIDUsIGx2ZWMueiAqIDUpO1xuICAgICAgICB0aGlzLmxpZ2h0LmNhc3RTaGFkb3cgPSB0cnVlO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLmxpZ2h0KTtcblxuICAgICAgICAvLyDov73liqDjga7nkrDlooPlhYnvvIjjgrfjg7Pjg5fjg6vjg6njgqTjg4bjgqPjg7PjgrDnlKjvvIlcbiAgICAgICAgY29uc3QgYW1iaWVudExpZ2h0ID0gbmV3IFRIUkVFLkFtYmllbnRMaWdodCgweDQwNDA0MCwgMC4zKTsgLy8g5byx44GE55Kw5aKD5YWJXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGFtYmllbnRMaWdodCk7XG5cbiAgICAgICAgLy8g6L+95Yqg44Gu44OV44Kj44Or44Op44Kk44OIXG4gICAgICAgIGNvbnN0IGZpbGxMaWdodCA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmLCAwLjMpO1xuICAgICAgICBmaWxsTGlnaHQucG9zaXRpb24uc2V0KC0xLCAwLjUsIC0xKTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoZmlsbExpZ2h0KTtcblxuICAgICAgICBsZXQgdXBkYXRlOiBGcmFtZVJlcXVlc3RDYWxsYmFjayA9ICh0aW1lKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5waHlzaWNzRW5hYmxlZCkge1xuICAgICAgICAgICAgICAgIHdvcmxkLmZpeGVkU3RlcCgpO1xuICAgICAgICAgICAgICAgIHBsYW5lQm9keS5wb3NpdGlvbi5zZXQocGxhbmUucG9zaXRpb24ueCwgcGxhbmUucG9zaXRpb24ueSwgcGxhbmUucG9zaXRpb24ueik7XG4gICAgICAgICAgICAgICAgcGxhbmVCb2R5LnF1YXRlcm5pb24uc2V0KHBsYW5lLnF1YXRlcm5pb24ueCwgcGxhbmUucXVhdGVybmlvbi55LCBwbGFuZS5xdWF0ZXJuaW9uLnosIHBsYW5lLnF1YXRlcm5pb24udyk7XG5cbiAgICAgICAgICAgICAgICAvLyDjg4njg6njg4PjgrDkuK3jgafjgarjgZHjgozjgbDniannkIbihpJUaHJlZS5qc+WQjOacn1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc0RyYWdnaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpc2tNZXNoLnBvc2l0aW9uLnNldChkaXNrQm9keS5wb3NpdGlvbi54LCBkaXNrQm9keS5wb3NpdGlvbi55LCBkaXNrQm9keS5wb3NpdGlvbi56KTtcbiAgICAgICAgICAgICAgICAgICAgZGlza01lc2gucXVhdGVybmlvbi5zZXQoZGlza0JvZHkucXVhdGVybmlvbi54LCBkaXNrQm9keS5xdWF0ZXJuaW9uLnksIGRpc2tCb2R5LnF1YXRlcm5pb24ueiwgZGlza0JvZHkucXVhdGVybmlvbi53KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlKTtcbiAgICB9XG5cbiAgICAvLyDlkbzjgbPlh7rjgZnjgajjgY3jgavmlbDlgKTjgpLmjIflrprjgZnjgovjgYvjgonjg4fjg5Xjgqnjg6vjg4jlgKTjgavmhI/lkbPjga/jgarjgYTjgZHjgankuIDlv5zoqK3lrprjgZfjgabjgYrjgY9cbiAgICAvLyBHVUnkuIrjgafjga8odGhpY2tuZXNzLCByYWRpdXMsIGNhcFNlZ21lbnRzLCByYWRpYWxTZWdtZW50cynjgavjgarjgosg55u044GZ5pmC6ZaT44GM44Gq44GEXG4gICAgcHJpdmF0ZSBjcmVhdGVkaXNrR2VvbWV0cnkocmFkaXVzOiBudW1iZXIgPSAxLCBsZW5ndGg6IG51bWJlciA9IDIsIGNhcFNlZ21lbnRzOiBudW1iZXIgPSAxNiwgcmFkaWFsU2VnbWVudHM6IG51bWJlciA9IDMyKTogVEhSRUUuTGF0aGVHZW9tZXRyeSB7XG4gICAgICAgIGNvbnN0IHBvaW50czogVEhSRUUuVmVjdG9yMltdID0gW107XG4gICAgICAgIGNvbnN0IGhhbGZMZW5ndGggPSBsZW5ndGggLyAyO1xuXG4gICAgICAgIC8vIOS4i+WBtOOBruS4reW/g1xuICAgICAgICBwb2ludHMucHVzaChuZXcgVEhSRUUuVmVjdG9yMigwLCByYWRpdXMgKiBNYXRoLnNpbigtTWF0aC5QSSAvIDIpKSk7XG5cbiAgICAgICAgLy8g5Y2K5YaGXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IGNhcFNlZ21lbnRzOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gLU1hdGguUEkgLyAyICsgKE1hdGguUEkgKiBpKSAvIGNhcFNlZ21lbnRzO1xuICAgICAgICAgICAgcG9pbnRzLnB1c2gobmV3IFRIUkVFLlZlY3RvcjIocmFkaXVzICogTWF0aC5jb3MoYW5nbGUpICsgaGFsZkxlbmd0aCwgcmFkaXVzICogTWF0aC5zaW4oYW5nbGUpKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDkuIrlgbTjga7kuK3lv4NcbiAgICAgICAgcG9pbnRzLnB1c2gobmV3IFRIUkVFLlZlY3RvcjIoMCwgcmFkaXVzICogTWF0aC5zaW4oTWF0aC5QSSAvIDIpKSk7XG5cbiAgICAgICAgLy8gcG9pbnRz44Gu5L2N572u44KS6KGo56S6XG4gICAgICAgIC8vIGxldCBzcGhlcmVHZW9tZXRyeSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSgwLjAyNSk7XG4gICAgICAgIC8vIGxldCByZWRNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IGNvbG9yOiAweGZmMDAwMCB9KTtcbiAgICAgICAgLy8gZm9yIChsZXQgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgLy8gICAgIGxldCBtZXNoID0gbmV3IFRIUkVFLk1lc2goc3BoZXJlR2VvbWV0cnksIHJlZE1hdGVyaWFsKTtcbiAgICAgICAgLy8gICAgIG1lc2gucG9zaXRpb24uc2V0KHBvaW50c1tpXS54LCBwb2ludHNbaV0ueSwgMCk7XG4gICAgICAgIC8vICAgICB0aGlzLnNjZW5lLmFkZChtZXNoKTtcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIHJldHVybiBuZXcgVEhSRUUuTGF0aGVHZW9tZXRyeShwb2ludHMsIHJhZGlhbFNlZ21lbnRzKTtcbiAgICB9XG5cbn1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGluaXQpO1xuXG5mdW5jdGlvbiBpbml0KCkge1xuICAgIGxldCBjb250YWluZXIgPSBuZXcgVGhyZWVKU0NvbnRhaW5lcigpO1xuXG4gICAgbGV0IHZpZXdwb3J0ID0gY29udGFpbmVyLmNyZWF0ZVJlbmRlcmVyRE9NKDY0MCwgNDgwLCBuZXcgVEhSRUUuVmVjdG9yMygwLCAzLCAwKSk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh2aWV3cG9ydCk7XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsInZhciBkZWZlcnJlZCA9IFtdO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuXHRpZihjaHVua0lkcykge1xuXHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuXHRcdGRlZmVycmVkW2ldID0gW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgbm90RnVsZmlsbGVkID0gSW5maW5pdHk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaHVua0lkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuXHRcdFx0XHRjaHVua0lkcy5zcGxpY2Uoai0tLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihwcmlvcml0eSA8IG5vdEZ1bGZpbGxlZCkgbm90RnVsZmlsbGVkID0gcHJpb3JpdHk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWQuc3BsaWNlKGktLSwgMSlcblx0XHRcdHZhciByID0gZm4oKTtcblx0XHRcdGlmIChyICE9PSB1bmRlZmluZWQpIHJlc3VsdCA9IHI7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbl9fd2VicGFja19yZXF1aXJlX18uTy5qID0gKGNodW5rSWQpID0+IChpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApO1xuXG4vLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbnZhciB3ZWJwYWNrSnNvbnBDYWxsYmFjayA9IChwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiwgZGF0YSkgPT4ge1xuXHR2YXIgW2NodW5rSWRzLCBtb3JlTW9kdWxlcywgcnVudGltZV0gPSBkYXRhO1xuXHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcblx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG5cdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDA7XG5cdGlmKGNodW5rSWRzLnNvbWUoKGlkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2lkXSAhPT0gMCkpKSB7XG5cdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihydW50aW1lKSB2YXIgcmVzdWx0ID0gcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0fVxuXHRpZihwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbikgcGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24oZGF0YSk7XG5cdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKCk7XG5cdFx0fVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG5cdH1cblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uTyhyZXN1bHQpO1xufVxuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua2NncHJlbmRlcmluZ1wiXSA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtjZ3ByZW5kZXJpbmdcIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgZGVwZW5kcyBvbiBvdGhlciBsb2FkZWQgY2h1bmtzIGFuZCBleGVjdXRpb24gbmVlZCB0byBiZSBkZWxheWVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcInZlbmRvcnMtbm9kZV9tb2R1bGVzX2Nhbm5vbi1lc19kaXN0X2Nhbm5vbi1lc19qcy1ub2RlX21vZHVsZXNfbGlsLWd1aV9kaXN0X2xpbC1ndWlfZXNtX2pzLW5vZC0wNGYzOThcIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvYXBwLnRzXCIpKSlcbl9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=