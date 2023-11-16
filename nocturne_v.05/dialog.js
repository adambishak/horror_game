
function drawHealthBar() {
  noFill();
  stroke(255);
  rect(10, height - 30, 200, 20); // Position and size of the health bar
  fill(255, 0, 0);
  rect(10, height - 30, map(Player.health, 0, playerHealth, 0, 200), 20);
}

function displayPlayerHealth() {
  fill(255);
  textSize(16);
  textAlign(LEFT); // Set text alignment to the left
  text(`Health: ${Player.health}`, 10, height - 40); // Use a fixed x-position
}

function drawSanityBar() {
  noFill();
  stroke(255);
  let barWidth = 200;
  let barHeight = 20;
  let x = width - barWidth - 10; // Position at the bottom-right corner
  let y = height - barHeight - 10; // Position at the bottom-right corner
  rect(x, y, barWidth, barHeight);
  fill(0, 0, 255);
  rect(x, y, map(sanity, 0, 100, 0, barWidth), barHeight);
}

function displayPlayerSanity() {
  fill(255);
  textSize(16);
  textAlign(RIGHT); // Set text alignment to the right
  let x = width - 10; // Position at the bottom-right corner
  let y = height - 40; // Position at the bottom-right corner
  text(`Sanity: ${sanity}`, x, y);
}

function displayGameOverScreen() {
  background(0); // Aesthetics can be altered later
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Game Over", width / 2, height / 2 - 50);
  textSize(20);
  text("Click to restart", width / 2, height / 2 + 50);
}

function displayDialogScreen(dialogText) {
  // Aesthetics can be altered later
  background(0, 150); // Dark overlay
  fill(255);
  textSize(24);
  textAlign(CENTER, CENTER);
  text(dialogText, width / 2, height / 2);
  textSize(16);
  text("Click to continue", width / 2, height / 2 + 40);
}

function openDialog(inputText) {
  //function to call to show dialog text, Aesthetics can be altered later
  gamePaused = true;
  dialogText = inputText;
  noLoop(); // Pause the game loop
}