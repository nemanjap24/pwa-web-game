class Ball {
  constructor(x, y, diameter, color) {
    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.r = diameter / 2; // Radius for easier calculations
    this.color = color || "#FFFFFF";
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.speed = 5;
  }

  move(keys, walls) {
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

    // Collision check with walls BEFORE constraining to canvas
    for (let wall of walls) {
      console.log("wall");

      this.handleWallCollision(wall);
    }

    // Constrain to canvas bounds AFTER collision handling
    this.x = constrain(this.x, this.r, width - this.r);
    this.y = constrain(this.y, this.r, height - this.r);
  }

  //with help of gemini advanced 2.0
  handleWallCollision(wall) {
    // Circle-Rectangle Collision Detection
    // https://yal.cc/rectangle-circle-intersection-test/
    // constrain returns the value of the first argument constrained between the second and third arguments
    // closestX and closestY are the closest points on the rectangle to the center of circle
    let closestX = constrain(this.x, wall.x - wall.w / 2, wall.x + wall.w / 2);
    let closestY = constrain(this.y, wall.y - wall.h / 2, wall.y + wall.h / 2);

    //distenca between circle and closest point on the rectangle edge
    let distanceX = this.x - closestX;
    let distanceY = this.y - closestY;
    let distanceSquared = distanceX * distanceX + distanceY * distanceY;
    if (distanceSquared < this.r * this.r) {
      // Collision detected!

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

      // Separate the ball from the wall (very important)
      let penetrationDepth = this.r - sqrt(distanceSquared);
      this.x += collisionNormalX * penetrationDepth;
      this.y += collisionNormalY * penetrationDepth;
    }
  }

  display() {
    fill(this.color);
    circle(this.x, this.y, this.diameter);
  }

  handleOrientation(beta, gamma) {
    // Basic tilt control - you'll likely want to refine these values
    this.x += gamma * 0.5; // Adjust multiplier for sensitivity
    this.y += beta * 0.5;

    // Collision check with walls BEFORE constraining to canvas
    for (let wall of walls) {
      this.handleWallCollision(wall);
    }

    // Constrain to canvas bounds AFTER collision handling
    this.x = constrain(this.x, this.r, width - this.r);
    this.y = constrain(this.y, this.r, height - this.r);
    // this.x = constrain(this.x, this.diameter/2, width - this.diameter/2);
    // this.y = constrain(this.y, this.diameter/2, height - this.diameter/2);
  }
}
