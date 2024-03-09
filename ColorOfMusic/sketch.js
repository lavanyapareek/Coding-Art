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
  var blob = new Blob(chunks, { 'type' : 'video/webm' });

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
    
  // toggle recording true or false
  recording = !recording
  console.log(recording);
  
  // 82 is keyCode for r 
  // if recording now true, start recording 
  if (keyCode === 82 && recording ) {
    
    console.log("recording started!");
    recorder.start();
  } 
  
  // if we are recording, stop recording 
  if (keyCode === 82 && !recording) {  
    console.log("recording stopped!");
    recorder.stop();
  }
  
}


function preload(){
  sound = loadSound('audiofile3.mp3');                                                    
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(fr);
  
  // initialize recorder
  record();

  userStartAudio();
  sound.loop();
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();

  background(0);
}

function draw() {
  background(0, 20);
  translate(width/2,height/2);
  var spectrum = fft.analyze();
  colorMode(HSB, 512, 1024, 1024, 100);
  p.push(new Particle(color(colourChoose(), 1024, 1024)));
  
  var level = amplitude.getLevel();

  var size = map(level, 0, 1, 0, 200);                                                              
  
  for (var i = 0; i < p.length; i ++) {

    var freqId = i % 1024;                                                                          

    var spec = map(spectrum[freqId], 0, 255, 0, 0.01);                                              
    p[i].display();
    p[i].speedFactor = spec;
    p[i].update();

    if (dist(p[i].pos.x, p[i].pos.y, p[i].targetPos.x, p[i].targetPos.y) < size) {

        p.splice(i, 1);                                                                              
    }
  }
  

  push();
  //stroke(colourChoose(), 1024, 1024, 100);
  //strokeWeight(size);
  //line(pmouseX, pmouseY, mouseX, mouseY);
  pop();
}


function colourChoose() {
    var spectrum = fft.analyze();
    var specHue = 0;

    for (var i = 0; i < spectrum.length; i++) {

      var m = map(spectrum[i], 0, 255, 0, 1);
      specHue += m;
    }
    return specHue;
}


function Particle(col) {

  this.init = function() {                                                                  
    var rand = floor(random(0, 4));
    var vec;
    var radius = height/2;
    var theta = random(0, TWO_PI);
    var x1 = radius*cos(theta);
    var y1 = radius*sin(theta);
    vec = createVector(x1,y1)
    // if (rand == 0) {
    //   //Top
    //   vec = createVector(random(width), 0);                                                          
    // } else if (rand == 1) {
    //   //Bottom
    //   vec = createVector(random(width), height);                                                    
    // } else if (rand == 2) {
    //   //Left
    //   vec = createVector(0, random(height));                                                        
    // } else {
    //   //Right
    //   vec = createVector(width, random(height));                                                    
    // }
    return vec;
  }
  

  this.pos = this.init();
  this.targetPos = createVector(mouseX, mouseY);

  this.col = col;
  this.speedFactor;
  

  this.update = function() {
    this.posXp = this.pos.x;
    this.posYp = this.pos.y;
    this.pos.x += ((this.targetPos.x - this.pos.x)*Math.sqrt(Math.abs(this.targetPos.x - this.pos.x)/6)) * this.speedFactor;
    this.pos.y += ((this.targetPos.y - this.pos.y)*Math.sqrt(Math.abs(this.targetPos.y - this.pos.y)/6)) * this.speedFactor;
    //targetPos = mouse position
    
    this.targetPos.x = 0;
    this.targetPos.y = 0;
  }
  

  this.display = function() {
    fill(this.col);
    noStroke();
    ellipse(this.pos.x, this.pos.y, 7);
    line(this.pos.x, this.pos.y, this.posXp, this.posYp)
  }
}
