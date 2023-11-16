
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
let lastInteractionTime; // Initialize the time of the last interaction
let interacted = false;