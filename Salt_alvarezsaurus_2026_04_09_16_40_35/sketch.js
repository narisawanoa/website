let jump;
let mount;
let mount2;
let offset;
let mountCol, mountCol2;
let mountTop, mountTop2;
let d_hold, l_hold, r_hold, u_hold;
let one_hold;
let down, left, right, up;

let a_hold, s_hold;
let size;

let w_hold;
let speed;

let z_hold;

let blow;

let col;

let align;

let underground;

function setup() {
  createCanvas(600, 700);
  underground= createGraphics(600,350);
  blow = 0;
  mount = -100;
  mount2 = random(1, 20);
  mountTop = random(50, 130);
  mountTop2 = random(40, 150);
  offset = random(-400, 0);
  mountCol = color(random(0, 100), random(255), random(100, 255));
  mountCol2 = color(random(0, 100), random(255), random(100, 255));
  down = 0;
  left = 0;
  right = 0;
  up = 0;
  size = 0;
  speed = 0;

  align = random(10);
  frameRate(10);
}

function draw() {
  background(80, 120, 225);

  //background
  push();
  rectMode(CORNER);
  fill(80 + mount * random(-0.05, 0.05), 120, 255);
  rect(0, 0, width, jump);
  pop();
  rectMode(CENTER);

  //s
  push();
  noStroke();
  fill(mouseY, mouseX, mouseY);
  ellipse(300 + width / 5 + left, 50 + down, 30 + size, 30 + size);
  pop();

  if (d_hold) {
    down += 5;
  }
  if (l_hold) {
    left -= 5;
  }
  if (r_hold) {
    left += 5;
  }
  if (u_hold) {
    down -= 5;
  }
  if (a_hold) {
    size += 5;
  }
  if (s_hold) {
    size -= 5;
  }
  if (w_hold) {
    frameRate(50);
  }
  if (z_hold) {
    mount -= 5;
    mount2 -= random(1, 20);
  }

  if (one_hold) {
    //align=width/5;
    align = random(10);
  }

  //mountains
  push();
  fill(mountCol);
  triangle(
    mount + offset,
    jump,
    140 + mount + offset,
    jump,
    75 + mount + offset,
    mountTop2
  );
  fill(mountCol2);
  triangle(mount, jump, 140 + mount, jump, 75 + mount, mountTop);

  if (!z_hold) {
    mount += 5;
    mount2 += random(1, 20);
  }

  if (mount >= width + 150) {
    mount = -100;
    mountTop = random(50, 130);
    mountCol = color(random(0, 100), random(255), random(100, 255));
  }
  if (mount + offset >= width + 150) {
    mount2 = random(1, 20);
    mountTop2 = random(40, 150);
    offset = random(-400, 0);
    mountCol2 = color(random(0, 100), random(255), random(100, 255));
  }

  if (mount <= -width + 150) {
    mount = 450;
    mountTop = random(50, 130);
    mountCol = color(random(0, 100), random(255), (100, 255));
  }
  if (mount + offset <= -width + 150) {
    mount2 = random(1, 20);
    mountTop2 = random(40, 150);
    offset = random(-400, 0);
    mountCol2 = color(random(0, 100), random(255), (100, 255));
  }
  pop();

  line(0, jump, 400, jump);
  jump = random(200, 202);

  //body
  fill(255);
  stroke(0);
  rect(200 + align, 230, 70, 10);
  ellipse(150 + align, 250, 40, 45);
  ellipse(250 + align, 250, 40, 45);
  rect(170 + align, 185, 30, 10);

  //wheels
  push();
  angleMode(DEGREES);
  translate(150 + align, 250);
  if (z_hold) {
    rotate(frameCount * 10);
  }
  if (!z_hold) {
    rotate(-frameCount * 10);
  }
  line(-10, -10, 10, 10);
  pop();

  push();
  angleMode(DEGREES);
  translate(250 + align, 250);
  if (z_hold) {
    rotate(frameCount * 10);
  }
  if (!z_hold) {
    rotate(-frameCount * 10);
  }
  line(-10, -10, 10, 10);
  pop();

  //figure and bike

  push();
  angleMode(DEGREES);
  rotate(-70);
  translate(align / 3, 5);
  rect(-150, 230, 70, 10);
  pop();

  ellipse(200 + align, 200, 20, 40);
  ellipse(200 + align, 170, 15, 18);
  ellipse(200 + align, 230, 10, 40);
  ellipse(190 + align, 190, 30, 8);
  ellipse(195 + align, 250, 12, 8);

  //hair
  push();
  strokeWeight(2);
  stroke(random(150), random(100), random(220));
  if (!w_hold) {
    blow = random(1);
  } else {
    blow = random(3);
  }
  if (z_hold) {
    translate(405 + align, 0);
    scale(-1, 1);
  }
  line(200 + align, 168, 213 + align, 168 + blow);
  line(204 + align, 165, 219 + align, 165 + blow);
  pop();

  //underground
  
  push();
  fill(map((frameCount * 10) % 360, 0, 360, 0, 255), 0, 255);
  noStroke();
  rectMode(CORNER);
  rect(0, 350, width, 450);

  stroke(255);
  fill(map((frameCount * 10) % 360, 0, 360, 0, 255), 0, 255, 20);
  image(underground, 0, 0);
  //rain
  for (let x = 0; x < width; x += 5) {
    for (let y = 450; y < height ; y += 5) {
      noStroke();
      fill(random(100,y), random(100,x), random(100,255), 200);
      if (mouseX < width/2) {
      fill(mouseX, mouseY, random(255));
    }
      rect(random(x) + random(width) - 100, y + random(height)-100,3,20);
    }
    
  }
      //underground biker
  
      //bike
      translate(0, height-75);
      scale(1,-1);
      stroke(0);
      rect(165 + align, 230, 70, 10);
      ellipse(150 + align, 250, 40, 45);
      ellipse(250 + align, 250, 40, 45);
      rect(150 + align, 185, 30, 10);
  
      push();
      angleMode(DEGREES);
      rotate(110);
      translate(align+260, -475);
      rect(-150, 230, 70, 10);
      pop();
  
        ellipse(200 + align, 200, 20, 40);
        ellipse(200 + align, 170, 15, 18);
        ellipse(200 + align, 230, 10, 40);
        ellipse(190 + align, 190, 30, 8);
        ellipse(195 + align, 250, 12, 8);
        push();
        strokeWeight(2);
        stroke(random(150), random(100), random(220));
        if (!w_hold) {
          blow = random(1);
        } else {
          blow = random(3);
        }
        if (z_hold) {
          translate(405 + align, 0);
          scale(-1, 1);
        }
        line(200 + align, 168, 213 + align, 168 + blow);
        line(204 + align, 165, 219 + align, 165 + blow);
        pop();
  
        push();
        angleMode(DEGREES);
        translate(150 + align, 250);
        if (z_hold) {
          rotate(frameCount * 10);
        }
        if (!z_hold) {
          rotate(-frameCount * 10);
        }
        line(-10, -10, 10, 10);
        pop();

        push();
        angleMode(DEGREES);
        translate(250 + align, 250);
        if (z_hold) {
          rotate(frameCount * 10);
        }
        if (!z_hold) {
          rotate(-frameCount * 10);
        }
        line(-10, -10, 10, 10);
        pop();

}

