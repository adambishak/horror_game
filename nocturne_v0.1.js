let playerX, playerY;
const playerSpeed = 3;
const borderOffset = 20;
let xDirection = 0;
let yDirection = 0;
let playerRadius = 15;
let playerHealth = 100;
let enemies = [];
let enemySpeed = 2;
let enemySpawnTimer = 0;

function setup() {
  createCanvas(700, 700);
  //initial player position
  playerX = width / 2;
  playerY = height / 2;
}

function draw() {
  background('lightyellow');
  // Draw the player at the current position
  fill('white');
  strokeWeight(2);
  ellipse(playerX, playerY, 30, 30);
  
  // Update the player's position
  playerX = constrain(playerX + xDirection, borderOffset, width - borderOffset);
  playerY = constrain(playerY + yDirection, borderOffset, height - borderOffset);

  // Update and display enemies
  for (let i = enemies.length - 1; i >= 0; i--) {
    let enemy = enemies[i];
    enemy.move();
    enemy.display();

    // Check for collision with player
    let d = dist(playerX, playerY, enemy.x, enemy.y);
    if (d < playerRadius + enemy.radius) {
      handleCollision(enemy);
      enemies.splice(i, 1);
    }
  }

  // Spawn enemies randomly
  enemySpawnTimer -= 1;
  if (enemySpawnTimer <= 0) {
    spawnEnemy();
    enemySpawnTimer = floor(random(2, 10) * 60); // 2-10 seconds
  }
  
  fill(0,0,0,0);
  strokeWeight(900);
  circle(playerX,playerY, 1200)
}

function keyPressed() {
  if (key === 'A' || key === 'a' || keyCode === LEFT_ARROW) {
    // Move left
    xDirection = -playerSpeed;
  } else if (key === 'D' || key === 'd' || keyCode === RIGHT_ARROW) {
    // Move right
    xDirection = playerSpeed;
  } else if (key === 'W' || key === 'w' || keyCode === UP_ARROW) {
    // Move up
    yDirection = -playerSpeed;
  } else if (key === 'S' || key === 's' || keyCode === DOWN_ARROW) {
    // Move down
    yDirection = playerSpeed;
  }
}

function keyReleased() {
  if (
    (key === 'A' || key === 'a' || keyCode === LEFT_ARROW) &&
    xDirection === -playerSpeed
  ) {
    xDirection = 0;
  } else if (
    (key === 'D' || key === 'd' || keyCode === RIGHT_ARROW) &&
    xDirection === playerSpeed
  ) {
    xDirection = 0;
  } else if (
    (key === 'W' || key === 'w' || keyCode === UP_ARROW) &&
    yDirection === -playerSpeed
  ) {
    yDirection = 0;
  } else if (
    (key === 'S' || key === 's' || keyCode === DOWN_ARROW) &&
    yDirection === playerSpeed
  ) {
    yDirection = 0;
  }
}
function spawnEnemy() {
  let side = floor(random(4)); // 0: top, 1: right, 2: bottom, 3: left
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

  let enemy = new Enemy(x, y);
  enemies.push(enemy);
}

function handleCollision(enemy) {
  playerHealth -= 10;
  if (playerHealth <= 0) {
    playerHealth = 0;
    console.log("Player is defeated!");
    noLoop();
  }
}

class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 10;
  }

  move() {
    let dx = playerX - this.x;
    let dy = playerY - this.y;
    let angle = atan2(dy, dx);
    this.x += cos(angle) * enemySpeed;
    this.y += sin(angle) * enemySpeed;
  }

  display() {
    fill(255, 0, 0);
    ellipse(this.x, this.y, this.radius * 2);
  }
}