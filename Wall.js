class Wall{
    constructor(x,y,w,h, color){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.centerX = x + w/2;
        this.centerY = y + h/2;
        this.color = color || "#FFFFFF"; // Default white if no color provided
    }

    display(){
        fill(this.color);
        rect(this.x, this.y, this.w, this.h);
    }
}