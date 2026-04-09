let tracks = [
  {frames: [], recording: false, playing: false, playhead: 0, osc: null},
  {frames: [], recording: false, playing: false, playhead: 0, osc: null},
  {frames: [], recording: false, playing: false, playhead: 0, osc: null},
  {frames: [], recording: false, playing: false, playhead: 0, osc: null},
  {frames: [], recording: false, playing: false, playhead: 0, osc: null},
];
let activeRecordTrack = 0;
let isRecording = false;

let chords = {
  major:      [261, 293, 329, 349, 392, 440, 493],
  minor:      [261, 293, 311, 349, 392, 415, 466],
  seventh:    [261, 329, 392, 466, 523, 659, 784],
  minor7:     [261, 311, 392, 466, 523, 622, 784],
  maj7:       [261, 329, 392, 493, 523, 659, 784],
  dim:        [261, 293, 311, 349, 370, 415, 440],
  aug:        [261, 329, 415, 523, 659, 830, 1046],
  sus2:       [261, 293, 392, 440, 523, 587, 784],
  sus4:       [261, 349, 392, 440, 523, 698, 784],
  dorian:     [261, 293, 311, 349, 392, 440, 466],
  phrygian:   [261, 277, 311, 349, 392, 415, 466],
  lydian:     [261, 293, 329, 370, 392, 440, 493],
  mixolydian: [261, 293, 329, 349, 392, 440, 466],
  locrian:    [261, 277, 311, 349, 370, 415, 440],
  pentatonic: [261, 293, 329, 392, 440, 523, 659],
  blues:      [261, 311, 349, 370, 392, 466, 523],
};
let currentChord = '';
let chordText = 'current chord: ';
let keyText = 'Key: ';
let keyInput;
let keyInputX = 0, keyInputY = 0;
let keyMultiplier = 1;

let muted = false;
let oscsMuted = false;

let cables=[];
let draggedNotch = null;
let connectedColor = null;
let notch6Timer = 0;
let notch6Duration = 0;
let notch6Osc = null;
let notch7Timer = 0;
let notch7Duration = 0;
let notch7Osc = null;
let notch8Timer = 0;
let notch8Duration = 0;
let notch8OscDedicated;
let notch8Note = 0;
let notch12Meter = null;
let notch12BeatDuration = 0;
let notch13LFO;
let notch13ModType = null;
let notch13Amp = 0;
let notch13Oscs = [];
let notch15Filter;
let notch15Oscs = [];
let notch15FilterType = null;
let notch16FFT = null;

let notch20Noise = null;
let notch20Filter = null;
let notch21Active = false;
let notch21SelectedGrass = 0;
let notch21ZoneX = 0;
let notch21ZoneY = 0;
let notch22Flipped = false;
let notch23Active = false;
let notch25Active = false;
let notch25Graphics = null;
let notch25Mode = 0;
let notch26Dogs = [];
let notch26Crushes = [];
let notch27Feedback = null;
let notch27FeedbackFilter = null;
let notch28Active = false;
let notch28Timer = 0;
let notch28Duration = 0;
let notch28Oscs = [];
let notch28Interval = 0;

let scratching = false;
let scratchLastX = 0;

let grasses = [];
let draggingHex = false;

let angle=0;
let bgcol;
let acceleration=0;
let distortion;
let boostTimer=0;
let delay;
let input;
let dragging= false;
let inputX = 0, inputY = 0;

let isFullscreen = false;
let tx, ty;
let bx, by;


let spinText = 'spin the wheel';

let hexOffset = {x: 0, y: 0};
let oscs = [];
let paste = [];
let verts = [];

let notch18Doubles = [];
let notch25Decay = 0;

let spinCount=0;

let zoom = false;
let copied = false;
let easycam;

let grassLayer;
let grassDirty = false;

let gridBuffer;

let font;
let dog;
let bucketPuppies = [];


function preload() {
  dog = loadModel('dog.obj', true);
  font = loadFont('https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf');
  font2 = loadFont('Datatype-VariableFont_wdth,wght.ttf');
}


function drawBassGridToBuffer() {
  gridBuffer.clear();
  gridBuffer.strokeWeight(0.5);
  gridBuffer.noFill();
  let notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  let noteFreqs = [];
  for (let octave = 0; octave <= 3; octave++) {
    for (let n = 0; n < 12; n++) {
      let freq = 261.63 * pow(2, (octave - 4) + n / 12);
      if (freq >= 20 && freq <= 300) {
        noteFreqs.push({freq, name: notes[n] + octave});
      }
    }
  }
  for (let nf of noteFreqs) {
    let y = map(log(nf.freq), log(300), log(20), 0, windowHeight);
gridBuffer.stroke(0, 200, 255, 150);
gridBuffer.noFill();
gridBuffer.beginShape();
for (let x = 0; x < windowWidth; x += 2) {
  let wy = y + sin((x * 0.15) * 180 / Math.PI) * 3;
  gridBuffer.vertex(x, wy);
}
gridBuffer.endShape();
    gridBuffer.noStroke();
    gridBuffer.fill(255, 255, 255, 180);
    gridBuffer.textSize(8);
    gridBuffer.text(nf.name, 2, y - 2);
  }
}


function setup() {  
  createCanvas(windowWidth,windowHeight,WEBGL);
  angleMode(DEGREES);
  
  grassLayer = createGraphics(windowWidth, windowHeight);
  
  
  delay = new p5.Delay();
  delay.setType('pingPong');
  
  // grass
  for (let i = 0; i < 3; i++) {
      let note = random(200, 800);
      let o = new p5.Oscillator('sine');
      o.freq(note);
      o.amp(0);
      o.start();
      o.connect(delay);
      o.connect();
      grasses.push({x: random(windowWidth), y: random(windowHeight), px: random(windowWidth), py: random(windowHeight), dragging: false, locked: false, note: note, osc: o});
  }
  
  for (let i=0; i<7; i++){
   let f = random(200, 1000);
   verts.push({x:random(-width/2,width/2), y: random(-100, 100), freq: random(200, 1000)});
   
  let o = new p5.Oscillator('sine');
  o.freq(f);
  o.amp(0.1);
  o.start();
  o.connect(delay);
  oscs.push(o);
 }
   
 let o = new p5.Oscillator('sine'); 
  o.start();
  oscs.push(o);
  
  distortion = new p5.Distortion(0);
  oscs[0].connect(distortion);
  
  oscs.forEach(o => o.connect(delay));
  delay.process(oscs[0], 0.5, 0, 3000); 
  
  
  //Notch 8!!!!!!!
  notch8OscDedicated = new p5.Oscillator('sine');
  notch8OscDedicated.amp(0);
  notch8OscDedicated.start();

  notch13LFO = new p5.Oscillator('sine');
  notch13LFO.freq(random(2, 8));
  notch13LFO.amp(0);
  notch13LFO.start();
  
  notch15Filter = new p5.Filter();
  
  //this is for the ropes
  for (let i=0; i<3; i++){
    let x1 = random(-300, 300);
    cables.push(new Cable(x1+width/2, height/2, 20));
  }
  
  
  //text box blue
  input = createInput();
  inputX = width/2+600;
  inputY = -height/2+500;
  input.position(inputX, inputY,0);
  translate(0,0,-100);
  input.style('font-size', '10px');
  input.style('background-color', 'rgba(0,0,0,0.5)');
  input.style('color', 'rgb(255,255,255)');
  input.style('padding', 'none');
  input.style('width', '80px');
  input.style('outline', 'none');
  input.style('border', 'none');
  
  keyInput = createInput();
  keyInputX = width/2+700;
  keyInputY = -height/2+500;
  keyInput.position(keyInputX, keyInputY);
  keyInput.style('font-size', '10px');
  keyInput.style('background-color', 'rgba(0,0,0,0.5)');
  keyInput.style('color', 'rgb(255,255,255)');
  keyInput.style('padding', 'none');
  keyInput.style('width', '80px');
  keyInput.style('outline', 'none');
  keyInput.style('border', 'none');
  
  
  easycam = createEasyCam();
  easycam.removeMouseListeners();

  // pre-render the pitch map grid once
  gridBuffer = createGraphics(windowWidth, windowHeight);
  drawGridToBuffer();
}

function drawGridToBuffer() {
  gridBuffer.clear();
  gridBuffer.strokeWeight(0.5);
  gridBuffer.noFill();

  let notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  
  // generate all note frequencies in the range of the grid
  // freqY range: 50 to 1200, freqX range: 0.5 to 2
  // so total freq range: 25 to 2400
  let noteFreqs = [];
  for (let octave = 0; octave <= 7; octave++) {
    for (let n = 0; n < 12; n++) {
      let freq = 261.63 * pow(2, (octave - 4) + n / 12);
      if (freq >= 50 && freq <= 2400) {
        noteFreqs.push({freq, name: notes[n] + octave});
      }
    }
  }

  // horizontal dots
  for (let nf of noteFreqs) {
    let freqY = nf.freq / 0.5;
    if (freqY < 40 || freqY > 1250) continue;
    let y = map(freqY, 1200, 50, -10, windowHeight + 10);
    gridBuffer.stroke(255, 225, 0, 100);
    gridBuffer.noFill();
    gridBuffer.beginShape();
    for (let x = 0; x < windowWidth; x += 2) {
      let wy = y + sin((x * 0.15) * 180 / Math.PI) * 3;
      gridBuffer.vertex(x, wy);
    }
    gridBuffer.endShape();
    gridBuffer.noStroke();
    gridBuffer.fill(255, 255, 255, 180);
    gridBuffer.textSize(6);
    gridBuffer.text(nf.name, 2, y - 2);
  }

  // vertical dots
  for (let nf of noteFreqs) {
    let freqX = nf.freq / 600;
    if (freqX < 0.5 || freqX > 2) continue;
    let x = map(freqX, 0.5, 2, 0, windowWidth);
    gridBuffer.stroke(255,200,0,200);
    for (let y = 0; y < windowHeight; y += 8) {
      gridBuffer.point(x, y);
    }
    gridBuffer.noStroke();
    gridBuffer.fill(255, 255, 255, 80);
    gridBuffer.textSize(6);
    gridBuffer.text(nf.name, x + 2, 10);
  }
}

