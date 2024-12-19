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

    colides(object){
      //AABB(Axis Aligned Bounding Box) colision detection
      if(
        this.x + this.r > wall.x - wall.w / 2 &&
        this.x - this.r < wall.x + wall.w / 2 &&
        this.y + this.r > wall.y - wall.h / 2 &&
        this.y - this.r < wall.y + wall.h / 2
      ){
        return true;
      } else {
        return false;
      }
    }
    
    handleOrientation(beta, gamma) {
      // Basic tilt control - you'll likely want to refine these values
      this.x += gamma * 0.5; // Adjust multiplier for sensitivity
      this.y += beta * 0.5;
      
      this.x = constrain(this.x, this.diameter/2, width - this.diameter/2);
      this.y = constrain(this.y, this.diameter/2, height - this.diameter/2);
    }
  }