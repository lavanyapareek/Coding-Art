


function Star() {
  this.co = [[255,255,255],[255,255,255],[255,255,255],[255,255,255],[255,255,255],[255,255,255],[255,255,255],[255,255,255], [0,0,255], [255,0,0], [255,255,0], [255, 191, 0],[255,255,255],[255,255,255],[255,255,255]]
  this.c = this.co[Math.floor(random(0,15))]
  this.x = random(-width, width)
  this.y = random(-height, height)
  this.z = random(width)
  this.c1 = random(0, 255)
  this.c2 = random(0, 255)
  this.c3 = random(0, 255)
  this.update = function () {
      this.z = this.z - speed
      
      if (this.z < 1) {
          this.z = width
          this.x = random(-width, width)
          this.y = random(-height, height)
          this.pz = this.z
      }
  }
  this.show = function () {
      var c = this.c
      fill(c)
      noStroke()
      var sx = map(this.x / this.z, 0, 1, 0, width)
      var sy = map(this.y / this.z, 0, 1, 0, height)
      var r = map(this.z, 0, width, 8, 0)
      ellipse(2*sx, 2*sy, r, r)
      var px = map(this.x / this.pz, 0, 1, 0, width)
      var py = map(this.y / this.pz, 0, 1, 0, height)
      this.pz = this.z
      stroke(c)
      line(px, py, sx, sy)
  }
}
var stars = []
var speed

function setup(){
  createCanvas(windowWidth, windowHeight);
  for(var i = 0; i < 2000; i++){
    stars[i] = new Star();
  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
function draw(){
  speed = map(mouseX, 0, width, 0, 100);
  background(0);
  translate(width/2, height/2);
  for(var i = 0; i < stars.length; i++){
    stars[i].update();
    stars[i].show();
  }
}