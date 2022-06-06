// This is a JavaScript file
var win_w = window.innerWidth;
var win_h = window.innerHeight;
var g_TICK = 100; // 1000/40 = 25 frames per second
var g_Time = 0;

let app = new PIXI.Application({
    width: win_w,     // スクリーン(ビュー)横幅 
    height: win_w,    // スクリーン(ビュー)縦幅 
    backgroundColor: 0xcccccc
});

// This is a JavaScript file
let W,H,S = 2;
let snake = [];
let foods = [];
let point = 0;
let timer = NaN;
let keyCode = "down";

let gameScenes; //ゲームシーン

let snake_text = [];
let food_text = [];

document.querySelector("#main").appendChild(app.view)

//Pointオブジェクト
class Point {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
}


//初期化関数
init = () => {

    W = app.screen.width / S;
    H = app.screen.height / S;

    //蛇の初期化
    snake.push(new Point(W/2, H/2))
    snake_text.push(new PIXI.Text("."))

    //餌の初期化
    for(var i = 0; i < 10; i++) {
        addFood();
    }

    app.ticker.add((delta) => {
        
        // Limit to the frame rate
        var timeNow = (new Date()).getTime();
        var timeDiff = timeNow - g_Time;
        if (timeDiff < g_TICK) {
            return;
        } else {
            tick();
        }
        // We are now meeting the frame rate, so reset the last time the animation is done
        g_Time = timeNow;


    })
}

//餌の追加
addFood = () => {
    while(true) {
        //フィールド内にランダムなxとy座標を読み込む
        let x = Math.floor(Math.random()*W);
        let y = Math.floor(Math.random()*H);

        if (isHit(foods, x, y) || isHit(snake, x, y)) {
            continue;
        }

        //foods配列に新しい座標をpushする
        foods.push(new Point(x,y))
        food_text.push(new PIXI.Text("+"))
        break;
    }
    
}

//衝突判定
isHit = (data, x, y) => {
    for (var i = 0 ; i < data.length ; i++) {
        if (data[i].x <= x+S && data[i].x >= x-S
        && data[i].y <= y+S && data[i].y >= y-S) {
            return true;
        }
    }
    return false;
}

moveFood = (x,y) => {
    foods = foods.filter(function (p) {
        return (!(p.x <= x+S) &&!(p.x >= x-S) 
        || !(p.y <= y+S) && !(p.y >= y-S));
    });
   addFood();
}

//蛇の動き管理
tick = () => {
   // console.log(snake.length)//最初のreturn=1
    let x = snake[0].x;
    let y = snake[0].y;

    
    switch(keyCode) {
        case "left":
            x--;
            break;
        case "right":
            x++;
            break;
        case "up":
            y--;
            break;
        case "down":
            y++;
            break;
    }
    
	if ( joystick.up ) {
        keyCode = "up";
	}
    if( joystick.down) {
        keyCode = "down";
    }
    if( joystick.left) {
        keyCode = "left";
    }
    if( joystick.right) {
        keyCode = "right";
    }

    // 自分 or 壁に衝突？
    if (x < 0 || x >= W || y < 0 || y >= H) {
        app.stop();
        alert("game over");
    }

    //頭を先頭に追加
    snake.unshift(new Point(x,y))
    snake_text.unshift(new PIXI.Text("."))

    if(isHit(foods, x, y)) {
        point += 10;
        moveFood(x,y);
    } else {
        //餌を食べてない->しっぽ削除
        snake.pop();
        snake_text.pop();
    }

    paint();
}

paint = () => {
 
    for (var i = app.stage.children.length - 1; i >= 0; i--) {	
        app.stage.removeChild(app.stage.children[i]);
    };

    foods.forEach((p,i) => {
        food_text[i].x = p.x*S;
        food_text[i].y = (p.y+1)*S;
        app.stage.addChild(food_text[i])
    }) 

    snake.forEach((p,i) => {
        snake_text[i].x = p.x*S;
        snake_text[i].y = (p.y+1)*S;
        app.stage.addChild(snake_text[i])
    })

}

//ジョイパッドを生成
var joystick = new JoyStick({
	radius: 80,
	x: window.innerWidth / 2,
	y: window.innerHeight * 0.8,
	inner_radius: 50
});

init();
