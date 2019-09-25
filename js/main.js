"use strict";

/*
let BASE_URL = 'file:///Users/yamamoto.atsushi/Documents/game/js/';
let dungeon_js = document.createElement('script');
dungeon_js.type = 'type/javascript';
dungeon_js.src = BASE_URL + 'dungeon.js';
let character_js = document.createElement('script');
character_js.type = 'type/javascript';
character_js.src = BASE_URL + 'character.js';

alert(dungeon_js);
document.getElementsByTagName('head')[0].appendChild(dungeon_js);
document.getElementsByTagName('head')[0].appendChild(character_js);
*/


const FONT = "28px monospace"; // 利用フォント
const STATUS_FONT = "20px monospace"; // 利用フォント
const FONTSTYLE = "#ffffff";
const STATUS_FONTSTYLE = "#c0c0ff";
const HEIGHT = 510;
const WIDTH = 544;
/*
const MAP_WIDTH = 29;
const MAP_HEIGHT = 29;
*/
const MAP_WIDTH = 17;
const MAP_HEIGHT = 15;
const SMOOTH = false;
const TILECOLUMN = 6;
const TILEROWS = 6;
const TILESIZE = 32;
const WNDSTYLE = "rgba(0, 0, 0, 0.65)";
// const BASE_URL = ""; // LOCAL
const BASE_URL = "https://atzy-yama.github.io/rougai/";
const gFileMap = "img/map2.png";

let gScreen;
let gFrame = 0;
let gWidth;
let gHeight;
let gImgMap;
let gDungeon;
let gPlayer;
let initialized = false;


//const gFilePlayer = "img/kawauso.png";

function initialize(floor){
  if (!initialized) {
    if (!floor) {
      floor = 1;
    } else {
      return;
    }
  }
  gDungeon = new Dungeon(MAP_WIDTH, MAP_HEIGHT, floor);
  gPlayer = new Player(gDungeon);
  gDungeon.addCharacter(gPlayer);
  if (!initialized) {
    initialized = true;
    start();
  }
}


function DrawMain(){
  const g = gScreen.getContext("2d");

  let current_map;
  gDungeon.draw(g, MAP_WIDTH, MAP_HEIGHT, -8, -9, 9, 9);
  /*
  for (let dy = -9; dy <= 9; dy++) {
    let y = dy + 7;
    for (let dx = -8; dx < 8; dx++) {
      let x = dx + 8;
      let px = gPlayer.getX() + dx;
      let py = gPlayer.getY() + dy;
      let map = MAP_WALL;
//      if (index >= 0 && index < MAP_WIDTH * MAP_WIDTH) {
      if (px >= 0 && py >= 0 && px < MAP_WIDTH && py < MAP_HEIGHT) {
//        map = gMap[py * MAP_WIDTH + px];
        map = gDungeon.get(px, py);
      }
      DrawTile(g, x * TILESIZE, y * TILESIZE, map);
      if (dx == 0 && dy == 0) {
        current_map = map;
      }
    }
  }
    */
    /*
  g.fillStyle = "#ff0000";
  g.fillRect(0, HEIGHT / 2 - 2, WIDTH, 4);
  g.fillRect(WIDTH / 2 - 2, 0, 4, HEIGHT);
  */
  gDungeon.getCharacters().forEach(
    function(value, index, array){
        value.draw(g, gPlayer.getX(), gPlayer.getY(), WIDTH, HEIGHT);
    }
  );
/*
  g.drawImage(gImgPlayer, 0, 0, CHARWIDTH, CHARHEIGHT,
            WIDTH / 2 - CHARWIDTH / 2, HEIGHT / 2 - CHARHEIGHT,
            CHARWIDTH, CHARHEIGHT);
            */

  g.fillStyle = WNDSTYLE;
  g.fillRect(10, 10, 170, 160);
  g.font = FONT;
  g.fillStyle = FONTSTYLE;
  g.fillText("B" + gDungeon.getFloor() + "F", 25, 40);
  g.fillText("LV: " + gPlayer.getLevel(), 25, 70);
  g.fillText("HP: " + gPlayer.getHP() + "/" + gPlayer.getMaxHP(), 25, 100);
  g.fillText("AP: " + gPlayer.getAttachP(), 25, 130);
  g.fillText("EX: " + gPlayer.getExp(), 25, 160);

  g.fillStyle = WNDSTYLE;
  g.fillRect(80, 430, 420, 70);
  g.font = STATUS_FONT;
  g.fillStyle = STATUS_FONTSTYLE;
  g.fillText("(x,y)=(" + gPlayer.getX() + "," + gPlayer.getY() + ")", 85, 460);
  g.fillText(gDungeon.getMessage(), 85, 490);

//  g.font = FONT;
//  g.fillText("Hello World" + gFrame, gFrame / 10, 64);
}

