var sound, amplitude;
var p = [];
let recording = false;
let recorder;
let chunks = [];
const fr = 90;

function record() {
  chunks.length = 0;
  let stream = document.querySelector('canvas').captureStream(fr);
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = e => {
    if (e.data.size) {
      chunks.push(e.data);
    }
  };
  recorder.onstop = exportVideo;
}

function exportVideo(e) {
  var blob = new Blob(chunks, { 'type': 'video/webm' });
  var videoElement = document.createElement('video');
  videoElement.setAttribute("id", Date.now());
  videoElement.controls = true;
  document.body.appendChild(videoElement);
  videoElement.src = window.URL.createObjectURL(blob);

  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';
  a.href = url;
  a.download = 'newVid.webm';
  a.click();
  window.URL.revokeObjectURL(url);
}

function keyPressed() {
  recording = !recording;
  if (keyCode === 82 && recording) {
    recorder.start();
  }
  if (keyCode === 82 && !recording) {
    recorder.stop();
  }
}

function preload(){
  sound = loadSound('audio.mp3');                                                    
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(fr);
  record();
  userStartAudio();
  sound.loop();
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();
  background(0);
}

function draw() {
  background(0, 20);
  translate(width/2, height/2);
  var spectrum = fft.analyze();
  colorMode(HSB, 360, 100, 100, 100);  // Use HSB color mode with more color range
  p.push(new Particle(color(colourChoose(spectrum), 100, 100)));

  var level = amplitude.getLevel();
  var size = map(level, 0, 1, 0, 100);

  for (var i = 0; i < p.length; i++) {
    var freqId = i % spectrum.length;
    var spec = map(spectrum[freqId], 0, 255, 0, 0.01);
    p[i].display();
    p[i].speedFactor = spec;
    p[i].update();

    if (dist(p[i].pos.x, p[i].pos.y, p[i].targetPos.x, p[i].targetPos.y) < size) {
        p.splice(i, 1);
    }
  }
}

function colourChoose(spectrum) {
  var specHue = 0;
  for (var i = 0; i < spectrum.length; i++) {
    var m = map(spectrum[i], 0, 255, 0, 1);
    specHue += m * (i / spectrum.length) * 2;  
  }
  return specHue % 360;  
}

function Particle(col) {
  this.init = function() {
    var radius = height/2;
    var theta = random(0, TWO_PI);
    var x1 = radius * cos(theta);
    var y1 = radius * sin(theta);
    return createVector(x1, y1);
  }

  this.pos = this.init();
  this.targetPos = createVector(mouseX, mouseY);
  this.col = col;
  this.speedFactor;

  this.update = function() {
    this.pos.x += ((this.targetPos.x - this.pos.x) * Math.sqrt(Math.abs(this.targetPos.x - this.pos.x) / 10)) * this.speedFactor;
    this.pos.y += ((this.targetPos.y - this.pos.y) * Math.sqrt(Math.abs(this.targetPos.y - this.pos.y) / 10)) * this.speedFactor;
    this.targetPos.x = 0;
    this.targetPos.y = 0;
  }

  this.display = function() {
    fill(this.col);
    noStroke();
    ellipse(this.pos.x, this.pos.y, 7);
    line(this.pos.x, this.pos.y, this.pos.x, this.pos.y)
  }
}
