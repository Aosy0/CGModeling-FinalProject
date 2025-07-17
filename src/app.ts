//23FI551 青嶋勇太

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { createNoise2D } from 'simplex-noise';

class ThreeJSContainer {
    private scene: THREE.Scene;
    private geometry: THREE.BufferGeometry;
    private material: THREE.Material;
    private cube: THREE.Mesh;
    private light: THREE.Light;

    constructor() {

    }

    // 画面部分の作成(表示する枠ごとに)*
    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        let renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x495ed));
        renderer.shadowMap.enabled = true; //シャドウマップを有効にする

        //カメラの設定
        let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        let orbitControls = new OrbitControls(camera, renderer.domElement);

        this.createScene();
        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        let render: FrameRequestCallback = (time) => {
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
    private createScene = () => {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x495ed, 50, 250); // (霧の色, 開始距離, 終了距離)

        const noise2D = createNoise2D();

        //平面の関数
        let myPlane = (u: number, v: number, target: THREE.Vector3) => {
            let r = 200;
            let x = u * r - r / 2;
            //let y = 0;
            let z = v * r - r / 2;

            const frequency = 2; // 地形の周波数（値を大きくすると細かくなる）
            const amplitude = 3;  // 地形の振幅（値を大きくすると高低差が大きくなる）

            //let y = noise2D(u * frequency, v * frequency) * amplitude;
            let y = 0;
            y += noise2D(u * 3, v * 3) * 8;     // 大きな地形の起伏
            y += noise2D(u * 8, v * 8) * 2;     // 中程度の起伏
            y += noise2D(u * 20, v * 20) * 0.5; // 細かい起伏

            // 山を追加する関数
            const addMountain = (centerU: number, centerV: number, radius: number, height: number) => {
                let distU = u - centerU;
                let distV = v - centerV;
                let distance = Math.sqrt(distU * distU + distV * distV);

                if (distance < radius) {
                    // ガウシアン分布で山の形を作成
                    let mountainHeight = height * Math.exp(-(distance * distance) / (2 * radius * radius / 9));
                    y += mountainHeight;
                }
            };

            // 複数の山を配置
            addMountain(0.3, 0.3, 0.15, 25);  // 山1: 右上
            addMountain(0.7, 0.2, 0.12, 20);  // 山2: 右下
            addMountain(0.2, 0.8, 0.18, 30);  // 山3: 左上（最も高い）
            addMountain(0.6, 0.7, 0.1, 15);   // 山4: 中央右（小さめ）

            target.set(x, y, z);
        }

        //ジオメトリの作成
        let paramGeometry = new THREE.ParametricGeometry(myPlane, 256, 256);

        //頂点カラー用の配列を用意
        const colors = [];
        const color = new THREE.Color();

        //ジオメトリの全頂点をループ処理
        const positions = paramGeometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const y = positions.getY(i); // i番目の頂点のy座標を取得

            // 3. y座標（標高）に応じて色を決定
            if (y < 1.0) { // 水面レベル
                color.setHSL(0.6, 0.8, 0.4); // 青色
            } else if (y < 8.0) { // 草地
                color.setHSL(0.3, 0.6, 0.5); // 緑色
            } else if (y < 25.0) { // 岩肌
                color.setHSL(0.1, 0.2, 0.4); // 茶色・灰色
            } else { // 雪
                color.setHSL(0.0, 0.0, 0.9); // 白色
            }

            colors.push(color.r, color.g, color.b);
        }

        paramGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        let paramMaterial = new THREE.MeshPhongMaterial({
            //color: 0x00ffff,
            side: THREE.DoubleSide,
            flatShading: true,
            vertexColors: true
        });
        //ワイヤーフレーム
        let lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });

        let group = new THREE.Group();
        //group.add(new THREE.Mesh(paramGeometry, paramMaterial));
        // 地形メッシュが影を受けるように設定
        const mesh = new THREE.Mesh(paramGeometry, paramMaterial);
        mesh.receiveShadow = true;
        group.add(mesh);
        //group.add(new THREE.LineSegments(paramGeometry, lineMaterial));

        this.scene.add(group);



        //ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        let lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.light.castShadow = true;
        this.scene.add(this.light);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(ambientLight);

        // 毎フレームのupdateを呼んで，更新
        // reqestAnimationFrame により次フレームを呼ぶ
        let update: FrameRequestCallback = (time) => {

            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();

    let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(50, 40, 50));
    document.body.appendChild(viewport);
}
