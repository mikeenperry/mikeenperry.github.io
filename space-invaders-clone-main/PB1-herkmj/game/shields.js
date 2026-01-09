let shield;
const shields = [];
const splicedShields = [];
let numberOfShields = 4;
let shieldBoundingBox = 600;
let shieldSizeX = 70;
let shieldSizeY = 20;
let shieldSprite;

const shieldCornersXStart = [10, 60, 70, 0];
const shieldCornersYStart = [0, 0, 20, 20];

//spawns the shields at the start of the game
function spawnShields()
{
  let distanceBetweenShields = (shieldBoundingBox - (numberOfShields * shieldSizeX)) / (numberOfShields - 1);

  //creates shields that can be changed in distance and size and will still function
  for(let i = 0; i < numberOfShields; i++)
  {
    shield = new Shield((i * distanceBetweenShields) + (i * shieldSizeX) + (width - shieldBoundingBox)/2, player.y - player.height - 20 - shieldSizeY);
    shields.push(shield);
  }
}


//this class handles everything the shields do
class Shield
{
  constructor(x, y)
  {
    this.x = x;
    this.y = y;
    this.width = shieldSizeX;
    this.height = shieldSizeY;
    this.health = 4;
    this.objectACornerSetterX = objectACornerSetterX;
    this.objectACornerSetterY = objectACornerSetterY;
    this.objectBCornerSetterX = objectBCornerSetterX;
    this.objectBCornerSetterY = objectBCornerSetterY;
  }


  update()
  {
    this.advancedCollider = new AdvancedCollider()

    /*for(let j = 0; j < shieldCornersXStart.length; j++)
    {
      this.objectACornerSetterX.splice(j, 1, shieldCornersXStart[j] + this.x);
      this.objectACornerSetterY.splice(j, 1, shieldCornersYStart[j] + this.y);
    }

    this.advancedCollider.setObjectA(this.objectACornerSetterX, this.objectACornerSetterY);*/
    this.advancedCollider.setObjectA(colliderArrayMeter(shieldCornersXStart.length, shieldCornersXStart, shieldCornersYStart, false, this.x, this.y).x, colliderArrayMeter(shieldCornersXStart.length, shieldCornersXStart, shieldCornersYStart, false, this.x, this.y).y);



    //checks for every bullet in bullets
    for(let i = 0; i < bullets.length; i ++)
    {

      if(bullets[i] instanceof Fragmentation)
      {
        this.advancedCollider.setObjectB(colliderArrayMeter(bulletCornersXStart.length, bullets[i].bulletCornersXStart, bullets[i].bulletCornersYStart, true, bullets[i].x + bullets[i].fragPos.x, bullets[i].y + bullets[i].fragPos.y).x, colliderArrayMeter(bulletCornersXStart.length, bullets[i].bulletCornersXStart, bullets[i].bulletCornersYStart, true, bullets[i].x + bullets[i].fragPos.x, bullets[i].y + bullets[i].fragPos.y).y);
      }
      else
      {
        this.advancedCollider.setObjectB(colliderArrayMeter(bulletCornersXStart.length, bullets[i].bulletCornersXStart, bullets[i].bulletCornersYStart, true, bullets[i].x, bullets[i].y).x, colliderArrayMeter(bulletCornersXStart.length, bullets[i].bulletCornersXStart, bullets[i].bulletCornersYStart, true, bullets[i].x, bullets[i].y).y);
      }

      //checks if the shield is hit by a bullet
      if(this.advancedCollider.update() && splicedBullets.length < 1)
      {
        splicedBullets.push(i);
        this.health -= 1;    
      }
    }

    //checks for every enemy in enemies
    for(let i = 0; i < enemies.length; i++)
    {

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
      this.advancedCollider.setObjectB(this.objectBCornerSetterX, this.objectBCornerSetterY);

      //checks if the shield is hit by an enemy
      if(this.advancedCollider.update() == true)
      {
        this.health -= 1;
        splicedEnemies.push(i);
      }
    }

    //removes the shield if it's health is below or equal to 0
    if(this.health <= 0)
    {
      splicedShields.push(shields.indexOf(this));
    }
  }


  draw()
  {
    image(shieldSprite, this.x, this.y, this.width, this.height);
  }
}
