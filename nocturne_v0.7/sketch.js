// BUILT WITH P5JS
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
let Checkpoint = new StaticClass(400, 400, 20, 30);
Statics.push(Checkpoint);

function setup() {

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
  if (levelNumber == 3 && gameOver === false && gamePaused === false && mainMenu === false) {
    if (!levelDialogShown) {
      levelDialogShown = true;
      openDialog(level.levelDialog[levelNumber]);
      gameWon = true;
    }
    displayWinningScreen();
    keyPressed = function() {
      resetGame();
    }
  }

  if (mainMenu) {
    // Game is paused, display menu screen
    displayMainMenu();
    noLoop();
  } else if (!levelDialogShown) {
    // Game is not paused, display level dialog
    openDialog(level.levelDialog[levelNumber]);
    levelDialogShown = true;
  }

  if (gameOver === false && gamePaused === false && mainMenu === false && gameWon === false) {
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
    checkpointDistance();
    highlightCheckpoint();
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
    }
    Checkpoint.display();
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

    displayScore();

    updateSanityRadius()

    sanityCheck();
    hasEnoughScore()

  }
  if (gameOver) {
    // Game is over, display game over screen
    displayGameOverScreen();
  
    keyPressed = function() {
      resetGame();
    }
  }
  if (gamePaused) {
    // Game is paused, display dialog screen
    displayDialogScreen(dialogText);
  }
}