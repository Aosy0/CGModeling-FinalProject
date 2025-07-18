import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import GUI from 'lil-gui';

class ThreeJSContainer {
    private scene: THREE.Scene;
    //private renderer: THREE.WebGLRenderer;
    private light: THREE.Light;

    constructor() {

    }

    // 画面部分の作成(表示する枠ごとに)*
    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x495ed));
        renderer.shadowMap.enabled = true; //シャドウマップを有効にする


        //カメラの設定
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        const orbitControls = new OrbitControls(camera, renderer.domElement);

        // ドラッグ可能なオブジェクトの配列
        const draggableObjects: THREE.Object3D[] = [];

        this.createScene(draggableObjects);

        // DragControlsの設定
        const dragControls = new DragControls(draggableObjects, camera, renderer.domElement);

        // ドラッグ中はOrbitControlsを無効にする
        dragControls.addEventListener('dragstart', () => {
            orbitControls.enabled = false;
        });

        dragControls.addEventListener('dragend', () => {
            orbitControls.enabled = true;
        });


        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        const render: FrameRequestCallback = (time) => {
            orbitControls.update();

            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);

        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    }

    // シーンの作成(全体で1回)
    private createScene = (draggableObjects?: THREE.Object3D[]) => {
        this.scene = new THREE.Scene();

        let gui = new GUI(); // GUI用のインスタンスの生成

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
        const planeGeometry = new THREE.PlaneGeometry(5, 5);
        const loader = new THREE.TextureLoader();
        const planeTextures = {
            'DragToMove': loader.load('DragToMove.png'),
            'Space': loader.load('space.jpeg'),
            'Dispersion': loader.load('DISPERSION.png')
        };
        let planeMaterial = new THREE.MeshBasicMaterial({ map: planeTextures['DragToMove'] });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        this.scene.add(plane);

        // シンプルな背景設定
        this.scene.background = new THREE.Color(0x404040);
        this.scene.environment = null; // 環境光を無効化

        // 初期背景の設定完了

        // ジオメトリの生成
        const diskGeometry = this.creatediskGeometry(shapeParams.thickness, shapeParams.radius, shapeParams.capSegments, shapeParams.radialSegments);

        // マテリアルの設定
        const material = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0.0,
            roughness: 0.0,
            transmission: 1.3,
            ior: 1.33,
            thickness: 1.0,
            dispersion: 5.0,
        });


        // メッシュの作成
        const diskMesh = new THREE.Mesh(diskGeometry, material);
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
            const newGeometry = this.creatediskGeometry(
                shapeParams.thickness,
                shapeParams.radius,
                shapeParams.capSegments,
                shapeParams.radialSegments
            );
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
            materialFolder.addColor(specularColorObj, 'color').name('Specular Color').onChange((value: string) => {
                material.specularColor.set(value);
            });
        }

        // 平面テクスチャ切り替え
        const planeFolder = gui.addFolder('Plane Texture');
        const planeTextureParams = { texture: 'DragToMove' };
        planeFolder.add(planeTextureParams, 'texture', ['DragToMove', 'Space', 'Dispersion']).name('Texture').onChange((value: string) => {
            planeMaterial.map = planeTextures[value];
            planeMaterial.needsUpdate = true;
        });
        planeFolder.open();

        // 位置フォルダー
        const positionFolder = gui.addFolder('Position');
        positionFolder.add(positionParams, 'y', 0, 1.5, 0.1).name('Y').onChange((value: number) => {
            diskMesh.position.y = value;
        });

        shapeFolder.open();
        materialFolder.open();
        positionFolder.open();


        // グリッド表示
        const gridHelper = new THREE.GridHelper(10, 20,);
        gridHelper.position.y = 0.01; // 平面の上に配置
        this.scene.add(gridHelper);

        // 軸表示
        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);

        //ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff, 1.0);
        const lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x * 5, lvec.y * 5, lvec.z * 5);
        this.light.castShadow = true;
        this.scene.add(this.light);

        // 追加の環境光（シンプルライティング用）
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3); // 弱い環境光
        this.scene.add(ambientLight);

        // 追加のフィルライト
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-1, 0.5, -1);
        this.scene.add(fillLight);

        let update: FrameRequestCallback = (time) => {

            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    private creatediskGeometry(radius: number = 1, length: number = 2, capSegments: number = 16, radialSegments: number = 32): THREE.LatheGeometry {
        const points: THREE.Vector2[] = [];
        const halfLength = length / 2;

        points.push(new THREE.Vector2(0, radius * Math.sin(-Math.PI / 2)));
        //points.push(new THREE.Vector2(radius, radius * Math.sin(-Math.PI / 2 + (Math.PI * 0) / capSegments)));

        // 半円
        for (let i = 0; i <= capSegments; i++) {
            const angle = -Math.PI / 2 + (Math.PI * i) / capSegments;
            //const angle = (Math.PI * i) / capSegments;
            points.push(new THREE.Vector2(radius * Math.cos(angle) + halfLength, radius * Math.sin(angle)));
        }

        points.push(new THREE.Vector2(0, radius * Math.sin(Math.PI / 2)));

        // pointsの位置を表示
        // let sphereGeometry = new THREE.SphereGeometry(0.025);
        // let redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        // for (let i = 0; i < points.length; ++i) {
        //     let mesh = new THREE.Mesh(sphereGeometry, redMaterial);
        //     mesh.position.set(points[i].x, points[i].y, 0);
        //     this.scene.add(mesh);
        // }

        return new THREE.LatheGeometry(points, radialSegments);
    }

}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();

    let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(0, 3, 0));
    document.body.appendChild(viewport);
}
