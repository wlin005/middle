
let video;
let poseNet;
let x=0, y=0, x_new, y_new;

let tileSize = 50;  // size tiles to make
let tiles;          // list of tiles, created in setup()

let m, n, w

let framRate = 120;

let font = 'Georgia';
// let letters = 'All the world\'s a stage, and all the men and women merely players. They have their exits and their entrances.';
// let lettersLength = letters.length;


let sen = '永和九年，岁在癸丑,暮春之初，会于会稽山阴之兰亭,脩稧事也.'
let letters = [];



//let chr = ['All the world\'s a stage, and all the men and women merely players. They have their exits and their entrances.']


let points = [];

let fontSizeMin = 65;
let angleDistortion = 0.0;
let havePoses = false;

var counter = 0;
function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // draw the text to a graphics object
  let pg = createGraphics(windowWidth, windowHeight);
  pg.background(0);
  pg.textFont(font);            // note we have to start all
  pg.textAlign(CENTER, CENTER); // commands with the name of
  pg.textSize(400);             // the graphics object
  pg.fill(255);
  pg.noStroke();
 
   // split the graphics object into tiles!
  tiles = [];
  for (let n=0; n<pg.height; n+=tileSize) {
    for (let m=0; m<pg.width; m+=tileSize) {
      let tile = new Tile(m, n, tileSize, pg);
      tiles.push(tile);
    }
  }

  //piont
  for (let i = 0; i < 50; i++) {
    points.push({ x: 0, y: 0});
  }

  video = createCapture(VIDEO);
  video.hide();
  
  poseNet = ml5.poseNet(video, modelReady);
  
  poseNet.on("pose", gotPoses);
  
  // textSize(20);
  textAlign(LEFT);
  stroke(0);
  textFont(font);

}

function modelReady() {
  console.log("model ready");
}

function gotPoses(poses) {
  //console.log(poses);
  if (poses.length > 0) {
    havePoses = true;
    //lerping - linear interpolation for smoother transitions
    x = x_new;
    y = y_new;
    x_new = poses[0].pose.rightWrist.x;
    y_new = poses[0].pose.rightWrist.y;
    
    /*lerp takes 3 arguments, val1, val2, percentage and interpolates between val1 and val2 according to the percentage point value*/
    //x = lerp(x, x_new, 0.5);
    //y = lerp(y, y_new, 0.5);
  }

}

class Tile {
  constructor(m, n, w, pg) {
    this.m = m;
    this.n = n;
    
    // create an empty image and copy from
    // the graphics object we made above!
    this.img = createImage(w, w);
    this.img.copy(pg, m,n, w,w, 0,0, w,w);
  }
  
  // display the tile!
  display() {
    push();
    translate(this.m, this.n);
    rotate( map(poseNet, 0,width, 0,TWO_PI) );
    image(video, 0,0);
    pop();
  }
}

function draw() {
   image(video,0,0 );
   //return;

   if (havePoses){
    
    
    let d = dist(x, y, x_new, y_new);
    //textSize(fontSizeMin + d);
    
    let newLetter = sen.charAt(counter);
   
    stepSize = 10; // textWidth(newLetter);

    // Look at Shiffman Particle system, and either adapt that or just examine difference
    if (d > stepSize){ // condition if to add a letter
      if (letters.length >= sen.length) { // too many letters? remove one
        for (let i = 0; i < letters.length - 1; i++) {
          letters[i] = letters[i + 1];
        }
        letters.pop();
      }
      print('New letter')
      // add a new letter
      let l = {x: x,
               y: y,
               original_x: 20 , // put the right postion in with spacing
               original_y: 25+counter*40,
               vx: x_new - x,
               vy: y_new - y,
               size: fontSizeMin ,
               char: sen[counter]};
      letters.push(l);
      // increment letter counter
      counter = (counter + 1)%sen.length;
      
     
    }
  }

  // update all letters
  for (let i = 0; i < letters.length; i++) {
    let l = letters[i];
    //l.x += (l.original_x - l.x)*0.2;
    l.x = lerp(l.x, l.original_x+i, 0.05);
    l.y = lerp(l.y , l.original_y, 0.05);

   



    //l.x += l.vx*0.01;
    //l.y += l.vy*0.01;
    l.vx *= 0.9;
    l.vy *= 0.9;
    


    noStroke();
    for (let i = 0; i < sen.length; i++) {
      //   text(l.char, l.x,l.y); // draw each text element
  
  tiles[i].display();
  text(l.char, l.x,l.y);
 }
// split the graphics object into tiles!
  
}




    //textAlign(CENTER, CENTER); // set text alignment to center
    //textSize(l.size); // set text size 
   // fill(0, (i/letters.length)*255);
    //let textArray = ["Vertical", "sen", "Arrangement"]; // create an array of text
    
    //let y = height / 2 - ((l.length - 1) * textSize() / 2); // calculate y position
    
    // for (let i = 0; i < sen.length; i++) {
    //   text(l.char, l.x,l.y); // draw each text element
    // }
    // textSize(l.size);
    // fill(0, (i/letters.length)*255);
    // text(l.char, l.x, l.y);
  

}
    
