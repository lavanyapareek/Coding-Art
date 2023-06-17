function Branch(begin, end, angle){
    this.begin = begin;
    this.end = end;
    this.angle = angle;
    this.finished = false;
    
    this.show = function(){
        stroke(255);
        strokeWeight(0.75)
        line(this.begin.x, this.begin.y, this.end.x, this.end.y)
    }
    this.jitter = function(){
        this.end.x += random(-0.1,0.1);
        this.end.y += random(-0.1,0.1);
    }

    this.branch = function(red, angle, str){
        var dir = p5.Vector.sub(this.end, this.begin);
        dir.rotate(angle);
        dir.mult(1/red);
        var newEnd = p5.Vector.add(this.end, dir);
        var right = new Branch(this.end, newEnd)
        return right;
    }
}