let enemy;
let rows = 5;
let columns = 5;
let firstloop = true;
let smallEnemySize = 40;
let bigEnemySize = 60;
let bigEnemyRows = 1;
let boundingBox = 300;
let meleeEnemiesSprite;
let shootingEnemySprite;

const weakEnemyCornersXStart = [20, 40, 24, 12, 1];
const weakEnemyCornersYStart = [1, 18, 39, 38, 18];

const shootingEnemyCornersXStart = [1, 30, 59, 36, 24];
const shootingEnemyCornersYStart = [7, 0, 8, 55, 55];

const ufoCornersXStart = [0, 12, 28, 20, 10];
const ufoCornersYStart = [14, 1, 15, 27, 26];

let ufoSize = 30;
let ufoStartX;
let ufo;
const ufos = [];
const splicedUfos = [];
let destroyedNumberOfUfos;
let ufoTimer = 5000;
let ufoRandom;
let ufoSprite;

const enemies = [];
let direction = 0;
let turnAround = false;

let strongEnemySize = 80;
let fragShooter = false;

//spawns the enemies at the start of the game, you can actually change all of the variables and it will still work AAAAAHHHH
function spawnEnemies()
{
  switch(level)
  {
    case 1:
      //rows = 5;
      bigEnemyRows = 1;
      boundingBox = 300;
      break;
    case 2:
      rows = 6;
      bigEnemyRows = 1;
      boundingBox = 350;
      break;
    case 3:
      rows = 7;
      bigEnemyRows = 2;
      boundingBox = 400;
      break;
  }
  direction = 0;
  firstloop = true;
  //best not to touch anything in here... calculates distances between enemies
  let distanceBetweenBigEnemiesX = (boundingBox - (bigEnemySize * columns)) / (columns - 1);
  let distanceBetweenSmallEnemiesX = (boundingBox - (smallEnemySize * columns)) / (columns - 1);
  let distanceBetweenEnemiesY = (boundingBox - ((bigEnemySize * bigEnemyRows) + (smallEnemySize * (rows - bigEnemyRows)))) / (rows - 1);
  
  fragShooter = false;

  //starts two loops to create a grid of enemies
  for(let j = 0; j < rows; j++)
  {

    for(let i = 0; i < columns; i++)
    {

      //makes sure the big enemies are spawned inside the boundingBox
      if(j <= bigEnemyRows - 1)
      {
        enemy = new Enemy((i * distanceBetweenBigEnemiesX + (i * bigEnemySize)) + ((width - boundingBox) / 2), (j * distanceBetweenEnemiesY) + (j * bigEnemySize));
      }

      //makes sure the small enemies are spawned inside the boundingBox
      else
      {
        enemy = new WeakEnemy((i * distanceBetweenSmallEnemiesX + (i * smallEnemySize)) + ((width - boundingBox) / 2), (j * distanceBetweenEnemiesY) + ((j - bigEnemyRows) * smallEnemySize + (bigEnemyRows * bigEnemySize)));
      }

      if(i == 2 && j < bigEnemyRows)
      {
        enemy = new StrongEnemy((i * distanceBetweenBigEnemiesX + (i * bigEnemySize)) + ((width - boundingBox) / 2), (j * distanceBetweenEnemiesY) + (j * bigEnemySize));
      }
      enemies.push(enemy); 
    }
  }
}


//this class contains everything the shooting enemy does except for turning
class Enemy
{
  //constructs enemy
  constructor(x, y)
  {
    this.x = x;
    this.y = y;
    this.width = bigEnemySize;
    this.height = bigEnemySize;
    this.speed = 2;
    this.movement = createVector(-1, 0);
    this.shootingCooldown = 0;
    this.firstloop = firstloop;
    this.fragShooter = fragShooter;
  }

  
  update()
  {
    //creates this collider
    this.collider = new Collider(this.x, this.y, this.width, this.height, player.x, player.y, player.width, player.height);

    this.enemyMovement();
    this.enemyShooting();

    //removes enemies when they are off screen and kills the player
    if(this.y > height)
    {
      player.health = 0;
      splicedEnemies.push(enemies.indexOf(this));
    }
  }


