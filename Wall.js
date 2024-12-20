class Wall {
  constructor(x, y, w, h, color) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color || "#FFFFFF"; // Default white if no color provided
  }

  display() {
    rectMode(CENTER);
    fill(this.color);
    rect(this.x, this.y, this.w, this.h);
  }
}
