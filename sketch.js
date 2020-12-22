//Declare Game States.
var PLAY = 1;
var END = 0;
var gameState = PLAY; 

//Declare variables for mario, ground, obstacles, bricks instances.
var mario, marioRunning;
var ground, groundImage;
var movingGround, movingGroundImage, invisibleGround;
var obstacleAnim;
var brickPoints, brickPointsImage;
var score;
var obstaclesGroup, bricksGroup;
var mario_collided;
var gameOverImg,restartImg;
var jumpSound , checkPointSound, dieSound;

//Function preload() created.
function preload() {
  
  //Load the images.
  groundImage = loadImage("bg.png");
  movingGroundImage = loadImage("ground2.png");
  brickPointsImage = loadImage("brick.png");
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");
  
  //Load the animations.
  marioRunning = loadAnimation("mario01.png", "mario02.png", "mario03.png");
  mario_collided = loadAnimation("collided.png");
  obstacleAnim = loadAnimation("obstacle1.png", "obstacle2.png", "obstacle3.png","obstacle4.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
}

function setup() {
  
  //Create Canvas.
  createCanvas(600, 400);
  
  //Create Groups.
  obstaclesGroup = createGroup();
  bricksGroup = createGroup();

  //Creating Background Image.
  ground = createSprite(300, 197.4, 600, 20);
  ground.addImage('groundI', groundImage);
  ground.scale = 1.05;
  ground.x=ground.width/2;
  
  //Create sprite for Game Over state.
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  //Create sprite for Restart state.
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  //Scale the images.
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  //Creating Moving Ground
  movingGround = createSprite(200, 365, 400, 20);
  movingGround.addImage("ground", movingGroundImage);
  movingGround.velocityX = -10;

  //Creating Invisible Ground
  invisibleGround = createSprite(200, 341.5, 400, 20);
  invisibleGround.visible = false;

  //Creating Mario
  mario = createSprite(50, 270, 10, 90);
  mario.addAnimation("marioAnim", marioRunning);
  mario.scale = 2.5;

  //Set the collider for mario.
  mario.setCollider("rectangle",0,0,30,30);
  mario.debug = true;
  
  //Add the animation for mario collided.
  mario.addAnimation("collided", mario_collided);
  
  //Initialize the variable score.
  score = 0;
}

function draw() {
  
  //Clear the background.
  background('white');
  
  //If the game state is 'PLAY'.
  if(gameState===PLAY){
    
    //Set the visibility to false for the images.
    gameOver.visible = false;
    restart.visible = false;
    
    //Assign the velocity to move the ground.
    movingGround.velocityX=-10;
    
    if (movingGround.x < 0) {
      movingGround.x = movingGround.width / 2;
    }
    
    //Jump when the space key is pressed
    if (keyDown("space") && mario.y > 250) {
      mario.velocityY = -10;
      jumpSound.play();
    }
    
    //Assign gravity to mario.
    mario.velocityY = mario.velocityY + 0.6;
    
    //Call the methods for spawning bricks and obstacles.
    spawnBricks();
    spawnObstacles();
    
    //If the mario touches the bricks, Score is calculated.
    if(bricksGroup.isTouching(mario)){
      score = score+1;
    }
    
    //If the mario touches the obstacles, game state change to 'END'.
    if(obstaclesGroup.isTouching(mario)){
      gameState = END;
      dieSound.play();
    }
  }
  
  //If the Game State is 'END'.
  else if(gameState === END){
    
    //Set the visibility to true for the images.
    gameOver.visible = true;
    restart.visible = true;
    
    //Stop the ground.
    movingGround.velocityX=0;
    
    //Stop the mario and set the animation.
    mario.velocityY=0; 
    mario.changeAnimation("collided", mario_collided);
    
    //Set the lifetime to -1 for all obstacles and bricks.
    obstaclesGroup.setLifetimeEach(-1);
    bricksGroup.setLifetimeEach(-1);
    
    //Set the velocity to 0 for all obstacles and bricks.
    obstaclesGroup.setVelocityXEach(0);
    bricksGroup.setVelocityXEach(0);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  mario.collide(invisibleGround);

  //Draw the sprites.
  drawSprites();
  
  //Display the Score.
  text("Score: "+ score, 500,20);
  textSize(100);
}

//Function spawnBricks() created.
function spawnBricks() {
  if (frameCount % 60 === 0) {
    
    //Create the brick points.
    brickPoints = createSprite(600,100,40,10);
    brickPoints.y = Math.round(random(150,270));
    brickPoints.addImage(brickPointsImage);
    brickPoints.velocityX = -3;
    
    //Assign lifetime to the variable.
    brickPoints.lifetime = 200;
    
    //Adjust the depth.
    brickPoints.depth = mario.depth;
    mario.depth = mario.depth + 1;
    
    //Add the bricks to the group.
    bricksGroup.add(brickPoints);
  }
}

//Function spawnObstacles() created.
function spawnObstacles() {
  if (frameCount % 48 === 0) {
    
    //Create the obstacles.
    var obstacle = createSprite(700, 300, 10, 40);
    obstacle.addAnimation("obstacleAnim", obstacleAnim);
    obstacle.velocityX = -10;
    
    //Assign the life time for obstacles.
    obstacle.lifetime = 200;
    
    //Add the obstacles to the group.
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  bricksGroup.destroyEach();
  score = 0;
  
  mario.changeAnimation("marioAnim", marioRunning);
}