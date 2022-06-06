// This is a JavaScript file
var win_w = window.innerWidth;
var win_h = window.innerHeight * 85/100-5;

let app = new PIXI.Application({
    width: win_w,     // スクリーン(ビュー)横幅 
    height: win_h,    // スクリーン(ビュー)縦幅  
    antialiasing: true,
    transparent: false,
    resolution: 1
});

let gameScenes; // ゲームシーン
let dungeon; // ダンジョン背景
let player; // キャラアイコン
const collisions = [];//障害物(猫)一覧

// #game要素にapp.viewを追加
document.querySelector("#game").appendChild(app.view);

PIXI.Loader.shared
//リソースを登録
//第一引数は任意のキー、第二引数は実体パス
.add("chara-1","../src/img/game_sample/JNGbC6F.png")
.add("chara-2", "../src/img/game_sample/H9smyaD.png")
.add("chara-3", "../src/img/game_sample/xT6FStW.png")
.add("explorer", "../src/img/game_sample/rWus6RK.png")
.add("cat", "../src/img/game_sample/Fk2JkI5.png")
.add("dungeon", "../src/img/game_sample/EzpxVBZ.png")
.load(setup);

// この「setup」機能は、イメージがロードされたときに実行されます。
function setup(loader, res) {
    // ゲームシーンを作成
    gameScenes = new PIXI.Container();
    app.stage.addChild(gameScenes);

    //ダンジョン作成(ここで画面の大枠サイズを確定)
    dungeon = new PIXI.Sprite(PIXI.utils.TextureCache["dungeon"]);
    dungeon.width = win_w;
    dungeon.height = win_h;
    gameScenes.addChild(dungeon);
    // アニメーションを作成してシーン追加
    player = createAnim([
        "chara-1", // chara-1
        "chara-2", // chara-2
        "chara-3", // chara-3
    ]);
    player.x = (gameScenes.width/2) - player.width;
    player.y = (gameScenes.height/2) - (player.height/2);
    player.vx = 0;
    player.vy = 0;
    player.play();
    player.anchor.set(0.5,0.5);
    gameScenes.addChild(player);

    //
    // 障害物（猫）を適当に配置
    //
    // 障害物1（猫）を作成してシーンに追加
    const cat = new PIXI.Sprite(PIXI.utils.TextureCache["cat"]);
    cat.x = (gameScenes.width/2) + cat.width/2;
    cat.y = gameScenes.height/2 - cat.height/2;
    gameScenes.addChild(cat);
    collisions.push(cat); //障害物として登録
    // 障害物（猫）を作成してシーンに追加
    const cat2 = new PIXI.Sprite(PIXI.utils.TextureCache["cat"]);
    cat2.x = (gameScenes.width/2) - cat2.width*2;
    cat2.y = gameScenes.height * 0.75;
    gameScenes.addChild(cat2);
    collisions.push(cat2);//障害物として登録
    
    // Start the game loop
    // NOTE: キャラにクリックイベントハンドラーをセット
    //
    player.interactive = true;
    player
        //クリックした時、もしくはタブした時に発動
        .on('pointertap',onClick);

   app.ticker.add((delta) => {
       //ジョイパッドの方向チェック
       check();
       //プレイヤーの移動方向取得
       const playerDirection = getPlayerDirection();
       // 障害物と衝突していないかチェック
       for (let len = collisions.length, i= 0; i< len; i++) {
           
           const collision = collisions[i];
           const hitDirection = getCollisionDirection(collision);
           if(hitDirection) return;
       }
        player.x += player.vx;
        player.y += player.vy;
   })
}


/**
 * アニメーションスプライトオブジェクトを作成
 * @param  {Array<String>} imgs - imageパスの配列
 * @param  {Object} opts - [OPTIONAL] オプション @see PIXI.extras.AnimatedSprite
 * @return {AnimatedSprite}
 */
function createAnim(imgs, opts) {
    // テクスチャを保存する配列を宣言
    const textureArray = [];
    
    for (let i = 0; i < imgs.length; i++) {
        //引数から取ってきたイメージのパスをテクスチャ化する
        let texture = PIXI.Texture.from(imgs[i]);
        // テクスチャ配列にテクスチャを入れる
        textureArray.push(texture);
    };
    // textureArrayを元にAnimatedApriteを宣言
    const animatedSprite = new PIXI.AnimatedSprite(textureArray);
    animatedSprite.animationSpeed = (opts && opts.animationSpeed) ? opts.animationSpeed : 0.1;

    //AnimatedSpriteを返す
    return animatedSprite;
}


//ジョイパッドを生成
var joystick = new JoyStick({
	radius: 80,
	x: window.innerWidth / 4,
	y: window.innerHeight * 0.8,
	inner_radius: 50
});


// player停止
function stop(e) {
    player.stop();
}

// player再生
function play(e){
    player.play();
}

//player一瞬猫化
function change(e) {
    // アイコンの位置を取得
    const x = player.x;
    const y = player.y;
    // アイコンを非表示
    player.visible = false;
    // 猫アイコンを取得
    const sprite = new PIXI.Sprite(PIXI.utils.TextureCache["cat"]);
    // 猫アイコンの位置をセット
    sprite.x = x;
    sprite.y = y;
    // 猫アイコンをゲームシーンに追加
    gameScenes.addChild(sprite);
    // 1秒後に猫のアイコンを壊して元のアイコン再表示
    setTimeout(()=> {
        sprite.destroy();
        player.visible = true;
    },1000)
}

/**
 *  キャラのフェードアウト
 */
