let Enemies = [];
let Statics = [];
let EnemySpawnTimer = 0;
//The higher, the quicker the spawn rate. a range of (0,1] seems to be sufficient 
let Enemy_spawn_rate = 0.5;


class StaticClass{
  constructor(x,y,w,h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  display(){
    rect(this.x,this.y,this.w,this.h)
  }
}
let Static = new StaticClass(100,100,20,30)
Statics.push(Static)


class PlayerClass {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.light_radius = 300;
    this.speed = 5;
    this.health = 100;
  }
  display(){
    push()
    fill(170);
    circle(this.x, this.y, this.radius*2);
    push()
    translate(this.x,this.y)
    rotate(atan2(mouseY-this.y,mouseX-this.x))
    stroke(255)
    line(0,0,20,0)
    pop()
    for(let i = 0; i <5; i++){
      push()
      clip(() => {
        circle(this.x,this.y,this.light_radius*2 - i*this.light_radius/5)
      },{ invert: true })
      fill(0,0,0,125)
      rect(0,0,width,height)
      pop()
    }
    pop()
  }
  update(){
    if (keyIsDown(LEFT_ARROW)){
      this.x += -this.speed;
    } 
    if (keyIsDown(RIGHT_ARROW)){
      this.x += this.speed;
    } 
    if (keyIsDown(UP_ARROW)) {
      this.y += -this.speed;
    } 
    if (keyIsDown(DOWN_ARROW)) {
      this.y += this.speed;
    }
  }
}
let Player = new PlayerClass(200,200)

class EnemyClass {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = 0.1;
  }

  update(Player) {
    let dx = Player.x - this.x;
    let dy = Player.y - this.y;
    let angle = atan2(dy, dx);
    this.x += cos(angle) * this.speed;
    this.y += sin(angle) * this.speed;
  }

  display() {
    push()
    fill(255, 0, 0);
    ellipse(this.x, this.y, this.radius * 2);
    fill(255)
    text(this.radius -5,this.x,this.y)
    pop()
  }
}

function mouseClicked(){
  shotSound.play();
  shotShell.play(1);
  let dx = Player.x - mouseX;
  let dy = Player.y - mouseY;
  let angle_of_shot = atan2(dy, dx);
  let shot_miss = true
  for (let i = Enemies.length - 1; i >= 0; i--){
    let Enemy = Enemies[i];
    let dx = Player.x - Enemy.x;
    let dy = Player.y - Enemy.y;
    let angle_to_enemy = atan2(dy, dx);
    let theta = (360 * Enemy.radius)/(2*PI*dist(Player.x,Player.y,Enemy.x,Enemy.y))
    if(angle_of_shot > angle_to_enemy - theta && angle_of_shot < angle_to_enemy + theta){
      shot_miss = false
      Enemy.radius -= 2
      if(Enemy.radius <= 5){
        Enemies.splice(i, 1);
      }
    }
  }
  if(shot_miss){
    //play miss effect
    shotWhiz.play(0.3,1,10);
  }
  else{
    //play hit
    shotImpact.play(0.3,1,10);
  }
}



function setup() {
  createCanvas(400, 400);
  noStroke()
  angleMode(DEGREES)
  shotSound = loadSound('./shot1.wav')
  shotWhiz = loadSound('./shot1whiz.wav')
  shotShell = loadSound('./shot1shell.wav')
  shotImpact = loadSound('./shot1impact.wav')
}



function draw() {
  background(255, 202, 145);
  Player.update()
  
  
  // Update and display enemies
  for (let i = Enemies.length - 1; i >= 0; i--) {
    let Enemy = Enemies[i];
    Enemy.update(Player);
    StaticCollisionCheck(Enemy)
    EnemyCollisionCheck(Enemy,i)

    // Check for collision with player
    if (dist(Player.x, Player.y, Enemy.x, Enemy.y) < Player.radius + Enemy.radius) {
      handleCollision(Enemy);
      Enemies.splice(i, 1);
    }
    Enemy.display();
  }
  
  for (let i = Statics.length - 1; i >= 0; i--){
    Static = Statics[i]
    Static.display()
  }
  Player.display()

  // Spawn enemies randomly
  EnemySpawnTimer -= Enemy_spawn_rate * deltaTime;
  if (EnemySpawnTimer <= 0) {
    spawnEnemy();
    EnemySpawnTimer = random(2, 10) * 60; // 2-10 seconds
  }
}
function StaticCollisionCheck(Enemy){
  for (let i = Statics.length - 1; i >= 0; i--){
    Static = Statics[i]
    if(Enemy.x + Enemy.radius > Static.x && Enemy.x - Enemy.radius < Static.x + Static.w && Enemy.y+Enemy.radius > Static.y && Enemy.y -Enemy.radius< Static.y + Static.h){
      if(Enemy.x < Static.x + Static.w){
        Enemy.x -= Enemy.x+Enemy.radius - Static.x
      }
      else{
        Enemy.x += Enemy.x-Enemy.radius - Static.x+Static.w
      }
      //need to fix this code, probably use angle between center of rectangle and center of cirlce to determine side and then do collision resolution appropraitely 
    }
  }
}

function EnemyCollisionCheck(Enemy,i){
    for (let j = Enemies.length - 1; j >= 0; j--) {
      Enemy2 = Enemies[j]
      d = dist(Enemy.x,Enemy.y,Enemy2.x,Enemy2.y)
      if(i != j && d < Enemy.radius + Enemy2.radius){
        let dx = Enemy.x - Enemy2.x;
        let dy = Enemy.y - Enemy2.y;
        let angle = atan2(dy, dx);
        let pen_depth = Enemy2.radius + Enemy.radius - d
        Enemy.x += cos(angle) * pen_depth;
        Enemy.y += sin(angle) * pen_depth;
      }
    }
}

function spawnEnemy() {
  let side = random(0,4); // 0: top, 1: right, 2: bottom, 3: left
  side = floor(side)
  let x, y;

  if (side === 0) {
    x = random(width);
    y = -10;
  } else if (side === 1) {
    x = width + 10;
    y = random(height);
  } else if (side === 2) {
    x = random(width);
    y = height + 10;
  } else {
    x = -10;
    y = random(height);
  }
  let radius = random(5,40)
  radius = floor(radius)
  let Enemy = new EnemyClass(x, y, radius);
  Enemies.push(Enemy);
}

function handleCollision(Enemy) {
  Player.health -= 10;
  if (Player.health <= 0) {
    Player.health = 0;
    console.log("Player is defeated!");
    noLoop();
  }
}
