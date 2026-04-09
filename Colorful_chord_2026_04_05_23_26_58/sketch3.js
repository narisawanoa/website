let audioCtx;
let source;
let audioBuffer;
let playbackRate = 1;
let isDragging = false;
let lastMouseX = 0;
let loaded = false;
let clickCount = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);

  let url = sessionStorage.getItem('recordedAudio');
  if (url) {
    audioCtx = new AudioContext();
    fetch(url)
      .then(r => r.arrayBuffer())
      .then(buf => audioCtx.decodeAudioData(buf))
      .then(decoded => {
        audioBuffer = decoded;
        loaded = true;
        startScrub();
      });
  }
}

function mousePressed() {
  if (!loaded) return;
  audioCtx.resume();
  isDragging = true;
  lastMouseX = mouseX;
  clickCount++;
  if (clickCount >= 7) {
    window.location.href = "index4.html";
  }
}

function mouseReleased() {
  isDragging = false;
}

function mouseDragged() {
  if (!audioBuffer) return;
  let dx = mouseX - lastMouseX;
  playbackRate = constrain(1 + dx * 0.02, 0.1, 4);
  if (source) source.playbackRate.value = playbackRate;
  lastMouseX = mouseX;
}

function startScrub() {
  if (!audioBuffer || source) return;
  source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.loop = true;
  source.playbackRate.value = playbackRate;
  source.connect(audioCtx.destination);
  source.start();
}

function stopScrub() {
  if (source) {
    source.stop();
    source = null;
  }
}

function draw() {
  background(255, 240, 245);
  if (!isDragging) {
    fill(100);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(24);
    text('hold + drag left/right to warp the sound', width/2, height - 40);
  }
}