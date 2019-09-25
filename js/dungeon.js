"use strict";

const MAP_NORMAL = 0;
const MAP_NORMAL2 = 1;
const MAP_WALL = 2;
const MAP_STAIR = 3;

class Dungeon {
  map;
  width;
  height;
  characters;
  stair_x;
  stair_y;
  floor;
  message = "";

  constructor(width, height, floor) {
    this.width = width;
    this.height = height;
    this.floor = floor;
    this.map = this.makeMap(width, height);
    this.characters = [];
    this.assignStair();
    this.assignEnemies();
  }

  makeMap(width, height){
    let map = [];
    for (let i = 0; i < width * height; i++) {
      map[i] = MAP_NORMAL;
    }
    for (let x = 0; x < width; x++) {
      map[x] = map[(height - 1) * width + x] = MAP_WALL;
    }
    for (let y = 0; y < height; y++) {
      map[width * y] = map[width * (y + 1) - 1] = MAP_WALL;
    }
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        if (x % 2 == 0 && y % 2 == 0) {
          map[x + y * width] = MAP_WALL;
        } else {
          map[x + y * width] = MAP_NORMAL;
        }
      }
    }
    for (let y = 2; y < height - 1; y += 2) {
      switch(Math.floor(Math.random() * 4)){
      case 0:
        map[1 + y * width] = MAP_WALL;
        break;
      case 1:
        map[3 + y * width] = MAP_WALL;
        break;
      case 2:
        map[2 + (y - 1) * width] = MAP_WALL;
        break;
      case 3:
        map[2 + (y + 1) * width] = MAP_WALL;
        break;
      }
    }
    for (let y = 2; y < height - 1; y += 2) {
      for (let x = 4; x < width - 1; x += 2) {
        switch(Math.floor(Math.random() * 3)){
        case 0:
          map[(x - 1) + y * width] = MAP_WALL;
          break;
        case 1:
          map[x + (y - 1) * width] = MAP_WALL;
          break;
        case 2:
          map[x + (y + 1) * width] = MAP_WALL;
          break;
        }
      }
    }


    return map;
  }

  draw(g, width, height, start_x, start_y, end_x, end_y){
    for (let dy = start_y; dy < end_y; dy++) {
      let y = dy + 7; // ??
      for (let dx = start_x; dx < end_x; dx++) {
        let x = dx + 8; // ??
        /*
        let px = ((gPlayerX + dx) % MAP_WIDTH + MAP_WIDTH) % MAP_WIDTH;
        let py = ((gPlayerY + dy) % MAP_HEIGHT + MAP_HEIGHT) % MAP_HEIGHT;
        */
        let px = gPlayer.getX() + dx;
        let py = gPlayer.getY() + dy;
        let map = MAP_WALL;
  //      if (index >= 0 && index < MAP_WIDTH * MAP_WIDTH) {
        if (px == this.stair_x && py == this.stair_y) {
          map = MAP_STAIR;
        } else if (px >= 0 && py >= 0 && px < MAP_WIDTH && py < MAP_HEIGHT) {
  //        map = gMap[py * MAP_WIDTH + px];
          map = gDungeon.get(px, py);
        }
        DrawTile(g, x * TILESIZE, y * TILESIZE, map);
      }
    }

  }

  get(x, y){
    return this.map[x + y * this.width];
  }

  getCharacter(x, y){
    for (let i = 0; i < this.characters.length; i++) {
      let c = this.characters[i];
      if (c.getX() == x && c.getY() == y) {
        return c;
      }
    }
    return;
  }

  /*
    そもそもマップとして移動可能か?
  */
  movableAsMap(x, y){
    switch(this.get(x, y)){
    case MAP_WALL:
      return false;
    }
    return true;
  }

  /*
    キャラクタや壁などが存在するか？
  */
  assignable(x, y){
    if (!this.movableAsMap(x, y)) {
      return false;
    }
    for (let i = 0; i < this.characters.length; i++) {
      let c = this.characters[i];
      if (c.getX() == x && c.getY() == y) return false;
    }
    return true;
  }

  getCharacters(){
    return this.characters;
  }

  addCharacter(character){
    let x, y;
    do {
      x = Math.floor(Math.random() * this.width);
      y = Math.floor(Math.random() * this.height);
    } while(!this.assignable(x, y));
    character.x = x;
    character.y = y;
//    character.force_move(x, y);
    console.log("addchar x = " + x + ", y=" + y);
    this.characters.push(character);
  }

  assignStair(){
    let x, y;
    do {
      x = Math.floor(Math.random() * this.width);
      y = Math.floor(Math.random() * this.height);
    } while(!this.movableAsMap(x, y));
    this.stair_x = x;
    this.stair_y = y;
  }

  removeCharacter(character){
    let i = this.characters.indexOf(character);
    this.characters.splice(i, 1);
  }

  stair(){
    if (this.stair_x == gPlayer.getX() && this.stair_y == gPlayer.getY()) {
      this.downstair(this.floor + 1);
    }
  }

  downstair(){
    gDungeon = new Dungeon(this.width, this.height, this.floor + 1);
    gDungeon.addCharacter(gPlayer);
  }

  assignEnemies(){
    for(let i = 0; i < 8; i++){
      this.addCharacter(this.newEnemy());
    }
  }

  update(){
    for (let i = 0; i < this.characters.length; i++) {
      let c = this.characters[i];
      c.update();
    }
//    this.setMessage("");
    if(this.characters.length < 5 && Math.floor(Math.random() * 15) == 0) {
      let new_enemy = this.newEnemy();
      if (Math.abs(new_enemy.getX() - gPlayer.getX()) < MAP_WIDTH / 2 + 1 &&
          Math.abs(new_enemy.getY() - gPlayer.getY()) < MAP_HEIGHT / 2 + 1) {
            this.removeCharacter(newEnemy);
      }
    }
  }
  setMessage(message){
    this.message = message;
  }
  getMessage(){
    return this.message;
  }

  getFloor(){
    return this.floor;
  }

  newEnemy(){
    let floor_score = Math.floor(this.floor + Math.sqrt(Math.random()*(this.floor*6)));
    switch(floor_score){
    case 1:
    case 4:
    case 6:
      return new Zourimushi(this);
    case 2:
    case 7:
      return new Mijinko(this);
    case 3:
    case 9:
      return new Ika(this);
    case 5:
    case 8:
    case 11:
      return new Maeda(this);
    case 14:
    case 16:
    case 19:
      return new Mori(this);
    case 12:
    case 15:
    case 20:
      return new Namba(this);
      */
    default:
      return new Zourimushi(this);
    }
  }
}
