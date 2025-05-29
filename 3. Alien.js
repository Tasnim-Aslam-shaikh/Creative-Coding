let angle = 0;
let colorOffset = 0;

function setup() {
  createCanvas(600, 600);
  noStroke();
}

function draw() {
  background(10, 5, 30); // Dark space background
  
  // Floating animation
  angle += 0.02;
  let floatY = sin(angle) * 10;
  
  // Color shift over time
  colorOffset += 0.5;
  let bodyHue = (colorOffset % 360);
  
  push(); // Isolate transformations
  translate(width / 2, height / 2 + floatY);
  rotate(sin(angle * 0.5) * 0.1); // Gentle swaying
  
  // Draw the alien's jelly body (custom shape)
  fill(bodyHue, 70, 90, 150); // Semi-transparent
  beginShape();
  vertex(-80, -50);
  bezierVertex(-120, -80, -100, 20, -50, 40);
  bezierVertex(0, 60, 50, 40, 80, 0);
  bezierVertex(100, -30, 120, -80, 80, -50);
  bezierVertex(40, -20, -40, -20, -80, -50);
  endShape(CLOSE);
  
  // Glowing eyes
  drawEye(-30, -30, angle); // Left eye
  drawEye(30, -30, angle);  // Right eye
  
  // Wiggly tentacles
  drawTentacle(-40, 30, -1, angle); // Left tentacle
  drawTentacle(40, 30, 1, angle);   // Right tentacle
  
  pop(); // Reset transformations
  
  // Optional: Add stars in the background
  drawStars();
}

// Custom function for drawing animated eyes
function drawEye(x, y, time) {
  push();
  translate(x, y);
  
  // Outer glow
  fill(200, 200, 255, 100);
  ellipse(0, 0, 40, 40);
  
  // Eye white
  fill(255);
  ellipse(0, 0, 30, 30);
  
  // Pupil (moves in a circle)
  let pupilX = cos(time * 3) * 5;
  let pupilY = sin(time * 3) * 5;
  fill(0);
  ellipse(pupilX, pupilY, 15, 15);
  
  // Glint
  fill(255);
  ellipse(pupilX - 3, pupilY - 3, 5, 5);
  
  pop();
}

// Custom function for wiggly tentacles
function drawTentacle(startX, startY, direction, time) {
  push();
  translate(startX, startY);
  noFill();
  stroke((colorOffset + 100) % 360, 80, 90, 180);
  strokeWeight(8);
  
  beginShape();
  for (let i = 0; i < 10; i++) {
    let wiggle = sin(time * 2 + i * 0.5) * 15 * direction;
    curveVertex(i * 10, i * 15 + wiggle);
  }
  endShape();
  
  pop();
}

// Optional: Draw twinkling stars
function drawStars() {
  fill(255);
  for (let i = 0; i < 50; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(1, 3);
    ellipse(x, y, size, size);
    
    // Some stars flicker
    if (random() > 0.8) {
      fill(255, random(150, 255));
      ellipse(x, y, size * 1.5, size * 1.5);
      fill(255);
    }
  }
}