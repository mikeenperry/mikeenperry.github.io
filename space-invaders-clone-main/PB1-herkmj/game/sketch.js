let score = 0;
let finished = false;

let health;
let damage;

let pressedKeys = {};
const releasedKeys = {};

const splicedBullets = [];
const splicedEnemies = [];

let level = 1;

let bground;
let img;

let inp;
let typing = false;
let writeSizeX;
let writeSizeY;

let loadDataUrl = 'https://oege.ie.hva.nl/~hofem/blok1/highscore/load.php';
let saveDataUrl = 'https://oege.ie.hva.nl/~hofem/blok1/highscore/save.php';
let gameId = 5730873027480;
let playerName;
let highscoreRetrieved = false;
const highscores = [];
const top10 = [];
let ranked = false;
let highscore;
let firstscore = true;

let nonExistant = true;
let shapedOnce = true;

//gets alled first and loads all the sprites
function preload()
{
  bground = loadImage('sprites/space_invaders_bakcground.png');
  playerSprite = loadImage('sprites/spaceship.png');
  meleeEnemiesSprite = loadImage('sprites/meleeenemies.png');
  bulletSprite = loadImage('sprites/bullet.png');
  shieldSprite = loadImage('sprites/shield.png');
  shootingEnemySprite = loadImage('sprites/shootingEnemy.png');
  ufoSprite = loadImage('sprites/ufo.png');
}


//creates canvas, player and enemies
function setup() 
{
  //loads images
  preload();

  angleMode(DEGREES);

  createCanvas(800, 600);

  //adds everything that needs to be added
  loadLevel();
}


//this shows everything on screen
function draw() 
{
  background(bground);
  //updates player
  player.update();
  //draws player
  player.draw();

  //starts a loop for every enemy in the enemies array
  for(let i = 0; i < enemies.length; i++)
  {    
    //updates enemies    
    enemies[i].update();
    //draws the enemies
    enemies[i].draw();
  }

  //calls the turn function when an enemy hits the side of the screen
  if(turnAround)
  {
    turnAround = false;
    turn();
  }

  //checks if there are bullets on the screen
  if(bullets.length > 0)
  {

    //updates every bullet in the bullets array
    for(let i = 0; i < bullets.length; i++)
    {
      //updates bullets
      bullets[i].update();
      //draws the bullets
      bullets[i].draw();
    }
  }

  //updates shields while there still are shields
  if(shields.length > 0)
  {
    for(let i = 0; i < shields.length; i++)
    {
      shields[i].update();
      shields[i].draw();
    }
  }

  //changes the ufo timer while it's above 0
  if(ufoTimer > 0)
  {
    ufoTimer -= deltaTime;
  }

  //creates an ufo if the timer is below or equal to 0
  if(ufoTimer <= 0 && finished == false)
  {
    ufoRandom = Math.random();
    if(ufoRandom < 0.5)
    {
      ufo = new Ufo(0 - ufoSize);
    }
    else
    {
      ufo = new Ufo(width);
    }
    ufos.push(ufo);
    ufoTimer = Math.random() * (20000 - 10000) + 10000;
  }

  //checks if there are ufos on screen and update them
  for(let i = 0; i < ufos.length; i++)
  {
    ufos[i].update();
    ufos[i].draw();
    if(ufos[i].x > width + ufoSize + 10 || ufos[i].x < 0 - ufoSize - 10)
    {
      splicedUfos.push(ufo);
    }  
  }

  //DESTROYS EVERYTHING!!! that should be destroyed
  destroyer();
  //writes everything on screen
  writer();

  if(finished == true && typing == true)
  {
    inp.input(myInputEvent);
  }

  if(pressedKeys[ENTER] == true && finished == true && typing == true)
  {
    typing = false;
    httpGet(`${saveDataUrl}?game=${gameId}&name=${playerName}&score=${score}`, onHighscoreSaved);
    inp.position(-150, 0);
  }

  //checks if the game is over
  endGame();
}


//loads a level
function loadLevel()
{
  player = new Player(width/2 - playerWidth/2, height - playerHeight/2 - 32);
  spawnEnemies();
  spawnShields();
}


//handles the playerName input
function myInputEvent()
{
  playerName = this.value();
}


//unloads a level
function unloadLevel()
{
  //kills all enemies
  for(let i = 0; i < enemies.length; i++)
  {
    splicedEnemies.push(enemies[i]);
  }

  //kills all bullets
  for(let j = 0; j < bullets.length; j++)
  {
    splicedBullets.push(bullets[j]);
  }

  //kills all shields
  for(let k = 0; k < shields.length; k++)
  {
    splicedShields.push(shields[k]);
  }

  //kills all ufos
  for(let l = 0; l < ufos.length; l++)
  {
    splicedUfos.push(ufos[l]);
  }

  delete player;
  score = 0;
}


//this checks which keys are pressed and adds them to an array
function keyPressed()
{
  //adds the pressed key to pressedKeys
  pressedKeys[keyCode] = true;
}


//this checks which keys are released and adds them to an array
function keyReleased()
{
  //adds the spacebar to the releasedKeys array when released
  if(keyCode == 32 && finished == false)
  {
    releasedKeys[keyCode] = true;
  }
    //deletes the released key from pressedKeys
  delete pressedKeys[keyCode];
}


//this class checks for collision between two objects
class Collider
{
  //constructs collider
  constructor(ax, ay, awidth, aheight, bx, by, bwidth, bheight)
  {
    this.ax = ax;
    this.ay = ay;
    this.bx = bx;
    this.by = by;
    this.awidth = awidth;
    this.aheight = aheight;
    this.bwidth = bwidth;
    this.bheight = bheight;
  }


