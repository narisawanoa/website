let trigger = 60;
let started = false;
let red = 0;
let offset1 = 0;
let offset2 = 0;
let clickCount =0;

function setup() {
  createCanvas(windowWidth, windowHeight)
}

function draw() {
  background(red,150,160);
  secondLayer();
  thirdLayer();
  fourthLayer();
  fifthLayer();

  if (frameCount === trigger){
    drum(true);
    red = random(0,255);
    offset1 = random(-80,90);
    offset2 = random(-150,150);
    trigger = frameCount + floor(random(10,20));
  }
}

function mousePressed(){
  if (!started) {
    userStartAudio();
    started=true;
    return;
  }
  drum();
  clickCount++;
  if (clickCount >= 10) {
    window.location.href="index2.html";
  }
}

function secondLayer(){
  push();
  fill(red+100,195,210);
  beginShape();
  vertex(0,0);
  vertex(windowWidth-300+offset1, 0);
  vertex(windowWidth-280, windowHeight/2-400+offset1);
  vertex(windowWidth-380, windowHeight/2-350);
  vertex(windowWidth-100+offset1, windowHeight/2-280+offset1/2);
  vertex(windowWidth-130, windowHeight/2-200+offset1);
  vertex(windowWidth-80+offset1, windowHeight/2-150);
  vertex(windowWidth-100, windowHeight/2-130);
  vertex(windowWidth, windowHeight/2-100);
  vertex(windowWidth, windowHeight);
  vertex(0, windowHeight);
  vertex(0,0);
  endShape();
  pop();
}

function thirdLayer(){
  push();
  fill(red+30,175,205);
  beginShape();
  vertex(windowWidth,windowHeight/2-50);
  vertex(windowWidth-50, windowHeight/2-80);
  vertex(windowWidth-150+offset2, windowHeight/2-150);
  vertex(windowWidth-300, windowHeight/2-300);
  vertex(windowWidth/2+offset2, windowHeight/2-400);
  vertex(windowWidth/2+200, windowHeight/2-250);
  vertex(windowWidth/2+180, windowHeight/2-100+offset2);
  vertex(windowWidth/2, windowHeight/2-80);
  vertex(windowWidth/2-100, windowHeight/2-70+offset2);
  vertex(windowWidth/2-150, windowHeight/2-180);
  vertex(windowWidth/2-300, windowHeight/2-200);
  vertex(windowWidth/2-450+offset2, windowHeight/2-310);
  vertex(windowWidth/2-550, windowHeight/2-300);
  vertex(100, windowHeight/2+offset2);
  vertex(0, windowHeight/2+50+offset2);
  vertex(0, windowHeight);
  vertex(windowWidth, windowHeight);
  vertex(windowWidth, windowHeight/2-50);
  endShape();
  pop();
}

function fourthLayer(){
  push();
  fill(red+160, 215, 225);
  beginShape();
  vertex(windowWidth/2+150, 0);
  vertex(windowWidth/2+160, 100+offset2);
  vertex(windowWidth/2+140, 400);
  vertex(windowWidth/2+120, 450+offset2);
  vertex(windowWidth/2+100, 400);
  vertex(windowWidth/2+110, 200);
  vertex(windowWidth/2+offset2+90, 50);
  vertex(windowWidth/2+100,0+offset2);
  vertex(windowWidth/2+150, 0);
  endShape();
  pop();
}

function fifthLayer(){
  push();
  fill(red,130,145);
  beginShape();
  vertex(windowWidth/2-50+offset1, windowHeight/2+300);
  vertex(windowWidth/2-150+offset2, windowHeight/2+450);
  vertex(windowWidth/2-130+offset1, windowHeight/2+290);
  vertex(windowWidth/2-125+offset2, windowHeight/2+280+offset1);
  vertex(windowWidth/2-50+offset1, windowHeight/2+300);
  endShape();
  pop();
}

function drum(loud = false){
  let ctx = getAudioContext();
  let osc = ctx.createOscillator();
  let gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  let now = ctx.currentTime;

  osc.frequency.setValueAtTime(60, now);
  osc.frequency.exponentialRampToValueAtTime(20, now + 0.1);
   gain.gain.setValueAtTime(loud ? 8 : 5, now);
   gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

   osc.start(now);
   osc.stop(now + 0.5);
}