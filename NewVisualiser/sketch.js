let recording = false;
let recorder;
let chunks = [];
const fr = 90;

function record() {
  chunks.length = 0;
  let stream = document.querySelector('canvas').captureStream(fr);
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (e) => {
    if (e.data.size) {
      chunks.push(e.data);
    }
  };
  recorder.onstop = exportVideo;
}

function exportVideo() {
  var blob = new Blob(chunks, { type: 'video/webm' });

  // Draw video to screen
  var videoElement = document.createElement('video');
  videoElement.setAttribute("id", Date.now());
  videoElement.controls = true;
  document.body.appendChild(videoElement);
  videoElement.src = window.URL.createObjectURL(blob);

  // Download the video
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
  console.log(recording);

  if (keyCode === 82 && recording) {
    console.log("recording started!");
    recorder.start();
  }

  if (keyCode === 82 && !recording) {
    console.log("recording stopped!");
    recorder.stop();
  }
}

let t;
let scale1 = 0.9;
let scale2 = 0.5;
let r1, r2, r3, r4, r5;
const redmask = 0xff000000;
const greenmask = 0x00ff0000;
const bluemask = 0x0000ff00;

let mic, amplitude, fft;

function preload() {
  // No sound file needed as we use microphone input
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  frameRate(fr);

  // Initialize recorder
  record();

  r1 = random(200, 600);
  r2 = -random(70, 250);
  r3 = -random(70, 250);
  r4 = -random(150, 450);
  r5 = random(250, 750);
  t = 0;

  // Start microphone input
  mic = new p5.AudioIn();
  mic.start();
  mic.amp(2.0); // Amplify microphone input by 2x

  fft = new p5.FFT();
  fft.setInput(mic);
  fft.smooth(0.8); // Apply smoothing for FFT

  amplitude = new p5.Amplitude();
  amplitude.setInput(mic);
}

let lastLevel = 0;
const threshold = 0.1; // Lower threshold for higher sensitivity
let bgColor = [0, 0, 0];

function draw() {
  const level = amplitude.getLevel() * 2; // Amplify amplitude by 2x
  const last = get(0, 0, width, height);
  const spectrum = fft.analyze();

  if (level > threshold && lastLevel <= threshold) {
    bgColor = (colourChoose() + 90) % 360;
  } else {
    bgColor = colourChoose();
  }

  lastLevel = level;
  colorMode(HSB, 360, 50, 100);
  background(bgColor, 50, 100);

  colorMode(HSB, 512, 1024, 1024, 100);
  stroke(colourChoose(), 512, 1024);
  fill(0, 0, 0, 0);
  strokeWeight(5);
  rect(1, 1, width + 10, height + 10);

  push();
  translate(width / 2, height / 2);
  rotate(t / (r1 * 1.5));
  translate(-scale1 / 2 * width, -scale1 / 2 * height);
  image(last, 0, 0, scale1 * width, scale1 * height);
  pop();

  push();
  translate(width / 2, height / 2);
  rotate(t / r4);
  translate(0, 0.8 * scale2 * width);
  translate(0, 20 * sin(t / 200));
  rotate(t / (r5 * 1.5));
  translate(-scale2 / 2 * width, -scale2 / 2 * height);
  image(last, 0, 0, scale2 * width, scale2 * height);
  pop();

  t += map(level, 0.1, 1.1, 1, 11);
}

function colourChoose() {
  const spectrum = fft.analyze();
  let specHue = 0;

  for (let i = 0; i < spectrum.length; i++) {
    const m = map(spectrum[i], 0, 255, 0, 1);
    specHue += m;
  }
  return specHue;
}
