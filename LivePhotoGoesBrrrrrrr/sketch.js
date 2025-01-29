let capture;
let fft;
let sound;

function preload() {
  sound = loadSound('mand.mp3'); // Replace with your audio file
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  capture.size(windowWidth, windowHeight);
  capture.hide(); // Hide the default webcam feed

  userStartAudio();
  sound.loop();
  fft = new p5.FFT();
}

function draw() {
  background(0);

  // Get frequency spectrum and energy levels
  let bass = fft.getEnergy('bass');
  let treble = fft.getEnergy('treble');
  let mid = fft.getEnergy('mid');

  // Capture the webcam feed
  let camFrame = capture.get();

  // Define filters as functions
  let filters = [
    (img) => { img.filter(GRAY); },
    (img) => { img.filter(INVERT); },
    (img) => { img.filter(THRESHOLD, map(mid, 0, 255, 0.2, 0.8)); }, // Threshold level varies with mid
    (img) => { img.filter(BLUR, map(treble, 0, 255, 1, 5)); },       // Blur intensity varies with treble
    (img) => { img.filter(POSTERIZE, int(map(bass, 0, 255, 2, 10))); } // Posterize levels vary with bass
  ];

  // Shuffle the filters to assign them dynamically
  shuffle(filters, true);

  // Create independent frames with filters
  let topLeft = camFrame.get(0, 0, camFrame.width / 2, camFrame.height / 2);
  let topRight = camFrame.get(camFrame.width / 2, 0, camFrame.width / 2, camFrame.height / 2);
  let bottomLeft = camFrame.get(0, camFrame.height / 2, camFrame.width / 2, camFrame.height / 2);
  let bottomRight = camFrame.get(camFrame.width / 2, camFrame.height / 2, camFrame.width / 2, camFrame.height / 2);

  // Apply filters and draw each quadrant
  filters[0](topLeft);
  image(topLeft, 0, 0, width / 2, height / 2);

  filters[1](topRight);
  image(topRight, width / 2, 0, width / 2, height / 2);

  filters[2](bottomLeft);
  image(bottomLeft, 0, height / 2, width / 2, height / 2);

  filters[3](bottomRight);
  image(bottomRight, width / 2, height / 2, width / 2, height / 2);
}
