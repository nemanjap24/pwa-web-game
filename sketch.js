
let ball;
let keys = {};
let orientationData = { alpha: 0, beta: 0, gamma: 0 };
let orientationEnabled = false;
let requestButton;
let isMobile;

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.style('display', 'block');
  
  // Detect mobile more robustly
  isMobile = checkMobile();
  
  // Event listeners for keyboard
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  ball = new Ball(width/2, height/2, 100, "red");
  
  // Create orientation request button for mobile
  if (isMobile) {
    requestButton = createButton('Enable Device Motion');
    requestButton.position(width / 2 - 100, height / 2);
    requestButton.style('padding', '10px');
    requestButton.style('font-size', '16px');
    requestButton.mousePressed(requestOrientationPermission);
  }
}

function draw() {
  background("#9dacff");

  if (isMobile) {
    if (orientationEnabled) {
      ball.handleOrientation(orientationData.beta, orientationData.gamma);
      if (requestButton) requestButton.hide();
    } else {
      fill(0);
      textSize(20);
      textAlign(CENTER, CENTER);
      text("Tap 'Enable Device Motion' to start", width / 2, height / 3);
      textAlign(LEFT, BASELINE);
    }
  } else {
    ball.move(keys);
  }

  ball.display();
}

// Improved mobile detection
function checkMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Improved orientation permission request
function requestOrientationPermission() {
  // Check for both DeviceOrientation and DeviceMotionEvent
  if (typeof DeviceOrientationEvent !== 'undefined') {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      // iOS devices
      DeviceOrientationEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
            orientationEnabled = true;
          } else {
            alert("Device orientation permission denied.");
          }
        })
        .catch(console.error);
    } else {
      // Android and other devices
      window.addEventListener('deviceorientation', handleOrientation);
      orientationEnabled = true;
    }
  } else {
    alert("Device orientation is not supported on this device.");
  }
}

// Orientation event handler
function handleOrientation(event) {
  // Normalize orientation data
  orientationData.alpha = event.alpha || 0;
  orientationData.beta = event.beta || 0;
  orientationData.gamma = event.gamma || 0;
  
  // Additional logging for debugging
  console.log('Orientation Data:', {
    alpha: orientationData.alpha,
    beta: orientationData.beta,
    gamma: orientationData.gamma
  });
}

// Keyboard event handlers
function handleKeyDown(event) {
  keys[event.key.toLowerCase()] = true;
}

function handleKeyUp(event) {
  keys[event.key.toLowerCase()] = false;
}

// Responsive canvas resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (requestButton) {
    requestButton.position(width / 2 - 100, height / 2);
  }
}