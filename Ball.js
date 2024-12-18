class Ball {
    constructor(x, y, diameter, color) {
      this.x = x;
      this.y = y;
      this.diameter = diameter;
      this.color = color || "#FFFFFF"; // Default white if no color provided
      this.xSpeed = 0;
      this.ySpeed = 0;
      this.speed = 5; // Movement speed
    }
  
    move(keys) {
      this.xSpeed = 0;
      this.ySpeed = 0;
  
      if (keys['w'] || keys['arrowup']) {
        this.ySpeed = -this.speed;
      }
      if (keys['a'] || keys['arrowleft']) {
        this.xSpeed = -this.speed;
      }
      if (keys['s'] || keys['arrowdown']) {
        this.ySpeed = this.speed;
      }
      if (keys['d'] || keys['arrowright']) {
        this.xSpeed = this.speed;
      }
  
      this.x += this.xSpeed;
      this.y += this.ySpeed;
      
      // Constrain to canvas bounds
      this.x = constrain(this.x, this.diameter/2, width - this.diameter/2);
      this.y = constrain(this.y, this.diameter/2, height - this.diameter/2);
    }
  
    display() {
      fill(this.color);
      circle(this.x, this.y, this.diameter);
    }
    
    
  }