//chord
function keyPressed(){
  
  if (keyCode === ENTER) {
    let val = input.value().toLowerCase().trim();
  if (chords[val]) {
        currentChord = val;
        chordText = 'current chord: ' + currentChord;
        let intervals = [0, 2, 4];
        let root = intervals[int(random(intervals.length))];
        let rootFreq = chords[currentChord][root];
        for (let i=0; i<7; i++) oscs[i].freq(chords[currentChord][i] * keyMultiplier * (rootFreq / chords[currentChord][0]));
      }
    
      let keys = {c:1, d:1.122, e:1.26, f:1.335, g:1.498, a:1.682, b:1.888};
      let kval = keyInput.value().toLowerCase().trim();
      if (keys[kval]) {
              keyMultiplier = keys[kval];
              keyText = 'Key:'+ kval;
              if (currentChord && chords[currentChord]) {
                let intervals = [0, 2, 4];
                let root = intervals[int(random(intervals.length))];
                let rootShift = chords[currentChord][root] / chords[currentChord][0];
          for (let i=0; i<7; i++) oscs[i].freq(chords[currentChord][i] * keyMultiplier * rootShift);
              }
            }
  }
  
  
  //keyboard as keyboards notch No. 12!!!!!!!!!!!!!!!!!!
  if (notch21Active) {
let keyMap = {
      '`':{x:0/13,y:0/3},  '1':{x:1/13,y:0/3},  '2':{x:2/13,y:0/3},  '3':{x:3/13,y:0/3},
      '4':{x:4/13,y:0/3},  '5':{x:5/13,y:0/3},  '6':{x:6/13,y:0/3},  '7':{x:7/13,y:0/3},
      '8':{x:8/13,y:0/3},  '9':{x:9/13,y:0/3},  '0':{x:10/13,y:0/3}, '-':{x:11/13,y:0/3},
      '=':{x:12/13,y:0/3}, 'backspace':{x:13/13,y:0/3},
      'tab':{x:0/13,y:1/3},   'q':{x:1/13,y:1/3},  'w':{x:2/13,y:1/3},  'e':{x:3/13,y:1/3},
      'r':{x:4/13,y:1/3},  't':{x:5/13,y:1/3},  'y':{x:6/13,y:1/3},  'u':{x:7/13,y:1/3},
      'i':{x:8/13,y:1/3},  'o':{x:9/13,y:1/3},  'p':{x:10/13,y:1/3}, '[':{x:11/13,y:1/3},
      ']':{x:12/13,y:1/3}, '\\':{x:13/13,y:1/3},
      'capslock':{x:0/13,y:2/3}, 'a':{x:1/13,y:2/3}, 's':{x:2/13,y:2/3}, 'd':{x:3/13,y:2/3},
      'f':{x:4/13,y:2/3},  'g':{x:5/13,y:2/3},  'h':{x:6/13,y:2/3},  'j':{x:7/13,y:2/3},
      'k':{x:8/13,y:2/3},  'l':{x:9/13,y:2/3},  ';':{x:10/13,y:2/3}, '\'':{x:11/13,y:2/3},
      'enter':{x:12/13,y:2/3},
      'shift':{x:0/13,y:3/3}, 'z':{x:1/13,y:3/3}, 'x':{x:2/13,y:3/3}, 'c':{x:3/13,y:3/3},
      'v':{x:4/13,y:3/3},  'b':{x:5/13,y:3/3},  'n':{x:6/13,y:3/3},  'm':{x:7/13,y:3/3},
      ',':{x:8/13,y:3/3},  '.':{x:9/13,y:3/3},  '/':{x:10/13,y:3/3}, 'shift':{x:11/13,y:3/3}
    };
    let k = key.toLowerCase();
    if (k === ' ') k = 'space';
    if (keyCode === BACKSPACE) k = 'backspace';
    if (keyCode === TAB) k = 'tab';
    if (keyCode === ENTER) k = 'enter';
    if (keyCode === 20) k = 'capslock';
    if (keyCode === 16) k = 'shift';
if (keyMap[k]) {
      let g = grasses[notch21SelectedGrass];

      let zoneStartY = notch21ZoneY * (windowHeight / 2);
      let zoneEndY = zoneStartY + (windowHeight / 2);
      let zoneStartX = notch21ZoneX * (windowWidth / 2);
      let zoneEndX = zoneStartX + (windowWidth / 2);

      let vertLines = [];
      for (let octave = 0; octave <= 7; octave++) {
        for (let n = 0; n < 12; n++) {
          let freq = 261.63 * pow(2, (octave - 4) + n / 12);
          let freqX = freq / 600;
          if (freqX < 0.5 || freqX > 2) continue;
          let x = map(freqX, 0.5, 2, 0, windowWidth);
          if (x >= zoneStartX && x < zoneEndX) vertLines.push(x);
        }
      }
      vertLines.sort((a, b) => a - b);
      let colIndex = constrain(int(map(keyMap[k].x, 0, 1, 0, vertLines.length - 1)), 0, vertLines.length - 1);
      g.x = vertLines[colIndex];

      let horizLines = [];
      for (let octave = 0; octave <= 7; octave++) {
        for (let n = 0; n < 12; n++) {
          let freq = 261.63 * pow(2, (octave - 4) + n / 12);
          let freqY = freq / 0.5;
          if (freqY < 40 || freqY > 1250) continue;
          let y = map(freqY, 1200, 50, -10, windowHeight + 10);
          if (y >= zoneStartY && y < zoneEndY) horizLines.push(y);
        }
      }
      horizLines.sort((a, b) => a - b);
      let rowIndex = constrain(int(map(keyMap[k].y, 0, 1, 0, horizLines.length - 1)), 0, horizLines.length - 1);
      g.y = horizLines[rowIndex];

      let anyNotch17k = cables.some(c =>
        [c.notches[0], c.notches[c.notches.length-1]].some(n => n.wasNotch17)
      );
      if (anyNotch17k) {
        let freqY2 = exp(map(g.y, 0, windowHeight, log(300), log(20)));
        g.osc.freq(freqY2);
        let ampValK = map(freqY2, 20, 300, 2.0, 0.3);
        ampValK = constrain(ampValK, 0.3, 2.0);
        g.osc.amp(ampValK);
      } else {
        let freqY2 = map(g.y, 0, windowHeight, 1200, 50);
        let freqX2 = map(g.x, 0, windowWidth, 0.5, 2);
        g.osc.freq(freqY2 * freqX2);
        let ampValK = map(freqY2 * freqX2, 25, 2400, 0.7, 0.05);
        ampValK = constrain(ampValK, 0.05, 0.7);
        g.osc.amp(ampValK);
      }
    }
    
    if (keyCode === TAB) {
      notch21SelectedGrass = (notch21SelectedGrass + 1) % grasses.length;
    }
    
      if (keyCode === LEFT_ARROW)  { notch21ZoneX = max(0, notch21ZoneX - 1); return; }
      if (keyCode === RIGHT_ARROW) { notch21ZoneX = min(1, notch21ZoneX + 1); return; }
      if (keyCode === UP_ARROW)    { notch21ZoneY = max(0, notch21ZoneY - 1); return; }
      if (keyCode === DOWN_ARROW)  { notch21ZoneY = min(1, notch21ZoneY + 1); return; }
    }
}




function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  grassLayer = createGraphics(windowWidth, windowHeight);
  hexOffset.x = windowWidth / 2;
  hexOffset.y = windowHeight / 2;
  gridBuffer = createGraphics(windowWidth, windowHeight);
  drawGridToBuffer();
}


function mouseReleased() {
  dragging = false;
  draggedNotch = null;
  draggingHex = false;
  scratching = false;
  
  let mx = notch22Flipped ? windowWidth - mouseX : mouseX;
  let my = notch22Flipped ? windowHeight - mouseY : mouseY;
  
  for (let g of grasses) {
    g.dragging = false;
    if (g.osc && !g.locked) g.osc.amp(0);
    if (g.osc && g.locked && notch23Active) {
      setTimeout(() => { g.osc.amp(0); }, 150);
    }
  }

  for (let p of paste) {
    p.dragging = false;
  }
}

