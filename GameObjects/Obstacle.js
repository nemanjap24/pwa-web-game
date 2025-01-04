class Obstacle{
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.w = width;
        this.h = height;
        this.color = "#1a0dd9";
    }
    display(){
        rectMode(CENTER);
        fill(this.color);
        rect(this.x, this.y, this.w, this.h);
    }
}