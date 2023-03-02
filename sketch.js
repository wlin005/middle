
let video;
let poseNet;
let x=0, y=0, x_new, y_new;

let tileSize = 40;  // size tiles to make
let tiles;          // list of tiles, created in setup()

let framRate = 120;

let myFont;

// let letters = 'All the world\'s a stage, and all the men and women merely players. They have their exits and their entrances.';
// let lettersLength = letters.length;


let sen = '故人西辞黄鹤楼，烟花三月下扬州。孤帆远影碧空尽，唯见长江天际流。'
let letters = [];



//let chr = ['All the world\'s a stage, and all the men and women merely players. They have their exits and their entrances.']


let points = [];

let fontSizeMin = 35;
let angleDistortion = 0.0;
let havePoses = false;

var counter = 0;

function preload() {
  // Load the JPG image
  img = loadImage('background.jpg');
//load the font
   myFont = loadFont('Han.ttf')
}



function setup() {

  textFont(myFont);
  //cavas in the middle of screen   
  var canvasWidth = 640;
  var canvasHeight = 480;
  
  var cnv = createCanvas(canvasWidth, canvasHeight);
  cnv.position((windowWidth - canvasWidth) / 2, (windowHeight - canvasHeight) / 2);
  background(img);
   

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
  textFont(myFont);

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
  } else {
    havePoses = false;
  }
}


function draw() {
  
   image(video,0,0 ); 
   background(img,210);
   //return;

   if (havePoses){
    
    
    let d = dist(x, y, x_new, y_new);
    textSize(fontSizeMin + d);
    
    let newLetter = sen.charAt(counter);
   
    stepSize = 50; // textWidth(newLetter);

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
      let l = {x: x_new,
               y: y_new,
               original_x: 20 , // put the right postion in with spacing
               //original_y: 45+counter*20,
               //original_y: 45,
               vx: x_new - x,
               vy: y_new - y,
               size: fontSizeMin ,
               char: sen[counter]
              };
      letters.push(l);
      // increment letter counter
      counter = (counter + 1)%sen.length;
      
    }
  }

// set colum number
  let colNum = height/fontSizeMin;

  //letters in y 
  let yCount = 0;

  let rowNum = 0;

  // update all letters
  for (let i = 0; i < letters.length; i++) {
    let l = letters[i];
    //l.x += (l.original_x - l.x)*0.2;
    l.original_y = yCount + 70;
    l.x = lerp(l.x, l.original_x+i*13, 0.05);
    l.y = lerp(l.y , l.original_y, 0.05);
    //l.y = yCount +70

    yCount = rowNum * fontSizeMin;
    if (yCount > height){ 
      yCount = 0;
      rowNum = 2;
      colNum ++;
    }else{
      rowNum = rowNum + 3;
    }

    textAlign(CENTER, CENTER); // set text alignment to center
    textSize(l.size); // set text size 
    fill(0, (i/letters.length)*255);
    //l.x += l.vx*0.01;
    //l.y += l.vy*0.01;
    l.vx *= 0.9;
    l.vy *= 0.9;
    noStroke();
    //for (let i = 0; i < sen.length; i++) {
        text(l.char, l.x,l.y); // draw each text element     
    //}
  }


}
    
