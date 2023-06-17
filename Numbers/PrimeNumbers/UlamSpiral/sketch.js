let x, y;
let px, py;
let step = 1;
let numSteps = 1;
let state = 0;
let turnCounter = 1;
let totalSteps;
let speed;
class Spiral {
  constructor(x, y, w, h) {
    this.stepSize = 2;
    this.pos = createVector(x, y);
    const cols = w / this.stepSize;
    const rows = h / this.stepSize;
    this.totalSteps = cols * rows;
    this.x = 0;
    this.y = 0;
    this.px = this.x;
    this.py = this.y;
    this.step = 1;
    this.numSteps = 1;
    this.turnCounter = 1;
    this.state = 0;
  }

  update(testFunction) {
    push();
    translate(this.pos.x, this.pos.y);
    noStroke();
    if (testFunction(this.step)) {
      fill(255);
      circle(this.x, this.y, this.stepSize * 0.2);
    } else {
      fill(10);
      circle(this.x, this.y, this.stepSize * 0.2);
    }
    strokeWeight(1);
    stroke(255, 50);
    pop();
    this.px = this.x;
    this.py = this.y;

    switch (this.state) {
      case 0:
        this.x += this.stepSize;
        break;
      case 1:
        this.y -= this.stepSize;
        break;
      case 2:
        this.x -= this.stepSize;
        break;
      case 3:
        this.y += this.stepSize;
        break;
    }

    if (this.step % this.numSteps == 0) {
      this.state = (this.state + 1) % 4;
      this.turnCounter++;
      if (this.turnCounter % 2 == 0) {
        this.numSteps++;
      }
    }
    this.step++;

    if (this.step > this.totalSteps) {
      noLoop();
    }
  }
}

function isRandom(value) {
  return random(1) < 1 / log(value);
}

function isPrime(value) {
  if (value == 1) return false;
  for (let i = 2; i <= sqrt(value); i++) {
    if (value % i == 0) {
      return false;
    }
  }
  return true;
}

let spiral1;
function setup() {
  createCanvas(windowWidth, windowHeight);
  speed = createSlider(0, 10000, 1000, 0.01)
  
  textFont("Courier-Bold");
  background(0);
  spiral1 = new Spiral(windowWidth/2, windowHeight/2, windowHeight, windowHeight);
  
}

function draw() {
  spiral1.update(isPrime)
  for (let i = 0; i < speed.value(); i++) {
    spiral1.update(isPrime);
  }
}