function DrawTile(g, x, y, index){
  const ix = (index % TILECOLUMN) * TILESIZE;
  const iy = Math.floor(index / TILECOLUMN) * TILESIZE;
  g.drawImage(gImgMap, ix, iy, TILESIZE, TILESIZE, x, y, TILESIZE, TILESIZE);
}

function LoadImage(){
  gImgMap = new Image(); gImgMap.src = BASE_URL + gFileMap;
}

function WmPaint(){
  DrawMain();
  const ca = document.getElementById("main"); // main canvas
  const g = ca.getContext("2d"); // 2d canvas getContext

  g.drawImage(gScreen, 0, 0, gScreen.width, gScreen.height, 0, 0, gWidth, gHeight);
}

function WmSize(){
  const ca = document.getElementById("main"); // main canvas
  ca.width = window.innerWidth;
  ca.height = window.innerHeight;

  const g = ca.getContext("2d");
  g.imageSmoothingEnabled = g.msImageSmoothingEnabled = SMOOTH;

  // calcurate pysical screen size
  gWidth = ca.width;
  gHeight = ca.height;
  if (gWidth / WIDTH < gHeight / HEIGHT) {
    gHeight = gWidth;
  } else {
    gWidth = gHeight;
  }

}

// function at timer event
function WmTimer() {
  if(gDungeon == null){return;}
  gFrame++; // counter
  WmPaint();
}

window.onkeydown = function(ev){
  let c = ev.keyCode;
  console.log("keycode = " + c + " gPlayerX=" + gPlayer.getX(), " gPlayerY=" + gPlayer.getY());
  let retval = false;
  switch(c) {
    case 37: // →
      retval = gPlayer.left();
      break;
    case 38: // ↑
      retval = gPlayer.up();
      break;
    case 39: // ←
      retval = gPlayer.right()
      break;
    case 40: // ↓
      retval = gPlayer.down();
      break;
    case 13: // Enter
      gDungeon.stair();
      retval = true;
    case 27: // Escape
  }
  if(retval) {
    gDungeon.update();
  }
}

window.onload = function(){
  start();
}

function start(){
  LoadImage();

  gScreen = document.createElement("canvas"); // create virtual gScreen
  gScreen.width = WIDTH;
  gScreen.height = HEIGHT;

  WmSize();
  window.addEventListener("resize", WmSize);

  setInterval(
    function(){
      WmTimer();
    }, 300); // interval(msec)
}

function requestAjax(endpoint, callback) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (this.readyState==4 && this.status==200) {
            callback(this.response);
        }
    };
    xhr.responseType = 'json';
    xhr.open('GET',endpoint,true);
    xhr.send();
}

/*
// test code
requestAjax("https://talentbase.dena.com/api/me", function(response){
  let body = document.getElementsByTagName('body')[0];
  let json = document.createElement('p');
  json.innerHTML = JSON.stringify(response);
  body.appendChild(json);
});
*/
