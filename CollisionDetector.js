//https://gamedev.stackexchange.com/questions/43397/collision-detection-game-design-and-architecture
//Observer pattern

class CollisionDetector{
    constructor(){
        this.walls = [];
        this.coins = [];
        this.obstacles = [];
        this.ball = null;
        this.finishLine = null;
    }
    //adds a coin to the array
    addCoin(coin) { 
        this.coins.push(coin); 
    }
    //removes all coins from the array
    clearCoins(){
        this.coins = [];
    }
    addWall(wall) { 
        this.walls.push(wall); 
    }
    clearWalls(){
        this.walls = [];
    }
    addObstacle(obstacle) { 
        this.obstacles.push(obstacle); 
    }
    clearObstacles(){
        this.obstacles = [];
    }
    setBall(ball){
        this.ball = ball;
    }
    setFinishLine(finishLine){
        this.finishLine = finishLine;
    }
    checkCollisions(){
        //TODO checkCollisionCircleRect(ball, wall);
        if(this.ball === null){
            console.error("Ball not set");
            return;
        }
        if(this.finishLine !== null){
            //check only if all coins are collected
            if(this.coins.length === 0){
                this.checkCollisionCircleCircle(this.finishLine, this.ball);
            }
        } else{
            console.error("Finish line not set");
        }
        for(let wall of this.walls){
            this.checkCollisionCircleRect(this.ball, wall)
        }
        for(let coin of this.coins){
            this.checkCollisionCircleCircle(this.ball, coin);
        }
        for(let obstacle of this.obstacles){
            this.checkCollisionCircleRect(this.ball, obstacle);
        }
    }
    checkCollisionCircleRect(circle, rect){
        //with help of gemini advanced 2.0
        // Circle-Rectangle Collision Detection
        // https://yal.cc/rectangle-circle-intersection-test/
        // constrain returns the value of the first argument constrained between the second and third arguments
        // closestX and closestY are the closest points on the rectangle to the center of circle
        let closestX = constrain(circle.x, rect.x - rect.w / 2, rect.x + rect.w / 2);
        let closestY = constrain(circle.y, rect.y - rect.h / 2, rect.y + rect.h / 2);

        //distenca between circle and closest point on the rectangle edge
        let distanceX = circle.x - closestX;
        let distanceY = circle.y - closestY;
        let distanceSquared = distanceX * distanceX + distanceY * distanceY;
        if (distanceSquared < circle.r * circle.r) {
            // console.log("Collision detected!");
            this.handleCollision(circle, rect, sqrt(distanceSquared));
        }
    }
    //obj1 is the object that is colliding with obj2
    //obj1 is the one that handles the collision meaning its onCollision method is called
    handleCollision(obj1, obj2, distance) {
        if(obj2 instanceof Coin) {
            // Remove the coin from the coins array
            let index = this.coins.indexOf(obj2);
            if(index > -1) {
                console.log(this.coins);
                this.coins.splice(index, 1);
                console.log(this.coins);
            }
        }
        // Still call onCollision for any other collision handling
        obj1.onCollision(obj2, distance);
    }
    checkCollisionCircleCircle(circle1, circle2){
        let distance = dist(circle1.x, circle1.y, circle2.x, circle2.y);
        if(distance < (circle1.diameter/2) + (circle2.diameter / 2)){
            console.log("Collision circle-circle detected!");
            this.handleCollision(circle1, circle2, distance);
        }
    }
}