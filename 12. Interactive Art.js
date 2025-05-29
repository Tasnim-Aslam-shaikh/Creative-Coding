let particles = [];
let plants = [];
let messages = [];
let bgMusic;
let plantSound;
let startButton;
let started = false;
let designs = [];

function preload() {
  bgMusic = loadSound('sound.mp3');
  plantSound = loadSound('plant.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  colorMode(RGB);

  startButton = createButton('Start Experience');
  startButton.position(width / 2 - 75, height / 2 - 20);
  startButton.mousePressed(startExperience);
}

function startExperience() {
  started = true;
  startButton.remove();
  bgMusic.loop();
  initializeParticles();
}

function initializeParticles() {
  for (let i = 0; i < 100; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
}

function draw() {
  if (!started) return;

  background(0, 25); // Black with trail

  // Particle system
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }

  if (mouseIsPressed) {
    for (let i = 0; i < 5; i++) {
      particles.push(new Particle(mouseX, mouseY));
    }
  }

  for (let plant of plants) {
    plant.update();
    plant.display();
  }

  for (let i = messages.length - 1; i >= 0; i--) {
    messages[i].display();
    if (messages[i].isDone()) {
      messages.splice(i, 1);
    }
  }

  for (let d of designs) {
    d.update();
    d.display();
  }

  if (frameCount % 5 === 0) {
    particles.push(new Particle(random(width), random(height)));
  }
}

// PARTICLE CLASS
class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
    this.lifespan = 255;
    this.size = random(4, 10);
    this.color = color(random(100, 200), random(100, 200), random(255), 200);
  }

  update() {
    this.vel.mult(0.98);
    this.pos.add(this.vel);
    this.lifespan -= 3;
    this.vel.x += sin(frameCount * 0.1 + this.pos.y * 0.01) * 0.05;
    this.vel.y += cos(frameCount * 0.1 + this.pos.x * 0.01) * 0.05;
  }

  display() {
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.lifespan);
    ellipse(this.pos.x, this.pos.y, this.size * (this.lifespan / 255));
    if (random() < 0.3) {
      fill(255, 200);
      ellipse(this.pos.x + random(-2, 2), this.pos.y + random(-2, 2), 2);
    }
  }

  isDead() {
    return this.lifespan <= 0;
  }
}

// PLANT CLASS
class Plant {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.height = 0;
    this.maxHeight = random(50, 150);
    this.color = color(random(0, 100), random(150, 255), random(100, 200));
  }

  update() {
    if (this.height < this.maxHeight) {
      this.height += 2;
    }
  }

  display() {
    fill(this.color);
    rectMode(CENTER);
    rect(this.pos.x, this.pos.y - this.height / 2, 8, this.height);
    fill(150, 255, 200);
    for (let i = 0; i < 3; i++) {
      let y = this.pos.y - this.height + (i * 30);
      if (y > this.pos.y) continue;
      ellipse(this.pos.x - 15, y, 20, 10);
      ellipse(this.pos.x + 15, y, 20, 10);
    }
    if (this.height >= this.maxHeight) {
      fill(255, 200, 255);
      ellipse(this.pos.x, this.pos.y - this.height, 25);
    }
  }
}

// MESSAGE CLASS
class WelcomeMessage {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.timer = 255;
    this.color = random([
      color(255),           // white
      color(255, 105, 180), // pink
      color(30, 144, 255)   // blue
    ]);
  }

  display() {
    textAlign(CENTER, CENTER);
    textSize(32 + sin(millis() * 0.01) * 2);
    fill(red(this.color), green(this.color), blue(this.color), this.timer);
    text("Welcome to Bath Spa University", this.x, this.y);
    this.timer -= 2;
  }

  isDone() {
    return this.timer <= 0;
  }
}

// DESIGN CLASS (for P key)
class RandomDesign {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = 20;
    this.angle = 0;
    this.type = random(["circle", "rect", "star"]);
    this.color = color(random(255), random(255), random(255), 200);
  }

  update() {
    this.size += sin(frameCount * 0.05) * 0.5;
    this.angle += 0.05;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    fill(this.color);
    noStroke();
    if (this.type === "circle") {
      ellipse(0, 0, this.size * 2);
    } else if (this.type === "rect") {
      rectMode(CENTER);
      rect(0, 0, this.size * 2, this.size);
    } else if (this.type === "star") {
      this.drawStar(0, 0, this.size / 2, this.size, 5);
    }
    pop();
  }

  drawStar(x, y, radius1, radius2, npoints) {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = cos(a) * radius2;
      let sy = sin(a) * radius2;
      vertex(sx, sy);
      sx = cos(a + halfAngle) * radius1;
      sy = sin(a + halfAngle) * radius1;
      vertex(sx, sy);
    }
    endShape(CLOSE);
  }
}

// INPUT HANDLERS
function mousePressed() {
  if (!started) return;
  messages.push(new WelcomeMessage(mouseX, mouseY));
}

function keyPressed() {
  if (!started) return;

  if (key === 'p' || key === 'P') {
    for (let i = 0; i < 5; i++) {
      designs.push(new RandomDesign());
    }
  } else {
    if (plantSound.isLoaded()) plantSound.play();
    plants.push(new Plant(random(width), height - 50));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}