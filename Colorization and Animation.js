let eyeOpen = true;
let mouthWidth = 100;
let mouthDirection = 1;

function setup() {
  createCanvas(400, 400);
  frameRate(10); // Slower frame rate for visible blinking
}

function draw() {
  background(220);
  
  // Draw face (yellow)
  fill(255, 255, 0);
  stroke(0);
  strokeWeight(2);
  ellipse(200, 200, 300, 300);
  
  // Draw eyes
  fill(255);
  ellipse(150, 150, 50, eyeOpen ? 50 : 10); // Left eye
  ellipse(250, 150, 50, eyeOpen ? 50 : 10); // Right eye
  
  // Draw pupils (blue)
  fill(0, 0, 255);
  noStroke();
  ellipse(150, 150, 20, 20);
  ellipse(250, 150, 20, 20);
  
  // Animate mouth (red)
  fill(255, 0, 0);
  stroke(0);
  arc(200, 250, mouthWidth, 80, 0, PI);
  
  // Animation logic
  if (frameCount % 20 === 0) { // Blink every 20 frames
    eyeOpen = !eyeOpen;
  }
  
  mouthWidth += mouthDirection * 2;
  if (mouthWidth > 120 || mouthWidth < 80) {
    mouthDirection *= -1;
  }
}