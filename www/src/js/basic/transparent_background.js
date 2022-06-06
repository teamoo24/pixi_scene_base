// 新しいスプライトをイメージパスから取得
const bunny_tb = PIXI.Sprite.from("../src/img/basic/bunny.png")

//bunnyのancor pointを指定
bunny_tb.anchor.set(0.5);

// move the sprite to the center of the screen
bunny_tb.x = app.screen.width / 2;
bunny_tb.y = app.screen.height / 2;

container_tb.addChild(bunny_tb);

app.ticker.add(() => {
    // just for fun, let's rotate mr rabbit a little
    bunny_tb.rotation += 0.1;
});
