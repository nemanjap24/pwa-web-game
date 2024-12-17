//runs once
function setup() {
  //creates canvas with dimensions of the window
  createCanvas(windowWidth/2, windowHeight/2);
  //sets background color
  background("#9dacff");
}

//refreshes 60times per second
function draw() {
  
  //draws circle on mouse position
  circle(mouseX,mouseY,100);
}
