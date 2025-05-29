let particles = [];
let colorPalette = [];
let trailMode = 1;
let maxParticles = 100;
let physicsEnabled = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create vibrant color palette
  colorPalette = [
    color(10, 100, 100),  // Bright red
    color(50, 100, 100),  // Orange
    color(120, 100, 80),  // Green
    color(200, 100, 100), // Cyan
    color(270, 100, 80),  // Purple
    color(330, 100, 100)  // Pink
  ];
  
  // Instructions
  textAlign(CENTER);
  textSize(16);
}

function draw() {
  // Fading background effect
  background(0, 0, 10, 0.1);
  
  // Create new particles at mouse position
  if (mouseIsPressed) {
    // More particles when mouse is pressed
    for (let i = 0; i < 3; i++) {
      addParticle(mouseX, mouseY);
    }
  } else {
    addParticle(mouseX, mouseY);
  }
  
  // Update and display particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    
    // Remove old particles
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }
  
  // Display instructions
  fill(255);
  noStroke();
  text("Click to intensify | Press 1-3 to change modes | SPACE to toggle physics", width/2, 30);
}

function addParticle(x, y) {
  if (particles.length < maxParticles) {
    let speed = dist(mouseX, mouseY, pmouseX, pmouseY);
    let col = colorPalette[floor(random(colorPalette.length))];
    
    particles.push(new Particle(
      x,
      y,
      col,
      speed,
      trailMode
    ));
  }
}

function keyPressed() {
  // Change trail modes
  if (key >= '1' && key <= '3') {
    trailMode = int(key);
  }
  
  // Toggle physics
  if (key === ' ') {
    physicsEnabled = !physicsEnabled;
  }
  
  // Clear trail
  if (key === 'c') {
    particles = [];
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Particle Class
class Particle {
  constructor(x, y, col, speed, mode) {
    this.pos = createVector(x, y);
    this.prevPos = createVector(x, y);
    this.color = col;
    this.size = map(speed, 0, 30, 15, 5, true);
    this.life = 255;
    this.decay = random(1, 3);
    this.mode = mode;
    this.angle = random(TWO_PI);
    this.spinSpeed = random(-0.1, 0.1);
    
    // Physics properties
    this.vel = p5.Vector.random2D().mult(random(0.5));
    this.acc = createVector();
    this.maxSpeed = random(1, 3);
  }
  
  update() {
    this.prevPos.set(this.pos);
    
    // Different behaviors based on mode
    switch(this.mode) {
      case 1: // Fluid ribbons
        if (physicsEnabled) {
          this.acc.add(p5.Vector.random2D().mult(0.05));
          this.vel.add(this.acc);
          this.vel.limit(this.maxSpeed);
          this.pos.add(this.vel);
          this.acc.mult(0);
        }
        break;
        
      case 2: // Swirling dots
        this.angle += this.spinSpeed;
        this.pos.x += cos(this.angle) * 0.5;
        this.pos.y += sin(this.angle) * 0.5;
        break;
        
      case 3: // Geometric shapes
        this.size = map(sin(frameCount * 0.1), -1, 1, 5, 15);
        break;
    }
    
    this.life -= this.decay;
  }
  
  display() {
    let alpha = map(this.life, 0, 255, 0, 1);
    let currentColor = this.color;
    currentColor.setAlpha(alpha);
    
    noFill();
    stroke(currentColor);
    strokeWeight(this.size);
    
    // Different rendering based on mode
    switch(this.mode) {
      case 1:
        line(this.prevPos.x, this.prevPos.y, this.pos.x, this.pos.y);
        break;
        
      case 2:
        strokeWeight(this.size * 0.5);
        point(this.pos.x, this.pos.y);
        break;
        
      case 3:
        noStroke();
        fill(currentColor);
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.angle);
        rectMode(CENTER);
        rect(0, 0, this.size, this.size);
        pop();
        break;
    }
  }
  
  isDead() {
    return this.life <= 0;
  }
}