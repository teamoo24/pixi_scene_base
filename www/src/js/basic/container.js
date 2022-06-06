container_co.interactive = true;
container_co.hitArea = new PIXI.Rectangle(0, 0, 160, 160);
container_co.on('pointertap', for_stop);

// Create a new texture
const texture = PIXI.Texture.from('/src/img/basic/bunny.png');


// Create a 5x5 grid of bunnies
for (let i = 0; i < 25; i++) {
    const bunny = new PIXI.Sprite(texture);
    bunny.x = (i % 5) * 40;
    bunny.y = Math.floor(i / 5) * 40;
    container_co.addChild(bunny);
}

function for_stop(e) {
    app.ticker.started ? app.stop() : app.start();
}

// コンテナを真ん中に移動
container_co.x = win_w / 2;
container_co.y = win_h / 2;

// コンテナの中にbunnyスプライトを作成する
container_co.pivot.x = container_co.width / 2;
container_co.pivot.y = container_co.height / 2;

// アニメーションのアップデートをする。
app.ticker.add((delta) => {
    // コンテナを回す!
    // デルタを使用してフレームに依存しない変換を作成する
    container_co.rotation -= 0.05 * delta;
});