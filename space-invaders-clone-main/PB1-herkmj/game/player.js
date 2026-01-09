let player;
let playerWidth = 64;
let playerHeight = 64;
let playerSprite;

const playerCornersXStart = [32,39,57,60,45,16,1,4,23];
const playerCornersYStart = [3,22,15,43,51,51,42,19,22];


//this class contains everything the player does
class Player
{
  //constructs player
  constructor(x,y)
  {
    this.x = x;
    this.y = y;
    this.speed = 10;
    this.width = playerWidth;
    this.height = playerHeight;
    this.shootingCooldown = 0;
    this.health = 3;
  }


  update()
  {
    let movement = createVector(0,0);

    //checks which keys are pressed and changes the direction of movement
    if(keyIsPressed == true)
    {

      //makes player move left when left arrow key is pressed
      if(pressedKeys[LEFT_ARROW] && this.x > 0)
      {
        movement.x -= 1;
      }  

      //makes player move right when right arrow key is pressed
      if(pressedKeys[RIGHT_ARROW] && this.x < width - this.width)
      {
        movement.x += 1;
      }  
 
      //might be useful later on, adds vertical movement to the player
      /*
      if(pressedKeys[UP_ARROW])
      {
        movement.y -= 1;
      }  
      if(pressedKeys[DOWN_ARROW])
      {
        movement.y += 1;
      }*/
    }
    shoot = true;

    //checks if a player bullet is still in existence
    for(let i = 0; i < bullets.length; i++)
    {

      //checks if a playerbullet exists
      if(bullets[i].bulletType == 1)
      {
        shoot = false;
      }
    }

    //shoots a bullet when the spacebar is released and the cooldown is off
    if(releasedKeys[32] && shoot == true)
    {
      //creates a bullet
      bulletType = 1;
      bullet = new Bullet((this.x + this.width/2 - bulletWidth/2), this.y, bulletType);
      bullets.push(bullet);
      shoot = false;
    }
    delete releasedKeys[keyCode];

    //limits speed and adds movement to position of the player
    movement.setMag(this.speed);

    this.x += movement.x;
    this.y += movement.y;
  }

  //draws the player
  draw()
  {
    image(playerSprite, this.x, this.y, playerWidth, playerHeight);
  }
}