let trigger = 60;
let started = false;
let clickCount = 0;
let offset1 = 0;
let offset2 = 0;
let recorder;
let audioChunks = [];
let destination;

function setup() {
  createCanvas(windowWidth, windowHeight);
  let ctx = getAudioContext();
  destination = ctx.createMediaStreamDestination();
  recorder = new MediaRecorder(destination.stream);
  
  recorder.ondataavailable = e => audioChunks.push(e.data);
  
  recorder.onstop = () => {
    let blob = new Blob(audioChunks, { type: 'audio/webm' });
    let reader = new FileReader();
    reader.onloadend = () => {
      sessionStorage.setItem('recordedAudio', reader.result);
      window.location.href = "index3.html";  
    };
    reader.readAsDataURL(blob); 
  };
}  


function mousePressed(){
  if (!started) {
    userStartAudio();
    recorder.start();
    started = true;
    return;
  }
  guitar();
  popSound();
  clickCount++;

  if (clickCount >= 10){
    recorder.stop();  
  }
}

function draw() {
  background(60+offset2,50+offset2,10+offset2);
  firstLayer();
  secondLayer();
  thirdLayer();
  fourthLayer();
  fifthLayer();
  sixthLayer();
 
    if (started && frameCount === trigger) {
    offset1 = random(-20,20);
    drum(true);
    trigger = frameCount + floor(random(3, 8));
  }
}

function mousePressed(){
    if (!started) {
        userStartAudio();
        recorder.start();
        started=true;
        return;
    }
    guitar();
    popSound();
    clickCount++;
    offset2= random(-50,0);

  if (clickCount >= 10){
    recorder.stop();  
    setTimeout(() => {
      window.location.href = "index3.html";
    }, 200); 
  }
}

function firstLayer(){
    push();
    fill(140, 70+offset2, 130);
    beginShape();
    vertex(windowWidth, 0);
    vertex(windowWidth, windowHeight/2 +100);
    vertex(windowWidth-50+offset1, windowHeight/2 + 95);
    vertex(windowWidth-100, windowHeight/2+offset1);
    vertex(windowWidth-120, windowHeight/2-10+offset1);
    vertex(windowWidth-150, windowHeight/2-200);
    vertex(windowWidth-120, 0);
    vertex(windowWidth, 0);
    endShape();

    beginShape();
    vertex(0+offset1, 0);
    vertex(150, 0);
    vertex(155+offset1, 200);
    vertex(140+offset1, windowHeight/2-200+offset1);
    vertex(140, windowHeight/2+offset1);
    vertex(130+offset1, windowHeight/2+200);
    vertex(120, windowHeight/2+300);
    vertex(100+offset1, windowHeight/2);
    vertex(50, windowHeight/2-50);
    vertex(0, windowHeight/2-60+offset1);
    vertex(0,0);
    endShape();
    pop();
}

function secondLayer(){
    push();
    fill(255,200,240);
    beginShape();
    vertex(150, windowHeight/2+50);
    vertex(145, windowHeight/2+300);
    vertex(120, windowHeight/2+300);
    vertex(125, windowHeight/2+50);
    vertex(130, windowHeight/2+50);
    endShape();
    pop();
}

 function thirdLayer(){
    push();
    fill(185,90,20);
    beginShape();
    vertex(windowWidth, 0);
    vertex(windowWidth, 100);
    vertex(windowWidth-80, 180);
    vertex(windowWidth-150, 200);
    vertex(windowWidth-250, 230);
    vertex(windowWidth-300, 200);
    vertex(windowWidth-190, 70);
    vertex(windowWidth-180, 0);
    vertex(windowWidth, 0);
    endShape();
    pop();
}

