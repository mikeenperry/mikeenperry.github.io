let bullet;
let shoot;
let bulletType;
let bulletWidth = 10;
let bulletHeight = 50
const bullets = [];
let bulletSprite;
let justShot = false;
let destroyedShootingUnits = 0;
let fragBulletFirstLoop = true;


const bulletCornersXStart = [0, 10, 10, 0];
const bulletCornersYStart = [0, 0, 50 , 50];
const bulletCornersX = [];
const bulletCornersY = [];

let fragmentationTimer = 0;

//this class handles everything bullets do
class Bullet
{
  //constructs bullet
  constructor(x, y, bulletType)
  {
    this.x = x;
    this.y = y;
    this.speed = 0;
    this.width = bulletWidth;
    this.height = bulletHeight;
    this.bulletType = bulletType;
    this.movement = createVector(0, 0);
    this.bulletCornersXStart = bulletCornersXStart;
    this.bulletCornersYStart = bulletCornersYStart;
  }


  update()
  {

    //if the bullet is shot by the player this makes sure everything that needs to happen happens
    if(this.bulletType == 1)
    {
        this.friendlyBullet();
    }

    //if the bullet is shot by an enemy this makes sure everything that needs to happen happens
    else if(this.bulletType == 0)
    {
      this.enemyBullet();
    }
    this.bulletMovement();
  }


  bulletMovement()
  {
    //removes bullets when they're off screen
    if(this.y >= height || this.y <= 0 - this.height)
    {
      splicedBullets.push(bullets.indexOf(this));
    }
    this.movement.setMag(this.speed);
    this.x += this.movement.x;
    this.y += this.movement.y;
  }


  friendlyBullet()
  {
    this.movement.y = -2;
    this.speed = 10;

    this.advancedCollider = new AdvancedCollider();

    this.advancedCollider.setObjectA(
      colliderArrayMeter(bulletCornersXStart.length, bulletCornersXStart, bulletCornersYStart, false, this.x, this.y).x,
      colliderArrayMeter(bulletCornersXStart.length, bulletCornersXStart, bulletCornersYStart, false, this.x, this.y).y);

    //checks for every enemy if it's hit by a bullet
    for(let i = 0; i < enemies.length; i++)
    {

      //sets the collider for the enemies
      if(i < (columns * bigEnemyRows) - destroyedShootingUnits)
      {
        this.advancedCollider.setObjectB(
          colliderArrayMeter(shootingEnemyCornersXStart.length, shootingEnemyCornersXStart, shootingEnemyCornersYStart, true, enemies[i].x, enemies[i].y).x, 
          colliderArrayMeter(shootingEnemyCornersXStart.length, shootingEnemyCornersXStart, shootingEnemyCornersYStart, true, enemies[i].x, enemies[i].y).y);
      }

      else
      {
        this.advancedCollider.setObjectB(
          colliderArrayMeter(weakEnemyCornersXStart.length, weakEnemyCornersXStart, weakEnemyCornersYStart, true, enemies[i].x, enemies[i].y).x, 
          colliderArrayMeter(weakEnemyCornersXStart.length, weakEnemyCornersXStart, weakEnemyCornersYStart, true, enemies[i].x, enemies[i].y).y);
      }

      //the bullet gets destroyed and the enemy dies
      if(this.advancedCollider.update() == true)
      {
        splicedEnemies.push(i);

        if(i < columns * bigEnemyRows - destroyedShootingUnits)
        { 
          destroyedShootingUnits += 1;
        }

        //makes sure only 1 bullet gets destroyed when multiple enemies are hit
        if(splicedBullets < 1)
        {
          splicedBullets.push(bullets.indexOf(this));
        }
        
        //updates the score while the player is alive
        if(player.health > 0)
        {
          score += 100;
        }
      }
    }

    //checks for every ufo in ufos and creates a collider
    for(let i = 0; i < ufos.length; i++)
    {
      this.advancedCollider.setObjectB(
        colliderArrayMeter(ufoCornersXStart.length, ufoCornersXStart, ufoCornersYStart, true, ufo.x, ufo.y).x, 
        colliderArrayMeter(ufoCornersXStart.length, ufoCornersXStart, ufoCornersYStart, true, ufo.x, ufo.y).y);


      //checks if a ufo is hit by this bullet
      if(this.advancedCollider.update() == true)
      {
        splicedUfos.push(i)

        //makes sure only one bullet gets destroyed when mulitple enemies are hit
        if(splicedBullets < 1)
        {
          splicedBullets.push(bullets.indexOf(this));
        }

        //adds points to score if the player is still alive
        if(player.health > 0)
        {
          score += 500;
        }
      }
    }
  }


  enemyBullet()
  {
    this.advancedCollider = new AdvancedCollider()
    this.movement.y = 1;
    this.speed = 2;

    //sets the colliders
    this.advancedCollider.setObjectA(
      colliderArrayMeter(bulletCornersXStart.length, bulletCornersXStart, bulletCornersYStart, false, this.x, this.y).x,
      colliderArrayMeter(bulletCornersXStart.length, bulletCornersXStart, bulletCornersYStart, false, this.x, this.y).y);

    this.advancedCollider.setObjectB(
      colliderArrayMeter(playerCornersXStart.length, playerCornersXStart, playerCornersYStart, true, player.x, player.y).x, 
      colliderArrayMeter(playerCornersXStart.length, playerCornersXStart, playerCornersYStart, true, player.x, player.y).y);

    //the bullet gets destroyed and the player's health gets lowered when hit by a bullet
    if(this.advancedCollider.update() == true)
    {
      splicedBullets.push(bullets.indexOf(this));

      //removes 1 hitpoint if the player is alive
      if(player.health > 0)
      {
        player.health -= 1;
      }
    }
  }


