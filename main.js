//creating enemy object
class Enemy {
  constructor(x_pos, y_pos, size) {
    this.x_pos = x_pos;
    this.y_pos = y_pos;
    this.is_alive = true;
    this.size = size;
  
  }
}

//inializing enemies then
//holding all enemies in a list so it can be easily iterated through


//storing player info

let player_size = 20
let player_alive = true

let enemy_list = []
const enemy_1 = new Enemy(0,0,10)
const enemy_2 = new Enemy(0,0,10)
const enemy_3 = new Enemy(0,0,10)
const enemy_4 = new Enemy(0,0,10)
const enemy_5 = new Enemy(0,0,10)
enemy_list.push(enemy_1)
enemy_list.push(enemy_2)
enemy_list.push(enemy_3)
enemy_list.push(enemy_4)
enemy_list.push(enemy_5)




function setup() {
  createCanvas(400, 400)
  //storing autoscroll info
  yPos = height/2
  xPos = width/2
  angleMode(DEGREES)
  for(i = 0; i < enemy_list.length; i++){
      x = random(0,400)
      y = random(0,400)
      enemy_list[i].x_pos = x
      enemy_list[i].y_pos = y
    }
}


function draw() {
  if(player_alive){
    
    background(220)
    autoscroller()
    enemyUpdate()
    //render the player at the center of the screen
    circle(width/2,height/2,player_size)
  }
  else{
    background(255,0,0)
    textAlign(CENTER)
    textSize(65)
    textFont('Courier New')
    text('Game Over', width/2, height/2)
    rect(width/2-50,height/2+50,100,30)
    textSize(20)
    text('Again?', width/2, height/2+65)
    if(mouseX > width/2-50 && mouseX < width/2+50 && mouseY > height/2+50 && mouseY < height/2+80 && mouseIsPressed){
      player_alive = true
      for(i = 0; i < enemy_list.length; i++){
      x = random(0,400)
      y = random(0,400)
      enemy_list[i].x_pos = x
      enemy_list[i].y_pos = y
      enemy_list[i].is_alive = true
    }
    }
    
  }
}


function autoscroller(){
  //y scroll
  
  if(yPos > 0|| yPos < 400 || xPos > 0 || xPos < 400){
    if(keyIsDown(DOWN_ARROW)){
      yPos -= 2
    }
    if(keyIsDown(UP_ARROW)){
      yPos += 2
    }

    for(let i = 0; i < 6; i++ ){
      line(0,yPos + i*50,width,yPos + i*50)
      line(0,yPos + i*-50,width,yPos + i*-50)
    }
    if(yPos <= (height/2)-50 || yPos >= (height/2)+50){
      yPos = height/2
    }

    //x scroll
    if(keyIsDown(RIGHT_ARROW)){
      xPos -= 2
    }
    if(keyIsDown(LEFT_ARROW)){
      xPos += 2
    }
    for(let i = 0; i < 6; i++ ){
      line(xPos + i*50,0,xPos + i*50, height)
      line(xPos + -i*50,0,xPos + -i*50, height)
    }
    if(xPos <= 150 || xPos >= 250){
      xPos = width/2
    }
  }
}

function enemyUpdate(){
  for (i = 0; i < enemy_list.length; i++){
    enemy = enemy_list[i]
    if(enemy.is_alive){
      //if the enemy is alive check all inputs to move it accordingly
      if(keyIsDown(RIGHT_ARROW)){
        enemy.x_pos -= 2
      }
      if(keyIsDown(LEFT_ARROW)){
        enemy.x_pos += 2
      }
       if(keyIsDown(UP_ARROW)){
        enemy.y_pos += 2
      }
      if(keyIsDown(DOWN_ARROW)){
        enemy.y_pos -= 2
      }
      
      //movement ai
      //might be better to use atan2
      let vector1 = createVector(enemy.x_pos-width/2,enemy.y_pos-height/2)
      let vector2 = createVector(0,50)
      let angle1 = vector1.angleBetween(vector2)
      enemy.x_pos -= sin(angle1)
      enemy.y_pos -= cos(angle1)
      
      //collision checker, 
      if(enemy.x_pos >= width/2 - player_size/2 && enemy.x_pos <= width/2 + player_size/2 && enemy.y_pos >= height/2 - player_size/2 && enemy.y_pos <= height/2 + player_size/2){
        console.log("collision")
        if(enemy.size < player_size){
          enemy.is_alive = false
          player_alive = false
        }
      }
      circle(enemy.x_pos,enemy.y_pos,enemy.size)
    }
  }
}
