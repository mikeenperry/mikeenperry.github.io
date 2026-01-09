const cornersA = [];
const cornersB = [];
let mousePosition;
let counter = 0;
let cornerCounter = 8;
let shaped = true;

const objectACornersX = [];
const objectACornersY = [];
const objectBCornersX = [];
const objectBCornersY = [];

const objectBCornerSetterX = [];
const objectBCornerSetterY = [];
const objectACornerSetterX = [];
const objectACornerSetterY = [];

let cornersBX;
let cornersBY;

let aDeltaX;
let aDeltaY;
let aGrow;
let aYAxisOffset;
const aGrowths = [];
const aYAxisOffsets = [];

let bDeltaX;
let bDeltaY;
let bGrow;
let bYAxisOffset;
const bGrowths = [];
const bYAxisOffsets = [];

let crossingX;
let crossingY;

class AdvancedCollider
{
  constructor()
  {

  }


  setObjectA(cornersAX, cornersAY)
  {

    //sets the corners of object A
    for(let i = 0; i < cornersAX.length; i++)
    {
      let x = cornersAX[i];
      let y = cornersAY[i];
      cornersA.splice(i,1,createVector(x, y));

      //makes sure that if a new object has more corners than the last one, it doesn't use more corners than it has
      if(cornersA.length > cornersAX.length)
      {
        cornersA.length = cornersAX.length;
      }
    }

    //loops for every corner object A has. calculates the lines between two corners
    for(let i = 0; i < cornersA.length; i++)
    {

      //makes sure the last line uses the last and first corner to create a line
      if(i+1 >= cornersA.length)
      {
        aDeltaY = cornersA[0].y - cornersA[i].y;
        aDeltaX = cornersA[0].x - cornersA[i].x;
      }

      else
      {
        aDeltaY = cornersA[i+1].y - cornersA[i].y;
        aDeltaX = cornersA[i+1].x - cornersA[i].x;
      }
      aGrow = (aDeltaY/aDeltaX);
      aGrowths.splice(i, 1, aGrow);
      aYAxisOffset = cornersA[i].y - (cornersA[i].x * aGrow);
      aYAxisOffsets.splice(i, 1, aYAxisOffset);
    }
  }


  setObjectB(cornersBX, cornersBY)
  {
    //sets the corners of object B
    for(let i = 0; i < cornersBX.length; i++)
    {
      let x = cornersBX[i];
      let y = cornersBY[i];
      cornersB.splice(i,1,createVector(x, y));
      
      //makes sure that if a new object has more corners than the last one, it doesn't use more corners than it has
      if(cornersB.length > cornersBX.length)
      {
        cornersB.length = cornersBX.length;
      }
    }
    
    //loops for every corner object A has. calculates the lines between two corners
    for(let i = 0; i < cornersB.length; i++)
    {

      //makes sure the last line uses the last and first corner to create a line
      if(i+1 >= cornersB.length)
      {
        bDeltaY = cornersB[0].y - cornersB[i].y;
        bDeltaX = cornersB[0].x - cornersB[i].x;
      }

      else
      {
        bDeltaY = cornersB[i+1].y - cornersB[i].y;
        bDeltaX = cornersB[i+1].x - cornersB[i].x;
      }
      bGrow = (bDeltaY/bDeltaX);
      bGrowths.splice(i, 1, bGrow);
      bYAxisOffset = cornersB[i].y - (cornersB[i].x * bGrow);
      bYAxisOffsets.splice(i, 1, bYAxisOffset);

    }  
  }


  /*
    Using the corners of the 2 objects I calculated the lines that would make up the objects creating a y = ax + b formula.
    I then calculated where the lines of object A would meet the lines of object B.
    After that I checked whether the meeting point (crossingX and crossingY) was between the two corners of the line for both objects.
    If so there is a collision, if not there isn't.
  */