function fourthLayer(){
    push();
    fill(210, 200, 30);
    beginShape();
    vertex(windowWidth/2+300, windowHeight/2-300);
    vertex(windowWidth/2+280, windowHeight/2-200);
    vertex(windowWidth/2+90, 0);
    vertex(windowWidth/2+230, 0);
    vertex(windowWidth/2+250, 100);
    vertex(windowWidth/2+280, windowHeight/2-280);
    vertex(windowWidth/2+300, windowHeight/2-300);
    endShape();

    beginShape();
    vertex(windowWidth/2+130, windowHeight/2-400);
    vertex(windowWidth/2+100, windowHeight/2-350);
    vertex(windowWidth/2+50, windowHeight/2- 400);
    vertex(windowWidth/2-10, windowHeight/2-420);
    vertex(windowWidth/2-10, 80);
    vertex(windowWidth/2+150, windowHeight/2-350);
    vertex(windowWidth/2+155, windowHeight/2-330);
    vertex(windowWidth/2+130, windowHeight/2-400);
    endShape();
    
    beginShape();
    vertex(windowWidth/2-300, windowHeight/2-290);
    vertex(windowWidth/2-280, windowHeight/2-290);
    vertex(windowWidth/2-280, windowHeight/2-310);
    vertex(windowWidth/2-160, windowHeight/2-310,);
    vertex(windowWidth/2-10, 130);
    vertex(windowWidth/2-30, 180);
    vertex(windowWidth/2-150, windowHeight/2-290);
    vertex(windowWidth/2-300, windowHeight/2-290);
    endShape(); 
    pop();
}

function fifthLayer(){
    push();
    fill(175, 165, 60);
    beginShape();
    vertex(windowWidth/2-200, windowHeight/2-300);
    vertex(windowWidth/2-240, windowHeight/2-300);
    vertex(windowWidth/2-300, 100);
    vertex(100, 0);
    vertex(250, 0);
    vertex(300, 200);
    vertex(windowWidth/2-200, windowHeight/2-300);
    endShape();
    pop();
}

function  sixthLayer(){
    push();
    fill(20,35,15);
    beginShape();
    vertex(0, windowHeight-300);
    vertex(0, windowHeight);
    vertex(windowWidth, windowHeight);
    vertex(windowWidth, windowHeight-380);
    vertex(windowWidth-130, windowHeight-350);
    vertex(windowWidth/2+30, windowHeight-400);
    vertex(windowWidth/2-100, windowHeight-410);
    vertex(windowWidth/2-250, windowHeight-200);
    vertex(0, windowHeight-300);
    endShape();
    pop();
}

function guitar(){
    let ctx = getAudioContext();
    let now = ctx.currentTime;

    let scale = [110, 123, 130, 146, 164, 174, 196, 220, 246];
    let frequencies = [random(scale), random(scale), random(scale)];

    frequencies.forEach(freq => {
        let osc = ctx.createOscillator();
        let gain = ctx.createGain();
        let distortion = ctx.createWaveShaper();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);

        let curve = new Float32Array(256);
        for (let i = 0; i < 256; i++) {
            let x = (i*2)/256-1;
            curve[i] = (Math.PI + 300) * x / (Math.PI + 300 * Math.abs(x));
        }
        distortion.curve = curve;

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(3, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

        osc.connect(distortion);
        distortion.connect(gain);
        gain.connect(ctx.destination);
        gain.connect(destination);  // record

        osc.start(now);
        osc.stop(now + 1.5);
    });
}

function drum(loud = false){
  let ctx = getAudioContext();
  let osc = ctx.createOscillator();
  let gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);
  gain.connect(destination);  // record

  let now = ctx.currentTime;

  osc.frequency.setValueAtTime(60, now);
  osc.frequency.exponentialRampToValueAtTime(20, now + 0.1);
  gain.gain.setValueAtTime(loud ? 15 : 10, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

  osc.start(now);
  osc.stop(now + 0.5);
}


function popSound() {
  let ctx = getAudioContext();
  let now = ctx.currentTime;

  let bufferSize = ctx.sampleRate * 0.08;
  let buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  let data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  let noise = ctx.createBufferSource();
  noise.buffer = buffer;

  let filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(800, now);
  filter.frequency.exponentialRampToValueAtTime(200, now + 0.08);
  filter.Q.value = 0.8;

  let gain = ctx.createGain();
  gain.gain.setValueAtTime(3, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  gain.connect(destination);  // record

  noise.start(now);
}