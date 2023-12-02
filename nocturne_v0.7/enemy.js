class ProjectileClass{
  constructor(x,y,angle){
    this.x = x;
    this.y = y;
    this.angle = angle + 180;
  }
  
  update(){
    this.x += cos(this.angle) * 20
    this.y += sin(this.angle) * 20
  }
  display(){
    push()
    translate(this.x,this.y)
    stroke(255, 224, 138)
    strokeWeight(3)
    rotate(this.angle)
    line(0,0,30,0)
    pop()
  }
}

class StaticClass {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  display() {
    rect(this.x, this.y, this.w, this.h);
  }
}

class EnemyClass {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = level.enemySpeed[levelNumber]; // Set enemy speed to level 1 speed
  }

  update(Player) {
    let dx = Player.x - this.x;
    let dy = Player.y - this.y;
    let angle = atan2(dy, dx);
    this.x += cos(angle) * this.speed;
    this.y += sin(angle) * this.speed;
  }

  display() {
    push();
    fill(255, 0, 0);
//    ellipse(this.x, this.y, this.radius * 2);
    fill(255);
//    text(this.radius - 5, this.x, this.y);
    pop();
  }
}

function spawnEnemy() {
  let side = random(0, 4); // 0: top, 1: right, 2: bottom, 3: left
  side = floor(side);
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
  let radius = random(25, 40);
  radius = floor(radius);
  let Enemy = new EnemyClass(x, y, radius);
  Enemies.push(Enemy);
}