let jump;
let mount;
let mount2;
let offset;
let mountCol, mountCol2
let mountTop, mountTop2;
let d_hold, l_hold, r_hold, u_hold;
let down, left, right, up;

let a_hold, s_hold;
let size;

let w_hold;
let speed;

let z_hold;

let blow;

function setup() {
  createCanvas(400, 400);
  blow = 0;
  mount = -100;
  mount2 =random(1,20);
  mountTop = random (50,130);
  mountTop2 = random (40,150);
  offset= random (-400,0);
  mountCol = color(random(0,100), random(255), random(100,255));
  mountCol2 = color(random(0,100), random(255), random(100,255));
  down=0;
  left=0;
  right=0;
  up=0;
  size=0;
  speed=0;
  frameRate(10);
}

function draw() {
  background(80,120,225);
  
  push();
  rectMode(CORNER);
  fill(80+mount*random(-0.05,0.05),120,255);
  rect(0,0,400,jump)
  pop();
  rectMode(CENTER);

//planet
  ellipse(300+left,30+down,30+size,30+size);
  

  if (d_hold){
    down += 5;
  }
  if (l_hold){
    left -= 5;
  }
  if (r_hold){
    left += 5;
  }
  if (u_hold){
    down -= 5;
  }
  if (a_hold){
    size += 5;
  }
  if (s_hold){
    size -= 5;
  }
  if (w_hold){
    frameRate (50);
  }
  if (z_hold){
    mount -=5;
    mount2 -=random(1,20);
  }
  
//mountains
  push();
  fill (mountCol);
  triangle(mount+offset, jump, 140+mount+offset, jump, 75+mount+offset, mountTop2);
  fill (mountCol2);
  triangle(mount, jump, 140+mount, jump, 75+mount,mountTop);
  
  if (!z_hold){
    mount += 5;
    mount2 +=random(1,20);
  }
  
  if (mount>=550){
    mount = -100;
    mountTop = random (50,130);
  mountCol =
color(random(0,100), random(255), random(100,255));
  }
  if (mount+offset>=550){
    mount2 =random(1,20);
    mountTop2 = random (40,150);
    offset= random (-400,0);
  mountCol2 = color(random(0,100), random(255), random(100,255));
  }
  
  if (mount<=-550){
    mount = 450;
    mountTop = random (50,130);
    mountCol = color(random(0,100), random(255), (100,255));
  }
  if (mount+offset<=-550){
    mount2 =random(1,20);
    mountTop2 = random (40,150);
    offset= random (-400,0);
    mountCol2 = color(random(0,100), random(255), (100,255));
  }
  pop();
  
  line(0,jump,400,jump);
  jump = random(200,202);
  
  stroke(0);
  rect(200,230,70,10);
  ellipse(150,250,40,45);
  ellipse(250,250,40,45);
  rect(170,185,30,10);

//wheels 
  push();
  angleMode(DEGREES);
  translate(150, 250);
  if (z_hold){
    rotate(frameCount*10);
  }
  if (!z_hold){
    rotate(-frameCount*10);
  }
  line(-10, -10, 10, 10);
  pop();

  push();
  angleMode(DEGREES);
  translate(250, 250);
  if (z_hold){
    rotate(frameCount*10);
  }
  if (!z_hold){
    rotate(-frameCount*10);
  }
  line(-10, -10, 10, 10);
  pop();

//figure
  ellipse(200,200,20,40);
  ellipse(200,170,15,18);
  ellipse(200,230,10,40);
  ellipse(190,190,30,8);
  ellipse(195,250,12,8);
  
//hair
  push();
  strokeWeight(2);
  stroke(random(150),random(100), random(220));
  if (!w_hold){
    blow =random(1);
  } else{
    blow = random(3);
  }   
  if (z_hold){
    translate(405,0);
    scale(-1,1);
  }

  line(200,168,213,168+blow);
  line(204,165,219,165+blow);
  pop();
  
  push();
  angleMode(DEGREES);
  rotate(-70);
  rect(-150,230,70,10);
  pop();
}

function mousePressed(){
  mount=-100;
  mount2 =random(1,20);
  mountTop = random (50,130);
  mountTop2 = random (40,150);
  offset= random (-400,0);
  mountCol =
color(random(0,100), random(255), random(100,255));
  mountCol2 = color(random(0,100), random(255), random(100,255));
  down=0;
  left=0;
  right=0;
  up=0;
  size=0;
  frameRate(10);

}

function keyPressed(){
  if (keyCode===DOWN_ARROW){
    d_hold=true; 
  }
  if (keyCode===LEFT_ARROW){
    l_hold=true;
  }
  if (keyCode===RIGHT_ARROW){
    r_hold=true;
  }
  if (keyCode===UP_ARROW){
    u_hold=true;
  }
  if (key==='a'){
    a_hold=true;
  }
  if (key==='s'){
    s_hold=true;
  }
  
  if (key==='w'){
    w_hold=true;
  }
  if (key==='z'){
    z_hold=true;
  }
}


function keyReleased(){
  if (keyCode === DOWN_ARROW){
    d_hold = false;
  }
  if (keyCode===LEFT_ARROW){
    l_hold=false;
  }
  if (keyCode===RIGHT_ARROW){
    r_hold=false;
  }
  if (keyCode===UP_ARROW){
    u_hold=false;
  }
  if (key==='a'){
    a_hold=false;
  }
  if (key==='s'){
    s_hold=false;
  }  
  if (key==='w'){
    w_hold=false;
    frameRate(10);
  }
  if (key==='z'){
    z_hold=false;
    mount += 5;
    mount2 +=random(1,20);
  }
}
