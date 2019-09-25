"use strict";


const gFilePlayer = BASE_URL + "img/kawauso.png";
const CHARHEIGHT = 30;
const CHARWIDTH = 30;

class Character {
  dungeon;
  image;
  hp;
  maxhp;
  attackp;
  x;
  y;
  exp = 0;
  charwidth;
  charheight;
  img;
  constructor(dungeon){
    this.dungeon = dungeon;
    this.charwidth = CHARWIDTH;
    this.charheight = CHARHEIGHT;
  }

  getX(){
    return this.x;
  }

  getY(){
    return this.y;
  }

  up(){
    return this.move(2);
//    if (this.dungeon.movable(this.x, this.y - 1)) this.y--;
  }
  down(){
    return this.move(3);
//    if (this.dungeon.movable(this.x, this.y + 1)) this.y++;
  }
  left(){
    return this.move(0);
//    if (this.dungeon.movable(this.x - 1, this.y)) this.x--;
  }
  right(){
    return this.move(1);
//    if (this.dungeon.movable(this.x + 1, this.y)) this.x++;
  }

  move(direction){
    let new_x = this.getX();
    let new_y = this.getY();
    if (direction < 0) {
      direction = Math.floor(Math.random() * 6);
    }
    console.log("newx, newy, direction = " + new_x + ", " + new_y + ", " + direction);
    switch(direction){
    case 0: // left
      new_x--;
//      this.left();
      break;
    case 1: // right
      new_x++;
//      this.right();
      break;
    case 2: // up
      new_y--;
//      this.up();
      break;
    case 3: // down
      new_y++;
//      this.down();
      break;
    default: // not move
      return false;
    }
    let character = gDungeon.getCharacter(new_x, new_y);
    if (character != null && this.isEnemy(character)) {
      this.attack(character);
    } else if (character != null) {
      return false;
    } else if(gDungeon.movableAsMap(new_x, new_y)){
      this.x = new_x;
      this.y = new_y;
    } else {
      return false;
    }
    return true;
  }

  isEnemy(){
    return false;
  }

  attack(enemy){
    let this_attack_point = Math.floor(this.attackp * (Math.random(1.4)+0.4));
    console.log(this.name() + "は" + enemy.name() + "に" + this_attack_point + "のダメージを与えた");
    gDungeon.setMessage(this.name() + "は" + enemy.name() + "に" + this_attack_point + "のダメージを与えた");
    enemy.damage(this_attack_point);
  }

  damage(attack_point){
    if (Math.floor(this.hp) < attack_point) {
      this.hp = 0;
      this.die();
    } else {
      this.hp -= attack_point;
    }
  }

  update(){
    let enemy_direction = this.findEnemy();
    console.log("enemy_direction = " + enemy_direction);
    this.move(enemy_direction);
  }

  findEnemy(){
    let diffx = gPlayer.getX() - this.getX();
    let diffy = gPlayer.getY() - this.getY();
    if (Math.abs(diffx) >= MAP_WIDTH/2 || Math.abs(diffy) >= MAP_HEIGHT/2) {
      console.log("too far");
      return -1;
    } else {
      console.log("start tracing..." + diffx + "," + diffy + "," + this.getX() + "," + this.getY());
      return this.trace(this.getX(), this.getY(), 0);
    }
  }

  trace(char_x, char_y, count){
//    console.log("trace count = " + count);
    if (count > 7 ||
        !this.dungeon.movableAsMap(char_x, char_y)) {
        return -1;
    }
    if (char_x == gPlayer.getX() && char_y == gPlayer.getY()) {
      console.log("FIND!!! " + char_x + ", " + char_y);
      return count;
    }
    let step_right  = this.trace(char_x - 1, char_y, count + 1);
    let step_left   = this.trace(char_x + 1, char_y, count + 1);
    let step_up     = this.trace(char_x, char_y - 1, count + 1);
    let step_down   = this.trace(char_x, char_y + 1, count + 1);
//    console.log("count, r,l,u,d=" + count + ", " + step_right + "," + step_left + "," + step_up + "," + step_down);
    if (count == 0) { // the 1st step(return the direction)
      let direction = 0; // 0: right, 1: left, 2: up, 3: down
      let shortest = 100000;
      if (shortest > step_right && step_right >= 0) {
        shortest = step_right;
        direction = 0;
      }
      if (shortest > step_left && step_left >= 0) {
        shortest = step_left;
        direction = 1;
      }
      if (shortest > step_up && step_up >= 0) {
        shortest = step_up;
        direction = 2;
      }
      if (shortest > step_down && step_down >= 0) {
        shortest = step_down;
        direction = 3;
      }
      console.log("shortest,direction = " + shortest + ", " + direction);
      if (shortest < 0 || shortest > 10000) { // not found
        return -1;
      } else {
        return direction;
      }
    } else { // the 2nd or the step after 2nd step (return true or false)
      /*
      return Math.min([step_right, step_left, step_up, step_down, 1000000].filter(function(item){
        return item >= 0;
      }));
      */
      let shortest = 100000;
      if (shortest > step_right && step_right >= 0) {
        shortest = step_right;
      }
      if (shortest > step_left && step_left >= 0) {
        shortest = step_left;
      }
      if (shortest > step_up && step_up >= 0) {
        shortest = step_up;
      }
      if (shortest > step_down && step_down >= 0) {
        shortest = step_down;
      }
      if (shortest > 10000) { // not found
        return -1;
      } else {
        return shortest; // return the shortest step count
      }
//      return Math.min(step_right, step_left, step_up, step_down);
    }
  }

