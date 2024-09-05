class Particle {
  constructor(pos, vel, lifetime, c) {
    this.color = c;
    this.pos = pos;
    this.vel = vel;
    this.initialLifetime = lifetime;
    this.lifetime = lifetime;
  }

  update() {
    this.pos.add(this.vel);
    this.vel.y += 0.08;
    this.vel.mult(0.99);
    this.lifetime--;
  }

  show() {
    stroke(this.color.r, this.color.g, this.color.b, map(this.lifetime, 0, this.initialLifetime, 0, 255));
    strokeWeight(3);
    point(this.pos.x, this.pos.y);
  }
}


class Explosion {
  constructor(pos, c, maxLifetime, amount = 50) {
    this.pos = pos;
    this.particles = [];
    this.lifetime = 0;
    for (let i = 0; i < amount; i++) {
      const lifetime = random(max(0, maxLifetime - 30), maxLifetime);
      if (lifetime > this.lifetime) this.lifetime = lifetime;
      const vel = createVector(random(-3, 3), random(-3, 3));
      this.particles.push(new Particle(pos.copy(), vel, lifetime, c));
    }
    this.finished = false;
  }

  update() {
    if (this.lifetime > 0) {
      for (const p of this.particles) {
        p.update();
      }
      this.lifetime--;
    } else {
      this.finished = true;
    }
  }

  show() {
    if (this.lifetime > 0) {
      for (const p of this.particles) {
        p.show();
      }
    }
  }
}

const explosions = [];
let sound;
let amp;

function preload() {
  sound = loadSound('./Egzod, Maestro Chives, Neoni - Royalty [NCS Release].mp3');
}

function setup() {
  const canvas = document.querySelector('canvas');
  if (canvas) canvas.remove();
  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(30);
  amp = new p5.Amplitude();
}

const tempAmps = [];

function draw() {
  background(33);
  noStroke();
  fill(33);
  rect(0, 0, 35, 30);
  fill(255);
  text(frameRate().toFixed(), 10, 20);

  for (let i = explosions.length - 1; i >= 0; i--) {
    if (explosions[i].finished) {
      explosions.splice(i, 1);
      continue;
    }

    explosions[i].update();
    explosions[i].show();
  }


  let avg = tempAmps.reduce((acc, next) => acc + next, 0) / tempAmps.length;

  let level = amp.getLevel();

  if (level > avg + 0.1) {
    explosions.push(new Explosion(
      createVector(width / 2, height / 2),
      { r: 255, g: 255, b: 255 },
      50
    ));
  }
  
  tempAmps.push(level);
  if (tempAmps.length > 5) tempAmps.splice(0, 1);

  console.log(level);
}

function mousePressed() {
  if (sound.isPlaying()) sound.stop();
  else sound.play();
}

function windowResized() {
  setup();
}
