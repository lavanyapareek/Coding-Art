let antColor = new Uint8Array([100, 125, 200]);
const antsNum = 8192;
let sensorOffset = 30;
const clockwise = 30;
const counter = -30;
let c = 0;

let brightColor = new Uint8Array([255, 255, 255]);
const foodRadius = 10;


const fr = 90;

function preload(){
    sound = loadSound('mand.mp3');
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  pixelDensity(1);
  background(0);

    userStartAudio();
    sound.loop();
    fft = new p5.FFT();
    amplitude = new p5.Amplitude();

  ants.init();
}
var lastlevel = 0;
var threshold = 0.5;
var bgColor = [0,0,0]



function colourChoose() {
  var spectrum = fft.analyze();
  var specHue = 0;
  for (var i = 0; i < spectrum.length; i++) {
    var m = map(spectrum[i], 0, 255, 0, 1);
    specHue += m;
  }
  return specHue;
}
var speed;
var level
function draw() {

  level = amplitude.getLevel();

  let last = get(0,0,width, height);
  var spectrum = fft.analyze();
  let colorIndex = int(spectrum.length);

  background(0, 50); // Update trail
  stroke(255);
  strokeWeight(1);
  if (mouseIsPressed) {
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
  //colorMode(HSB, 360, 50, 100);
  loadPixels();

  for (let i = 10; i--;) {
    
    ants.updateAngle();
    
    if (level > threshold && lastLevel <= threshold) {
      ants.updateColor((colourChoose()+ 90) % 360);
      f = 10
      //bgColor = [255 - mainColor, 255 - (mainColor), 255 - (mainColor)];  
    }else{
      ants.updateColor(colourChoose());
      f = 1
      //bgColor = [mainColor, (mainColor), (mainColor)]
    }
    ants.updatePosition(f);
    
  }
  lastLevel = level; 
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

  updatePosition(f) {
    const speed = f*map(level, 0.1, 1.1, 1, 11)/10;;  
    for (const a of this.ants) {
      a.x += cos(a.angle) * speed;
      a.y += sin(a.angle) * speed;
      a.x = (a.x + width) % width;
      a.y = (a.y + height) % height;
    }
  },

  updateColor(color) {
    var base = Math.floor(color * 85); // Map the sum into a range of 0-255
    // Create a color based on specHue
    var r = (base + 50) % 256; // Adding offset to avoid pure black
    var g = (base + 75) % 256; // Adding offset to vary the green component
    var b = (base + 150) % 256; 
    antColor = new Uint8Array([r, g, b])

    for (const a of this.ants) {
      const index = (Math.floor(a.x) + Math.floor(a.y) * width) * 4;
      pixels[index] = antColor[0];
      pixels[index + 1] = antColor[1];
      pixels[index + 2] = antColor[2];
    }
  }
};
