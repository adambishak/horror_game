let Enemies = [];
let EnemySpawnTimer = 0;
//The higher, the quicker the spawn rate. a range of (0,1] seems to be sufficient 
let Enemy_spawn_rate = 0.1;
let insanity = 0;

class PlayerClass {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.light_radius = 500;
    this.speed = 5;
    this.health = 100;
  }
  display(){
    push()
    fill(170);
    circle(this.x, this.y, this.radius*2);
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
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.speed = 2;
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
    pop()
  }
}

function setup() {
  createCanvas(1400, 600);
  noStroke()
}



function draw() {
  background(255, 202, 145);
  Player.update()
  if(Player.light_radius >= 0){
    insanity += 0.0001 * deltaTime
    Player.light_radius -= insanity
  }
  // Update and display enemies
  for (let i = Enemies.length - 1; i >= 0; i--) {
    let Enemy = Enemies[i];
    Enemy.update(Player);
    EnemyCollisionCheck(Enemy,i)

    // Check for collision with player
    if (dist(Player.x, Player.y, Enemy.x, Enemy.y) < Player.radius + Enemy.radius) {
      handleCollision(Enemy);
      Enemies.splice(i, 1);
    }
    Enemy.display();
  }
  Player.display()

  // Spawn enemies randomly
  EnemySpawnTimer -= Enemy_spawn_rate * deltaTime;
  if (EnemySpawnTimer <= 0) {
    spawnEnemy();
    EnemySpawnTimer = random(2, 10) * 60; // 2-10 seconds
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
  let side = random(4); // 0: top, 1: right, 2: bottom, 3: left
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

  let Enemy = new EnemyClass(x, y);
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
