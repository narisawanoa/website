var button = false;
let time = 0;
let points = [];
let lines = [];
let balls = [];

function setup() {
  createCanvas(400, 400);
  sand = createGraphics(400, 400);
  ballLayer = createGraphics(400, 400);
  background(220);
}

function mousePressed() {
  button = true;
  balls.push({ x: mouseX, y: mouseY, g: 0, speed: random(0.1, 0.5), size: random(5,20)});
}

function mouseReleased() {
  button = false;
}

function mouseDragged(){
    let c1 = get(mouseX, mouseY);
    let c2 = get(mouseX + 3, mouseY + 3);
    let r = (red(c1) + red(c2)) / 2;
    let g = (green(c1) + green(c2)) / 2;
    let b = (blue(c1) + blue(c2)) / 2;
    sand.fill(r, g, b, 10);
    sand.noStroke();
    sand.ellipse(mouseX, mouseY, 10);
  
}

function draw() {
  time = (millis() / 50) % width;
  image(sand, 0, 0);
  ballLayer.clear();

  for (let b of balls) {
    b.g += b.speed;
    b.y += b.g;

    if (b.y >= height) {
      b.y = height;
      b.g = -b.g;
    }
    if (b.y <= 0) {
      b.y = 0;
      b.g = -b.g;
    }

    ballLayer.noStroke();
    ballLayer.fill(random(mouseX),255,random(mouseY));
    ballLayer.ellipse(b.x, b.y, b.size);
  }

  image(ballLayer, 0, 0);

  if (button) {
    for (let i = 0; i < random(30); i++) {
      sand.stroke(time + random(-30, 30), random(-time, time), random(-time, time));
      sand.point(mouseX + random(30), mouseY + random(10));
      points.push({ x: mouseX + random(30), y: mouseY + random(10) });
    }

    if (points.length >= 4) {
      let recent = points.slice(-10);
      let p1 = recent[int(random(recent.length))];
      let p2 = recent[int(random(recent.length))];
      let p3 = recent[int(random(recent.length))];
      let p4 = recent[int(random(recent.length))];
      sand.noFill();
      sand.stroke(random(255), random(255), random(255), 100);
      sand.strokeWeight(0.1);
      sand.quad(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);
    }
  }

  for (let x = 0; x < width; x += 20) {
    for (let y = 0; y < height; y += 20) {
      noStroke();
      fill(random(100, y), random(100, x), random(100, 255), 200);
      if (mouseX < random(300, 350)) {
        fill(mouseX, mouseY, random(255));
      }
      rect(random(x) + random(width) - 100, random(y) + random(height) - 100, 3, 20);

      for (let i = 0; i < 10; i++) {
        let time = (millis() / 50) % width;
        fill(mouseY, time, random(100, 255), 50);
        rect(time, 0, 5, height);
      }
    }

    push();
    frameRate(60);
    fill(255);
    ellipse(mouseX + random(-2, 2), mouseY + random(-2, 2), random(10, 3));
    ellipse(mouseX + random(-2, 2), mouseY + random(-2, 2), random(10, 3));
    pop();
  }
} 
