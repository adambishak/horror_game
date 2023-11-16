let playerHealth = 100;
class PlayerClass {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.light_radius = 300;
    this.speed = 1;
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
    if (keyIsDown(LEFT_ARROW)) {
      this.x += -this.speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
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

let Player = new PlayerClass(200, 200);
function setup() {
  let Static = new StaticClass(100, 100, 20, 30);
  Statics.push(Static);

  createCanvas(400, 400);
  noStroke();
  angleMode(DEGREES);
  shotSound = loadSound("./shot1.wav");
  shotWhiz = loadSound("./shot1whiz.wav");
  shotShell = loadSound("./shot1shell.wav");
  shotImpact = loadSound("./shot1impact.wav");
  //EnemyImg = loadImage("./character_sprite_small.png");
  lastInteractionTime = millis(); // Initialize the lastInteractionTime
}


function draw() {
  if (!gameOver) {
    //put normal code that runs during game here!!
    background(255, 202, 145);
    Player.update();
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

      // START OF DIALOG TEST - CODE NON-ESSENTIAL!
      keyTyped = function () {
        if (key === "d" || key === "D") {
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

    // If the player has interacted with an enemy, update the lastInteractionTime
    if (interacted) {
      lastInteractionTime = millis();
    } else {
      // If the player hasn't interacted for more than 10 seconds, decrease sanity
      if (millis() - lastInteractionTime > 10000 && sanity > 0) {
        sanity -= 5;
      }
    }

    // Draw health bar and display player's health, drawn last to be on top
    drawHealthBar();
    displayPlayerHealth();

    drawSanityBar();
    displayPlayerSanity();
  } else {
    // Game is over, display game over screen
    displayGameOverScreen();
  }

  if (gamePaused) {
    // Game is paused, display dialog screen
    displayDialogScreen(dialogText);
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
  let radius = random(6, 40);
  radius = floor(radius);
  let Enemy = new EnemyClass(x, y, radius);
  Enemies.push(Enemy);
}

