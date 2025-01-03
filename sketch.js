let levelsData;
let levelData;
let currentDifficulty = "easy";
let currentLevelIndex = 0;
let difficulties;
let levelLabel;
let ball;
let keys = {};
let orientationData = { alpha: 0, beta: 0, gamma: 0 };
let orientationEnabled = false;
let requestButton;
let isMobile;
let coins = [];
coins.push(new Coin(1, 1, 1, 1));
let canvasSize = 500;
let CD;
function preload() {
  levelsData = loadJSON("levels.json");
}

if ($(window).width() < 450) {
  canvasSize = $(window).width() * 0.8;
}

// function that checks if browser supports localStorage
if (storageAvailable("localStorage")) {
  console.log("funguje");
} else {
  console.log("nefunguje");
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
    $("#orientation-overlay").css("display", "flex");
    
    $("#enable-orientation").click(function() {
      requestOrientationPermission();
      $("#orientation-overlay").css("display", "none");
    });
  }

  // Convert levelsData to an array if necessary
  difficulties = Object.values(levelsData);
  CD = new CollisionDetector();
  loadLevel(currentDifficulty, currentLevelIndex);

  // Use jQuery for DOM manipulation
  $(document).ready(function () {
    $("#next-level").click(nextLevel);
    $("#help-button").click(function() {
      $("#help-overlay").css("display", "flex");
    });
  
    $("#close-help").click(function() {
      $("#help-overlay").css("display", "none");
    });
  });
}

function draw() {
  background("#9dacff");

  renderMap();
  if (isMobile) {
    if (orientationEnabled) {
      ball.handleOrientation(orientationData.beta, orientationData.gamma);
    } 
  } else {
    ball.move(keys);
  }

  CD.checkCollisions();
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
  for (let wall of CD.walls) {
    wall.display();
  }
  for (let coin of CD.coins) {
    coin.display();
  }
  for (let obstacle of CD.obstacles) {
    obstacle.display();
  }
  CD.finishLine.display();
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
// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
//   if (requestButton) {
//     requestButton.position(width / 2 - 100, height / 2);
//   }
// }

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
  CD.clearWalls();
  CD.clearCoins();
  CD.clearObstacles();
  for (let i = 0; i < levelData.dimensions; i++) {
    for (let j = 0; j < levelData.dimensions; j++) {
      let tileSize = width / levelData.dimensions;

      let x = j * tileSize + tileSize / 2;
      let y = i * tileSize + tileSize / 2;
      if (levelData.map[i][j] === "s") {
        ball = new Ball(x, y, tileSize * 0.8, "red");
        CD.setBall(ball);
        spawnFound = true;
      } else if (levelData.map[i][j] === "w") {
        let wall = new Wall(x, y, tileSize, tileSize, "#fff");
        CD.addWall(wall);
      } else if (levelData.map[i][j] === "c") {
        console.log("Coin placed");
        let coin = new Coin(x, y, tileSize * 0.3, 10);
        CD.addCoin(coin);
      } else if (levelData.map[i][j] === "o") {
        CD.addObstacle(new Obstacle(x, y, tileSize * 0.5, tileSize * 0.5));
        console.log("Obstacle placed");
      } else if (levelData.map[i][j] === "e") {
        // finishLine = new Finish(x, y, tileSize * 0.8);
        CD.setFinishLine(new Finish(x, y, tileSize * 0.8, () => nextLevel()));
        console.log("Finish line placed");
      }
    }
  }
}

function nextLevel() {
  currentLevelIndex++;
  const difficultiesOrder = ["easy", "medium", "hard"];
  let difficultyIndex = difficultiesOrder.indexOf(currentDifficulty);

  const currentDifficultyObj = difficulties.find((d) => d.name === currentDifficulty);

  if (currentLevelIndex >= currentDifficultyObj.levels.length) {
    currentLevelIndex = 0;
    difficultyIndex++;
    if (difficultyIndex < difficultiesOrder.length) {
      currentDifficulty = difficultiesOrder[difficultyIndex];
    } else {
      console.log("No more difficulties.");
      return;
    }
  }

  loadLevel(currentDifficulty, currentLevelIndex);
}