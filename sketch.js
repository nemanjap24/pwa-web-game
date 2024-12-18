let posX = 200;
let posY = 200;

// object to track which keys are currently pressed
let keys = {};

function setup() {
  //creates canvas with dimensions of the window
  createCanvas(windowWidth, windowHeight);
  
  // event listeners for keyPressed and keyReleased
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
}

// refreshes 60 times per second
function draw() {
  // clear the background
  background("#9dacff");
  
  // checks if the key is pressed 
  // keys['w'] is accessing boolean property W
  if (keys['w'] || keys['arrowup']) {
    posY -= 5;
  }
  if (keys['a'] || keys['arrowleft']) {
    posX -= 5;
  }
  if (keys['s'] || keys['arrowdown']) {
    posY += 5;
  }
  if (keys['d'] || keys['arrowright']) {
    posX += 5;
  }
  
  // draw the circle
  circle(posX, posY, 100);
}

// handle key down events
function handleKeyDown(event) {
  // creates a property for each key if in does not exist and sets it true
  keys[event.key.toLowerCase()] = true;
  console.log(keys);
}

// handle key up events
function handleKeyUp(event) {
  // on realease sets key to false as its no longer pressed
  keys[event.key.toLowerCase()] = false;
  console.log(keys);
}