let antColor = new Uint8Array([100, 125, 200]);
const antsNum = 8192;
let sensorOffset = 10;
const clockwise = 90;
const counter = -90;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  pixelDensity(1);
  background(0); // Initialize trail

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
  for (let i = 1; i--;) {
    ants.updateAngle();
    ants.updatePosition();
    ants.updateColor();
  }
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
    return pixels[index]; // Only get red channel
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
    const speed = random(1, 5); // Random speed
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
