let levelsData;
let levelData;
let currentDifficulty = "hard";
let currentLevelIndex = 0;
let difficulties;
let levelLabel;
let ball;
let keys = {};
let orientationData = { alpha: 0, beta: 0, gamma: 0 };
let orientationEnabled = false;
let requestButton;
let isMobile;
let canvasSize = 500;

function preload() {
  levelsData = loadJSON("levels.json");
}

function setup() {
  let cnv = createCanvas(canvasSize, canvasSize);
  cnv.parent("canvas-container");
  cnv.style("display", "block");
  
  isMobile = checkMobile();

  // Event listeners for keyboard
  setupEventListeners();

  // Create orientation request button for mobile
  if (isMobile) {
    requestButton = createButton("Enable Device Motion");
    requestButton.position(width / 2 - 100, height / 2);
    requestButton.style("padding", "10px");
    requestButton.style("font-size", "16px");
    requestButton.mousePressed(requestOrientationPermission);
  }

  // Convert levelsData to an array if necessary
  difficulties = Object.values(levelsData);

  loadLevel(currentDifficulty, currentLevelIndex);

  // Use jQuery for DOM manipulation
  $(document).ready(function () {
    levelLabel = $("#level-label");
    updateLevelLabel();

    $("#prev-level").click(prevLevel);
    $("#next-level").click(nextLevel);
  });
}

function draw() {
  background("#9dacff");

  renderMap();
  // todo: maybe move the method
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

function setupEventListeners() {
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
}
// Improved mobile detection
function checkMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
function renderMap() {
  let map = levelData.map;
  let tileSize = width / levelData.dimensions;

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      let cell = map[i][j];
      let x = j * tileSize;
      let y = i * tileSize;

      if (cell === "w") {
        fill("#fff");
        rect(x, y, tileSize, tileSize);
      } else if (cell === "s") {
      } else if (cell === "e") {
        fill(0);
        circle(x + tileSize / 2, y + tileSize / 2, tileSize * 0.8);
      }
    }
  }
}

// Improved orientation permission request
function requestOrientationPermission() {
  // Check for both DeviceOrientation and DeviceMotionEvent
  if (typeof DeviceOrientationEvent !== "undefined") {
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      // iOS devices
      DeviceOrientationEvent.requestPermission()
        .then((permissionState) => {
          if (permissionState === "granted") {
            window.addEventListener("deviceorientation", handleOrientation);
            orientationEnabled = true;
          } else {
            alert("Device orientation permission denied.");
          }
        })
        .catch(console.error);
    } else {
      // Android and other devices
      window.addEventListener("deviceorientation", handleOrientation);
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
  console.log("Orientation Data:", {
    alpha: orientationData.alpha,
    beta: orientationData.beta,
    gamma: orientationData.gamma,
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

function loadLevel(difficultyName, levelIndex) {
  let difficulty = difficulties.find((d) => d.name === difficultyName);

  if (!difficulty) {
    console.error(`Difficulty '${difficultyName}' not found.`);
    return;
  }

  levelData = difficulty.levels[levelIndex];

  if (!levelData) {
    console.error(`Level index ${levelIndex} not found in difficulty '${difficultyName}'.`);
    return;
  }
  let spawnFound = false;
  for (let i = 0; i < levelData.map.length; i++) {
    for (let j = 0; j < levelData.map[i].length; j++) {
      if (levelData.map[i][j] === "s") {
        let tileSize = width / levelData.dimensions;
        let x = j * tileSize + tileSize / 2;
        let y = i * tileSize + tileSize / 2;
        ball = new Ball(x, y, tileSize * 0.8, "red");
        spawnFound = true;
        break;
      }
    }
    if (spawnFound) break;
  }
}

function updateLevelLabel() {
  levelLabel.text(`Difficulty: ${currentDifficulty}, Level: ${levelData.level}`);
}

function prevLevel() {
  if (currentLevelIndex > 0) {
    currentLevelIndex--;
    loadLevel(currentDifficulty, currentLevelIndex);
    updateLevelLabel();
    redraw();
  }
}

function nextLevel() {
  let difficulty = difficulties.find((d) => d.name === currentDifficulty);
  if (currentLevelIndex < difficulty.levels.length - 1) {
    currentLevelIndex++;
    loadLevel(currentDifficulty, currentLevelIndex);
    updateLevelLabel();
    redraw();
  }
}
