let coffeeData = [
  {country: "Finland", cupsPerDay: 3.2, color: [0, 100, 50]},
  {country: "Norway", cupsPerDay: 2.6, color: [30, 100, 50]},
  {country: "Iceland", cupsPerDay: 2.5, color: [60, 100, 50]},
  {country: "Denmark", cupsPerDay: 2.4, color: [90, 100, 50]},
  {country: "Netherlands", cupsPerDay: 2.3, color: [120, 100, 50]},
  {country: "Sweden", cupsPerDay: 2.2, color: [150, 100, 50]},
  {country: "Switzerland", cupsPerDay: 2.1, color: [180, 100, 50]},
  {country: "Belgium", cupsPerDay: 2.0, color: [210, 100, 50]},
  {country: "Luxembourg", cupsPerDay: 1.9, color: [240, 100, 50]},
  {country: "Canada", cupsPerDay: 1.8, color: [270, 100, 50]},
  {country: "Germany", cupsPerDay: 1.7, color: [300, 100, 50]},
  {country: "France", cupsPerDay: 1.6, color: [330, 100, 50]},
  {country: "Croatia", cupsPerDay: 1.5, color: [0, 80, 60]},
  {country: "Italy", cupsPerDay: 1.4, color: [30, 80, 60]},
  {country: "Brazil", cupsPerDay: 1.3, color: [60, 80, 60]},
  {country: "Austria", cupsPerDay: 1.2, color: [90, 80, 60]},
  {country: "Slovenia", cupsPerDay: 1.1, color: [120, 80, 60]},
  {country: "Greece", cupsPerDay: 1.0, color: [150, 80, 60]},
  {country: "Spain", cupsPerDay: 0.9, color: [180, 80, 60]},
  {country: "Portugal", cupsPerDay: 0.8, color: [210, 80, 60]}
];

let sorted = false;
let animating = false;
let animationStart = 0;
let originalPositions = [];
let currentPositions = [];

function setup() {
  createCanvas(1000, 600);
  colorMode(HSB, 360, 100, 100);
  textAlign(CENTER, CENTER);
  
  // Store original positions
  for (let i = 0; i < coffeeData.length; i++) {
    originalPositions[i] = createVector(150, 100 + i * 25);
    currentPositions[i] = createVector(150, 100 + i * 25);
  }
}

function draw() {
  background(240);
  
  // Title
  fill(30);
  textSize(24);
  text("Global Coffee Consumption (Cups per Day)", width/2, 40);
  textSize(14);
  text("Source: International Coffee Organization | Click to sort | Hover for details", width/2, 70);
  
  // Animation logic
  if (animating) {
    let progress = (millis() - animationStart) / 1000;
    if (progress >= 1) {
      animating = false;
      progress = 1;
    }
    
    for (let i = 0; i < currentPositions.length; i++) {
      let targetY = sorted ? 
        100 + i * 25 : 
        originalPositions[coffeeData.findIndex(d => d.country === coffeeData[i].country)].y;
      
      currentPositions[i].y = lerp(currentPositions[i].y, targetY, progress * 0.1);
    }
  }
  
  // Draw data
  for (let i = 0; i < coffeeData.length; i++) {
    let data = coffeeData[i];
    let x = currentPositions[i].x;
    let y = currentPositions[i].y;
    
    // Highlight on hover
    if (dist(mouseX, mouseY, x + 200, y) < 50) {
      fill(30);
      textSize(12);
      text(`${data.country}: ${data.cupsPerDay} cups/day`, x + 200, y - 20);
      stroke(30);
      strokeWeight(1.5);
    } else {
      noStroke();
    }
    
    // Coffee cup icon
    fill(data.color);
    rect(x, y - 10, 30, -data.cupsPerDay * 15);
    line(x - 5, y - 10, x + 35, y - 10);
    
    // Country label
    fill(30);
    textSize(12);
    text(data.country, x + 200, y);
    
    // Value label
    text(nf(data.cupsPerDay, 1, 1), x + 300, y);
    
    // Bar graph
    fill(data.color);
    rect(x + 400, y - 5, data.cupsPerDay * 40, 10);
  }
  
  // Legend
  drawLegend();
}

function drawLegend() {
  fill(30);
  textSize(14);
  text("Cups per Day", 500, height - 40);
  
  for (let i = 0; i <= 3; i++) {
    let x = 400 + i * 100;
    line(x, height - 50, x, height - 45);
    text(i, x, height - 30);
  }
}

function mousePressed() {
  if (!animating) {
    sorted = !sorted;
    if (sorted) {
      coffeeData.sort((a, b) => b.cupsPerDay - a.cupsPerDay);
    } else {
      coffeeData.sort((a, b) => 
        originalPositions[coffeeData.findIndex(d => d.country === a.country)].y - 
        originalPositions[coffeeData.findIndex(d => d.country === b.country)].y
      );
    }
    animationStart = millis();
    animating = true;
  }
}