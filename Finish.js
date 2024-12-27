class Finish{
    constructor(x, y, diameter){
        this.x = x;
        this.y = y;
        this.diameter = diameter;
        this.color = "#000"
    }

    display(){
        fill(this.color);
        circle(this.x, this.y, this.diameter);
    }
}