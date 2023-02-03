function Star() {
  this.x = random(-width, width)
  this.y = random(-height, height)
  this.z = random(width)
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
      fill(255)
      noStroke()
      var sx = map(this.x / this.z, 0, 1, 0, width)
      var sy = map(this.y / this.z, 0, 1, 0, height)
      var r = map(this.z, 0, width, 8, 0)
      ellipse(2*sx, 2*sy, r, r)
      var px = map(this.x / this.pz, 0, 1, 0, width)
      var py = map(this.y / this.pz, 0, 1, 0, height)
      this.pz = this.z
      stroke(255)
      line(px, py, sx, sy)
  }
}
var stars = []
var speed
function setup(){
  createCanvas(1920, 1080);
  for(var i = 0; i < 2000; i++){
    stars[i] = new Star();
  }
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