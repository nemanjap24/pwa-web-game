let levelsData;
let levelData;
let currentDifficulty = "easy";
let currentLevelIndex = 0;
let difficulties;
let levelLabel;

function preload() {
  levelsData = loadJSON("levels.json");
}

function setup() {
  let canvas = createCanvas(400, 400);
  canvas.parent("canvas-container");
  noLoop();

  console.log(levelsData); // For debugging

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
  background("#3f992f");
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
        fill("red");
        circle(x + tileSize / 2, y + tileSize / 2, tileSize * 0.8);
      } else if (cell === "e") {
        fill(0);
        circle(x + tileSize / 2, y + tileSize / 2, tileSize * 0.8);
      }
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
    console.error(
      `Level index ${levelIndex} not found in difficulty '${difficultyName}'.`
    );
    return;
  }
}

function updateLevelLabel() {
  levelLabel.text(
    `Difficulty: ${currentDifficulty}, Level: ${levelData.level}`
  );
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
