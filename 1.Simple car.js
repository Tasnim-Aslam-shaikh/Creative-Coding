function setup() {
  createCanvas(400, 200);
}

function draw() {
  background(220);

  // Car body
  fill(255, 0, 0);
  rect(100, 100, 100, 40, 10); // Rounded rectangle

  // Car top
  fill(200, 0, 0);
  rect(120, 80, 60, 30, 5);

  // Wheels
  fill(0);
  ellipse(115, 140, 20, 20);
  ellipse(185, 140, 20, 20);
}