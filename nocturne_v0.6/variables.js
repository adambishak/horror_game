let Enemies = [];
let Statics = [];
let Projectiles = [];
let EnemySpawnTimer = 0;
//The higher, the quicker the spawn rate. a range of (0,1] seems to be sufficient
let Enemy_spawn_rate = 0.7;

let gameOver = false;

let gamePaused = false; //for dialog screen
let dialogText = "";

let sanity = 100; // Initial sanitys value

let rotationAngle = 0; // Initial rotation angle of the player

let grassAssets = []; // Locations of grasses image assets
let grassObjects = []; // Grass objects on screen