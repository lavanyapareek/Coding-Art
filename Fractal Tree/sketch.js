let angle = 0;
let slider;
let str;
let stw;
let minLen;
let minL = 1;
let red = 1.1;
let red2 = 1.1;
function setup(){
    createCanvas(windowWidth, windowHeight - 30);
    slider = createSlider(0, PI, PI/6, 0.01)
    str = createSlider(0, 10, 1, 0.01);
    str.position(200);
    minLen = createSlider(2, 10, 10, 0.01);
    minLen.position(400);
    reduction = createSlider(1.3, 2, 2, 0.001);
    reduction.position(600);
    reduction2 = createSlider(1.3, 2, 2, 0.001);
    reduction2.position(800);
    
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight - 30);
}
function draw(){
    background(0);
    text("Thickness:", 20, windowHeight)
    angle = slider.value();
    stw = str.value();
    minL = minLen.value();
    red = reduction.value();
    red2 = reduction2.value();
    stroke(255);
    strokeWeight(stw)
    translate(width*0.5, height/1.1);
    branch(height/4, stw);
}
function branch(len, stw){
    line(0, 0, 0, - len);
    translate(0, -len);
    if(len > minL){
        push();
        rotate(angle);
        strokeWeight(stw)
        branch(len/red, stw*0.6)
        branch(len/red2, stw*0.75)
        pop();
        push();
        rotate(-angle);
        strokeWeight(stw)
        branch(len/red, stw*0.6)
        branch(len/red2, stw*0.75)
        pop();
    }
}
