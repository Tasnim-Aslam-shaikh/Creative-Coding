let angle = 0;
let seed;
let palettes = [
  ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFD166"],
  ["#A06CD5", "#6247AA", "#102B3F", "#E2CFEA"],
  ["#2EC4B6", "#E71D36", "#FF9F1C", "#011627"]
];

function setup() {
  createCanvas(400, 400);
  seed = random(1000);
  noStroke();
  colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
  randomSeed(seed); // Ensures pattern stays consistent per run
  background(0, 0, 95);
  
  translate(width / 2, height / 2);
  angle += 0.005;
  
  let palette = random(palettes);
  
  for (let i = 0; i < 12; i++) {
    push();
    rotate((TWO_PI / 12) * i + angle);
    drawBranch(0, -100, 60, 0, palette);
    pop();
  }
  
  // Pause after one full cycle
  if (angle > TWO_PI) noLoop();
}

function drawBranch(x, y, len, depth, palette) {
  if (depth > 5 || len < 2) return;
  
  let hue = map(depth, 0, 5, 0, 360);
  let col = color(random(palette));
  col.setAlpha(0.7);
  fill(col);
  
  push();
  translate(x, y);
  rotate(angle * 0.5);
  
  // Fractal recursion
  ellipse(0, 0, len * 1.5);
  drawBranch(0, -len * 0.8, len * 0.7, depth + 1, palette);
  drawBranch(len * 0.6, 0, len * 0.5, depth + 1, palette);
  drawBranch(-len * 0.6, 0, len * 0.5, depth + 1, palette);
  
  pop();
}

function mousePressed() {
  seed = random(1000);
  angle = 0;
  loop(); // Restart animation
}