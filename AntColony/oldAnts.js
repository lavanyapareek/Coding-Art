let antColor = new Uint8Array([100, 125, 200]);
const antsNum = 8192;
let sensorOffset = 60;
const clockwise = 45;
const counter = -45;

function placeFoodCircle(cx, cy, radius, color) {
  for (let x = -radius; x <= radius; x++) {
    for (let y = -radius; y <= radius; y++) {
      if (x * x + y * y <= radius * radius) { // Check if the point is within the circle
        const px = cx + x;
        const py = cy + y;
        if (px >= 0 && px < width && py >= 0 && py < height) { // Ensure within bounds
          const index = (px + py * width) * 4;
          pixels[index] = color[0];
          pixels[index + 1] = color[1];
          pixels[index + 2] = color[2];
          pixels[index + 3] = 255; // Full opacity
        }
      }
    }
  }
}
let brightColor = new Uint8Array([255, 255, 255]);
const foodRadius = 10;
function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  pixelDensity(1);
  background(0); // Initialize trail
  placeFoodCircle(0, 0, foodRadius, brightColor);
   // White color for the food
  ants.init();
}












function draw() {
  background(0, 50); // Update trail
  stroke(255);
  strokeWeight(1);
  if (mouseIsPressed) {
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
  loadPixels();

  for (let i = 10; i--;) {
    ants.updateAngle();
    ants.updatePosition();
    ants.updateColor();
  }
  

  // Bottom-left corner
  placeFoodCircle(width/5, height/2, foodRadius*1.5, brightColor)

  placeFoodCircle(width/5, height/7, foodRadius*4, brightColor)
  // Bottom-right corner
  placeFoodCircle(width/3, height/3, foodRadius, brightColor);

  placeFoodCircle(width/2, height/2, foodRadius*2, brightColor)
  updatePixels();
}

const ant = () => ({
  x: width / 2,
  y: height / 2,
  angle: random(360),
  step: random(2, 3)
});

const ants = {
  ants: [],
  init() {
    this.ants.length = 0;
    for (let i = antsNum; i--;) this.ants.push(ant());
  },

  smell(a, d) {
    const aim = a.angle + d;
    let x = Math.floor(a.x + sensorOffset * cos(aim));
    let y = Math.floor(a.y + sensorOffset * sin(aim));

    x = (x + width) % width;
    y = (y + height) % height;

    const index = (x + y * width) * 4;
    return pixels[index]; // Only get one channel
  },

  updateAngle() {
    for (const a of this.ants) {
      const right = this.smell(a, clockwise),
        center = this.smell(a, 0),
        left = this.smell(a, counter);

      if (center > left && center > right) {
        // Carry on straight
      } else if (left < right) {
        a.angle += clockwise;
      } else if (left > right) {
        a.angle += counter;
      }
    }
  },

  updatePosition() {
    const speed = 1; // Random speed
    for (const a of this.ants) {
      a.x += cos(a.angle) * speed;
      a.y += sin(a.angle) * speed;
      a.x = (a.x + width) % width;
      a.y = (a.y + height) % height;
    }
  },

  updateColor() {
    for (const a of this.ants) {
      const index = (Math.floor(a.x) + Math.floor(a.y) * width) * 4;
      pixels[index] = antColor[0];
      pixels[index + 1] = antColor[1];
      pixels[index + 2] = antColor[2];
    }
  }
};