  update()
  {
    //this.draw();

    //checks collision for every line in object A with every line in object B
    for(let i = 0; i < cornersA.length; i++)
    {

      for(let j = 0; j < cornersB.length; j++)
      {
        crossingX = (aYAxisOffsets[i] - bYAxisOffsets[j]) / -(aGrowths[i] - bGrowths[j]);

        //when A line is parallel to the X- or Y-Axis the growth could be infinite or the axisoffset could be non-existant
        //this sets the crossingX to the X of the corner if the line is parallel to the Y-axis.
        if(isNaN(crossingX))
        {
          if(aGrowths[i] == Infinity || aGrowths[i] == -Infinity)
          {
            crossingX = cornersA[i].x;
          }
          else
          {
            crossingX = cornersB[i].x;
          }
        }
        crossingY = bGrowths[j] * crossingX + bYAxisOffsets[j];

        //if the line is parallel to the X-axis then this sets the y crossing to the y value of the corner.
        if(isNaN(crossingY))
        {
          crossingY = cornersA[i].y
        }

        //makes sure the corners are on the rigth side of the other object.
        if(i+1 < cornersA.length && j+1 < cornersB.length)
        {
          let minAX = Math.min(cornersA[i].x, cornersA[i+1].x);
          let maxAX = Math.max(cornersA[i].x, cornersA[i+1].x);
          let minBX = Math.min(cornersB[j].x, cornersB[j+1].x);
          let maxBX = Math.max(cornersB[j].x, cornersB[j+1].x);

          let minAY = Math.min(cornersA[i].y, cornersA[i+1].y);
          let maxAY = Math.max(cornersA[i].y, cornersA[i+1].y);
          let minBY = Math.min(cornersB[j].y, cornersB[j+1].y);
          let maxBY = Math.max(cornersB[j].y, cornersB[j+1].y);

          //checks for collision between object A and B.
          if((crossingX <= maxAX && crossingX >= minAX && crossingX <= maxBX && crossingX >= minBX) && (crossingY <= maxAY && crossingY >= minAY && crossingY <= maxBY && crossingY >= minBY))
          {
            return true;
          }
        }

        //makes sure the corners are on the rigth side of the other object.
        else if(i+1 >= cornersA.length && j+1 < cornersB.length)
        {
          let minAX = Math.min(cornersA[i].x, cornersA[0].x);
          let maxAX = Math.max(cornersA[i].x, cornersA[0].x);
          let minBX = Math.min(cornersB[j].x, cornersB[j+1].x);
          let maxBX = Math.max(cornersB[j].x, cornersB[j+1].x);

          let minAY = Math.min(cornersA[i].y, cornersA[0].y);
          let maxAY = Math.max(cornersA[i].y, cornersA[0].y);
          let minBY = Math.min(cornersB[j].y, cornersB[j+1].y);
          let maxBY = Math.max(cornersB[j].y, cornersB[j+1].y);

          //checks for collision between object A and B.
          if((crossingX >= minAX && crossingX <= maxAX && crossingX <= maxBX && crossingX >= minBX) && (crossingY <= maxAY && crossingY >= minAY && crossingY <= maxBY && crossingY >= minBY))
          {
            return true;
          }
        }

        //makes sure the corners are on the rigth side of the other object.
        else if(i+1 < cornersA.length && j+1 >= cornersB.length)
        {
          let minAX = Math.min(cornersA[i].x, cornersA[i+1].x);
          let maxAX = Math.max(cornersA[i].x, cornersA[i+1].x);
          let minBX = Math.min(cornersB[j].x, cornersB[0].x);
          let maxBX = Math.max(cornersB[j].x, cornersB[0].x);

          let minAY = Math.min(cornersA[i].y, cornersA[i+1].y);
          let maxAY = Math.max(cornersA[i].y, cornersA[i+1].y);
          let minBY = Math.min(cornersB[j].y, cornersB[0].y);
          let maxBY = Math.max(cornersB[j].y, cornersB[0].y);

          //checks for collision between object A and B.
          if((crossingX >= minAX && crossingX <= maxAX && crossingX <= maxBX && crossingX >= minBX) && (crossingY <= maxAY && crossingY >= minAY && crossingY <= maxBY && crossingY >= minBY))
          {
            return true;
          }
        }

        //makes sure the corners are on the rigth side of the other object.
        else if(i+1 >= cornersA.length && j+1 >= cornersB.length)
        {
          let minAX = Math.min(cornersA[i].x, cornersA[0].x);
          let maxAX = Math.max(cornersA[i].x, cornersA[0].x);
          let minBX = Math.min(cornersB[j].x, cornersB[0].x);
          let maxBX = Math.max(cornersB[j].x, cornersB[0].x);

          let minAY = Math.min(cornersA[i].y, cornersA[0].y);
          let maxAY = Math.max(cornersA[i].y, cornersA[0].y);
          let minBY = Math.min(cornersB[i].y, cornersB[0].y);
          let maxBY = Math.max(cornersB[i].y, cornersB[0].y);

          //checks for collision between object A and B.
          if((crossingX >= minAX && crossingX <= maxAX && crossingX <= maxBX && crossingX >= minBX) && (crossingY <= maxAY && crossingY >= minAY && crossingY <= maxBY && crossingY >= minBY))
          {
            return true;
          }
        }

        else
        {
          return false;
        }
      }
    }
  }


  draw()
  {
    //draws the collision boxes of the objects.
    beginShape();
    for(let i = 0; i < cornersB.length; i++)
    {
      vertex(cornersB[i].x, cornersB[i].y);
    }
    endShape();

    beginShape()
    for(let i = 0; i < cornersA.length; i ++)
    {
      vertex(cornersA[i].x, cornersA[i].y);
    }
    endShape();
  }
}


function colliderArrayMeter(objectStartLength, objectX, objectY, objectIsB, x, y)
{

  if(objectIsB)
  {

    //sets the corners for the collider for object B
    for(let j = 0; j < objectStartLength; j++)
    {
      objectBCornerSetterX.splice(j, 1, objectX[j] + x);
      objectBCornerSetterY.splice(j, 1, objectY[j] + y);
    }

    //removes any corners from other objects that aren't part of the object.
    if(objectBCornerSetterX.length > objectStartLength)
    {
      objectBCornerSetterX.length = objectStartLength;
      objectBCornerSetterY.length = objectStartLength;
    }
    return createVector(objectBCornerSetterX, objectBCornerSetterY);
  }

  else
  {

    //sets the corners for the collider for object A
    for(let j = 0; j < objectStartLength; j++)
    {
      objectACornerSetterX.splice(j, 1, objectX[j] + x);
      objectACornerSetterY.splice(j, 1, objectY[j] + y);
    }

    //removes any corners from other objects that aren't part of the object.
    if(objectACornerSetterX.length > objectStartLength)
    {
      objectACornerSetterX.length = objectStartLength;
      objectACornerSetterY.length = objectStartLength;
    }
    return createVector(objectACornerSetterX, objectACornerSetterY);
  }
}


//used for finding the position of an object

// function mousePressed()
// {
//   console.log(mouseX, mouseY);
// }