  //detects if object a and object b collide
  colliderDetector()
  {
    if(((this.ax + this.awidth) >= this.bx)
    && (this.ax <= (this.bx + this.bwidth))
    && ((this.ay + this.aheight) >= this.by)
    && (this.ay <= (this.by + this.bheight)))
    {
      return true;
    }
  return false;
  }
}


//this function destroys all enemies and bullets that need to be destroyed
function destroyer()
{
  let destroyedNumberOfEnemies = 0;

  //destroys all enemies that are in the splicedEnemies array
  while(splicedEnemies.length > 0)
  {
    enemies.splice(splicedEnemies[0], 1);
    splicedEnemies.splice(0, 1);
    destroyedNumberOfEnemies += 1;

    //makes sure it still works when multiple enemies are destroyed at the same time
    if(splicedEnemies.length > 0)
    {
      splicedEnemies[0] -= destroyedNumberOfEnemies;
    }
  }

  let destroyedNumberOfBullets = 0;

  //destroys all bullets that are in the splicedBullets array
  while(splicedBullets.length > 0)
  {
    bullets.splice(splicedBullets[0], 1);
    splicedBullets.splice(0, 1);
    destroyedNumberOfBullets += 1;

    //makes sure it still works when multiple bullets are destroyed at the same time
    if(splicedBullets.length > 0)
    {
      splicedBullets[0] -= destroyedNumberOfBullets;
    }
  }
  let destroyedNumberOfShields = 0;

  //destroys all shields that are in the splicedShields array
  while(splicedShields.length > 0)
  {
    shields.splice(splicedShields[0], 1);
    splicedShields.splice(0, 1);
    destroyedNumberOfShields += 1;

    //makes sure it still works when multiple shields are destroyed at the same time
    if(splicedShields.length > 0)
    {
      splicedShields[0] -= destroyedNumberOfShields;
    }
  }

  //destroys all ufos that are in the splicedUfos array
  while(splicedUfos.length > 0)
  {
    ufos.splice(splicedUfos[0], 1);
    splicedUfos.splice(0, 1);
    destroyedNumberOfUfos += 1;

    //makes sure it still works when mulitple ufos are destroyed at the same time
    if(destroyedNumberOfUfos > 0)
    {
      splicedUfos[0] -= destroyedNumberOfUfos;
    }
  }
}


//writes all text on screen
function writer()
{
  fill(255);
  textSize(50);

  //writes score and lives while the game is still going
  if(finished == false)
  {
    textSize(20);
    text('score: ' + score, 10, 50);
    text('lives: ' + player.health, width - 100, 50);
  }

  //writes the you win text
  if(enemies.length <= 0 && player.health > 0 && ufos.length <= 0)
  {
    fill(255);
    text("you win", width/2, height/2);

    //creates input box
    if(finished == false)
    {
      typing = true;
      inp = createInput('');
      inp.position(0, 0);
      inp.size(100);
      httpGet(`${saveDataUrl}?game=${gameId}&name=${playerName}&score=${score}`, onHighscoreSaved);
    }
    finished = true;
  }

  //checks if the player died and writes loser
  if(player.health <= 0)
  {
    text('loser', width/2 - 20, 50);

    //makes sure the input is created only once and creates the input element
    if(finished == false)
    {
      typing = true;
      inp = createInput('');
      inp.position(0, 0);
      inp.size(100);
    }
    finished = true;
  }
  
  //show text when the game is over
  if(finished)
  {
    writeSizeX = 400;
    writeSizeY = 100;
    text('final score: ' + score, width/2 - writeSizeX/2, height/4, writeSizeX, writeSizeY);

    //checks for when you pressed ENTER and stopped typing
    if(typing == false)
    {
      text('press backspace to restart', 20, height/2 - 50);

      //checks if the highscores have been retrieved from the database
      if(highscoreRetrieved == true)
      {

        //sorts the highscores from highest to lowest score
        if(firstscore)
        {
          highscores.sort((a,b)=>a.score - b.score);
          highscores.reverse();
          firstscore = false;
        }
        
        //shows the 10 highest scores
        if(highscores.length >= 10)
        {
          for(let i = 0; i < 10; i++)
          {
            textSize(10);
            text(i + ". " + highscores[i].name + " " + highscores[i].score, width/2, height/2 + 20 + 20 * i);
          }
        }
        else
        {
          for(let i = 0; i < highscores.length; i++)
          {
            textSize(10);
            text(highscores[i].name + highscores[i].score, width/2, height/2 + 20 + 20 * i);
          }
        }
      }
    }
  }
}


//restarts the game
function endGame()
{

  //reloads the level
  if(finished == true && pressedKeys[BACKSPACE] && typing == false)
  {
    finished = false;
    unloadLevel();
    destroyer();
    if(level < 3)
    {
      level += 1;
    }
    loadLevel();
  }
}


//does things when the highscore is saved
function onHighscoreSaved()
{
  loadJSON(`${loadDataUrl}?game=${gameId}`, onHighscoreRetrieved);
}


//does things when the highscores have been retrieved
function onHighscoreRetrieved(dataAsJson)
{

  //adds the highscore name and score to an array
  for(let i = 0; i < dataAsJson.length; i++)
  {
    highscore = new Highscore();
    highscore.name = dataAsJson[i].name;
    highscore.score = dataAsJson[i].score
    highscores.push(highscore);
  }
  highscoreRetrieved = true;
}


//used to save the name and score of all players
class Highscore
{
  construstor(name, score)
  {
    this.name = name;
    this.score = score;
  }
}