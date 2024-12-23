//https://gamedev.stackexchange.com/questions/43397/collision-detection-game-design-and-architecture
//Observer pattern

class CollisionDetector{
    constructor(){
        this.walls = [];
        this.coins = [];
        this.obsstacles = [];
        this.ball = null;
    }
    addCoin(coin) { 
        this.coins.push(coin); 
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
    setBall(ball){
        this.ball = ball;
    }
    checkCollisions(){
        //TODO checkCollisionCircleRect(ball, wall);
        if(this.ball === null){
            console.error("Ball not set");
            return;
        }
        for(let wall of this.walls){
            this.checkCollisionCircleRect(this.ball, wall)
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
    handleCollision(obj1, obj2, distance){
        if(obj2 instanceof Wall){
            obj1.onCollision(obj2, distance);
        }
    }
}