  enemyMovement()
  {
    let movement = this.movement;

    //checks whether an enemy hits a wall and isn't already moving away
    if (((this.x <= 0) && (direction == 0)) || ((direction == 1) && (this.x + this.width >= width)))
    {  

      //changes direction so when mutliple enemies hit the side at the same time this function doesn't work multiple times when it shouldn't
      if (direction == 1)
      {
        direction = 0;
      }

      else if(direction == 0)
      {
        direction = 1;
      }

      //changes position and direction for every enemy
      turnAround = true;
    }

    //limits speed and adds movement to the position of the enemy
    movement.setMag(this.speed);
    this.x += movement.x;
  }


  enemyShooting()
  {
    //checks if this is the firsloop so the enemies won't all shoot at the same time
    if(this.firstloop)
    {
      firstloop = false;
      this.shootingCooldown = Math.floor(Math.random() * ((200 - 120) + 500));
    }

    //a timer for the shootingcooldown
    if(this.shootingCooldown > 0)
    {
      this.shootingCooldown -= 1;
    }

    //the enemy shoots a bullet when the cooldown is off
    if(this.shootingCooldown <= 0 && finished == false)
    {
      bulletType = 0;
      //creates a bullet
      if(this.fragShooter)
      {
        bullet = new FragBullet(this.x + this.width/2 - 5, this.y + this.height, bulletType)
      }
      else
      {
        bullet = new Bullet(this.x + this.width/2 - 5, this.y + this.height, bulletType);
      }
      bullets.push(bullet);
      this.shootingCooldown = Math.floor(Math.random() * (1200 - 600) + 600);
    }
  }


  draw()
  {
    //draws the enemy
    image(shootingEnemySprite, this.x, this.y, this.width, this.height);
  }
}


//this class contains everything the basic enemy does except for turning
class WeakEnemy
{
  constructor(x, y)
  {
    this.x = x;
    this.y = y;
    this.width = smallEnemySize;
    this.height = smallEnemySize;
    this.speed = 2;
    this.movement = createVector(-1, 0);
  }


  update()
  {
    let movement = this.movement;

    //checks whether an enemy hits a wall and isn't already moving away
    if (((this.x <= 0) && (direction == 0)) || ((direction == 1) && (this.x + this.width >= width)))
    {  

      //changes direction so when mutliple enemies hit the side at the same time this function doesn't work multiple times when it shouldn't
      if (direction == 1)
      {
        direction = 0;
      }

      else if(direction == 0)
      {
        direction = 1;
      }

      turnAround = true;
      //changes position and direction for every enemy
    }
    
    //removes enemies when off screen and kills the player
    if(this.y > height)
    {
      player.health = 0;
      splicedEnemies.push(enemies.indexOf(this));
    }

    //limits speed and adds movement to the position of the enemy
    movement.setMag(this.speed);
    this.x += movement.x;
  }


  draw()
  {
    //draws the enemy
    image(meleeEnemiesSprite, this.x, this.y, this.width, this.height);
  }
}


//this function turns all the enemies and changes their y location
function turn()
{
  //changes the direction and height off all enemies in the enemies array
  for(let j = 0; j < enemies.length; j++)
  {
    enemies[j].movement.x = enemies[j].movement.x * -1;
    enemies[j].y += 50;
  }
}


//this class contains eveything the ufo does
class Ufo
{
  constructor(x)
  {
    this.ufoStartX = x;
    this.x = x;
    this.y = 10;
    this.width = ufoSize;
    this.height = ufoSize;
    this.speed = 3;
    this.movement = createVector(3, 0);
  }


  update()
  {
    let movement = this.movement;

    //checks what direction the ufo should move in
    if(this.ufoStartX < width/2)
    {
      this.movement.x = 2;
    }

    else if(this.ufoStartX > width/2)
    {
      this.movement.x = -2;
    }

    movement.setMag(this.speed);
    this.x += movement.x;
  }


  draw()
  {
    image(ufoSprite, this.x, this.y, this.width, this.height);
  }
}


class StrongEnemy extends Enemy
{
  constructor(x, y, size)
  {
    super(x, y, size)
    this.fragShooter = true;
  }
}