function mousePressed(){
  if (!isFullscreen){
    fullscreen(true);
    isFullscreen=true;
    setTimeout(() => {
      gy = windowHeight;
      gx = random(windowWidth);
      grassLayer = createGraphics(windowWidth, windowHeight);
    }, 500);
    return;
  }
  
  // main dog click
let dogScreenX = width/2 + 100;
let dogScreenY = height/2 - 160;
let ddx = mouseX - dogScreenX;
let ddy = mouseY - dogScreenY;
if (sqrt(ddx*ddx + ddy*ddy) < 50) {
  oscsMuted = !oscsMuted;
  if (!oscsMuted) {
    oscs[0].amp(0.2);
    for (let i = 1; i < 8 && i < oscs.length; i++) oscs[i].amp(0.1);
  } else {
    for (let o of oscs) o.amp(0);
  }
  return;
}
  
  // track UI clicks
  let uiX = 50;
  let uiY = height/2 - 300;
  
  // Record text
if (!isRecording && mouseX > 50 && mouseX < 110 && mouseY > 25 && mouseY < 55) {
    isRecording = true;
    tracks[activeRecordTrack].frames = [];
    tracks[activeRecordTrack].recording = true;
    return;
  }

if (isRecording && mouseX > 100 && mouseX < 160 && mouseY > 25 && mouseY < 55) {
    isRecording = false;
    tracks[activeRecordTrack].recording = false;
    return;
  }

  for (let j = 0; j < tracks.length; j++) {
    let t = tracks[j];
    let ty3 = uiY + j * 22;

    // play/pause button
    if (mouseX > uiX + 160 && mouseX < uiX + 190 && mouseY > ty3 - 10 && mouseY < ty3 + 4) {
      if (t.playing) {
        t.playing = false;
        t.playhead = 0;
        if (t.osc) {
          for (let o of t.osc) { o.amp(0); o.stop(); }
          t.osc = null;
        }
      } else if (t.frames.length > 0) {
        t.playing = true;
        t.playhead = 0;
      }
      return;
    }

    // select track for recording
    if (mouseX > uiX && mouseX < uiX + 155 && mouseY > ty3 - 10 && mouseY < ty3 + 4) {
      activeRecordTrack = j;
      return;
    }
  }
  
  let mx = notch22Flipped ? windowWidth - mouseX : mouseX;
  let my = notch22Flipped ? windowHeight - mouseY : mouseY;

  //note players (grass)
for (let g of grasses) {
    let dx = g.x - mouseX;
    let dy = g.y - mouseY;
    if (sqrt(dx*dx + dy*dy) < 15) {
      if (notch21Active) {
        notch21SelectedGrass = grasses.indexOf(g);
        return;
      }
      g.dragging = true;
      g.locked = !g.locked;
      if (!g.locked) g.osc.amp(0);
      return;
    }
  }
  
  let wx = width/2 - 100;
  let wy = height/2;
  if (mouseX > wx - 80 && mouseX < wx + 80 && mouseY > wy - 80 && mouseY < wy + 80) {
    scratching = true;
    scratchLastX = mouseX;
    return;
  }
  
  // paste dog drag check
for (let p of paste) {
  let dx = p.sx - mouseX;
  let dy = p.sy - mouseY;
  if (sqrt(dx*dx + dy*dy) < 60) {
    p.dragging = true;
    return;
  }
}
  
    //the cable between notches
  for (let c of cables) {
  let first = c.notches[0];
  let last = c.notches[c.notches.length-1];
   
    
    
  for (let n of [first, last]) {
    let dx = n.x-mouseX;
    let dy = n.y-mouseY;
    if (sqrt(dx*dx + dy*dy) < 30) {
      draggedNotch = n;
      return;
    }
  }
}

  // hex fence check
    let fx = 100 + hexOffset.x;
    let fy = hexOffset.y;
    let fw = 20 * 52;  // 20 columns * 52px spacing
    let fh = 6 * 45;  // 6 rows * 45px spacing

    if (mouseX > fx && mouseX < fx + fw &&
        mouseY > fy && mouseY < fy + fh) {
      draggingHex = true;
      return;
    }
  

  //drag the input box
  if (mouseX > inputX && mouseX < inputX + 100 &&
      mouseY > inputY && mouseY < inputY + 20) {
    dragging = true;
    dragOffsetX = mouseX - inputX;
    dragOffsetY = mouseY - inputY;
    return;
  }
  
  //click on the "spin the wheel" text to spin the wheel
  if (zoom){
    if (mouseX>tx-140 && mouseX<tx-60 && mouseY>ty-100 && mouseY<ty-80){
    acceleration=random(1,4);
    boostTimer=70;
    spinCount ++;
    }
    if (spinCount > 0 && spinCount % 2 == 0) zoom = !zoom;
   }else {
    if (mouseX>tx-40 && mouseX<tx+40 && mouseY>ty-10 && mouseY<ty+10){
    acceleration=random(1,4);
    boostTimer=70;
    spinCount ++;
    }
    if (spinCount > 0 && spinCount % 5 == 0) zoom = !zoom;
}  
  
  //click on the bottle to add a sound  translate(100,-150);  cylinder(10,30);
  if (mouseX>bx-10 && mouseX<bx+10 && mouseY>by-15 && mouseY<by+15){
  let o = new p5.Oscillator('sine');
    o.amp(0.2);
    o.start();
    o.connect(distortion);
    o.connect(delay);
    let note = (currentChord && chords[currentChord]) ? chords[currentChord][int(random(7))] * keyMultiplier * (random() < 0.5 ? 0.25 : 0.5) : random(20, 200);
    o.freq(note);
    oscs.push(o);
  }
    
  //if text 'puppies' clicked, copy
  if (mouseX>tx+40 && mouseX<tx+100 && mouseY>ty-100 && mouseY<ty-60){
    copied = true;
  } else if (copied){
      paste.push({x: mouseX - width/2, y: mouseY - height/2, vx:0, vy:0, dragging: false});
      distortion.set(paste.length * 0.01);
      let pingOsc = new p5.Oscillator('sine');
      let pingFreq = chords[currentChord] ? chords[currentChord][int(random(6))] * keyMultiplier : random(200, 800);
      pingOsc.freq(pingFreq);
      pingOsc.amp(0.4);
      pingOsc.start();
      pingOsc.connect(delay);
      setTimeout(() => { pingOsc.amp(0); setTimeout(() => { pingOsc.stop(); }, 200); }, 300);
      copied = false;
    }
  }


//for the hexagon
function mouseDragged() {
  
  let mx = notch22Flipped ? windowWidth - mouseX : mouseX;
  let my = notch22Flipped ? windowHeight - mouseY : mouseY;
  
if (scratching) {
    let scratchSpeed = mouseX - scratchLastX;
    acceleration += scratchSpeed * 0.05;
    acceleration = constrain(acceleration, -10, 10);
    scratchLastX = mouseX;
    let pitchBend = 1 + scratchSpeed * 0.002;
    for (let o of oscs) {
      o.freq(o.getFreq() * pitchBend);
    }
    for (let g of grasses) {
      g.osc.freq(g.osc.getFreq() * pitchBend);
    }
    if (notch8OscDedicated) {
      notch8OscDedicated.freq(notch8OscDedicated.getFreq() * pitchBend);
    }
    for (let o of notch18Doubles) {
      o.freq(o.getFreq() * pitchBend);
    }
    for (let o of notch13Oscs) {
      o.freq(o.getFreq() * pitchBend);
    }
    if (notch20Filter) {
      notch20Filter.freq(notch20Filter.getFreq() * pitchBend);
    }
    if (notch27FeedbackFilter) {
      notch27FeedbackFilter.freq(notch27FeedbackFilter.getFreq() * pitchBend);
    }
    return;
  }

for (let g of grasses) {
      if (g.dragging && !notch21Active) {
        if (notch23Active) {
          setTimeout(() => { g.osc.amp(0); }, 150);
        }
        let anyNotch17 = cables.some(c =>
          [c.notches[0], c.notches[c.notches.length-1]].some(n => n.wasNotch17)
        );
        let freqForAmp = anyNotch17
        ? exp(map(mouseY, 0, windowHeight, log(300), log(20)))
        : map(mouseY, 0, windowHeight, 1200, 50) * map(mouseX, 0, windowWidth, 0.5, 2);
      let ampVal = anyNotch17
        ? map(freqForAmp, 20, 300, 2.0, 0.3)
        : map(freqForAmp, 25, 2400, 0.7, 0.05);
      ampVal = constrain(ampVal, 0.05, 2.0);
      g.osc.amp(ampVal);
        if (anyNotch17) {
          let freqY = exp(map(mouseY, 0, windowHeight, log(300), log(20)));
          g.osc.freq(freqY);
        } else {
          let freqY = map(mouseY, 0, windowHeight, 1200, 50);  // top = high, bottom = low
          let freqX = map(mouseX, 0, windowWidth, 0.5, 2);     // left = lower, right = higher
          g.osc.freq(freqY * freqX);
        }
        grassLayer.ellipse(g.x, g.y, 4);
        grassDirty = true;
        g.x = mouseX;
        g.y = mouseY;
        return;
      }
    }
  
  //dogs
  for (let p of paste) {
    if (p.dragging) {
      p.x = mouseX - width/2 - 60;
      p.y = mouseY - height/2;
      return;
    }
  }
  
  if (draggedNotch) {
    draggedNotch.x = mouseX;
    draggedNotch.y = mouseY;
    draggedNotch.px = mouseX;
    draggedNotch.py = mouseY;
  } else if (dragging) {
    inputX = mouseX - dragOffsetX;
    inputY = mouseY - dragOffsetY;
    input.position(inputX, inputY);
  } else if (draggingHex) {
    hexOffset.x += movedX;
    hexOffset.y += movedY;
  }
  
}

function heptagon(x, y, r, rot=60) {
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = (360 / 6) * i - 90 + rot;
    vertex(x + r * cos(angle), y + r * sin(angle));
  }
  endShape(CLOSE);
}


