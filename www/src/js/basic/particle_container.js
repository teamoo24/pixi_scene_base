// spriteを保存するための配列を宣言する
const maggots = [];

const totalSprites = app.renderer instanceof PIXI.Renderer ? 10000 : 100;

for (let i = 0; i < totalSprites; i++) {
    //新たなspriteを作る
    const dude = PIXI.Sprite.from('../src/img/basic/maggot_tiny.png');

    // spriteの真ん中に中心点をセットする
    dude.anchor.set(0.5)

    // maggotsごとにサイズをランダムに指定する
    dude.scale.set(0.8 + Math.random() * 0.3);

    // dudeを全部ばらまきます。
    dude.x = Math.random() * app.screen.width;
    dude.y = Math.random() * app.screen.height;

    dude.tint = Math.random() * 0x808080;

    // ランダムな方向をdudeごとに指定する
    dude.direction = Math.random() * Math.PI *2;

    //この数字は、時間の経過とともにspriteの方向を変更するために使用されます。
    dude.turningSpeed = Math.random() - 0.8;
    
    //0~2の間のランダムな速度を作成し、maggotとたちを遅く動かします。
    dude.speed = (2 + Math.random() * 2) * 0.2;

    dude.offset = Math.random() * 100;

    //最後にmaggotたちをcanvasにぶち込みます。
    maggots.push(dude);

    container_pc.addChild(dude);
}

//小さなmaggotsのために境界ボックスを作る
var dudeBoundsPadding = 100;
var dudeBounds = new PIXI.Rectangle (
    -dudeBoundsPadding,
    -dudeBoundsPadding,
    app.screen.width + dudeBoundsPadding *2,
    app.screen.height + dudeBoundsPadding *2,
);

let tick = 0;

app.ticker.add(() => {
    // スプライト毎のポジションを更新させる
    for (let i = 0 ; i <maggots.length; i++) {
        const dude = maggots[i];
        dude.scale.y = 0.95 + Math.sin(tick + dude.offset) * 0.05;
        dude.direction += dude.turningSpeed * 0.01;
        dude.x += Math.sin(dude.direction) * (dude.speed * dude.scale.y);
        dude.y += Math.cos(dude.direction) * (dude.speed * dude.scale.y);
        dude.rotation = -dude.direction + Math.PI;

        // maggotを包む
        if (dude.x < dudeBounds.x) {
            dude.x += dudeBounds.width;
        } else if (dude.x > dudeBounds.x + dudeBounds.width) {
            dude.x -= dudeBounds.width;
        }

        if (dude.y < dudeBounds.y) {
            dude.y += dudeBounds.height;
        } else if (dude.y > dudeBounds.y + dudeBounds.height) {
            dude.y -= dudeBounds.height
        }
    }

    // tickerを増加させる
    tick += 0.1;
});