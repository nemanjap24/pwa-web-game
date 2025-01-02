class Finish{
    constructor(x, y, diameter, onLevelComplete){
        this.x = x;
        this.y = y;
        this.diameter = diameter;
        this.color = "#000"
        this.onLevelComplete = onLevelComplete;
    }

    display(){
        fill(this.color);
        circle(this.x, this.y, this.diameter);
    }
    onCollision(obj, distance){
        if(obj instanceof Ball){
            //TODO next level
            this.onLevelComplete();
        }
    }
}