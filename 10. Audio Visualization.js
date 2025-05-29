let mic, fft;
let stars = [];
let particles = [];
let audioLoaded = false;
let bgColor = 0;
let colorPalette = [];
let currentTrack = 0;
let tracks = [
  "pop-beat.mp3",
  "sad-effect.mp3",
  "loud-piano-effect.mp3"
];
let soundFile;

function preload() {
  soundFile = loadSound(tracks[currentTrack]);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  
  // Create color palette
  colorPalette = [
    color(200, 80, 100), // Cyan
    color(300, 80, 100), // Pink
    color(50, 100, 100), // Orange
    color(120, 80, 100)  // Green
  ];
  
  // Initialize audio analysis
  fft = new p5.FFT(0.8, 64);
  
  // Create stars for background
  for (let i = 0; i < 200; i++) {
    stars.push(new Star());
  }
  
  // Setup instructions
  textAlign(CENTER);
  textSize(16);
}

function draw() {
  // Animate background between dark colors
  bgColor = lerpColor(
    color(270, 70, 20), 
    color(200, 70, 30), 
    map(sin(frameCount * 0.01), -1, 1, 0, 1)
  );
  background(bgColor);
  
  // Draw stars
  for (let star of stars) {
    star.display();
  }
  
  // Analyze audio if loaded
  if (audioLoaded) {
    let spectrum = fft.analyze();
    let waveform = fft.waveform();
    let energy = fft.getEnergy(20, 200);
    
    // Frequency circle visualization
    drawFrequencyCircle(spectrum);
    
    // Waveform visualization
    drawWaveform(waveform);
    
    // Energy particles
    if (energy > 100) {
      createParticles(energy);
    }
    
    // Update and display particles
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].display();
      if (particles[i].isDone()) {
        particles.splice(i, 1);
      }
    }
  } else {
    // Display loading/instructions
    fill(255);
    noStroke();
    text("CLICK TO START | Press N for next track", width/2, height/2);
  }
}

function drawFrequencyCircle(spectrum) {
  push();
  translate(width/2, height/2);
  noFill();
  
  for (let i = 0; i < spectrum.length; i++) {
    let angle = map(i, 0, spectrum.length, 0, TWO_PI);
    let amp = spectrum[i];
    let r = map(amp, 0, 255, 100, 300);
    let col = colorPalette[i % colorPalette.length];
    col.setAlpha(map(amp, 0, 255, 50, 200));
    
    stroke(col);
    strokeWeight(2);
    point(cos(angle) * r, sin(angle) * r);
    
    // Connect points with lines for higher frequencies
    if (i % 4 === 0 && amp > 100) {
      let nextAngle = map(i+1, 0, spectrum.length, 0, TWO_PI);
      let nextR = map(spectrum[i+1], 0, 255, 100, 300);
      line(
        cos(angle) * r, sin(angle) * r,
        cos(nextAngle) * nextR, sin(nextAngle) * nextR
      );
    }
  }
  pop();
}

function drawWaveform(waveform) {
  push();
  translate(0, height/2);
  beginShape();
  
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, -200, 200);
    let col = lerpColor(
      colorPalette[0], 
      colorPalette[1], 
      map(i, 0, waveform.length, 0, 1)
    );
    
    stroke(col);
    strokeWeight(1.5);
    vertex(x, y);
  }
  endShape();
  pop();
}

function createParticles(energy) {
  let particleCount = map(energy, 100, 255, 5, 20);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function mousePressed() {
  if (!audioLoaded) {
    userStartAudio();
    soundFile.loop();
    fft.setInput(soundFile);
    audioLoaded = true;
  }
}

function keyPressed() {
  if (key === 'n' || key === 'N') {
    currentTrack = (currentTrack + 1) % tracks.length;
    soundFile.stop();
    soundFile = loadSound(tracks[currentTrack], () => {
      soundFile.loop();
    });
  }
}

// Star background class
class Star {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(0.5, 3);
    this.brightness = random(50, 100);
    this.twinkleSpeed = random(0.01, 0.05);
  }
  
  display() {
    let twinkle = sin(frameCount * this.twinkleSpeed) * 20 + this.brightness;
    fill(255, twinkle);
    noStroke();
    circle(this.x, this.y, this.size);
  }
}

// Particle class
class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(random(1, 3));
    this.size = random(5, 15);
    this.color = color(random(360), 80, 100, 0.8);
    this.life = 100;
  }
  
  update() {
    this.pos.add(this.vel);
    this.life -= 1;
    this.size *= 0.98;
  }
  
  display() {
    this.color.setAlpha(map(this.life, 0, 100, 0, 0.8));
    fill(this.color);
    noStroke();
    circle(this.pos.x, this.pos.y, this.size);
  }
  
  isDone() {
    return this.life <= 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}