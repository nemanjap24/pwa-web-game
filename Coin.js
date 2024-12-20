class Coin {
    constructor(x, y, diameter, value) {
        this.x = x;
        this.y = y;
        this.diameter = diameter;
        this.value = value;
    }
    
    display() {
        fill("yellow");
        circle(this.x, this.y, this.diameter);

    }
}