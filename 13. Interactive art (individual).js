let branches = [];
let flowers = [];
let colorPalettes = [];
let currentPalette = 0;
let growthSpeed = 1;
let maxDepth = 8;
let audioEnabled = false;
let synth;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Define color palettes
  colorPalettes = [
    [color(10, 90, 90), color(50, 85, 80), color(120, 70, 80)], // Warm
    [color(200, 80, 90), color(240, 70, 80), color(280, 60, 70)], // Cool
    [color(30, 20, 95), color(180, 15, 90), color(300, 10, 85)]  // Pastel
  ];
  
  // Setup audio (optional)
  if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
    synth = new p5.PolySynth();
    audioEnabled = true;
  }
  
  // Initial seed
  branches.push(new Branch(width/2, height/2, 0, null));
}

function draw() {
  background(0, 0, 15, 0.1); // Semi-transparent for trails
  
  // Update and display all elements
  for (let i = branches.length - 1; i >= 0; i--) {
    branches[i].update();
    branches[i].display();
    if (branches[i].growNew()) {
      let newBranch = branches[i].createChild();
      if (newBranch) branches.push(newBranch);
    }
  }
  
  for (let flower of flowers) {
    flower.display();
  }
  
  // Display instructions
  drawInstructions();
}

function mouseMoved() {
  // 10% chance to plant new seed when moving
  if (random() < 0.1 && branches.length < 50) {
    branches.push(new Branch(mouseX, mouseY, 0, null));
  }
}

function mousePressed() {
  // Create flower at nearest branch intersection
  let closest = null;
  let record = 30; // Max distance
  
  for (let branch of branches) {
    let d = dist(mouseX, mouseY, branch.x, branch.y);
    if (d < record) {
      record = d;
      closest = branch;
    }
  }
  
  if (closest) {
    flowers.push(new Flower(closest.x, closest.y, currentPalette));
    if (audioEnabled) {
      let note = map(closest.x, 0, width, 60, 72);
      synth.play(midiToFreq(note), 0.2, 0, 0.1);
    }
  }
}

function keyPressed() {
  switch(key) {
    case 'c': // Change color palette
      currentPalette = (currentPalette + 1) % colorPalettes.length;
      break;
    case ' ': // Clear all
      branches = [];
      flowers = [];
      break;
    case 'g': // Toggle growth
      growthSpeed = growthSpeed > 0 ? 0 : 1;
      break;
  }
}

class Branch {
  constructor(x, y, depth, parent) {
    this.x = x;
    this.y = y;
    this.depth = depth;
    this.parent = parent;
    this.angle = parent ? parent.angle + random(-0.5, 0.5) : random(TWO_PI);
    this.length = map(depth, 0, maxDepth, 30, 5);
    this.growthProgress = 0;
    this.hue = colorPalettes[currentPalette][depth % 3];
  }
  
  update() {
    if (this.growthProgress < 1) {
      this.growthProgress += 0.02 * growthSpeed;
      
      // If child branch, calculate position based on parent
      if (this.parent) {
        let progress = this.growthProgress;
        this.x = lerp(this.parent.x, 
                     this.parent.x + cos(this.angle) * this.length, 
                     progress);
        this.y = lerp(this.parent.y, 
                     this.parent.y + sin(this.angle) * this.length, 
                     progress);
      }
    }
  }
  
  display() {
    if (!this.parent) return;
    
    let sw = map(this.depth, 0, maxDepth, 5, 1);
    strokeWeight(sw);
    stroke(this.hue);
    
    let startX = this.parent.x;
    let startY = this.parent.y;
    let endX = this.x;
    let endY = this.y;
    
    // Only draw visible portion
    if (this.growthProgress < 1) {
      endX = lerp(startX, endX, this.growthProgress);
      endY = lerp(startY, endY, this.growthProgress);
    }
    
    line(startX, startY, endX, endY);
    
    // Draw joint
    noStroke();
    fill(this.hue);
    circle(startX, startY, sw * 1.5);
  }
  
  growNew() {
    return (this.growthProgress >= 1 && 
           this.depth < maxDepth && 
           random() < 0.03);
  }
  
  createChild() {
    if (this.depth >= maxDepth - 1) return null;
    return new Branch(this.x, this.y, this.depth + 1, this);
  }
}

class Flower {
  constructor(x, y, paletteIndex) {
    this.x = x;
    this.y = y;
    this.size = random(15, 40);
    this.petalCount = floor(random(5, 12));
    this.rotation = random(TWO_PI);
    this.palette = colorPalettes[paletteIndex];
    this.life = 100;
  }
  
  display() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    
    // Draw petals
    for (let i = 0; i < this.petalCount; i++) {
      let angle = (TWO_PI / this.petalCount) * i;
      fill(this.palette[i % 3]);
      noStroke();
      ellipse(
        cos(angle) * this.size/2, 
        sin(angle) * this.size/2, 
        this.size, 
        this.size * 0.6
      );
    }
    
    // Center
    fill(50, 50, 90);
    circle(0, 0, this.size/3);
    
    pop();
    
    // Fade out
    this.life -= 0.2;
  }
}

function drawInstructions() {
  fill(255, 200);
  noStroke();
  textAlign(LEFT);
  textSize(14);
  text("MOUSE MOVE - Plant seeds\nCLICK - Create flowers\nC - Change colors\nSPACE - Clear\nG - Toggle growth", 20, 40);
  
  textAlign(RIGHT);
  text("Neural Garden\nInteractive Generative Art", width - 20, 40);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}