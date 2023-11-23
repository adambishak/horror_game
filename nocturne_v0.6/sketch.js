// BUILT WITH P5JS
let playerHealth = 100;
class PlayerClass {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.light_radius = 300;
    this.speed = 1;
    this.bearing = "right";
    this.isMoving = false;
    this.health = playerHealth; //pushed health to variable
  }
  display() {
    push();
    fill(170);
    circle(this.x, this.y, this.radius * 2);
    push();
    translate(this.x, this.y);
    rotate(atan2(mouseY - this.y, mouseX - this.x));
    stroke(255);
    strokeWeight(5)
    line(0, 0, 20, 0);
    pop();
    for (let i = 0; i < 5; i++) {
      push();
      clip(
        () => {
          circle(
            this.x,
            this.y,
            this.light_radius * 2 - (i * this.light_radius) / 5
          );
        },
        { invert: true }
      );
      fill(0, 0, 0, 125);
      rect(0, 0, width, height);
      pop();
    }
    pop();
  }
  update() {
    this.isMoving = false; // Set isMoving to false by default

    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { // 65 is the ASCII code for 'A'
      this.x -= this.speed;
      this.bearing = "left";
      this.isMoving = true; // Set isMoving to true when moving left
    }
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { // 68 is the ASCII code for 'D'
      this.x += this.speed;
      this.bearing = "right";
      this.isMoving = true; // Set isMoving to true when moving right
    }
    if (keyIsDown(UP_ARROW) || keyIsDown(87)) { // 87 is the ASCII code for 'W'
      this.y -= this.speed;
      this.isMoving = true; // Set isMoving to true when moving up
    }
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) { // 83 is the ASCII code for 'S'
      this.y += this.speed;
      this.isMoving = true; // Set isMoving to true when moving down
    }
  }
}

function preload() {
  playerSprite = loadImage('./assets/player.png');
  enemySprite = loadImage('./assets/enemy.png');
  bgImage = loadImage("./assets/bg.png");

  // Load the grass assets
  grassAssets.push(loadImage('./assets/grass1.png'));
  grassAssets.push(loadImage('./assets/grass2.png'));
  grassAssets.push(loadImage('./assets/grass3.png'));
  grassAssets.push(loadImage('./assets/grass4.png'));
}

let Player = new PlayerClass(400, 400);
function setup() {
  let Static = new StaticClass(100, 100, 20, 30);
  Statics.push(Static);

  bgImage.resize(bgImage.width / 2, bgImage.height / 2); // Scale down the bgImage by 50%

  createCanvas(800, 800);
  noStroke();
  angleMode(DEGREES);
  shotSound = loadSound("./assets/shot1.wav");
  shotWhiz = loadSound("./assets/shot1whiz.wav");
  shotShell = loadSound("./assets/shot1shell.wav");
  shotImpact = loadSound("./assets/shot1impact.wav");

  for (let i = 0; i < grassAssets.length; i++) {
    for (let j = 0; j < 2; j++) {
      let x = random(width);
      let y = random(height);
      grassObjects.push({ img: grassAssets[i], x: x, y: y });
    }
  }
}

function draw() {
  if (!gameOver) {
    //put normal code that runs during game here!!
  
    // Draw the background image and tile it seamlessly
    for (let x = 0; x < width; x += bgImage.width) {
      for (let y = 0; y < height; y += bgImage.height) {
        image(bgImage, x, y);
      }
    }
    // Draw the grass objects
    for (let i = 0; i < grassObjects.length; i++) {
      let grass = grassObjects[i];
      image(grass.img, grass.x, grass.y, grass.img.width * 0.15, grass.img.height * 0.15);
    }

    Player.update();
    updateRotation(); // rotation animation
    StaticCollisionCheck(Player);
    // Update and display enemies
    for (let i = Enemies.length - 1; i >= 0; i--) {
      let Enemy = Enemies[i];
      Enemy.update(Player);
      
      EnemyCollisionCheck(Enemy, i);
      StaticCollisionCheck(Enemy);

      // Check for collision with player
      if (
        dist(Player.x, Player.y, Enemy.x, Enemy.y) <
        Player.radius + Enemy.radius
      ) {
        handleCollision(Enemy);
        Enemies.splice(i, 1);
      }
      Enemy.display();

      // Render enemy sprite with radius tied to enemy radius
      image(enemySprite, Enemy.x - Enemy.radius, Enemy.y - Enemy.radius, Enemy.radius * 2, Enemy.radius * 2);

      // START OF DIALOG TEST - CODE NON-ESSENTIAL!
      keyTyped = function () {
        if (key === "k" || key === "K") {
          openDialog("This is a test!");
        }
      };
      // END OF DIALOG TEST - CODE NON-ESSENTIAL!
    }

    for (let i = Statics.length - 1; i >= 0; i--) {
      Static = Statics[i];
      Static.display();
    }
    Player.display();

    // Render player sprite
    if (Player.bearing === "right") {
      push();
      scale(-1, 1);
      rotate(rotationAngle);
      image(playerSprite, -Player.x-(40/2), Player.y-(60/2), 40 ,60);
      pop();
    } else {
      push();
      rotate(rotationAngle);
      image(playerSprite, Player.x-(40/2), Player.y-(60/2), 40 ,60);
      pop();
    }

    // Spawn enemies randomly
    EnemySpawnTimer -= Enemy_spawn_rate * deltaTime;
    if (EnemySpawnTimer <= 0) {
      spawnEnemy();
      EnemySpawnTimer = random(2, 10) * 60; // 2-10 seconds
    }
    
    for (let i = Projectiles.length - 1; i >= 0; i--){
      Projectile = Projectiles[i]
      Projectile.update();
      Projectile.display();
    }
    
    // Draw health bar and display player's health, drawn last to be on top
    drawHealthBar();
    displayPlayerHealth();

    drawSanityBar();
    displayPlayerSanity();
  }
  if (gameOver) {
    // Game is over, display game over screen
    displayGameOverScreen();
  }
  if (gamePaused) {
    // Game is paused, display dialog screen
    displayDialogScreen(dialogText);
  }
}

// Update the rotation angle based on current time
function updateRotation() {
  if (Player.isMoving) { // Only rotate if the player is moving
    if (floor(millis() / 170) % 2 === 0) {
      rotationAngle = radians(0); // Adjust this value to get the desired effect
    } else {
      rotationAngle = radians(-20); // Adjust this value to get the desired effect
    }
  } else {
    rotationAngle = 0;
  }
}