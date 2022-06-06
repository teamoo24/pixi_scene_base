
// aliensの配列を作る
const aliens = [];

const totlaDudes = 20;

for (let i = 0; i < totlaDudes; i++) {
    // スプライト用のイメージを読み込む
    const dude = PIXI.Sprite.from('../src/img/basic/flowerTop.png');

    // テクスチャのanchor(中心点)を指定する
    dude.anchor.set(0.5);

    // dudeの大きさをランダムで指定する
    dude.scale.set(0.8 + Math.random() * 0.3);

    // dudeをランダムな位置に置く
    dude.x = Math.random() * win_w;
    dude.y = Math.random() * win_h;

    dude.tint = Math.random() * 0xFFFFFF;

    // 動きをコントロールする追加属性を作ります。
    // 360°内のランダムな方に方向を指定します。
    dude.direction = Math.random() * Math.PI * 2;

    // この数字は、時間の経過とともに、dudeの方向を変更するために使用される
    dude.turningSpeed = Math.random() - 0/8;

    // dudeランダムなspeedを指定します。
    dude.speed = 2 + Math.random() * 2;

    // 最後に、後で簡単にアクセスできるように、エイリアンの配列にdudeを押し込みます
    aliens.push(dude);

    container_til.addChild(dude);
}

// dudeをためのboundingボックスを作る
var dudeBoundsPadding = 100;
var dudeBounds = new PIXI.Rectangle(-dudeBoundsPadding,
-dudeBoundsPadding, 
win_w + dudeBoundsPadding *2,
win_h + dudeBoundsPadding *2)

app.ticker.add(() => {
   // dudeを繰り返し、位置を更新します
   for (let i = 0; i < aliens.length; i++) {
       const dude = aliens[i];
       dude.direction += dude.turningSpeed * 0.01;
       dude.x += Math.sin(dude.direction) * dude.speed;
       dude.y += Math.cos(dude.direction) * dude.speed;
       dude.rotation = -dude.direction - Math.PI / 2;

       // 彼らの境界をテストするためdudeを包みます...
       if (dude.x < dudeBounds.x) {
           dude.x += dudeBounds.width;
       } else if (dude.x > dudeBounds.x + dudeBounds.width) {
           dude.x -= dudeBounds.width;
       }

       if (dude.y < dudeBounds.y) {
           dude.y += dudeBounds.height;
       } else if (dude.y > dudeBounds.y + dudeBounds.height) {
           dude.y -= dudeBounds.height;
       }
   }
})