function mousePressed() {
  mount = -100;
  mount2 = random(1, 20);
  mountTop = random(50, 130);
  mountTop2 = random(40, 150);
  offset = random(-400, 0);
  mountCol = color(random(0, 100), random(255), random(100, 255));
  mountCol2 = color(random(0, 100), random(255), random(100, 255));
  down = 0;
  left = 0;
  right = 0;
  up = 0;
  size = 0;
  frameRate(10);
  
  background(255);
}

function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    d_hold = true;
  }
  if (keyCode === LEFT_ARROW) {
    l_hold = true;
  }
  if (keyCode === RIGHT_ARROW) {
    r_hold = true;
  }
  if (keyCode === UP_ARROW) {
    u_hold = true;
  }
  if (key === "a") {
    a_hold = true;
  }
  if (key === "s") {
    s_hold = true;
  }

  if (key === "w") {
    w_hold = true;
  }
  if (key === "z") {
    z_hold = true;
  }

  if (key === "1") {
    one_hold = true;
  }
}

function keyReleased() {
  if (keyCode === DOWN_ARROW) {
    d_hold = false;
  }
  if (keyCode === LEFT_ARROW) {
    l_hold = false;
  }
  if (keyCode === RIGHT_ARROW) {
    r_hold = false;
  }
  if (keyCode === UP_ARROW) {
    u_hold = false;
  }
  if (key === "a") {
    a_hold = false;
  }
  if (key === "s") {
    s_hold = false;
  }
  if (key === "w") {
    w_hold = false;
    frameRate(10);
  }
  if (key === "z") {
    z_hold = false;
    mount += 5;
    mount2 += random(1, 20);
    rotate(-frameCount * 10);
  }

  if (key === "1") {
    one_hold = false;
  }
}
