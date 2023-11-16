function mouseClicked() {
  shotSound.play();
  shotShell.play();
  let dx = Player.x - mouseX;
  let dy = Player.y - mouseY;
  let angle_of_shot = atan2(dy, dx);
  let shot_miss = true;
  let Projectile = new ProjectileClass(Player.x,Player.y,angle_of_shot)
  Projectiles.push(Projectile)
  for (let i = Enemies.length - 1; i >= 0; i--) {
    let Enemy = Enemies[i];
    let dx = Player.x - Enemy.x;
    let dy = Player.y - Enemy.y;
    let angle_to_enemy = atan2(dy, dx);
    let theta =
      (360 * Enemy.radius) /
      (2 * PI * dist(Player.x, Player.y, Enemy.x, Enemy.y));
    if (
      angle_of_shot > angle_to_enemy - theta &&
      angle_of_shot < angle_to_enemy + theta
    ) {
      shot_miss = false;
      Enemy.radius -= 2;
      if (Enemy.radius <= 5) {
        Enemies.splice(i, 1);
      }
    }
  }
  if (shot_miss) {
    //play miss effect
    shotWhiz.play(0.3, 1, 10);
  } else {
    //play hit
    shotImpact.play(0.3, 1, 10);
    interacted = true;
  }

  if (gameOver) {
    // Reset the game and variables
    Player.health = playerHealth;
    Enemies = [];
    gameOver = false;
    loop(); // Restart the game loop
  }

  if (gamePaused) {
    gamePaused = false;
    loop(); // Resume the game loop
  }
}
