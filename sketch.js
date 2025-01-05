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
let canvasSize = 500;
let appWidth = 620;
let appHeight = 560;
let CD;

// todo: remove uneccessary code
let unlockedDifficulties = ["easy"];
// Track completed levels per difficulty
let levelsCompleted = {
  easy: 0,
  medium: 0,
  hard: 0,
};
let usedLevelIndexes = {
  easy: new Set(),
  medium: new Set(),
  hard: new Set(),
};
// Keep track of the current level index for each difficulty
let currentLevelIndexMap = { easy: null, medium: null, hard: null };
// Track whether a level is in progress for each difficulty
let levelInProgress = { easy: false, medium: false, hard: false };

// end of localStorage

function preload() {
  levelsData = loadJSON("levels.json");
}

if ($(window).width() < canvasSize + 120) {
  canvasSize = $(window).width() * 0.7;
}
if ($(window).height() < appHeight + 120) {
  canvasSize = $(window).height() * 0.7;
}

function setup() {
  let cnv = createCanvas(canvasSize, canvasSize);
  cnv.parent("canvas-container");
  cnv.style("display", "block");
  loadUserData();

  isMobile = checkMobile();

  // Event listeners for keyboard
  setupEventListeners();

  // Create orientation request button for mobile
  if (isMobile) {
    $("#orientation-overlay").css("display", "flex");

    $("#enable-orientation").click(function () {
      requestOrientationPermission();
      $("#orientation-overlay").css("display", "none");
    });
    // Add orientation change listener
    window.addEventListener("orientationchange", checkOrientation);
    checkOrientation(); // Check initial orientation
  }

  difficulties = Object.values(levelsData);
  CD = new CollisionDetector();

  loadOrInitializeLevel(currentDifficulty);

  // Use jQuery for DOM manipulation
  $(document).ready(function () {
    $("#next-level").click(nextLevel);
    $("#help-button").click(function () {
      $("#help-overlay").css("display", "flex");
      // Pause the game
      noLoop();
    });

    $("#close-help").click(function () {
      $("#help-overlay").css("display", "none");
      // Resume the game
      loop();
    });
    $("#close-unlocked-overlay-easy").click(function () {
      $("#unlocked-overlay-easy").css("display", "none");
      loop();
    });
    $("#close-unlocked-overlay-medium").click(function () {
      $("#unlocked-overlay-medium").css("display", "none");
      loop();
    });
    $("#close-congratulations-overlay").click(function () {
      $("#congratulations-overlay").css("display", "none");
      loop();
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
function checkOrientation() {
  const isPortrait = window.screen.orientation.type.includes("portrait");
  if (isMobile) {
    if (!isPortrait) {
      $("#rotate-overlay").css("display", "flex");
      // Pause the game
      noLoop();
    } else {
      $("#rotate-overlay").css("display", "none");
      // Resume the game
      loop();
    }
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
  saveUserData();
}

function nextLevel() {
  // Current difficulty completed one level
  levelsCompleted[currentDifficulty]++;

  // Mark current difficulty’s level as done
  levelInProgress[currentDifficulty] = false;

  // Unlock next difficulty if 3 levels done
  if (levelsCompleted[currentDifficulty] >= 3) {
    if (currentDifficulty === "easy" && !unlockedDifficulties.includes("medium")) {
      unlockedDifficulties.push("medium");
      $("#unlocked-overlay-easy").css("display", "flex");
      noLoop();
    } else if (currentDifficulty === "medium" && !unlockedDifficulties.includes("hard")) {
      unlockedDifficulties.push("hard");
      $("#unlocked-overlay-medium").css("display", "flex");
      noLoop();
    }
  }

  // Load next random level in the current difficulty
  loadRandomLevel(currentDifficulty);
}
function loadOrInitializeLevel(difficultyName) {
  if (currentLevelIndexMap[difficultyName] !== null) {
    // A level has already been chosen for this difficulty, load it
    loadLevel(difficultyName, currentLevelIndexMap[difficultyName]);
  } else {
    // No level chosen yet, so initialize
    loadRandomLevel(difficultyName);
  }
}

function loadRandomLevel(difficultyName) {
  const difficultyObj = difficulties.find((d) => d.name === difficultyName);
  if (!difficultyObj) return;

  let availableIndexes = [];
  for (let i = 0; i < difficultyObj.levels.length; i++) {
    if (!usedLevelIndexes[difficultyName].has(i)) {
      availableIndexes.push(i);
    }
  }
  // todo: remove after, used for debugging
  console.log(availableIndexes);

  // If all levels used, reset
  if (availableIndexes.length === 0) {
    usedLevelIndexes[difficultyName].clear();
    for (let i = 0; i < difficultyObj.levels.length; i++) {
      availableIndexes.push(i);
    }
  }

  // Pick a random unused level index
  const randomIndex = floor(random(availableIndexes.length));
  const chosenIndex = availableIndexes[randomIndex];
  usedLevelIndexes[difficultyName].add(chosenIndex);

  // Record that index as the current level for this difficulty
  currentLevelIndexMap[difficultyName] = chosenIndex;
  levelInProgress[difficultyName] = true;

  // Load the chosen level
  loadLevel(difficultyName, chosenIndex);
}

$(document).ready(function () {
  $("#btn-easy").click(function () {
    if (unlockedDifficulties.includes("easy")) {
      currentDifficulty = "easy";
      loadOrInitializeLevel("easy");
    }
  });
  $("#btn-medium").click(function () {
    if (unlockedDifficulties.includes("medium")) {
      currentDifficulty = "medium";
      loadOrInitializeLevel("medium");
    }
  });
  $("#btn-hard").click(function () {
    if (unlockedDifficulties.includes("hard")) {
      currentDifficulty = "hard";
      loadOrInitializeLevel("hard");
    }
  });
});
function loadUserData() {
  try {
    const savedData = JSON.parse(localStorage.getItem("gameData"));
    if (savedData) {
      unlockedDifficulties = savedData.unlockedDifficulties || ["easy"];
      levelsCompleted = savedData.levelsCompleted || { easy: 0, medium: 0, hard: 0 };

      // Convert arrays back to Sets
      if (savedData.usedLevelIndexes) {
        usedLevelIndexes.easy = new Set(savedData.usedLevelIndexes.easy || []);
        usedLevelIndexes.medium = new Set(savedData.usedLevelIndexes.medium || []);
        usedLevelIndexes.hard = new Set(savedData.usedLevelIndexes.hard || []);
      }
      currentDifficulty = savedData.currentDifficulty || "easy";
      currentLevelIndexMap = savedData.currentLevelIndexMap || { easy: null, medium: null, hard: null };
      levelInProgress = savedData.levelInProgress || { easy: false, medium: false, hard: false };
    }
  } catch (e) {
    console.warn("Could not parse localStorage data", e);
  }
}

function saveUserData() {
  try {
    const dataToSave = {
      unlockedDifficulties: unlockedDifficulties,
      levelsCompleted: levelsCompleted,
      usedLevelIndexes: {
        easy: Array.from(usedLevelIndexes.easy),
        medium: Array.from(usedLevelIndexes.medium),
        hard: Array.from(usedLevelIndexes.hard),
      },
      currentLevelIndexMap: currentLevelIndexMap,
      levelInProgress: levelInProgress,
      currentDifficulty: currentDifficulty,
      currentLevelIndex: currentLevelIndex,
    };
    localStorage.setItem("gameData", JSON.stringify(dataToSave));
  } catch (e) {
    console.warn("Could not save to localStorage", e);
  }
}