// ADD TO OBJECTS WHEN YOU ADD OBJECTS!!!!!!!!!!
function checkFense(){
  let fx = 100+hexOffset.x;
  let fy = hexOffset.y;
  let fw = 6*87;
  let fh = 6*87;
  
  let objects = [
    {x: width/2+100, y: height/2-160}, // dog
    {x: width/2, y: height/2-150},    // bottle
    {x: width/2-100, y: height/2},    // wheel
  ];
  
  for (let obj of objects){
    if (obj.x > fx && obj.x < fx+fw && obj.y > fy && obj.y<fy+fh){
      return true;
    }
    
  }
  return false;
  
}



function drawRope(x1, y1, x2, y2, sag) {
  let mx = (x1 + x2) / 2;
  let my = (y1 + y2) / 2 + sag;
  noFill();
  stroke(255);
  beginShape();
  curveVertex(x1, y1);
  curveVertex(x1, y1);
  curveVertex(mx, my);
  curveVertex(x2, y2);
  curveVertex(x2, y2);
  endShape();
}


class Cable{
    constructor(x, y, segments){
      this.notches = [];
      for (let i=0; i<segments; i++){
        let t = i / (segments - 1);
        this.notches.push({
          x: x + t * 200, 
          y: y, 
          px: x + t * 200, 
          py: y, 
          pinned: i === 0 || i === segments-1
        });
      }
    }
  
  update() {
    for (let n of this.notches) {
      if (n.pinned) continue;
      let vx = (n.x - n.px) * 0.98;
      let vy = (n.y - n.py) * 0.98;
      n.px = n.x;
      n.py = n.y;
      n.x += vx;
      n.y += vy + 10;
    }
    for (let iter = 0; iter < 10; iter++) {
      for (let i = 0; i < this.notches.length - 1; i++) {
        let a = this.notches[i];
        let b = this.notches[i + 1];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let d = sqrt(dx * dx + dy * dy);
        let diff = (d - 10) / d * 0.5;
        if (!a.pinned) { a.x += dx * diff; a.y += dy * diff; }
        if (!b.pinned) { b.x -= dx * diff; b.y -= dy * diff; }
      }
    }
  }
  
  
  //cable 
draw() {
      let ends = [this.notches[0], this.notches[this.notches.length-1]];
      let connectedCount = ends.filter(n => n.connectedTo).length;
      noFill();
      if (connectedCount === 2) {
        let r = map(sin(frameCount * 0.15), -1, 1, 0, 255);
        let g = map(sin(frameCount * 0.1 + 2), -1, 1, 0, 255);
        let b = map(sin(frameCount * 0.12 + 4), -1, 1, 0, 255);
        stroke(r, g, b);
        strokeWeight(map(sin(frameCount * 0.2), -1, 1, 1, 4));
      } else if (connectedCount === 1) {
        let r = map(sin(frameCount * 0.05), -1, 1, 100, 200);
        let g = map(sin(frameCount * 0.04 + 2), -1, 1, 100, 200);
        let b = map(sin(frameCount * 0.04 + 4), -1, 1, 100, 200);
        stroke(r, g, b);
        strokeWeight(2);
      } else {
        stroke(255, 0, 127);
        strokeWeight(2);
      }
      beginShape();
      let first = this.notches[0];
      let last = this.notches[this.notches.length-1];
      curveVertex(first.x, first.y);
      for (let n of this.notches) {
        let jitter = connectedCount === 2 ? random(-2, 2) : connectedCount === 1 ? random(-0.5, 0.5) : 0;
        curveVertex(n.x + jitter, n.y + jitter);
      }
      curveVertex(last.x, last.y);
      endShape();
    }
}
function applyNotch25() {
  if (!notch25Active || !notch25Graphics) return;
  
  push();
  resetMatrix();
  translate(-width/2, -height/2);
  notch25Decay = min(notch25Decay + 0.00005, 0.4);
  notch25Graphics.loadPixels();
  let pw = notch25Graphics.width;
  let ph = notch25Graphics.height;

  if (notch25Mode === 0) {
    for (let i = 0; i < notch25Graphics.pixels.length; i += 4) {
      if (random() < notch25Decay) {
        let shift = int(random(-200, 200)) * 4;
        let j = constrain(i + shift, 0, notch25Graphics.pixels.length - 4);
        notch25Graphics.pixels[i]   = notch25Graphics.pixels[j];
        notch25Graphics.pixels[i+1] = notch25Graphics.pixels[j+1];
        notch25Graphics.pixels[i+2] = notch25Graphics.pixels[j+2];
        notch25Graphics.pixels[i+3] = 255;
      }
    }
  } else if (notch25Mode === 1) {
    notch25Graphics.updatePixels();
    notch25Graphics.noStroke();
    for (let x = 0; x < pw; x += 12) {
      for (let y = 0; y < ph; y += 12) {
        let idx = (y * pw + x) * 4;
        let r = notch25Graphics.pixels[idx];
        let g = notch25Graphics.pixels[idx+1];
        let b = notch25Graphics.pixels[idx+2];
        notch25Graphics.fill(r, g, b);
        let jx = x + random(-notch25Decay * 200, notch25Decay * 200);
        let jy = y + random(-notch25Decay * 200, notch25Decay * 200);
        let sz = map(notch25Decay, 0, 0.4, 4, 20);
        notch25Graphics.ellipse(jx, jy, sz);
      }
    }
    image(notch25Graphics, 0, 0);
    pop();
    return;
  } else if (notch25Mode === 2) {
    for (let i = 0; i < notch25Graphics.pixels.length; i += 4) {
      if (random() < notch25Decay * 2) {
        let avg = (notch25Graphics.pixels[i] + notch25Graphics.pixels[i+1] + notch25Graphics.pixels[i+2]) / 3;
        let val = avg > 128 ? 255 : 0;
        notch25Graphics.pixels[i] = notch25Graphics.pixels[i+1] = notch25Graphics.pixels[i+2] = val;
        notch25Graphics.pixels[i+3] = 255;
      }
    }
  } else if (notch25Mode === 3) {
    for (let x = 1; x < pw - 1; x++) {
      for (let y = 1; y < ph - 1; y++) {
        if (random() < notch25Decay) {
          let idx = (y * pw + x) * 4;
          let idxL = (y * pw + (x-1)) * 4;
          let idxR = (y * pw + (x+1)) * 4;
          let idxU = ((y-1) * pw + x) * 4;
          let idxD = ((y+1) * pw + x) * 4;
          notch25Graphics.pixels[idx]   = (notch25Graphics.pixels[idxL] + notch25Graphics.pixels[idxR] + notch25Graphics.pixels[idxU] + notch25Graphics.pixels[idxD]) / 4;
          notch25Graphics.pixels[idx+1] = (notch25Graphics.pixels[idxL+1] + notch25Graphics.pixels[idxR+1] + notch25Graphics.pixels[idxU+1] + notch25Graphics.pixels[idxD+1]) / 4;
          notch25Graphics.pixels[idx+2] = (notch25Graphics.pixels[idxL+2] + notch25Graphics.pixels[idxR+2] + notch25Graphics.pixels[idxU+2] + notch25Graphics.pixels[idxD+2]) / 4;
          notch25Graphics.pixels[idx+3] = 255;
        }
      }
    }
  } else if (notch25Mode === 4) {
    let blockSize = int(map(notch25Decay, 0, 0.4, 2, 30));
    for (let x = 0; x < pw; x += blockSize) {
      for (let y = 0; y < ph; y += blockSize) {
        let idx = (y * pw + x) * 4;
        let r = notch25Graphics.pixels[idx];
        let g = notch25Graphics.pixels[idx+1];
        let b = notch25Graphics.pixels[idx+2];
        for (let bx = 0; bx < blockSize && x+bx < pw; bx++) {
          for (let by = 0; by < blockSize && y+by < ph; by++) {
            let bidx = ((y+by) * pw + (x+bx)) * 4;
            notch25Graphics.pixels[bidx]   = r;
            notch25Graphics.pixels[bidx+1] = g;
            notch25Graphics.pixels[bidx+2] = b;
            notch25Graphics.pixels[bidx+3] = 255;
          }
        }
      }
    }
  } else if (notch25Mode === 5) {
    let levels = int(map(notch25Decay, 0, 0.4, 8, 2));
    let step = 255 / levels;
    for (let i = 0; i < notch25Graphics.pixels.length; i += 4) {
      if (random() < notch25Decay * 2) {
        notch25Graphics.pixels[i]   = round(notch25Graphics.pixels[i]   / step) * step;
        notch25Graphics.pixels[i+1] = round(notch25Graphics.pixels[i+1] / step) * step;
        notch25Graphics.pixels[i+2] = round(notch25Graphics.pixels[i+2] / step) * step;
        notch25Graphics.pixels[i+3] = 255;
      }
    }
  } else if (notch25Mode === 6) {
    for (let y = 0; y < ph; y += 2) {
      for (let x = 0; x < pw; x++) {
        let idx = (y * pw + x) * 4;
        notch25Graphics.pixels[idx]   *= 0.3;
        notch25Graphics.pixels[idx+1] *= 0.3;
        notch25Graphics.pixels[idx+2] *= 0.3;
        notch25Graphics.pixels[idx+3] = 255;
        let shiftIdx = (y * pw + constrain(x + int(notch25Decay * 50), 0, pw-1)) * 4;
        notch25Graphics.pixels[shiftIdx]   = notch25Graphics.pixels[idx];
        notch25Graphics.pixels[shiftIdx+1] = notch25Graphics.pixels[idx+1];
        notch25Graphics.pixels[shiftIdx+2] = notch25Graphics.pixels[idx+2];
      }
    }
  } else if (notch25Mode === 7) {
    let copy = notch25Graphics.pixels.slice();
    for (let x = 1; x < pw - 1; x++) {
      for (let y = 1; y < ph - 1; y++) {
        let idx = (y * pw + x) * 4;
        let idxR = (y * pw + (x+1)) * 4;
        let idxD = ((y+1) * pw + x) * 4;
        let diffR = abs(copy[idx] - copy[idxR]) + abs(copy[idx+1] - copy[idxR+1]) + abs(copy[idx+2] - copy[idxR+2]);
        let diffD = abs(copy[idx] - copy[idxD]) + abs(copy[idx+1] - copy[idxD+1]) + abs(copy[idx+2] - copy[idxD+2]);
        let edge = min((diffR + diffD) * 2, 255);
        notch25Graphics.pixels[idx]   = edge;
        notch25Graphics.pixels[idx+1] = edge;
        notch25Graphics.pixels[idx+2] = edge;
        notch25Graphics.pixels[idx+3] = 255;
      }
    }
  } else if (notch25Mode === 8) {
    let palette = [
      [255,0,127], [10,255,100], [0,0,225],
      [127,0,255], [255,69,0],   [0,255,255],
      [255,255,0], [85,0,204]
    ];
    for (let i = 0; i < notch25Graphics.pixels.length; i += 4) {
      if (random() < notch25Decay * 2) {
        let r = notch25Graphics.pixels[i];
        let g = notch25Graphics.pixels[i+1];
        let b = notch25Graphics.pixels[i+2];
        let best = 0; let bestDist = 999999;
        for (let p = 0; p < palette.length; p++) {
          let d = abs(r - palette[p][0]) + abs(g - palette[p][1]) + abs(b - palette[p][2]);
          if (d < bestDist) { bestDist = d; best = p; }
        }
        notch25Graphics.pixels[i]   = palette[best][0];
        notch25Graphics.pixels[i+1] = palette[best][1];
        notch25Graphics.pixels[i+2] = palette[best][2];
        notch25Graphics.pixels[i+3] = 255;
      }
    }
  }

  notch25Graphics.updatePixels();
  image(notch25Graphics, 0, 0);
  pop();
}

