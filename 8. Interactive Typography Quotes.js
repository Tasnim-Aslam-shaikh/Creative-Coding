let quotes = [
  "The only way to do great work is to love what you do",
  "Innovation distinguishes between a leader and a follower",
  "Your time is limited so don't waste it living someone else's life",
  "Stay hungry stay foolish",
  "Creativity is just connecting things"
];

let currentQuote;
let words = [];
let fonts = [];
let bgColor;
let particleSystems = [];

function preload() {
  fonts.push(loadFont('Pacifico-Regular.ttf'));
  fonts.push(loadFont('Montserrat-VariableFont_wght.ttf'));
  fonts.push(loadFont('PlayfairDisplay-VariableFont_wght.ttf'));
  fonts.push(loadFont('RobotoSlab-VariableFont_wght.ttf'));
}

function setup() {
  createCanvas(1000, 1000);
  bgColor = color(240, 240, 250);
  selectNewQuote();
}

function draw() {
  background(bgColor);
  
  // Update and display particle systems
  for (let i = particleSystems.length - 1; i >= 0; i--) {
    particleSystems[i].update();
    particleSystems[i].display();
    if (particleSystems[i].isDone()) {
      particleSystems.splice(i, 1);
    }
  }
  
  // Display words
  for (let word of words) {
    word.update();
    word.display();
  }
  
  // Draw instructions
  fill(100);
  noStroke();
  textSize(14);
  textFont('Arial');
  textAlign(CENTER);
  text("Click any word to explode it | Press any key for new quote", width/2, height-30);
}

function selectNewQuote() {
  // Clear existing
  words = [];
  particleSystems = [];
  
  // Select random quote
  currentQuote = random(quotes);
  
  // Split into words and create word objects
  let wordArray = currentQuote.split(' ');
  let x = 100;
  let y = height/2 - (wordArray.length * 15);
  
  for (let i = 0; i < wordArray.length; i++) {
    let word = wordArray[i];
    let fontChoice = random(fonts);
    let fontSize = random(30, 60);
    let col = color(random(100, 200), random(100, 200), random(100, 200));
    
    words.push(new Word(
      word,
      x + random(-50, 50),
      y + i * 100 + random(-20, 20),
      fontChoice,
      fontSize,
      col
    ));
    
    x += textWidth(word) + 20;
    if (x > width - 200) {
      x = 100;
      y += 120;
    }
  }
}

function mousePressed() {
  for (let i = 0; i < words.length; i++) {
    if (words[i].contains(mouseX, mouseY)) {
      particleSystems.push(new ParticleSystem(words[i]));
      words.splice(i, 1);
      break;
    }
  }
}

function keyPressed() {
  selectNewQuote();
}

// Word Class
class Word {
  constructor(text, x, y, font, size, col) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.origX = x;
    this.origY = y;
    this.font = font;
    this.size = size;
    this.color = col;
    this.angle = random(TWO_PI);
    this.rotationSpeed = random(-0.02, 0.02);
    this.bounce = random(0.5, 1.5);
    this.timeOffset = random(100);
  }
  
  contains(px, py) {
    let w = textWidth(this.text) * 1.2;
    let h = this.size * 1.2;
    return px > this.x - w/2 && px < this.x + w/2 &&
           py > this.y - h/2 && py < this.y + h/2;
  }
  
  update() {
    // Gentle floating motion
    this.y = this.origY + sin(frameCount * 0.05 + this.timeOffset) * 20 * this.bounce;
    
    // Rotation
    this.angle += this.rotationSpeed;
    
    // Mouse attraction
    let mouseDist = dist(mouseX, mouseY, this.x, this.y);
    if (mouseDist < 150) {
      this.x += (mouseX - this.x) * 0.05;
      this.y += (mouseY - this.y) * 0.05;
    } else {
      // Return to original position
      this.x += (this.origX - this.x) * 0.05;
    }
  }
  
  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    textFont(this.font);
    textSize(this.size);
    fill(this.color);
    textAlign(CENTER, CENTER);
    text(this.text, 0, 0);
    pop();
  }
}

// Particle System for exploded words
class ParticleSystem {
  constructor(word) {
    this.particles = [];
    this.lifespan = 255;
    
    // Create particles from word
    let points = word.font.textToPoints(word.text, 0, 0, word.size, {
      sampleFactor: 0.2
    });
    
    for (let pt of points) {
      this.particles.push({
        x: word.x + pt.x,
        y: word.y + pt.y,
        vx: random(-3, 3),
        vy: random(-5, -1),
        size: random(2, 6),
        color: word.color,
        life: random(100, 255)
      });
    }
  }
  
  update() {
    this.lifespan -= 2;
    for (let p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1; // gravity
      p.life -= 1.5;
    }
  }
  
  display() {
    for (let p of this.particles) {
      if (p.life > 0) {
        fill(red(p.color), green(p.color), blue(p.color), p.life);
        noStroke();
        ellipse(p.x, p.y, p.size);
      }
    }
  }
  
  isDone() {
    return this.lifespan < 0;
  }
}