app.stop(); 

// load resources
app.loader
.add('spritesheet', '../src/json/monsters.json')
.load(onAssetsLoaded)

// alienを保存するために固定する
const aliens_cab = [];
const alienFrames = [
    '../src/img/basic/eggHead.png',
    '../src/img/basic/flowerTop.png',
    '../src/img/basic/helmlok.png',
    '../src/img/basic/skully.png',
]

let count = 0;

//空のコンテナを作る
container_cab.x = win_w/2;
container_cab.y = win_h/2;

// ステージが相互作用できるようにする
app.stage.interactive = true;

function onAssetsLoaded() {
    // イメージパスのテクスチャでalienの集団を追加する
    for (let i = 0; i< 100; i++) {
        const frameName = alienFrames[i % 4];

        // frame nameを利用してalienを作る
        const alien = PIXI.Sprite.from(frameName);
        alien.tint = Math.random() * 0xFFFFFF;

        /*
        * 今日の面白い事実 :)
        * 上記のソースを実装するもう一つの方法
        * var texture = PIXI.Texture.from(frameName);
        * var alien = new PIXI.Sprite(texture);
        */
        alien.x = Math.random() * win_w-win_w/2;
        alien.y = Math.random() * win_h-win_h/2;
        alien.anchor.x = 0.5;
        alien.anchor.y = 0.5;
        aliens_cab.push(alien);
        container_cab.addChild(alien);
    }
    app.start();
}

// マウスクリックとタッチタップの両方に対応するようにイベントを追加
container_cab.interactive = true;
container_cab.on('pointertap',onClick)

function onClick() {
    container_cab.cacheAsBitmap = !container_cab.cacheAsBitmap;

}

app.ticker.add(()=> {
   // alienを少しずつ動かしたり回転させたりしましょう
   for(let i = 0; i < 100 ; i ++) {
       const alien = aliens_cab[i];
       alien.rotation += 0.1;
   } 

    count += 0.01;

    container_cab.scale.x = Math.sin(count);
    container_cab.scale.y = Math.sin(count);
    container_cab.rotation += 0.01;
})