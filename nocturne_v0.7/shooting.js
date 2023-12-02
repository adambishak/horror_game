function mouseClicked() {
  if (!gamePaused && !gameOver && !mainMenu) {
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
        Enemy.radius -= 4;
        
        if (Enemy.radius < 10) { // Change the condition to check if radius is less than 1
          Enemy.radius =10; // Set the radius to 1 if it goes below 1
        }
        if (Enemy.radius <= 10) {
          Enemies.splice(i, 1);
          score += 4;
        }
      }
    }
    if (shot_miss) {
      //play miss effect
      shotWhiz.play(0.3, 1, 10);
      sanity -= level.sanityPenalty[levelNumber];
    } else {
      //play hit
      shotImpact.play(0.3, 1, 10);
    }
  }
}