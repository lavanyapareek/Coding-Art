
let antColor = new Uint8Array([100, 125, 200]);
const antsNum = 4096;
let sensorOffset = 7.5;
const clockwise = 30;
const counter = -30;

var sound;

function preload() {
  sound = loadSound('audiofile3.mp3');
}

setup = () => {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  pixelDensity(1);
  background(0); // Initialize trail

  userStartAudio();
  sound.loop();
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();

  ants.init();
};



draw = () => {

  background(0, 50); // Update trail

  var spectrum = fft.analyze();
  colorMode(HSB, 512, 1024, 1024, 100);
  p.push(new Particle(color(colourChoose(), 1024, 1024)));
  
  var level = amplitude.getLevel();

  var size = map(level, 0, 1, 0, 200);
  
  var freqId = i % 1024;                                                                          


  stroke(255);
  strokeWeight(1);
  mouseIsPressed && line(pmouseX, pmouseY, mouseX, mouseY);
  loadPixels();
  for (let i = 15; i--;) {

    var freqId = i % 1024;                                                                          

    var spec = map(spectrum[freqId], 0, 255, 0, 0.01);

    ants.updateAngle();
    ants.updatePosition(spec);
    ants.updateColor();
  }
  updatePixels();

};

var sound, amplitude;

function colourChoose() {
  var spectrum = fft.analyze();
  var specHue = 0;

  for (var i = 0; i < spectrum.length; i++) {

    var m = map(spectrum[i], 0, 255, 0, 1);
    specHue += m;
  }
  return specHue;
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
    let x = 0 | (a.x + sensorOffset * cos(aim));
    let y = 0 | (a.y + sensorOffset * sin(aim));

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
        /* Carry on straight */
      } else if (left < right) a.angle += clockwise;
      else if (left > right) a.angle += counter;
    }
  },

  updatePosition(spec) {
    const speed = map(spec, 1, 5, 1, 0.1)
    for (const a of this.ants) {
      a.x += cos(a.angle) * speed;
      a.y += sin(a.angle) * speed;
      a.x = (a.x + width) % width;
      a.y = (a.y + height) % height;



    }
  },
  updateColor() {
    for (const a of this.ants) {
      const index = ((0 | a.x) + (0 | a.y) * width) * 4;
      pixels.set(colourChoose(), index);
    }
  }
};