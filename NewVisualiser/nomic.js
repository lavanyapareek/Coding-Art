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


var t;
var scale1 = .9;
var scale2 = .5;
var r1;
var r2;
var r3;
var r4;
var r5;
const redmask   = 0xff000000;
const greenmask = 0x00ff0000;
const bluemask  = 0x0000ff00;

var sound, amplitude;

function preload(){
  sound = loadSound('mcofc.mp3');                                                    
}

function setup(){
  //size(800,800);
  createCanvas(windowWidth, windowHeight);
  background(0,0,0);
  frameRate(fr);
  
  // initialize recorder
  record();
  
  r1 = random (200, 600);
  r2 = -random (70, 250);
  r3 = -random (70, 250);
  r4 = -random (150, 450);
  r5 = random (250, 750);
  t=0;

  userStartAudio();
  sound.loop();
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();

}
var lastlevel = 0;
var threshold = 0.5;
var bgColor = [0,0,0]
function draw(){
  var level = amplitude.getLevel();

 let last = get(0,0,width, height);
 var spectrum = fft.analyze();
 let colorIndex = int(spectrum.length);

//  let mainColor = map(random(spectrum[colorIndex]), 0, 255, 0, 255);
 
if (level > threshold && lastLevel <= threshold) {
  bgColor = (colourChoose()+ 90) % 360
  //bgColor = [255 - mainColor, 255 - (mainColor), 255 - (mainColor)];  
}else{
  bgColor = colourChoose()
  //bgColor = [mainColor, (mainColor), (mainColor)]
}

lastLevel = level;  // Update lastLevel to the current level
colorMode(HSB, 360, 50, 100);
background(bgColor, 50, 100); 

//  if (random(0,250)<1){
//   background(0,0,0);
//  }

 
 colorMode(HSB, 512, 1024, 1024, 100);

 //fill(0,0,0, 7);
 //rect(0,0,width,height);
 stroke(colourChoose(), 512,1024);
 //stroke(random(0,255), random(0,200), random(0,255), 100);
 fill(0,0,0,0);
 strokeWeight(5);
 rect(1,1,width+10, height+10);
 stroke(colourChoose(), 512,1024);
 rect(-10,-10,width+8,height+8); 

 stroke(0,0,0,0);
 fill(colourChoose(), 256, 1024);

 push();
   translate(width/2, height/2);
   rotate(t/(r1*1.5));
   translate(-scale1/2*width, -scale1/2*height);
   //translate(0, 200*sin(t/200));
   image(last, 0,0, scale1*width,scale1*height);
 pop();

 push();
   translate(width/2, height/2);
   rotate(t/(r4));
   translate(0, .8*scale2*width);
   translate(0, 20*sin(t/200));
   
   rotate(t/(r5*1.5));
   translate(-scale2/2*width, -scale2/2*height); 
   image(last, 0,0, scale2*width,scale2*height);
 pop();

 push();
   translate(width/2, height/2);
   rotate(t/(r4));
   translate(0, -.8*scale2*width);
   translate(0, 20*sin(t/200));
   
   rotate(t/(r5*1.5));
   translate(-scale2/2*width, -scale2/2*height); 
   image(last, 0,0, scale2*width,scale2*height);
 pop();
 
 //hollow1

 push();
   stroke(0,0,0,0);
   fill(colourChoose(), 1024, 1024);
   translate(width/2,height/2);
   rotate(t/r3);
   translate(.3*width,.3*height);
   ellipse(0,0,70,70);
 pop();

 push();
   fill(colourChoose(), 1024, 1024);
   strokeWeight(4);
   stroke(colourChoose(), 512,1024);
   translate(width/2,height/2);
   rotate(t/r2);
   translate(width/3,height/3);
   ellipse(0,0,40,40);
 pop();
 
 //makeBlack();

 t += map(level, 0.1, 1.1, 1, 11);
 
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
// makeBlack(){
//   let dark =50;
//  loadPixels();

//  for (let i = 0; i < width*height; i++) {
//  if ((pixels[i] & redmask) <=dark  && (pixels[i] & greenmask) <= dark && (pixels[i] & bluemask) <= dark){
//    pixels[i]=0x000000ff;
   
//  }
//  }
//  updatePixels();
// }