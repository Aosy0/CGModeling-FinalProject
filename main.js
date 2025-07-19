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
        // 平面を追加
        const planeGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.PlaneGeometry(5, 5);
        const planeMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshBasicMaterial({ color: 0xffffff, side: three__WEBPACK_IMPORTED_MODULE_1__.DoubleSide });
        const plane = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        this.scene.add(plane);
        // シンプルな背景設定
        this.scene.background = new three__WEBPACK_IMPORTED_MODULE_1__.Color(0x404040); // ダークグレーの背景
        this.scene.environment = null; // 環境光を無効化
        // 初期背景の設定完了
        // ジオメトリの生成
        const diskGeometry = this.creatediskGeometry(shapeParams.thickness, shapeParams.radius, shapeParams.capSegments, shapeParams.radialSegments);
        // マテリアルの設定
        const material = new three__WEBPACK_IMPORTED_MODULE_1__.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0.0,
            roughness: 0.0,
            transmission: 1.0,
            ior: 1.33,
            thickness: 2.0,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0MzQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0scUJBQXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nLy4vc3JjL2FwcC50cyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9sc1wiO1xuaW1wb3J0IHsgRHJhZ0NvbnRyb2xzIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9jb250cm9scy9EcmFnQ29udHJvbHNcIjtcbmltcG9ydCBHVUkgZnJvbSAnbGlsLWd1aSc7XG5cbmNsYXNzIFRocmVlSlNDb250YWluZXIge1xuICAgIHByaXZhdGUgc2NlbmU6IFRIUkVFLlNjZW5lO1xuICAgIC8vcHJpdmF0ZSByZW5kZXJlcjogVEhSRUUuV2ViR0xSZW5kZXJlcjtcbiAgICBwcml2YXRlIGxpZ2h0OiBUSFJFRS5MaWdodDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgfVxuXG4gICAgLy8g55S76Z2i6YOo5YiG44Gu5L2c5oiQKOihqOekuuOBmeOCi+aeoOOBlOOBqOOBqykqXG4gICAgcHVibGljIGNyZWF0ZVJlbmRlcmVyRE9NID0gKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBjYW1lcmFQb3M6IFRIUkVFLlZlY3RvcjMpID0+IHtcbiAgICAgICAgY29uc3QgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcigpO1xuICAgICAgICByZW5kZXJlci5zZXRTaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICByZW5kZXJlci5zZXRDbGVhckNvbG9yKG5ldyBUSFJFRS5Db2xvcigweDQ5NWVkKSk7XG4gICAgICAgIHJlbmRlcmVyLnNoYWRvd01hcC5lbmFibGVkID0gdHJ1ZTsgLy/jgrfjg6Pjg4njgqbjg57jg4Pjg5fjgpLmnInlirnjgavjgZnjgotcblxuXG4gICAgICAgIC8v44Kr44Oh44Op44Gu6Kit5a6aXG4gICAgICAgIGNvbnN0IGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg3NSwgd2lkdGggLyBoZWlnaHQsIDAuMSwgMTAwMCk7XG4gICAgICAgIGNhbWVyYS5wb3NpdGlvbi5jb3B5KGNhbWVyYVBvcyk7XG4gICAgICAgIGNhbWVyYS5sb29rQXQobmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMCkpO1xuXG4gICAgICAgIGNvbnN0IG9yYml0Q29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gICAgICAgIC8vIOODieODqeODg+OCsOWPr+iDveOBquOCquODluOCuOOCp+OCr+ODiOOBrumFjeWIl1xuICAgICAgICBjb25zdCBkcmFnZ2FibGVPYmplY3RzOiBUSFJFRS5PYmplY3QzRFtdID0gW107XG5cbiAgICAgICAgdGhpcy5jcmVhdGVTY2VuZShkcmFnZ2FibGVPYmplY3RzKTtcblxuICAgICAgICAvLyBEcmFnQ29udHJvbHPjga7oqK3lrppcbiAgICAgICAgY29uc3QgZHJhZ0NvbnRyb2xzID0gbmV3IERyYWdDb250cm9scyhkcmFnZ2FibGVPYmplY3RzLCBjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gICAgICAgIC8vIOODieODqeODg+OCsOS4reOBr09yYml0Q29udHJvbHPjgpLnhKHlirnjgavjgZnjgotcbiAgICAgICAgZHJhZ0NvbnRyb2xzLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsICgpID0+IHtcbiAgICAgICAgICAgIG9yYml0Q29udHJvbHMuZW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICBkcmFnQ29udHJvbHMuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2VuZCcsICgpID0+IHtcbiAgICAgICAgICAgIG9yYml0Q29udHJvbHMuZW5hYmxlZCA9IHRydWU7XG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgLy8g5q+O44OV44Os44O844Og44GudXBkYXRl44KS5ZG844KT44Gn77yMcmVuZGVyXG4gICAgICAgIC8vIHJlcWVzdEFuaW1hdGlvbkZyYW1lIOOBq+OCiOOCiuasoeODleODrOODvOODoOOCkuWRvOOBtlxuICAgICAgICBjb25zdCByZW5kZXI6IEZyYW1lUmVxdWVzdENhbGxiYWNrID0gKHRpbWUpID0+IHtcbiAgICAgICAgICAgIG9yYml0Q29udHJvbHMudXBkYXRlKCk7XG5cbiAgICAgICAgICAgIHJlbmRlcmVyLnJlbmRlcih0aGlzLnNjZW5lLCBjYW1lcmEpO1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XG4gICAgICAgIH1cbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XG5cbiAgICAgICAgcmVuZGVyZXIuZG9tRWxlbWVudC5zdHlsZS5jc3NGbG9hdCA9IFwibGVmdFwiO1xuICAgICAgICByZW5kZXJlci5kb21FbGVtZW50LnN0eWxlLm1hcmdpbiA9IFwiMTBweFwiO1xuICAgICAgICByZXR1cm4gcmVuZGVyZXIuZG9tRWxlbWVudDtcbiAgICB9XG5cbiAgICAvLyDjgrfjg7zjg7Pjga7kvZzmiJAo5YWo5L2T44GnMeWbnilcbiAgICBwcml2YXRlIGNyZWF0ZVNjZW5lID0gKGRyYWdnYWJsZU9iamVjdHM/OiBUSFJFRS5PYmplY3QzRFtdKSA9PiB7XG4gICAgICAgIHRoaXMuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcblxuICAgICAgICBsZXQgZ3VpID0gbmV3IEdVSSgpOyAvLyBHVUnnlKjjga7jgqTjg7Pjgrnjgr/jg7Pjgrnjga7nlJ/miJBcblxuICAgICAgICAvLyDlvaLnirbjg5Hjg6njg6Hjg7zjgr9cbiAgICAgICAgbGV0IHNoYXBlUGFyYW1zID0ge1xuICAgICAgICAgICAgdGhpY2tuZXNzOiAwLjEsXG4gICAgICAgICAgICByYWRpdXM6IDEsXG4gICAgICAgICAgICBjYXBTZWdtZW50czogMzIsXG4gICAgICAgICAgICByYWRpYWxTZWdtZW50czogNjRcbiAgICAgICAgfTtcblxuICAgICAgICAvLyDkvY3nva7jg5Hjg6njg6Hjg7zjgr9cbiAgICAgICAgbGV0IHBvc2l0aW9uUGFyYW1zID0ge1xuICAgICAgICAgICAgeDogMCxcbiAgICAgICAgICAgIHk6IDAuMixcbiAgICAgICAgICAgIHo6IDBcbiAgICAgICAgfTtcblxuICAgICAgICAvLyDlubPpnaLjgpLov73liqBcbiAgICAgICAgY29uc3QgcGxhbmVHZW9tZXRyeSA9IG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KDUsIDUpO1xuICAgICAgICBjb25zdCBwbGFuZU1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgY29sb3I6IDB4ZmZmZmZmLCBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlIH0pO1xuICAgICAgICBjb25zdCBwbGFuZSA9IG5ldyBUSFJFRS5NZXNoKHBsYW5lR2VvbWV0cnksIHBsYW5lTWF0ZXJpYWwpO1xuICAgICAgICBwbGFuZS5yb3RhdGlvbi54ID0gLU1hdGguUEkgLyAyO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChwbGFuZSk7XG5cbiAgICAgICAgLy8g44K344Oz44OX44Or44Gq6IOM5pmv6Kit5a6aXG4gICAgICAgIHRoaXMuc2NlbmUuYmFja2dyb3VuZCA9IG5ldyBUSFJFRS5Db2xvcigweDQwNDA0MCk7IC8vIOODgOODvOOCr+OCsOODrOODvOOBruiDjOaZr1xuICAgICAgICB0aGlzLnNjZW5lLmVudmlyb25tZW50ID0gbnVsbDsgLy8g55Kw5aKD5YWJ44KS54Sh5Yq55YyWXG5cbiAgICAgICAgLy8g5Yid5pyf6IOM5pmv44Gu6Kit5a6a5a6M5LqGXG5cbiAgICAgICAgLy8g44K444Kq44Oh44OI44Oq44Gu55Sf5oiQXG4gICAgICAgIGNvbnN0IGRpc2tHZW9tZXRyeSA9IHRoaXMuY3JlYXRlZGlza0dlb21ldHJ5KHNoYXBlUGFyYW1zLnRoaWNrbmVzcywgc2hhcGVQYXJhbXMucmFkaXVzLCBzaGFwZVBhcmFtcy5jYXBTZWdtZW50cywgc2hhcGVQYXJhbXMucmFkaWFsU2VnbWVudHMpO1xuXG4gICAgICAgIC8vIOODnuODhuODquOCouODq+OBruioreWumlxuICAgICAgICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGh5c2ljYWxNYXRlcmlhbCh7XG4gICAgICAgICAgICBjb2xvcjogMHhmZmZmZmYsXG4gICAgICAgICAgICBtZXRhbG5lc3M6IDAuMCxcbiAgICAgICAgICAgIHJvdWdobmVzczogMC4wLFxuICAgICAgICAgICAgdHJhbnNtaXNzaW9uOiAxLjAsXG4gICAgICAgICAgICBpb3I6IDEuMzMsXG4gICAgICAgICAgICB0aGlja25lc3M6IDIuMCxcbiAgICAgICAgfSk7XG5cblxuICAgICAgICAvLyDjg6Hjg4Pjgrfjg6Xjga7kvZzmiJBcbiAgICAgICAgY29uc3QgZGlza01lc2ggPSBuZXcgVEhSRUUuTWVzaChkaXNrR2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgICAgLy9kaXNrTWVzaC5jYXN0U2hhZG93ID0gdHJ1ZTsgLy8g5b2x44KS6JC944Go44GZXG4gICAgICAgIC8vZGlza01lc2gucmVjZWl2ZVNoYWRvdyA9IHRydWU7IC8vIOW9seOCkuWPl+OBkeOCi1xuICAgICAgICBkaXNrTWVzaC5wb3NpdGlvbi5zZXQocG9zaXRpb25QYXJhbXMueCwgcG9zaXRpb25QYXJhbXMueSwgcG9zaXRpb25QYXJhbXMueik7IC8vIOODkeODqeODoeODvOOCv+OBi+OCieS9jee9ruOCkuioreWumlxuXG5cbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoZGlza01lc2gpO1xuXG4gICAgICAgIC8vIGRpc2tNZXNo44KS44OJ44Op44OD44Kw5Y+v6IO944Gq44Kq44OW44K444Kn44Kv44OI44Gr6L+95YqgXG4gICAgICAgIGlmIChkcmFnZ2FibGVPYmplY3RzKSB7XG4gICAgICAgICAgICBkcmFnZ2FibGVPYmplY3RzLnB1c2goZGlza01lc2gpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gR1VJ44Kz44Oz44OI44Ot44O844Or44Gu6L+95YqgXG4gICAgICAgIC8vIOW9oueKtuODleOCqeODq+ODgOODvFxuICAgICAgICBjb25zdCBzaGFwZUZvbGRlciA9IGd1aS5hZGRGb2xkZXIoJ1NoYXBlIFBhcmFtZXRlcnMnKTtcblxuICAgICAgICAvLyDjgrjjgqrjg6Hjg4jjg6rjga7mm7TmlrDplqLmlbBcbiAgICAgICAgY29uc3QgdXBkYXRlR2VvbWV0cnkgPSAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBuZXdHZW9tZXRyeSA9IHRoaXMuY3JlYXRlZGlza0dlb21ldHJ5KFxuICAgICAgICAgICAgICAgIHNoYXBlUGFyYW1zLnRoaWNrbmVzcyxcbiAgICAgICAgICAgICAgICBzaGFwZVBhcmFtcy5yYWRpdXMsXG4gICAgICAgICAgICAgICAgc2hhcGVQYXJhbXMuY2FwU2VnbWVudHMsXG4gICAgICAgICAgICAgICAgc2hhcGVQYXJhbXMucmFkaWFsU2VnbWVudHNcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkaXNrTWVzaC5nZW9tZXRyeS5kaXNwb3NlKCk7IC8vIOWPpOOBhOOCuOOCquODoeODiOODquOCkuWJiumZpFxuICAgICAgICAgICAgZGlza01lc2guZ2VvbWV0cnkgPSBuZXdHZW9tZXRyeTtcbiAgICAgICAgfTtcblxuICAgICAgICBzaGFwZUZvbGRlci5hZGQoc2hhcGVQYXJhbXMsICd0aGlja25lc3MnLCAwLjAxLCAwLjUsIDAuMDEpLm5hbWUoJ1RoaWNrbmVzcycpLm9uQ2hhbmdlKHVwZGF0ZUdlb21ldHJ5KTtcbiAgICAgICAgc2hhcGVGb2xkZXIuYWRkKHNoYXBlUGFyYW1zLCAncmFkaXVzJywgMC41LCA1LjAsIDAuMSkubmFtZSgnUmFkaXVzJykub25DaGFuZ2UodXBkYXRlR2VvbWV0cnkpO1xuICAgICAgICBzaGFwZUZvbGRlci5hZGQoc2hhcGVQYXJhbXMsICdjYXBTZWdtZW50cycsIDgsIDY0LCAxKS5uYW1lKCdDYXAgU2VnbWVudHMnKS5vbkNoYW5nZSh1cGRhdGVHZW9tZXRyeSk7XG4gICAgICAgIHNoYXBlRm9sZGVyLmFkZChzaGFwZVBhcmFtcywgJ3JhZGlhbFNlZ21lbnRzJywgMTYsIDEyOCwgMSkubmFtZSgnUmFkaWFsIFNlZ21lbnRzJykub25DaGFuZ2UodXBkYXRlR2VvbWV0cnkpO1xuXG4gICAgICAgIC8vIOODnuODhuODquOCouODq+ODkeODqeODoeODvOOCv1xuICAgICAgICBjb25zdCBtYXRlcmlhbEZvbGRlciA9IGd1aS5hZGRGb2xkZXIoJ01hdGVyaWFsJyk7XG4gICAgICAgIG1hdGVyaWFsRm9sZGVyLmFkZChtYXRlcmlhbCwgJ3JvdWdobmVzcycsIDAuMCwgMS4wLCAwLjAxKS5uYW1lKCdSb3VnaG5lc3MnKTtcblxuICAgICAgICAvLyDkvY3nva7jg5Xjgqnjg6vjg4Djg7xcbiAgICAgICAgY29uc3QgcG9zaXRpb25Gb2xkZXIgPSBndWkuYWRkRm9sZGVyKCdQb3NpdGlvbicpO1xuICAgICAgICBwb3NpdGlvbkZvbGRlci5hZGQocG9zaXRpb25QYXJhbXMsICd5JywgMCwgMS41LCAwLjEpLm5hbWUoJ1knKS5vbkNoYW5nZSgodmFsdWU6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgZGlza01lc2gucG9zaXRpb24ueSA9IHZhbHVlO1xuICAgICAgICB9KTtcblxuICAgICAgICBzaGFwZUZvbGRlci5vcGVuKCk7XG4gICAgICAgIG1hdGVyaWFsRm9sZGVyLm9wZW4oKTtcbiAgICAgICAgcG9zaXRpb25Gb2xkZXIub3BlbigpO1xuXG5cbiAgICAgICAgLy8g44Kw44Oq44OD44OJ6KGo56S6XG4gICAgICAgIGNvbnN0IGdyaWRIZWxwZXIgPSBuZXcgVEhSRUUuR3JpZEhlbHBlcigxMCwgMjAsKTtcbiAgICAgICAgZ3JpZEhlbHBlci5wb3NpdGlvbi55ID0gMC4wMTsgLy8g5bmz6Z2i44Gu5LiK44Gr6YWN572uXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGdyaWRIZWxwZXIpO1xuXG4gICAgICAgIC8vIOi7uOihqOekulxuICAgICAgICBjb25zdCBheGVzSGVscGVyID0gbmV3IFRIUkVFLkF4ZXNIZWxwZXIoNSk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGF4ZXNIZWxwZXIpO1xuXG4gICAgICAgIC8v44Op44Kk44OI44Gu6Kit5a6aXG4gICAgICAgIHRoaXMubGlnaHQgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZiwgMS4wKTtcbiAgICAgICAgY29uc3QgbHZlYyA9IG5ldyBUSFJFRS5WZWN0b3IzKDEsIDEsIDEpLm5vcm1hbGl6ZSgpO1xuICAgICAgICB0aGlzLmxpZ2h0LnBvc2l0aW9uLnNldChsdmVjLnggKiA1LCBsdmVjLnkgKiA1LCBsdmVjLnogKiA1KTtcbiAgICAgICAgdGhpcy5saWdodC5jYXN0U2hhZG93ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQodGhpcy5saWdodCk7XG5cbiAgICAgICAgLy8g6L+95Yqg44Gu55Kw5aKD5YWJ77yI44K344Oz44OX44Or44Op44Kk44OG44Kj44Oz44Kw55So77yJXG4gICAgICAgIGNvbnN0IGFtYmllbnRMaWdodCA9IG5ldyBUSFJFRS5BbWJpZW50TGlnaHQoMHg0MDQwNDAsIDAuMyk7IC8vIOW8seOBhOeSsOWig+WFiVxuICAgICAgICB0aGlzLnNjZW5lLmFkZChhbWJpZW50TGlnaHQpO1xuXG4gICAgICAgIC8vIOi/veWKoOOBruODleOCo+ODq+ODqeOCpOODiFxuICAgICAgICBjb25zdCBmaWxsTGlnaHQgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZiwgMC4zKTtcbiAgICAgICAgZmlsbExpZ2h0LnBvc2l0aW9uLnNldCgtMSwgMC41LCAtMSk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGZpbGxMaWdodCk7XG5cbiAgICAgICAgbGV0IHVwZGF0ZTogRnJhbWVSZXF1ZXN0Q2FsbGJhY2sgPSAodGltZSkgPT4ge1xuXG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZWRpc2tHZW9tZXRyeShyYWRpdXM6IG51bWJlciA9IDEsIGxlbmd0aDogbnVtYmVyID0gMiwgY2FwU2VnbWVudHM6IG51bWJlciA9IDE2LCByYWRpYWxTZWdtZW50czogbnVtYmVyID0gMzIpOiBUSFJFRS5MYXRoZUdlb21ldHJ5IHtcbiAgICAgICAgY29uc3QgcG9pbnRzOiBUSFJFRS5WZWN0b3IyW10gPSBbXTtcbiAgICAgICAgY29uc3QgaGFsZkxlbmd0aCA9IGxlbmd0aCAvIDI7XG5cbiAgICAgICAgcG9pbnRzLnB1c2gobmV3IFRIUkVFLlZlY3RvcjIoMCwgcmFkaXVzICogTWF0aC5zaW4oLU1hdGguUEkgLyAyKSkpO1xuICAgICAgICAvL3BvaW50cy5wdXNoKG5ldyBUSFJFRS5WZWN0b3IyKHJhZGl1cywgcmFkaXVzICogTWF0aC5zaW4oLU1hdGguUEkgLyAyICsgKE1hdGguUEkgKiAwKSAvIGNhcFNlZ21lbnRzKSkpO1xuXG4gICAgICAgIC8vIOWNiuWGhlxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBjYXBTZWdtZW50czsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBhbmdsZSA9IC1NYXRoLlBJIC8gMiArIChNYXRoLlBJICogaSkgLyBjYXBTZWdtZW50cztcbiAgICAgICAgICAgIC8vY29uc3QgYW5nbGUgPSAoTWF0aC5QSSAqIGkpIC8gY2FwU2VnbWVudHM7XG4gICAgICAgICAgICBwb2ludHMucHVzaChuZXcgVEhSRUUuVmVjdG9yMihyYWRpdXMgKiBNYXRoLmNvcyhhbmdsZSkgKyBoYWxmTGVuZ3RoLCByYWRpdXMgKiBNYXRoLnNpbihhbmdsZSkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBvaW50cy5wdXNoKG5ldyBUSFJFRS5WZWN0b3IyKDAsIHJhZGl1cyAqIE1hdGguc2luKE1hdGguUEkgLyAyKSkpO1xuXG4gICAgICAgIC8vIHBvaW50c+OBruS9jee9ruOCkuihqOekulxuICAgICAgICAvLyBsZXQgc3BoZXJlR2VvbWV0cnkgPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkoMC4wMjUpO1xuICAgICAgICAvLyBsZXQgcmVkTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBjb2xvcjogMHhmZjAwMDAgfSk7XG4gICAgICAgIC8vIGZvciAobGV0IGkgPSAwOyBpIDwgcG9pbnRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIC8vICAgICBsZXQgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKHNwaGVyZUdlb21ldHJ5LCByZWRNYXRlcmlhbCk7XG4gICAgICAgIC8vICAgICBtZXNoLnBvc2l0aW9uLnNldChwb2ludHNbaV0ueCwgcG9pbnRzW2ldLnksIDApO1xuICAgICAgICAvLyAgICAgdGhpcy5zY2VuZS5hZGQobWVzaCk7XG4gICAgICAgIC8vIH1cblxuICAgICAgICByZXR1cm4gbmV3IFRIUkVFLkxhdGhlR2VvbWV0cnkocG9pbnRzLCByYWRpYWxTZWdtZW50cyk7XG4gICAgfVxuXG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBpbml0KTtcblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBsZXQgY29udGFpbmVyID0gbmV3IFRocmVlSlNDb250YWluZXIoKTtcblxuICAgIGxldCB2aWV3cG9ydCA9IGNvbnRhaW5lci5jcmVhdGVSZW5kZXJlckRPTSg2NDAsIDQ4MCwgbmV3IFRIUkVFLlZlY3RvcjMoMCwgMywgMCkpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodmlld3BvcnQpO1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCJ2YXIgZGVmZXJyZWQgPSBbXTtcbl9fd2VicGFja19yZXF1aXJlX18uTyA9IChyZXN1bHQsIGNodW5rSWRzLCBmbiwgcHJpb3JpdHkpID0+IHtcblx0aWYoY2h1bmtJZHMpIHtcblx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0Zm9yKHZhciBpID0gZGVmZXJyZWQubGVuZ3RoOyBpID4gMCAmJiBkZWZlcnJlZFtpIC0gMV1bMl0gPiBwcmlvcml0eTsgaS0tKSBkZWZlcnJlZFtpXSA9IGRlZmVycmVkW2kgLSAxXTtcblx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRlZmVycmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIFtjaHVua0lkcywgZm4sIHByaW9yaXR5XSA9IGRlZmVycmVkW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2h1bmtJZHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdGlmICgocHJpb3JpdHkgJiAxID09PSAwIHx8IG5vdEZ1bGZpbGxlZCA+PSBwcmlvcml0eSkgJiYgT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5PKS5ldmVyeSgoa2V5KSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXy5PW2tleV0oY2h1bmtJZHNbal0pKSkpIHtcblx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihmdWxmaWxsZWQpIHtcblx0XHRcdGRlZmVycmVkLnNwbGljZShpLS0sIDEpXG5cdFx0XHR2YXIgciA9IGZuKCk7XG5cdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwibWFpblwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRpZihjaHVua0lkcy5zb21lKChpZCkgPT4gKGluc3RhbGxlZENodW5rc1tpZF0gIT09IDApKSkge1xuXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdH1cblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtjZ3ByZW5kZXJpbmdcIl0gPSBzZWxmW1wid2VicGFja0NodW5rY2dwcmVuZGVyaW5nXCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJ2ZW5kb3JzLW5vZGVfbW9kdWxlc19saWwtZ3VpX2Rpc3RfbGlsLWd1aV9lc21fanMtbm9kZV9tb2R1bGVzX3RocmVlX2J1aWxkX3RocmVlX21vZHVsZV9qcy1ub2QtNDljMDgxXCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2FwcC50c1wiKSkpXG5fX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKF9fd2VicGFja19leHBvcnRzX18pO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9