## Code review - Template

### Bespreek de volgende vragen met de reviewer:

#### Wat heb ik gedaan dat iemand anders zou willen overnemen?

Ik heb een aantal lijnen code geschreven die ervoor zorgen dat de variabelen van shields en enemies aangepast kunnen worden zonder dat ze buiten het scherm vallen. Zo kan je de grootte van de enemies, de grootte van de ruimte waarbinnen ze blijven, het aantal rijen en kolommen enemies en ook hoeveel rijen van de enemies moeten schieten aanpassen zonder dat het spel breekt.

#### Is de code makkelijk te begrijpen voor iemand die niet bekend is met het project?
Is de code leesbaar en begrijpelijk?  
Controleer of de code duidelijk is geschreven, met zinvolle variabelen en functienamen. Kan iemand met weinig kennis van het project de code begrijpen?  

Ik heb gebruik gemaakt van duidelijke variabelen die aangeven wat het precies inhoud zoals: "shootingEnemySprite" en "distanceBetweenEnemiesX". Hetzelfde geldt voor de functies bijvoorbeeld: "loadLevel".

#### Zijn de code conventies gebruikt?  
Bekijk of de code consistent is met de codestandaarden van het project.  
Bijvoorbeeld:  
- Benaming van functies en variabelen
- Code indentatie
- Code regellengte
- Magic numbers
- Commentaar

Ik heb steeds dezelfde hoeveelheid witregels gebruikt, 2 tussen functies en classes en 1 voor een if-statement of for-loop. Ik heb overal commentaar bij staan en heb vrijwel alle nummers in variabelen opgeslagen. Overal is de indentatie correct voor elke class, functie, loop en if-statement.

#### Zit er niet teveel herhaling in de code?
Welke code lijkt zich te herhalen?
Kan je de code bijvoorbeeld vervangen door gebruik te maken van functies, loops of classes?

Voor zover ik weet heb ik bijna overal waar mogelijk gebruik gemaakt van efficiente code door gebruik te maken van loops, classes en functies en deze zo te schrijven dat ze soms door meerdere objecten kunnen worden gebruikt(bijvoorbeeld de collider).
```javascript
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
```

#### Is de code efficient?
Is er onnodige complexiteit? Zie je vereenvoudiging van berekeningen, aantal expressies/stappen dat nodig is?
Beantwoord hier de vraag.

Er zal zeker nog wel mogelijkheid voor verbetering zijn, maar ik heb geprobeerd zo veel mogelijk lange formules op te breken in kleinere stukjes en de uitkomsten hiervan op te slaan in variabelen om het zo iets leesbaarder te maken(bijvoorbeeld in de spawnEnemies functie hieronder).

```javascript
//spawns the enemies at the start of the game, you can actually change all of the variables and it will still work AAAAAHHHH
function spawnEnemies()
{
  direction = 0;
  firstloop = true;
  //best not to touch anything in here... calculates distances between enemies
  let distanceBetweenBigEnemiesX = (boundingBox - (bigEnemySize * columns)) / (columns - 1);
  let distanceBetweenSmallEnemiesX = (boundingBox - (smallEnemySize * columns)) / (columns - 1);
  let distanceBetweenEnemiesY = (boundingBox - ((bigEnemySize * bigEnemyRows) + (smallEnemySize * (rows - bigEnemyRows)))) / (rows - 1);
  
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
      enemies.push(enemy); 
    }
  }
}


```

#### Is de bijbehorende documentatie aanwezig, duidelijk en compleet?
Ik probeer mijn documentatie zo goed mogelijk bij te houden en maak hierbinnen gebruik van codesnippets voor extra duidelijkheid als ik iets op een bepaalde manier heb geprogrammeerd.

### Beantwoord de volgende vragen zelf:

#### Welk deel van mijn code ben ik het meest trots op en waarom?
Ik ben het meest trots op mijn boundingbox formule, omdat ik hier best even mee zat te stoeien en erg blij was toen het uiteindelijk werkte.

#### Waarin wil ik mij de volgende sprint ontwikkelen m.b.t. code?
Ik wil mezelf uitdagen door te kijken naar een aantal vaardigheden die ik ken maar nog niet volledig beheers in javascript en kijken of ik deze op de een of andere manier kan verwerken in mijn code. Zo heb ik ideeen om te kijken naar verschillende levels maken en hierbij gebruik te maken van een switch. Verder wil ik misschien kijken of ik subclasses kan toevoegen om zo meer enemies te maken.