function Branch(begin, end, angle, weight) {
    this.begin = begin;
    this.end = end;
    this.angle = angle;
    this.weight = weight;
    this.finished = false;
    
    this.show = function() {
        stroke(255);
        strokeWeight(this.weight);
        line(this.begin.x, this.begin.y, this.end.x, this.end.y);
    }

    this.branch = function(iter, red, angle) {
        var dir = p5.Vector.sub(this.end, this.begin);
        dir.rotate(angle);
        dir.mult(1 / red);
        var newEnd = p5.Vector.add(this.end, dir);
        var newWeight = (this.weight - Math.sqrt(iter))* 0.4;  // Decrease stroke weight for each branch
        return new Branch(this.end, newEnd, angle, newWeight);
    }
}
