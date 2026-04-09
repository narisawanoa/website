let audioCtx;
let source;
let audioBuffer;
let evaluation = '';
let displayedText = '';
let typeIndex = 0;
let loaded = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('monospace');

  // load and play audio
  let url = sessionStorage.getItem('recordedAudio');
  if (url) {
    audioCtx = new AudioContext();
    fetch(url)
      .then(r => r.arrayBuffer())
      .then(buf => audioCtx.decodeAudioData(buf))
      .then(decoded => {
        audioBuffer = decoded;
        loaded = true;
        startAudio();
      });
  }

  // generate evaluation
  generateEval();
}

function startAudio() {
  if (!audioBuffer) return;
  source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.loop = true;
  source.connect(audioCtx.destination);
  source.start();
}

function generateEval() {
  let rhythm = floor(random(0, 100));
  let chaos = floor(random(0, 100));
  let intensity = floor(random(0, 100));
  let timing = floor(random(0, 100));
  let total = floor((rhythm + chaos + intensity + timing) / 4);

  evaluation = `PERFORMANCE EVALUATION\n\nRhythm:     ${rhythm} / 100\nChaos:      ${chaos} / 100\nIntensity:  ${intensity} / 100\nTiming:     ${timing} / 100\n\nOVERALL:    ${total} / 100`;
}



function draw() {
  background(0);

  // resume audio context on first frame
  if (loaded && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  // type out text slowly
  if (evaluation.length > 0 && typeIndex < evaluation.length) {
    typeIndex += 0.8;
  }
  displayedText = evaluation.substring(0, floor(typeIndex));

  // draw text
  push();
  fill(255);
  noStroke();
  textSize(15);
  textAlign(LEFT, TOP);
  textLeading(26);
  textWrap(WORD);
  text(displayedText, 80, 80, width - 160, height - 160);
  pop();

  // hint
  if (evaluation === '') {
    fill(255, 100);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(13);
    text('generating evaluation...', width/2, height/2);
  }
}

function mousePressed() {
  window.location.href = "index.html";
}