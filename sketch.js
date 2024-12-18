let levelsData;
let levelData;

function preload() {
  levelsData = loadJSON("levels.json");
}

function setup() {
  let canvas = createCanvas(400, 400);
  canvas.parent("canvas-container");

  let levelsArray = Object.values(levelsData);

  let easyLevels = levelsArray.find((difficulty) => difficulty.name === "easy");
  levelData = easyLevels.levels.find((level) => level.level === 1);
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
