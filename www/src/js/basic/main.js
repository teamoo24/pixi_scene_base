// This is a JavaScript file
var win_w = window.innerWidth;
var win_h = window.innerHeight;

let app = new PIXI.Application({
    width: win_w,     // スクリーン(ビュー)横幅 
    height: win_h,    // スクリーン(ビュー)縦幅  
});

let currentScene; // 現在表示されているシーン

document.getElementById("main").appendChild(app.view); // main要素にpixiApp.view追加

// js毎に使われるContainerを作成
const container_co = new PIXI.Container(); // conainer.js
const container_tb = new PIXI.Container(); // transparent_backgraound.js
const container_til = new PIXI.Container(); // tilting.js
const container_cab = new PIXI.Container(); // cache_as_bitmap.js
const container_pc = new PIXI.ParticleContainer(10000, {
    scale: true,
    position: true,
    rotation: true,
    uvs: true,
    alpha: true,
})// particle_container.js

// コンテナをアプリケーションに追加
app.stage.addChild(container_co); // conainer.js
app.stage.addChild(container_tb); // transparent_backgraound.js
app.stage.addChild(container_til); // tilting.js
app.stage.addChild(container_cab); // cache_as_bitmap.js
app.stage.addChild(container_pc); // particle_container.js

currentScene = container_co; // NOTE: 現在のシーン

//最初のcontainer以外は全部非表示にする
container_tb.visible = false;
container_til.visible = false;
container_cab.visible = false;
container_pc.visible = false;

const gameScenes = {
    "container": container_co,
    "Transparent Background": container_tb,
    "Tilting": container_til,
    "Cache As Bitmap":container_cab,
    "Particle Container":container_pc
}; // シーン保存領域

/** シーンを切り替え */
function selectScene(sceneKey) {

    // const sceneKey = e.currentTarget.value;
    fadeOut(currentScene, () => {
        currentScene = gameScenes[sceneKey];
        currentScene.alpha = 1.0;
        currentScene.visible = true;
    });

    function fadeOut(container, cb) {
        container.alpha = container.alpha - 0.1;
        if(container.alpha <= 0) {
            container.visible = false;
            return cb && cb(null);
        }
        setTimeout(() => {
            fadeOut(container, cb);
        }, 100);
    }
}