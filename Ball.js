class Ball {
  constructor(x, y, diameter, color) {
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.r = diameter / 2; // Radius for easier calculations
    this.color = color || "#FFFFFF";
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.speed = 5;
  }

  move(keys) {
    // Accept an array of walls
    this.xSpeed = 0;
    this.ySpeed = 0;

    if (keys["w"] || keys["arrowup"]) {
      this.ySpeed = -this.speed;
    }
    if (keys["a"] || keys["arrowleft"]) {
      this.xSpeed = -this.speed;
    }
    if (keys["s"] || keys["arrowdown"]) {
      this.ySpeed = this.speed;
    }
    if (keys["d"] || keys["arrowright"]) {
      this.xSpeed = this.speed;
    }

    this.x += this.xSpeed;
    this.y += this.ySpeed;

    // Constrain to canvas bounds
    this.x = constrain(this.x, this.r, width - this.r);
    this.y = constrain(this.y, this.r, height - this.r);
  }
  //obj = object with which the ball is colliding
  onCollision(obj, distance){
    if(obj instanceof Wall){
      let closestX = constrain(this.x, obj.x - obj.w / 2, obj.x + obj.w / 2);
      let closestY = constrain(this.y, obj.y - obj.h / 2, obj.y + obj.h / 2);
      
      // Calculate collision normal (direction from wall to circle)
      let collisionNormalX = this.x - closestX;
      let collisionNormalY = this.y - closestY;
  
      // Normalize the normal vector
      let normalLength = sqrt(collisionNormalX * collisionNormalX + collisionNormalY * collisionNormalY);
      if (normalLength > 0) {
        //Avoid dividing by zero
        collisionNormalX /= normalLength;
        collisionNormalY /= normalLength;
      }
  
      // Separate the this from the wall (very important)
      let penetrationDepth = this.r - distance;
      this.x += collisionNormalX * penetrationDepth;
      this.y += collisionNormalY * penetrationDepth;
    } else if(obj instanceof Obstacle){
      this.x = this.startX;
      this.y = this.startY;
    }
  }

  display() {
    fill(this.color);
    circle(this.x, this.y, this.diameter);
  }

  handleOrientation(beta, gamma) {
    // Convert orientation data to velocities with limits
    let maxSpeed = this.speed; // Use same speed limit as keyboard controls
    
    // Add velocity damping/smoothing
    this.xSpeed = constrain(gamma * 0.2, -maxSpeed, maxSpeed); 
    this.ySpeed = constrain(beta * 0.2, -maxSpeed, maxSpeed);  

    // Apply velocities
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    // Constrain to canvas
    this.x = constrain(this.x, this.r, width - this.r);
    this.y = constrain(this.y, this.r, height - this.r);
  }
}