function effectFadeOut(e) {
    const item = player;
    _effect(item.alpha - 0.1, ()=>{
        console.log("effect Fade Out end");
    })

    function _effect(alpha, cb) {
        item.alpha = alpha;
        if (alpha <=0) return cb && cb(null);
        setTimeout(()=>{
            _effect(alpha - 0.1, cb);
        }, 100);
    }
}

/**
 * キャラのフェードイン
 */
function effectFadeIn(e) {
    const item = player;
    _effect(item.alpha + 0.1, ()=> {
        console.log("effect Fade In end");
    })

    function _effect(alpha, cb) {
        item.alpha = alpha;
        if (alpha >= 1) return cb && cb(null);
        setTimeout(() => {
            _effect(alpha+0.1,cb);
        }, 100)
    }
}

/**
 * キャラの回転
 */
function effectRotate(e) {
    const item = player;
    let rotation = 0; // 現在の回転度数
    const maxCount = 2; // 上限回転数
    const maxTick = 57 * maxCount; // 57 = 1 radius.
    const rotationPerTick = 10; // 1Tickのrotation
    const defaultX = item.x;
    const defaultY = item.y;
    // アイコンの中心位置を取得する
    const offsetX = item.width/2;
    const offsetY = item.height/2;
    item.x += offsetX;
    item.y += offsetY;
    item.anchor.set(0.5, 0.5);
    // = item.pivot.set(item.width/2, item.height/2);
    _effect(() => {
        console.log("effect Rotate end");
        // アイコンの中心位置を戻す
        item.x -= offsetX;
        item.y -= offsetY;
        item.anchor.set(0,0);
        item.rotation = 0;
    })

    function _effect(cb) {
        item.rotation += rotationPerTick;
        rotation += rotationPerTick;
        if(rotation >= maxTick) return cb && cb(null);
        setTimeout(() => {
            _effect(cb);
        }, 100);
    }
}

/**
 * キャラのバイブ
 */
function effectVibe(e) {
    const item = player;
    let count = 0;//現状の回数
    const maxCount = 10; // 上限回転数
    const maxRotation = 57 * maxCount; //57 = 1radius
    const rotationPerTick = 0.3; // 1tickのrotation
    const defaultX = item.x;
    const defaultY = item.y;
    const offsetX = item.width/2;
    const offsetY = item.height/2;
    item.x += offsetX;
    item.y += offsetY;
    item.anchor.set(0.5, 0.5);
    // = item.pivot.set(item.width/2, item.height/2)
    _effect(true, ()=> {
        console.log("effectVibe end");
        //位置を直す
        item.x -= offsetX;
        item.y -= offsetY; 
        item.anchor.set(0,0);
        item.rotation = 0;
    });

    function _effect(leanRight, cb) {
        item.rotation = (leanRight) ? rotationPerTick : -rotationPerTick;
        count += 1;
        if (count > maxCount) return cb && cb(null);
        setTimeout(() => {
            _effect(!leanRight, cb);
        }, 100)
    }
}

/**
 * キャラの点滅
 */
function effectFlash(e) {
    const item = player;
    let count = 0;
    const flashCount = 3;//点滅回数
    const maxCount = flashCount * 2;
    _effect(false, () => {
        console.log("effect Flash end");
        item.alpha = 1;
    })

    function _effect(appear, cb) {
        item.alpha = (appear) ? 1:0;
        count += 1;
        if(count > maxCount) return cb && cb(null);
        setTimeout(() => {
            _effect(!appear, cb);
        },100)
    } 

    
}

/**
* クリックイベント実装
*/
function onClick(e) {
    console.log("onClick e:",e);
    const sprite = e.currentTarget;//読み込まれたスプライトを変数化
    sprite.stop(); // NOTE:一旦アニメ停止
    const prevTextures = sprite.textures//アニメtexturesを保存しておく
    const newTextures = PIXI.utils.TextureCache["cat"];
    sprite.texture = newTextures;
    setTimeout(() => {
        sprite.textures = prevTextures;// アニメtexturesを再設定
        sprite.play();
    }, 1000);
}

/** プレイヤーの移動方向を取得 */
function getPlayerDirection() {
    if (player.vx > 0) return "right";
    if (player.vx < 0) return "left";
    if (player.vy > 0) return "bottom";
    if (player.vy < 0) return "top";
    return null;
}
/**
 * ジョイパッドの動きをチェック
 */
function check() {
    
      player.vy = 0;
      player.vx = 0;

	if ( joystick.up ) {
      player.vy = -5;
      player.vx = 0;
	}

    if( joystick.down) {
      player.vy = 5;
      player.vx = 0;
    }
    if( joystick.left) {
      //Change the player's velocity when the key is pressed
      player.vx = -5;
      player.vy = 0;
    }
    if( joystick.right) {
      player.vx = 5;
      player.vy = 0;
    }
}

/** プレイヤーが衝突した障害物の方向を取得 */
function getCollisionDirection(collision) {
    const { x,y, vx, vy} = player;
    let direction = null;
    const nextX = x + vx;
    const nextY = y + vy;
    const targetRangeX = [collision.x, collision.x + collision.width];
    const targetRangeY = [collision.y, collision.y + collision.height];
    if ((nextX >= targetRangeX[0] && nextX <= targetRangeX[1]) &&
      (nextY >= targetRangeY[0] && nextY <= targetRangeY[1])) {
      if (vx > 0) direction = "right";
      else if (vx < 0) direction = "left";
      else if (vy > 0) direction = "bottom";
      else if (vy < 0) direction = "top";
    }
    return direction;
}

