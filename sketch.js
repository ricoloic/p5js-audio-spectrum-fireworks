const explosions = [];
const palette = 'happy';
const bins = COLOR_PALETTES[palette].length * 3;
const sample = 1024;
const realStart = 0;
const realEnd = sample - (sample / 2);
const levels = (realEnd - realStart) / bins;
const threshold = 20;
const previous = Array.from({ length: bins }).fill([]);
let sound, fft;
let size;


function preload() {
  sound = loadSound('audio/JVKE  this is what space feels like Official Lyric Video.mp3');
}

function setup() {
  const canvas = document.querySelector('canvas');
  if (canvas) canvas.remove();
  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(30);

  size = (min(width, height) / 2 - 100) / bins;

  fft = new p5.FFT();
  sound.setVolume(0.5)
}


function draw() {
  background(22);
  const spectrum = fft.analyze(sample);
  //stroke(255);
  //strokeWeight(2);
  //for (let i = realStart; i < sample; i++) {
  //  rect(i, 0, 1, spectrum[i]);
  //}

  noStroke();
  fill(33);
  rect(0, 0, 35, 30);
  fill(255);
  text(frameRate().toFixed(), 10, 20);

  translate(width / 2, height / 2);

  for (let i = explosions.length - 1; i >= 0; i--) {
    if (explosions[i].finished) {
      explosions.splice(i, 1);
      continue;
    }

    explosions[i].show();
    explosions[i].update();
  }

  for (let i = 0; i < bins; i++) {
    const index = floor(map(i, 0, bins, realStart, realEnd));
    let levelSUM = 0;
    for (let j = index; j < index + levels; j++) {
      levelSUM += spectrum[i];
    }
    const levelAVG = map(levelSUM / levels, 0, 255, 0, 1);
    previous[i].push(levelAVG);
    if (previous[i].length > threshold) previous[i].splice(0, 1);
    let previousSUM = 0;
    for (const prev of previous[i]) {
      previousSUM += prev;
    }
    const previousAVG = previousSUM / previous[i].length;

    if (levelAVG > previousAVG + map(i, 0, bins, 0.15, 0.01)) {
      const time =  bins - (i + 1);
      const level = ceil(map(levelAVG, 0, 1, 1, 7));
      for (let j = 0; j < level; j++) {
        const c = COLOR_PALETTES[palette][i % (COLOR_PALETTES[palette].length)].rgba;
        const iTimes = time * size;
        const r = random(iTimes, iTimes + 25);
        const p = p5.Vector.random2D().mult(r);
        const vel = map(levelAVG, 0, 1, 1, 3);
        explosions.push(new Explosion(
          p,
          c,
          5 + i,
          3,
          max(5, (bins - i) / 2),
          vel
        ));
      }
    }
  }
}

function mousePressed() {
  if (sound.isPlaying()) sound.pause();
  else sound.play();
}

function windowResized() {
  setup();
}
