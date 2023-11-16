
function handleCollision(Enemy) {
  Player.health -= Enemy.radius;
  if (Player.health <= 0) {
    Player.health = 0;
    console.log("Player is defeated!");
    gameOver = true; // Set game over to true
  } else {
    interacted = true;
  }
}


function StaticCollisionCheck(Enemy) {
  for (let i = Statics.length - 1; i >= 0; i--) {
    Static = Statics[i];
    if (
      Enemy.x + Enemy.radius > Static.x &&
      Enemy.x - Enemy.radius < Static.x + Static.w &&
      Enemy.y + Enemy.radius > Static.y &&
      Enemy.y - Enemy.radius < Static.y + Static.h
    ) {
      //if colliding
      if(Enemy.y > Static.y && Enemy.y < Static.y+Static.h){
        //if between top and bottom of rectangle
        if(Enemy.x > Static.x+Static.w/2){
          Enemy.x += (Static.x + Static.w) - (Enemy.x - Enemy.radius)
        }
        else{
          Enemy.x += (Static.x) - (Enemy.x + Enemy.radius)
        }
      }
      else if(Enemy.x>Static.x && Enemy.x < Static.x + Static.w){
        //if between left and right of rectangle
        if(Enemy.y > Static.y+Static.h/2){
          Enemy.y += (Static.y + Static.h) - (Enemy.y - Enemy.radius)
        }
        else{
          Enemy.y += (Static.y) - (Enemy.y + Enemy.radius)
        }
      }
     
      else{
        //if colliding at corners
        let dx = Enemy.x - Static.x+Static.w/2;
        let dy = Enemy.y - Static.y + Static.h/2;
        let angle = atan2(dy, dx);
        
        if(Enemy.y < Static.y){
          if(Enemy.x < Static.x+Static.w/2){
            //top left corner
            angle+=180
            d = dist(Enemy.x,Enemy.y,Static.x,Static.y) - Enemy.radius;
            Enemy.x -= d* cos(angle)
            Enemy.y -= d* sin(angle)
          }
          else{
            // top right
            d = dist(Enemy.x,Enemy.y,Static.x+Static.w,Static.y) - Enemy.radius;
            Enemy.x -= d* cos(angle)
            Enemy.y -= d* sin(angle)
          }
        }
        else{
          if(Enemy.x < Static.x+Static.w/2){
            //bottom left corner
            d = dist(Enemy.x,Enemy.y,Static.x,Static.y+Static.h) - Enemy.radius;
            Enemy.x -= d * cos(angle)
            Enemy.y -= d * sin(angle)
          }
          else{
            //bottom right
            d = dist(Enemy.x,Enemy.y,Static.x+Static.w,Static.y+Static.h) - Enemy.radius
            Enemy.x -= d* cos(angle)
            Enemy.y -= d* sin(angle)
            
          }
        }
      }
    }
  }
}


function EnemyCollisionCheck(Enemy, i) {
  for (let j = Enemies.length - 1; j >= 0; j--) {
    Enemy2 = Enemies[j];
    d = dist(Enemy.x, Enemy.y, Enemy2.x, Enemy2.y);
    if (i != j && d < Enemy.radius + Enemy2.radius) {
      let dx = Enemy.x - Enemy2.x;
      let dy = Enemy.y - Enemy2.y;
      let angle = atan2(dy, dx);
      let pen_depth = Enemy2.radius + Enemy.radius - d;
      Enemy.x += cos(angle) * pen_depth;
      Enemy.y += sin(angle) * pen_depth;
    }
  }
}