function draw() {
  if (!notch16FFT) {
    bgcol = color(10, 255, 100);
  }
  background(bgcol);
  
  if (notch22Flipped) {
    scale(-1, -1, 1);
  }
  
if (!muted && !oscsMuted) {
  oscs[0].amp(0.2 + acceleration * 0.3);
  for (let i = 1; i < 8 && i < oscs.length; i++) {
    if (oscs[i].getAmp() === 0) oscs[i].amp(0.1);
  }
}
  muted = false;
  
  tx = width/2 - 100; ty = height/2 - 100;
  bx = width/2; by = height/2 - 150;
  let rx = 350;
  let ry = height/2 - 230;
  
  if (acceleration > 0.1) oscs[0].freq((chords[currentChord] ? chords[currentChord][0] * keyMultiplier : 440) + acceleration * 100);
  
  
  if (zoom){
    easycam.setDistance(400, 0);
  } else {
    easycam.setDistance(800, 0);
  }

  // background
  push();
if (frameCount % 120 == 0){
  for (let i=0; i<verts.length; i++){
    verts[i].x=random(-width/2, width/2);
    verts[i].y=random(-100,100);
    oscs[i+1].freq(chords[currentChord] ? chords[currentChord][i] * keyMultiplier : verts[i].freq); 
  }
   verts.sort((a, b) => b.x - a.x);
  }
  
  beginShape();
  noStroke();
  
  //for notch No.0
  let isConnected = cables.some(c => 
    [c.notches[0], c.notches[c.notches.length-1]].some(n => 
      n.connectedTo && n.connectedTo.i === 0 && n.connectedTo.a === 0
    )
  );
  if (isConnected && !connectedColor) {
      let colors = [
        color(255,0,0), color(255,69,0), color(255,140,0), color(255,200,0),
        color(255,255,0), color(180,255,0), color(0,255,0), color(0,200,80),
        color(0,255,180), color(0,255,255), color(0,180,255), color(0,80,255),
        color(60,0,255), color(128,0,255), color(200,0,255), color(255,0,255),
        color(255,0,127), color(255,20,147), color(255,105,180), color(0,128,128)
      ];
      connectedColor = colors[int(random(colors.length))];
  } else if (!isConnected) {
    connectedColor = null;
  }
  fill(isConnected ? connectedColor : color(0, 0, 225, 200));
  
  vertex(-width/2-100, 0, -100);
  vertex(-width/2-100, -height/2-100, -100);
  vertex(width/2+100, -height/2-100, -100);
  vertex(width/2+100, 0, -100);
  verts.forEach(v =>{
    vertex(v.x, v.y, -100);
  });
  endShape();
  pop();
  
  
  
  //hexagon wire fense
  push();
  noFill();
  if (checkFense()) {
    let flicker = random() < 0.15;
    strokeWeight(flicker ? 1 : 0.8);
    stroke(flicker ? color(255, (frameCount + 15) % 255, (frameCount + 70) % 255) : color(frameCount+50 % 255, (frameCount + 15) % 255, (frameCount + 70) % 255));
  } else {
    strokeWeight(0.5);
    stroke(frameCount+50 % 255, (frameCount + 15) % 255, (frameCount + 70) % 255);
  }
  translate(100 + hexOffset.x - width/2, hexOffset.y - height/2, 100);
  //normalMaterial();
  for (let i=0; i<20; i++){
    for (let a=0; a<6; a++){
      let offset = (a % 2 == 0) ? 0 : 26;  
      heptagon(i*52 + offset, a*45, 30); 
    }
  }
  pop();
  
  //delaying by fensing
  if (checkFense()) {
    delay.feedback(map(hexOffset.x, 0, width, 0, 0.9));
  } else {
    delay.feedback(0);
  }
  
  //wheel
  push();
    //ambientLight(bgcol);
  pointLight(255, 192, 203, -200,-100,0);
    //ambientMaterial(bgcol);
  directionalLight(255, 192, 203,mouseX+width/2,mouseY+height/2,100);
  specularMaterial(bgcol);
  translate(-100,0,0);
  noStroke();
  
  
  //pigeons and dark couortyards
  push();
  translate(200,-160,0);
  rotateX(140);
  rotateY(-120);
  rotateZ(-5);
  model(dog);
  pop();
  
  push();
  stroke(0);
  line(200,-180,20+random(1),-10+random(0.2));  
  pop();
  
  //copy and paste of pigeons
  paste.forEach((p, i) => {
    
    //dogs pull each other
    paste.forEach((otherp,j)=>{
      if (i !== j){
      let dx = otherp.x - p.x;
      let dy = otherp.y - p.y;
      let d = sqrt(dx*dx + dy*dy);
      p.vx += dx / d * 0.1 ; 
      p.vy += dy / d * 0.1 ;
      }
    });
    
    if (p.x <= -width/2 || p.x >= width/2){
      p.vx = -p.vx;
    } 
    if (p.y <= -height/2 || p.y >= height/2){
      p.vy = -p.vy;
    }
       
      p.vx *= 0.5;
      p.vy *= 0.5;
      p.x += p.vx;
      p.y += p.vy;
    
  // DOG store approximate screen pos for hit detection
  p.sx = p.x + width/2-50;
  p.sy = p.y + height/2;
  push();
  translate(p.x+60,p.y,0);
  scale(0.5);
  rotateX(140);
  rotateY(angle*0.2);
  rotateZ(angle*0.5);
  model(dog);
  pop();
  
      if (!p.hasBeat && p.sx > width/2 - 250 - 120 && p.sx < width/2 - 250 + 120 &&
        p.sy > height/2 + 150 && p.sy < height/2 + 450) {
      p.hasBeat = true;
      const c = new AudioContext();
      let beatType = ['kick', 'envelope', 'ring', 'boom'][int(random(4))];
      bucketPuppies.push({type: beatType, ctx: c, interval: int(random(4, 25)), timer: 0, duty: random(0.02, 0.08), puppy: p});
    }
    
    
  });
  
  // bucket beats
for (let b of bucketPuppies) {
    let inBucket = b.puppy.sx > width/2 - 250 - 120 && b.puppy.sx < width/2 - 250 + 120 &&
                   b.puppy.sy > height/2 + 150 && b.puppy.sy < height/2 + 450;
    if (!inBucket) {
      b.puppy.hasBeat = false;
      continue;
    }
    b.timer++;
    if (b.timer % b.interval === 0) {
      const c = b.ctx;
      if (c.state === 'suspended') c.resume();
      if (b.type === 'kick') {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.connect(gain); gain.connect(c.destination);
        osc.frequency.setValueAtTime(150, c.currentTime);
        osc.frequency.exponentialRampToValueAtTime(0.001, c.currentTime + 0.3);
        gain.gain.setValueAtTime(1, c.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.3);
        osc.start(); osc.stop(c.currentTime + 0.3);
      } else if (b.type === 'envelope') {
        const buf = c.createBuffer(1, c.sampleRate * 0.15, c.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        const src = c.createBufferSource();
        const filter = c.createBiquadFilter();
        const gain = c.createGain();
        src.buffer = buf;
        filter.type = 'bandpass'; filter.frequency.value = 200; filter.Q.value = 0.5;
        src.connect(filter); filter.connect(gain); gain.connect(c.destination);
        gain.gain.setValueAtTime(1, c.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.08);
        src.start();
      } else if (b.type === 'ring') {
        const osc1 = c.createOscillator();
        const osc2 = c.createOscillator();
        const gain1 = c.createGain();
        const gainOut = c.createGain();
        osc1.frequency.value = random(200, 400);
        osc2.frequency.value = random(150, 250);
        osc1.connect(gain1); osc2.connect(gain1.gain);
        gain1.connect(gainOut); gainOut.connect(c.destination);
        gainOut.gain.setValueAtTime(1, c.currentTime);
        gainOut.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2);
        osc1.start(); osc2.start();
        osc1.stop(c.currentTime + 0.2); osc2.stop(c.currentTime + 0.2);
      } else if (b.type === 'boom') {
        const osc = c.createOscillator();
        const gain = c.createGain();
        const dist = c.createWaveShaper();
        const curve = new Float32Array(256);
        for (let i = 0; i < 256; i++) { const x = i * 2/256 - 1; curve[i] = x * 1.5; }
        dist.curve = curve;
        osc.frequency.setValueAtTime(60, c.currentTime);
        osc.frequency.exponentialRampToValueAtTime(20, c.currentTime + 0.5);
        osc.connect(dist); dist.connect(gain); gain.connect(c.destination);
        gain.gain.setValueAtTime(1.2, c.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.5);
        osc.start(); osc.stop(c.currentTime + 0.5);
      }
    }
  }
  
  
  
  //shape of nibble bottle
  push();
  translate(100, -150);
  rotateY(angle);
  specularMaterial(10,255,100,50);
  cylinder(10,30);
  translate(0,-15);
  cylinder(5,10);
  pop();
  
  //notches
  push();
  translate(-300,0);
    //rotateY(30);
  for (let i=0; i<7; i++){
    for (let a=0; a<5; a++){
    push();
    translate(i*180,a*100,-30);
    ambientLight(0,0,255);
    ambientMaterial(0,0,255);
    torus(2,2);
    text(i * 5 + a, 5, 0);
    pop();
    }
  }
  
  pop();
  
  muted = false;
  
for (let c of cables) {
  let ends = [c.notches[0], c.notches[c.notches.length-1]];
  for (let n of ends) {
    if (!n.connectedTo) n.wasConnected = false;
    if (oscsMuted) {
      for (let o of oscs) o.amp(0);
    }
    
    if (!n.connectedTo && notch13ModType) {
      notch13LFO.amp(0);
      notch13ModType = null;
    }
    
    if (!n.connectedTo && notch15FilterType) {
      notch15Oscs.forEach(o => {
        o.disconnect();
        o.connect(delay);
      });
      notch15FilterType = null;
      notch15Oscs = [];
    }
    
  if (!n.connectedTo && n.wasNotch16) {
        notch16FFT = null;
        bgcol = color(10, 255, 100);
        n.wasNotch16 = false;
      }

    if (!n.connectedTo && n.wasNotch17) {
      drawGridToBuffer();
      for (let o of oscs) o.amp(o.getAmp() / 2);
      for (let g of grasses) g.osc.amp(0);
      n.wasNotch17 = false;
    }
    
        if (!n.connectedTo && n.wasNotch18) {
              for (let o of notch18Doubles) {
                o.amp(0);
                o.stop();
              }
              notch18Doubles = [];
              n.wasNotch18 = false;
            }
    
        if (!n.connectedTo && n.wasNotch20) {
              notch20Noise.amp(0);
              notch20Noise.stop();
              notch20Noise = null;
              notch20Filter = null;
              n.wasNotch20 = false;
            }
    
    if (!n.connectedTo && n.wasNotch21) {
      notch21Active = false;
      n.wasNotch21 = false;
    }
    
    if (!n.connectedTo && n.wasNotch22) {
      notch22Flipped = false;
      n.wasNotch22 = false;
    }
    
    if (!n.connectedTo && n.wasNotch23) {
      notch23Active = false;
      n.wasNotch23 = false;
    }
    
    if (!n.connectedTo && n.wasNotch25) {
      notch25Active = false;
      notch25Decay = 0;
      if (notch25Graphics) {
        notch25Graphics.remove();
        notch25Graphics = null;
      }
      n.wasNotch25 = false;
    }
    
if (!n.connectedTo && n.wasNotch26) {
      notch26Dogs = [];
      for (let cr of notch26Crushes) {
        cr.osc.disconnect();
        cr.osc.connect(delay);
      }
      oscs[0].connect(distortion);
      notch26Crushes = [];
      n.wasNotch26 = false;
    }
    
    if (!n.connectedTo && n.wasNotch27) {
      if (notch27Feedback) {
        notch27Feedback.feedback(0);
        notch27Feedback.disconnect();
      }
      if (notch27FeedbackFilter) {
        notch27FeedbackFilter.disconnect();
      }
      notch27Feedback = null;
      notch27FeedbackFilter = null;
      n.wasNotch27 = false;
    }
    
    if (!n.connectedTo && n.wasNotch28) {
      notch28Active = false;
      for (let o of notch28Oscs) {
        o.amp(0);
        o.stop();
      }
      notch28Oscs = [];
      notch28Timer = 0;
      n.wasNotch28 = false;
    }
    
      n.connectedTo = null;
    for (let i=0; i<7; i++){
      for (let a=0; a<5; a++){
        let tx2 = (-100 + -300 + i * 180) + width/2;
        let ty2 = (a * 100) + height/2;
        let dx = n.x - tx2;
        let dy = n.y - ty2;
        if (sqrt(dx*dx + dy*dy) < 20) {
          n.connectedTo = {i, a};
            //This is for the notch No.1
          if (i === 0 && a === 1 && !n.wasConnected) { 
              let waveforms = ['sawtooth', 'triangle', 'square'];
              let w = waveforms[int(random(waveforms.length))];
              let wAmp = w === 'triangle' ? 0.05 : 0.02;
              for (let o of oscs) {
                o.setType(w);
                o.amp(wAmp);
              }
              n.wasConnected = true;
            }
          
          //notch No. 2
          if (i === 0 && a === 2) {
              if (frameCount % 10 < 5) {
                for (let o of oscs) o.amp(0.05);
              } else {
                for (let o of oscs) o.amp(0);
              }
            }
          
          //notch No. 5
          if (i === 1 && a === 0) {
              if (frameCount % 40 < 20) {
                for (let o of oscs) o.amp(0.05);
              } else {
                for (let o of oscs) o.amp(0);
              }
            }
          
          //Notch No. 6
          if (i === 1 && a === 1) {
              if (frameCount > notch6Timer) {
                let note = chords[currentChord] ? chords[currentChord][int(random(7))] * keyMultiplier : random(200, 800);
                notch6Osc = oscs[int(random(oscs.length))];
                notch6Osc.freq(note);
                notch6Osc.amp(0.5);
                notch6Duration = int(random(10, 60));
                notch6Timer = frameCount + notch6Duration;
              } else if (frameCount > notch6Timer - notch6Duration/2) {
                if (notch6Osc) notch6Osc.amp(0);
              }
            }
          
          //Notch No. 7
          if (i === 1 && a === 2) {
              if (frameCount > notch7Timer) {
                let note = (currentChord && chords[currentChord]) ? chords[currentChord][int(random(7))] * keyMultiplier * (random() < 0.5 ? 0.25 : 0.5) : random(20, 200);
                notch7Osc = oscs[int(random(oscs.length))];
                notch7Osc.freq(note);
                notch7Osc.amp(0.3);
                notch7Duration = int(random(10, 60));
                notch7Timer = frameCount + notch7Duration;
              } else if (frameCount > notch7Timer - notch7Duration/2) {
                if (notch7Osc) notch7Osc.amp(0);
              }
            }
          
          //Notch No. 8
          if (i === 1 && a === 3) {
            if (!n.wasConnected) {
              notch8Note = (currentChord && chords[currentChord]) ? chords[currentChord][int(random(7))] * keyMultiplier : random(200, 800);
              notch8Duration = int(random(2, 50));
              notch8OscDedicated.freq(notch8Note);
              notch8Timer = frameCount;
              n.wasConnected = true;
            }
            if (frameCount > notch8Timer + notch8Duration) {
              notch8Timer = frameCount;
            }
          if (frameCount < notch8Timer + notch8Duration/2) {
              notch8OscDedicated.amp(0.5);
            } else {
              notch8OscDedicated.amp(0);
            }
          }
          
          //Notch No. 11
          if (i === 2 && a === 1) {
            muted = true;
          }
          
          //Notch No. 12
          if (i === 2 && a === 2) {
            if (!n.wasConnected) {
              let meters = [
                {beats: 4, div: 4},
                {beats: 3, div: 4},
                {beats: 5, div: 4},
                {beats: 6, div: 8},
                {beats: 7, div: 8},
                {beats: 2, div: 4},
                {beats: 5, div: 8},
                {beats: 9, div: 8}
              ];
              notch12Meter = meters[int(random(meters.length))];
              notch12BeatDuration = int(map(notch12Meter.div, 4, 8, 30, 15));
              n.wasConnected = true;
            }
            if (notch12Meter) {
              let totalDuration = notch12Meter.beats * notch12BeatDuration;
              let pos = frameCount % totalDuration;
              let beat = int(pos / notch12BeatDuration);
                if (pos % notch12BeatDuration < notch12BeatDuration * 0.5) {
                for (let o of oscs) o.amp(0.02);
                notch8OscDedicated.amp(0.1);
              } else {
                for (let o of oscs) o.amp(0);
                notch8OscDedicated.amp(0);
              }
            }
          }
          
          //Notch No. 13
          if (i === 2 && a === 3) {
            if (!n.wasConnected) {
              notch13ModType = 'tremolo';
              notch13LFO.freq(random(0.5, 15));
              notch13Amp = random(0.02, 0.8);
              notch13Oscs = shuffle(oscs.slice()).slice(0, int(random(2, 5)));
              n.wasConnected = true;
            }
            let tremoloVal=(sin(frameCount*notch13LFO.getFreq()*6)+1)/2;
            for (let o of notch13Oscs) o.amp(tremoloVal * notch13Amp);
          }
          
          
          //Notch No. 15
          if (i === 3 && a === 0) {
            if (!n.wasConnected) {
              let filterTypes=['lowpass','highpass','bandpass'];
              notch15Filter = new p5.Filter(notch15FilterType);
              notch15Filter.freq(random(200, 2000));
              notch15Filter.res(random(1, 20));
              notch15Filter.connect(delay); 
              notch15Oscs = shuffle(oscs.slice()).slice(0, int(random(2, 5)));
              notch15Oscs.forEach(o => {
                o.disconnect();       
                o.connect(notch15Filter); 
              });
              n.wasConnected = true;
            }
          }
          
          //Notch No. 16
          if (i === 3 && a === 1) {
            if (!notch16FFT) {
              notch16FFT = new p5.FFT(0.8, 256);
              notch16FFT.setInput(delay);
              n.wasNotch16 = true;
            }
            let spectrum = notch16FFT.analyze();
            let low  = max(spectrum.slice(0,   30))  / 255;
            let mid  = max(spectrum.slice(30,  100)) / 255;
            let high = max(spectrum.slice(100, 128)) / 255;

            let total = low + mid + high + 0.001;
            let wL = low  / total;
            let wM = mid  / total;
            let wH = high / total;

            bgcol = color(
              255 * wL + 85  * wM + 10  * wH,
              69  * wL + 0   * wM + 255 * wH,
              0   * wL + 204 * wM + 100 * wH
            );
          }
          
          //Notch No. 17
          if (i === 3 && a === 2) {
            if (!n.wasConnected) {
              drawBassGridToBuffer();
              for (let o of oscs) o.amp(o.getAmp() * 2);
              for (let g of grasses) g.osc.amp(3.0);
              n.wasConnected = true;
              n.wasNotch17 = true;
            }
          }
          
          //Notch No. 18
          if (i === 3 && a === 3) {
            if (!n.wasConnected) {
              let doubled = [];
              for (let o of oscs) {
                let clone = new p5.Oscillator(o.getType());
                clone.freq(o.getFreq() * random(0.98, 1.02));
                clone.amp(o.getAmp());
                clone.start();
                clone.connect(delay);
                doubled.push(clone);
              }
              notch18Doubles = doubled;
              n.wasConnected = true;
              n.wasNotch18 = true;
            }
          }
          
          //Notch No. 20
          if (i === 4 && a === 0) {
            if (!notch20Noise) {
              let noiseTypes = ['white', 'pink', 'brown'];
              notch20Noise = new p5.Noise(noiseTypes[int(random(noiseTypes.length))]);
              notch20Filter = new p5.Filter('bandpass');
              notch20Filter.freq(random(400, 3000));
              notch20Filter.res(random(2, 12));
              notch20Noise.connect(notch20Filter);
              notch20Filter.connect(delay);
              notch20Noise.amp(random(0.05, 0.15));
              notch20Noise.start();
              n.wasNotch20 = true;
            }
            notch20Filter.freq(map(sin(frameCount * 0.02), -1, 1, 400, 2500));
            notch20Noise.amp(map(sin(frameCount * 0.015), -1, 1, 0.03, 0.12));
          }
          
          //Notch No. 21
          if (i === 4 && a === 1) {
            if (!n.wasConnected) {
              notch21Active = true;
              notch21SelectedGrass = 0;
              n.wasConnected = true;
              n.wasNotch21 = true;
            }
          }
          
          //Notch No. 22
          if (i === 4 && a === 2) {
            if (!n.wasConnected) {
              notch22Flipped = true;
              n.wasConnected = true;
              n.wasNotch22 = true;
            }
          }
          
          //Notch No. 23
          if (i === 4 && a === 3) {
            if (!n.wasConnected) {
              notch23Active = true;
              n.wasConnected = true;
              n.wasNotch23 = true;
            }
          }
          
          //Notch No. 25
          if (i === 5 && a === 0) {
            if (!n.wasConnected) {
              notch25Active = true;
              notch25Decay = 0;
              notch25Mode = int(random(9));
              notch25Graphics = createGraphics(windowWidth, windowHeight);
              notch25Graphics.pixelDensity(1);
              notch25Graphics.image(get(), 0, 0);
              n.wasConnected = true;
              n.wasNotch25 = true;
            }
          }
          
          //Notch No. 26
          if (i === 5 && a === 1) {
            if (!n.wasConnected) {
              let count = int(random(5, 30));
              for (let d = 0; d < count; d++) {
                notch26Dogs.push({
                  x: random(-width/2, width/2),
                  y: random(-height/2, height/2),
                  rotX: random(360),
                  rotY: random(360),
                  rotZ: random(360),
                  scale: random(0.05, 0.2),
                  spinSpeed: random(-3, 3)
                });
              }
              notch26Crushes = [];
              for (let o of oscs) {
                let crush = new p5.Distortion(map(paste.length, 0, 10, 0.1, 0.9));
                o.disconnect();
                o.connect(crush);
                crush.connect(delay);
                notch26Crushes.push({osc: o, crush: crush});
              }
              n.wasConnected = true;
              n.wasNotch26 = true;
            }
            for (let cr of notch26Crushes) {
              let amt = map(paste.length, 0, 10, 0.1, 0.9);
              cr.crush.set(amt, 'linear');
            }
          }
          
          //Notch No. 27
          if (i === 5 && a === 2) {
            if (!n.wasConnected) {
              notch27FeedbackFilter = new p5.Filter('bandpass');
              notch27FeedbackFilter.freq(random(200, 2000));
              notch27FeedbackFilter.res(random(15, 30));
              notch27Feedback = new p5.Delay();
              notch27Feedback.setType('pingPong');
              notch27Feedback.delayTime(random(0.1, 0.4));
              notch27Feedback.feedback(random(0.95));
              for (let o of oscs) {
                o.connect(notch27FeedbackFilter);
              }
              for (let g of grasses) {
                g.osc.connect(notch27FeedbackFilter);
              }
              notch27FeedbackFilter.connect(notch27Feedback);
              notch27Feedback.connect(notch27FeedbackFilter);
              notch27Feedback.connect(delay);
              notch27Feedback.amp(2);
              n.wasConnected = true;
              n.wasNotch27 = true;
            }
            notch27Feedback.feedback(map(sin(frameCount * 0.02), -1, 1, 0.6, 0.92));
            notch27FeedbackFilter.freq(map(sin(frameCount * 0.015), -1, 1, 200, 3000));
          }
          
          
          //Notch No. 28
          if (i === 5 && a === 3) {
            if (!n.wasConnected) {
              notch28Active = true;
              notch28Interval = int(random(10, 60));
              notch28Timer = 0;
              for (let j = 0; j < 4; j++) {
                let o = new p5.Oscillator('sine');
                o.amp(0);
                o.start();
                o.connect(delay);
                notch28Oscs.push(o);
              }
              n.wasConnected = true;
              n.wasNotch28 = true;
            }
            if (notch28Active && (currentChord && chords[currentChord])) {
              notch28Timer++;
              if (notch28Timer >= notch28Duration) {
                notch28Timer = 0;
                notch28Duration = notch28Interval;
                let chord = chords[currentChord];
                let inversionStart = int(random(chord.length));
                for (let j = 0; j < notch28Oscs.length; j++) {
                  let noteIndex = (inversionStart + j) % chord.length;
                  let octaveShift = floor((inversionStart + j) / chord.length);
                  notch28Oscs[j].freq(chord[noteIndex] * keyMultiplier * pow(2, octaveShift));
                  notch28Oscs[j].amp(0.15);
                }
                setTimeout(() => {
                  for (let o of notch28Oscs) o.amp(0);
                }, notch28Interval * 16 * 0.6);
              }
            }
          }
          
        }
        }
      }
    }
  }
  
  if (muted) {
    for (let o of oscs) o.amp(0);
    if (notch8OscDedicated) notch8OscDedicated.amp(0);
    for (let g of grasses) g.osc.amp(0);
  }
  
  //cables
  push();
  resetMatrix();
  translate(-width/2, -height/2);
  for (let c of cables) {
    c.update();
    c.draw();
  }
  //noStroke();
  //normalMaterial();
  fill(255, 0, 127);
  for (let c of cables) {
    circle(c.notches[0].x, c.notches[0].y, 5);
    circle(c.notches[c.notches.length-1].x, c.notches[c.notches.length-1].y, 5);
  }
  pop();
  
  //bucket to throw the puppies in
  push();
  noLights();
  ambientLight(0, 10, 60);
  pointLight(0, 60, 255, -200, -300, 300);   
  pointLight(0, 20, 120, 300, 200, 200);      
  ambientMaterial(0, 20, 100);
  specularMaterial(30, 60, 180);              
  shininess(40);
  translate(-250, 300, 0);
  cylinder(100, 200, 24, 1, false, false);
  pop();
  
    //notch 26 tiny dogs
  for (let d of notch26Dogs) {
    push();
    translate(d.x, d.y, 0);
    scale(d.scale);
    rotateX(d.rotX);
    rotateY(d.rotY + angle * d.spinSpeed * 0.1);
    rotateZ(d.rotZ);
    model(dog);
    pop();
  }
  //how long it boosts the wheel
  if (boostTimer>0){
    boostTimer--;
  } else {
    acceleration *= 0.95;
  }
  
  angle+=1+acceleration;
  rotateX(60);
  rotateZ(angle);
  rotateY(0.01);
  scale(1, 1, 0.5);
  torus(50, 50);
  pop();
  
  for (let wi = 0; wi < 3; wi++) {
    push();
    translate(width/2 - 80, height/2 - 60 - wi * 130, 0);
    rotateX(60);
    rotateZ(angle);
    normalMaterial();
    noStroke();
    rotateY(-0.8);
    scale(1, 1, 0.5);
    torus(20, 10);
    pop();
  }
  //text "spin the wheel"
  push();
  fill(255);
  textSize(10);
  textFont(font2);
  textAlign(CENTER, CENTER);
  text(spinText, tx - width/2, ty - height/2);
  
  stroke(10,255,100);
  translate(0,0,-100);
  rect(tx - width/2-60, ty - height/2-20, 100, 20);
  
  //text "lots of pigeon"
  fill(255);
  text('lots of puppies in a dark yard', tx - width/2+85.3, ty - height/2-100);
  fill(255, 0, 0);
  text('puppies', tx - width/2+81.5 + textWidth('lots of ') - textWidth('puppies and dark courtyards')/2 + textWidth('puppies')/2 , ty - height/2-100);
  
  //text "dump the dogs"
  push();
  fill(10,25,100);
  textSize(15);
  textFont(font2);
  text('<= puppies', tx - width/2-50, ty - height/2+300);
  pop();
  
  //show current chord
  push();
  fill(255, 20, 147);
  translate(width/2-100,-height/2+100);
  text(chordText, tx - width/2+120, ty - height/2 + 20);
  text(keyText, tx - width/2+140, ty - height/2 );
  textStyle(BOLD);
  pop();
  
  //display all the chord options
  push();
  textFont(font2);
  fill(255);
  text('major\n minor\nseventth\nminor7\nmaj7\ndim\naug\nsus2\nsus4\ndorian\nphrygian\nlydian\nmixolydian\nlocrian\npentatonic\nblues', 350,0);
  text('c\n d\ne\nf\ng\na\nb', 450,-10);
  pop();
  
  //grass
  push();
  resetMatrix();
  translate(-width/2, -height/2);
  grassLayer.stroke(127,0,255);
  grassLayer.strokeWeight(3);
  grassLayer.noFill();
  if (grassDirty) {
    image(grassLayer, 0, 0, windowWidth, windowHeight);
    grassDirty = false;
  } else {
    image(grassLayer, 0, 0, windowWidth, windowHeight);
  }
  noStroke();
  fill(255,69,0);
  for (let g of grasses) {
    g.x += sin(frameCount * g.note * 0.01) * 0.5;
    g.y += cos(frameCount * g.note * 0.005) * 0.5;
    grassLayer.ellipse(g.x, g.y, 4);
    
    //grass note players
    if (g.locked) {
          fill(255, 255, 0);
        } else if (notch21Active && grasses.indexOf(g) === notch21SelectedGrass) {
          fill(0, 255, 255);
          ellipse(g.x, g.y, 20);
        } else {
          fill(255, 0, 0);
        }
        ellipse(g.x, g.y, 10);
  }
  pop();
  
if (notch21Active) {
    push();
    resetMatrix();
    translate(-width/2, -height/2);

    let zoneW = windowWidth / 2;
    let zoneH = windowHeight / 2;
    let zoneX = notch21ZoneX * zoneW;
    let zoneY = notch21ZoneY * zoneH;
    noStroke();
    fill(255, 255, 255, 15);
    rect(zoneX, zoneY, zoneW, zoneH);
    stroke(255, 255, 255, 40);
    strokeWeight(1);
    noFill();
    rect(zoneX, zoneY, zoneW, zoneH);

    translate(400, 0);
    fill(0, 0, 0, 140);
    noStroke();
    textSize(14);
    textFont(font2);
    textAlign(LEFT);
    text('zone: ' + (notch21ZoneX + 1) + ',' + (notch21ZoneY + 1) + '   (arrows to switch)', windowWidth * 0.05, windowHeight * 0.18);
    text('`  1  2  3  4  5  6  7  8  9  0  -  =  bksp', windowWidth * 0.05, windowHeight * 0.25);
    text('tab  q  w  e  r  t  y  u  i  o  p  [  ]  \\', windowWidth * 0.05, windowHeight * 0.4);
    text('caps  a  s  d  f  g  h  j  k  l  ;  \'  enter', windowWidth * 0.05, windowHeight * 0.55);
    text('shift  z  x  c  v  b  n  m  ,  .  /', windowWidth * 0.05, windowHeight * 0.7);
    textSize(10);
    fill(0, 0, 0, 125);
    text('click a circle to select it', windowWidth * 0.05, windowHeight * 0.85);
    text('any key = play a note', windowWidth * 0.05, windowHeight * 0.88);
    pop();
  }
  
applyNotch25();
  
  // recording
  if (isRecording) {
    let frame = [];
    for (let g of grasses) {
      frame.push({freq: g.osc.getFreq(), amp: g.osc.getAmp()});
    }
    tracks[activeRecordTrack].frames.push(frame);
  }

  // playback
  for (let t of tracks) {
    if (t.playing && t.frames.length > 0) {
      let frame = t.frames[t.playhead % t.frames.length];
      if (!t.osc) {
        t.osc = [];
        for (let j = 0; j < grasses.length; j++) {
          let o = new p5.Oscillator('sine');
          o.amp(0);
          o.start();
          o.connect();
          t.osc.push(o);
        }
      }
      for (let j = 0; j < frame.length; j++) {
        if (t.osc[j]) {
        t.osc[j].freq(frame[j].freq);
        t.osc[j].amp(frame[j].amp > 0 ? frame[j].amp : 0);
        }
      }
      t.playhead++;
      if (t.playhead >= t.frames.length) t.playhead = 0;
    } else if (!t.playing && t.osc) {
      for (let o of t.osc) o.amp(0);
    }
  }

  // track UI
  push();
  resetMatrix();
  translate(-width/2, -height/2);
  noLights();
  textFont(font2);
  textSize(11);
  textAlign(LEFT);

  let uiX = 50;
  let uiY = height/2 - 300;


  for (let j = 0; j < tracks.length; j++) {
    let t = tracks[j];
    let ty3 = uiY + j * 22;

    // track label
    fill(activeRecordTrack === j ? color(255, 0, 127) : color(80, 0, 120));
    text('track ' + (j + 1) + (t.frames.length > 0 ? ' [' + int(t.frames.length / 60) + 's]' : ' [empty]'), uiX, ty3);

    // play/pause button
    noFill();
    stroke(t.playing ? color(0, 255, 100) : color(0, 0, 139));
    strokeWeight(1);
    rect(uiX + 160, ty3 - 10, 30, 14, 3);
    noStroke();
    fill(t.playing ? color(0, 255, 100) : color(80, 0, 120));
    text(t.playing ? '||' : '>', uiX + 165, ty3);

    // select for record button
    noFill();
    stroke(activeRecordTrack === j ? color(255, 0, 127) : color(0, 0, 139));
    strokeWeight(1);
    rect(uiX + 195, ty3 - 10, 28, 14, 3);
    noStroke();
    fill(activeRecordTrack === j ? color(255, 0, 127) : color(80, 0, 120));
    text('rec', uiX + 198, ty3);
  }
  pop();

  // pitch map grid
  push();
  resetMatrix();
  translate(-width/2 + frameCount % windowWidth, -height/2);
  image(gridBuffer, 0, 0);
  translate(-windowWidth, 0);
  image(gridBuffer, 0, 0);
  pop();
  
  //record botton
  push();
  normalMaterial();
  translate(-width/2 + 200, -height/2 + 60, 150);
  sphere(isRecording ? 25 : 15);
  pop();

  push();
  normalMaterial();
  translate(-width/2 + 200, -height/2 + 60, 150);
  rotateY(frameCount);
  torus(15, 2.5);
  pop();
  
  push();
  resetMatrix();
  translate(-width/2, -height/2);
  noLights();
  let str = 'Record / STOP';
  let startX = 50;
  let y = 40;
  textSize(14);
  textFont(font2);
  for (let i = 0; i < str.length; i++) {
    let hue = map(i, 0, str.length, 0, 360);
    colorMode(HSB, 360, 100, 100);
    fill(hue, 100, 100);
    text(str[i], startX, y);
    startX += textWidth(str[i]);
  }
  colorMode(RGB, 255);
  pop();
  
  //constellations?How do you spell stars
  push();
  stroke(0);
  strokeWeight(2);
  for (let i = 0; i<30; i++){
    let starx = random(-width/2,width/2);
    let stary = random(-height/2,height/2);
    let starz = random(-300,300);
     point(starx,stary,starz); 
  }
  pop();

}