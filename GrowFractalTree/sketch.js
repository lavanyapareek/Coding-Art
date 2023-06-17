var tree = [];
var count = 1;
var leaves = [];
var redA = 1.75;
var redB = 1.75;
var angleA;
var angleB;
let slider;
let angle;
function update(){
  for(var i = 0; i < slider.value() - 1; i++){

  }
}
function setup() {
  createCanvas(windowWidth, windowHeight -30);
  var a = createVector(width/2, height - 200);
  var b = createVector(width/2, height - 500)
  var root = new Branch(a, b);
  tree[0] = root;
  slider = createSlider(1, 1000, 0, 0.001);
  angle = createSlider(0, PI/2, 0, 0.001);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight - 30);
}

function draw() {
  background(0);
  update();
  for(var i = 0; i < tree.length; i++){
    if(!tree[i].finished){
      tree.push(tree[i].branch(redA, angle.value(), str));
      tree.push(tree[i].branch(redB, -angle.value(), str));
      
    }
    count++;
    tree[i].finished = true;
    tree[i].show(count);
  }
}
