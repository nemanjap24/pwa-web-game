let posX = 200;
let posY = 200;

// Velocity variables
let velocityX = 0;
let velocityY = 0;

// Acceleration and friction constants
const ACCELERATION = 0.5;
const MAX_SPEED = 10;
const FRICTION = 0.95;

// Object to track which keys are currently pressed
let keys = {};

function setup() {
  // Creates canvas with dimensions of the window
  createCanvas(windowWidth/2, windowHeight/2);
  
  // Add event listeners for keyPressed and keyReleased
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
}

// Refreshes 60 times per second
function draw() {
  // Clear the background
  background("#9dacff");
  
  // Apply acceleration based on key presses
  if (keys['w']) {
    velocityY -= ACCELERATION;
  }
  if (keys['a']) {
    velocityX -= ACCELERATION;
  }
  if (keys['s']) {
    velocityY += ACCELERATION;
  }
  if (keys['d']) {
    velocityX += ACCELERATION;
  }
  
  // Limit maximum speed
  velocityX = constrain(velocityX, -MAX_SPEED, MAX_SPEED);
  velocityY = constrain(velocityY, -MAX_SPEED, MAX_SPEED);
  
  // Apply friction to slow down
  velocityX *= FRICTION;
  velocityY *= FRICTION;
  
  // Update position based on velocity
  posX += velocityX;
  posY += velocityY;
  
  // Optional: Keep circle within canvas
  posX = constrain(posX, 0, width);
  posY = constrain(posY, 0, height);
  
  // Draw the circle
  circle(posX, posY, 100);
}

// Handle key down events
function handleKeyDown(event) {
  // Convert the key to lowercase to handle both lowercase and uppercase
  keys[event.key.toLowerCase()] = true;
}

// Handle key up events
function handleKeyUp(event) {
  // Remove the key from the pressed keys
  keys[event.key.toLowerCase()] = false;
}