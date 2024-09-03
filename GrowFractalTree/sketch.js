var tree = [];
var leaves = [];
var redA = 1.80;
var redB = 1.20;
let angleA;
let angleB;
let slider;
let iter = 0;
function setup() {
  createCanvas(windowWidth, windowHeight);
  var a = createVector(width / 2, height);
  var b = createVector(width / 2, height - 250);
  var root = new Branch(a, b, 0, 100);  // Start with stroke weight of 100
  tree.push(root);
  slider = createSlider(1, 100000, 1, 1); // Controls the depth of the tree
  angleA = createSlider(0, PI / 2, PI / 4, 0.01);
  angleB = angleA.value()  // Controls the angle of branches
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight - 30);
}

function draw() {
  background(0);
  for (var i = 0; i < tree.length; i++) {
    tree[i].show();
  }

  // Only grow the tree when there are unfinished branches
  if (slider.value() > tree.length / 2) {
    for (var i = tree.length - 1; i >= 0; i--) {
      if (!tree[i].finished) {
        iter += 1
        if(i%13 == 0){
          tree.push(tree[i].branch(iter, redA, angleA.value()));
          tree.push(tree[i].branch(iter, redB, -angleB));
        }else{
          tree.push(tree[i].branch(iter, redB, angleB));
          tree.push(tree[i].branch(iter, redA, -angleA.value()));
        }

        tree[i].finished = true;
      }
    }
  }
}