  setDungeon(dungeon){
    this.dungeon = dungeon;
  }

  name(){
    return "名無しさん";
  }

  getHP(){
    return Math.floor(this.hp);
  }
  getMaxHP(){
    return this.maxhp;
  }
  getLevel(){
    return this.level;
  }
  getAttachP(){
    return this.attackp;
  }
  getExp(){
    return this.exp;
  }

}

class Player extends Character{
  level = 1;
  attackp = 5;
  hp = 15;
  maxhp = 15;

  constructor(dungeon){
    super(dungeon);
    this.img = new Image();
    this.img.src = gFilePlayer;
  }

  draw(g, px, py, map_width, map_height){
    g.drawImage(this.img, 0, 0, this.charwidth, this.charheight,
                map_width / 2 - this.charwidth / 2, map_height / 2 - this.charheight,
                this.charwidth, this.charheight);
  }

  update(){
    this.takeRest();
    if (this.level < 30 &&
        this.exp > this.level*this.level*this.level+3*this.level*this.level) {
        this.levelUp();
    }
  }

  levelUp(){
    this.level++;
    this.attackp += 1 + Math.floor(Math.random(Math.random()*2));
    let up = Math.floor(this.maxhp * 0.1 + 2);
    this.maxhp += up;
    this.hp += up;
  }

  damage(attack_point){
    super.damage(attack_point);
    console.log(this.name() + "は" + attack_point + "のダメージを受けた");
  }

  die(){
    alert("rest in peace");
    initialize(1);
  }

  isEnemy(character){
    return character != gPlayer;
  }

  name(){
    return "あなた";
  }

  attack(enemy){
    super.attack(enemy);
    if (enemy.getHP() == 0) {
      this.exp += enemy.getExp();
    }
  }

  takeRest(){
    this.hp += this.maxhp/120;
    if(this.maxhp < this.hp){
      this.hp = this.maxhp;
    }
  }
}

class Enemy extends Character{
  attackp = 3;
  hp = 10;
  maxhp = 10;
  exp = 1;
  constructor(dungeon){
    super(dungeon);
  }

  draw(g, px, py, map_width, map_height){
//    console.log("enemy img.src=" + this.img.src + " x=" + this.x + " y=" + this.y);
    let dx = this.x - px;
    let dy = this.y - py;
    g.drawImage(this.img, 0, 0, this.charwidth, this.charheight,
                dx * TILESIZE + map_width / 2 - this.charwidth / 2,
                dy * TILESIZE + map_height / 2 - this.charheight,
                this.charwidth, this.charheight);
  }

  isEnemy(character){
    return character == gPlayer;
  }

  damage(attack_point){
    super.damage(attack_point);
    console.log(this.name() + "は" + attack_point + "のダメージを受けた");
  }

  die(){
    this.dungeon.removeCharacter(this);
  }

}


class Mijinko extends Enemy{
  attackp = 4;
  hp = 10;
  maxhp = 10;
  exp = 2;
  constructor(dungeon){
    super(dungeon);
    this.img = new Image();
    this.img.src = BASE_URL + "img/mijinko_trans.png";
  }

  name(){
    return "ミジンコ";
  }

}

class Zourimushi extends Enemy{
  attackp = 2;
  hp = 8;
  maxhp = 8;
  exp = 1;
  constructor(dungeon){
    super(dungeon);
    this.img = new Image();
    this.img.src = BASE_URL + "img/zourimushi.png";
  }

  name(){
    return "ゾウリムシ";
  }

}

class Ika extends Enemy{
  attackp = 5;
  hp = 14;
  maxhp = 14;
  exp = 3;
  constructor(dungeon){
    super(dungeon);
    this.img = new Image();
    this.img.src = BASE_URL + "img/mitsuo.png";
  }

  name(){
    return "みつを";
  }

}

class Maeda extends Enemy{
  attackp = 4;
  hp = 20;
  maxhp = 20;
  exp = 4;
  constructor(dungeon){
    super(dungeon);
    this.img = new Image();
    this.img.src = BASE_URL + "img/maeda.jpg";
  }

  name(){
    return "まえだ";
  }

}

class Moriyasu extends Enemy{
  attackp = 40;
  hp = 120;
  maxhp = 120;
  exp = 200;
  constructor(dungeon){
    super(dungeon);
    this.img = new Image();
    this.img.src = BASE_URL + "img/moriyasu.png";
  }

  name(){
    return "CEO";
  }
}

class Namba extends Enemy{
  attackp = 50;
  hp = 140;
  maxhp = 140;
  exp = 300;
  constructor(dungeon){
    super(dungeon);
    this.img = new Image();
    this.img.src = BASE_URL + "img/namba.png";
  }

  name(){
    return "会長";
  }

}