  //draws bullet
  draw()
  {
    image(bulletSprite, this.x, this.y, this.width, this.height);
  }
}


class FragBullet extends Bullet
{
  constructor(x, y, bulletType)
  {
    super(x, y, bulletType);
    this.width = bulletWidth;
    this.height = bulletHeight;
    this.speed = 1;
    this.fragBulletFirstLoop = fragBulletFirstLoop;
    this.fragmentationTimer = fragmentationTimer;
    this.movement = createVector(0, 1);
  }


  update()
  {
    //starts the timer for the fragmentation of a fragbullet
    if(this.fragBulletFirstLoop)
    {
      this.fragBulletFirstLoop = false;
      this.fragmentationTimer = Math.floor(Math.random() * 1000)+2000;
    }
    this.fragmentationTimer -= deltaTime;
    this.fragBulletExplode();
    super.bulletMovement();
  }


  fragBulletExplode()
  {

    //checks if the fragmentation timer is up meaning the bullet should explode into more bullets.
    if(this.fragmentationTimer <= 0)
    {

      //creates 3 fragmentation bullets
      for(let i = 0; i < 3; i++)
      {
        let lMR = i;
        bullet = new Fragmentation(this.x + this.width/2, this.y, lMR, createVector(this.x + this.width/2, this.y))
        bullets.push(bullet);
      }
      splicedBullets.push(bullets.indexOf(this));
    }
  }


  draw()
  {
    image(bulletSprite, this.x, this.y, this.width, this.height);
  }
}


class Fragmentation extends Bullet
{
  constructor(x, y, lMR, fragPos)
  {
    super(x, y)
    this.x = x;
    this.y = y;
    this.lMR = lMR;
    this.speed = 2;
    this.fragPos = fragPos;
    this.movement = createVector(0, 2); 
    this.x -= this.fragPos.x;
    this.y -= this.fragPos.y
  }

  update()
  {

    //creates the movement and corners for the left bullet
    if(this.lMR == 0)
    {
      this.movement = createVector(-2, 2);
      this.bulletCornersXStart = [0, Math.sqrt(50), Math.sqrt(50) - Math.sqrt(1250), 0 - Math.sqrt(1250)];
      this.bulletCornersYStart = [0, Math.sqrt(50), Math.sqrt(1250) + Math.sqrt(50), Math.sqrt(1250)];
    }

    //creates the movement and corners for the rigth bullet
    else if(this.lMR == 2)
    {
      this.bulletCornersXStart = [0, Math.sqrt(50), Math.sqrt(50)+ Math.sqrt(1250), Math.sqrt(1250)];
      this.bulletCornersYStart = [0, -Math.sqrt(50), Math.sqrt(1250) - Math.sqrt(50), Math.sqrt(1250)];
      this.movement = createVector(2, 2);
    }

    //creates the movement and corners for the middle bullet
    else
    {
      this.bulletCornersXStart = [0, 10, 10, 0];
      this.bulletCornersYStart = [0, 0, 50, 50];
      this.movement = createVector(0, 2);
    }
    super.bulletMovement();

    //creates the collider and sets the corner values for the fragmentation
    this.advancedCollider = new AdvancedCollider();

    this.advancedCollider.setObjectA(
      colliderArrayMeter(bulletCornersXStart.length, this.bulletCornersXStart, this.bulletCornersYStart, false, this.x + this.fragPos.x, this.y + this.fragPos.y).x,
      colliderArrayMeter(bulletCornersXStart.length, this.bulletCornersXStart, this.bulletCornersYStart, false, this.x + this.fragPos.x, this.y + this.fragPos.y).y);

    this.advancedCollider.setObjectB(
      colliderArrayMeter(playerCornersXStart.length, playerCornersXStart, playerCornersYStart, true, player.x, player.y).x,
      colliderArrayMeter(playerCornersXStart.length, playerCornersXStart, playerCornersYStart, true, player.x, player.y).y);

    //checks for collision
    if(this.advancedCollider.update())
    {
      splicedBullets.push(bullets.indexOf(this));

      if(player.health > 0)
      {
        player.health -= 1;
      }
    }
  }


  draw()
  {
    //changes the origin to the position of where the fragmentation bullet was created so we can rotate the image off of it.
    push();
    translate(this.fragPos.x, this.fragPos.y);

    //rotates and draws the left bullet
    if(this.lMR == 0)
    {
      rotate(45);
      image(bulletSprite, this.x + this.y, this.y * Math.sqrt(2), this.width, this.height);
    }

    //rotates and draws the right bullet
    else if(this.lMR == 2)
    {
      rotate(-45);
      image(bulletSprite, this.x - this.y, this.y * Math.sqrt(2), this.width, this.height);
    }

     //rotates and draws the middle bullet
    else
    {
      image(bulletSprite, this.x, this.y, this.width, this.height);
    }
    pop();
  }
}