const canvas = document.querySelector(".hero-canvas");
const context = canvas?.getContext("2d");
const panels = document.querySelectorAll("[data-panel]");
const transition = document.createElement("div");

class Ticker {
  constructor(onTick) {
    this.onTick = onTick;
    this.running = false;
    this.last = undefined;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.tick();
  }

  stop() {
    this.running = false;
  }

  tick() {
    if (!this.running) return;
    const now = performance.now();
    const delta = this.last == null ? 16 : Math.min(now - this.last, 200);
    this.last = now;
    this.onTick(delta);
    requestAnimationFrame(() => this.tick());
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", reject);
    image.src = src;
  });
}

class CursorSprite {
  constructor(pointX, pointY, image) {
    this.pointX = pointX;
    this.pointY = pointY;
    this.darkImage = image;
    this.lightImage = this.makeLightImage(image);
  }

  makeLightImage(image) {
    const buffer = document.createElement("canvas");
    const bufferContext = buffer.getContext("2d");
    if (!bufferContext) return image;

    try {
      buffer.width = image.width;
      buffer.height = image.height;
      bufferContext.drawImage(image, 0, 0);
      const data = bufferContext.getImageData(0, 0, buffer.width, buffer.height);

      for (let index = 0; index < data.data.length; index += 4) {
        const red = data.data[index];
        if (red > 100) {
          data.data[index] = 13;
          data.data[index + 1] = 13;
          data.data[index + 2] = 13;
        } else {
          data.data[index] = 217;
          data.data[index + 1] = 217;
          data.data[index + 2] = 217;
        }
      }

      bufferContext.putImageData(data, 0, 0);
      const lightImage = new Image();
      lightImage.src = buffer.toDataURL();
      return lightImage;
    } catch {
      return image;
    }
  }
}

function easeInOut(amount) {
  return -(Math.cos(Math.PI * amount) - 1) / 2;
}

function interpolate(points, x) {
  let previous = null;
  let next = null;

  for (const point of points) {
    if (point.x > x) {
      next = point;
      break;
    }
    previous = point;
  }

  if (!previous && !next) return 0;
  if (!previous) return next.y;
  if (!next) return previous.y;

  const progress = easeInOut((x - previous.x) / (next.x - previous.x));
  return previous.y + (next.y - previous.y) * progress;
}

async function startHeroCanvas() {
  if (!canvas || !context) return;

  const [defaultCursor, handCursor, textCursor, noCursor, altCursor, nwseCursor] = await Promise.all([
    loadImage("assets/cursors/pointer.png"),
    loadImage("assets/cursors/hand.png"),
    loadImage("assets/cursors/text.png"),
    loadImage("assets/cursors/no.png"),
    loadImage("assets/cursors/alt.png"),
    loadImage("assets/cursors/nwse.png"),
  ]);

  const pointerSprite = new CursorSprite(0, 0, defaultCursor);
  const activeSprites = [
    new CursorSprite(6, 2, handCursor),
    new CursorSprite(4, 7, textCursor),
    new CursorSprite(8, 8, noCursor),
    new CursorSprite(10, 4, altCursor),
    new CursorSprite(7, 7, nwseCursor),
  ];

  let pointer = { active: false, down: false, x: 0, y: 0 };
  let elapsed = 0;
  let canvasTop = 0;
  let scale = 3;
  let yOffset = 0;
  let maxY = 50;
  let yRange = 25;
  let waveA = [{ x: 0, y: 1 }];
  let waveB = [{ x: 0, y: yRange }];
  let firstWaveDone = false;
  const particles = [];

  function logicalWidth() {
    return canvas.width / window.devicePixelRatio / scale;
  }

  function logicalHeight() {
    return canvas.height / window.devicePixelRatio / scale;
  }

  function resetWaves(height) {
    yOffset = height < 650 ? 33 / scale : 66 / scale;
    maxY = logicalHeight() - pointerSprite.darkImage.height - yOffset * 2;
    yRange = maxY / 2;
    waveA = [{ x: 0, y: Math.random() * yRange }];
    waveB = [{ x: 0, y: Math.random() * yRange + yRange }];
    firstWaveDone = false;
    particles.length = 0;
  }

  function makeWave(points, offset = 0) {
    const result = [];
    const scroll = elapsed * 35;
    const end = scroll + logicalWidth();
    let last = points[points.length - 1];

    while (last.x - 100 < end) {
      let y = Math.random() * yRange;
      if (last.y < yRange) y += yRange;
      const longStep = last.x + Math.random() * 150 + 450;
      const shortStep = last.x + Math.random() * 350 + 250;
      points.push({ x: firstWaveDone ? shortStep : longStep, y });
      last = points[points.length - 1];
    }

    firstWaveDone = true;

    while (points.length > 2 && points[1].x < scroll) {
      points.shift();
    }

    for (let x = -100; x < logicalWidth() + 100; x += 15) {
      const y = interpolate(points, x + scroll);
      result.push({ x: x + y * 0.2 + offset, y });
    }

    return result;
  }

  function drawSprite(sprite, x, y) {
    const image = window.matchMedia("(prefers-color-scheme: dark)").matches ? sprite.darkImage : sprite.lightImage;
    context.imageSmoothingEnabled = false;
    context.drawImage(
      image,
      0,
      0,
      image.width,
      image.height,
      Math.floor((x - sprite.pointX) * window.devicePixelRatio * scale),
      Math.floor((y - sprite.pointY + yOffset) * window.devicePixelRatio * scale),
      image.width * window.devicePixelRatio * scale,
      image.height * window.devicePixelRatio * scale,
    );
  }

  class Particle {
    constructor(target, index, total) {
      this.x = target.x + Math.random() * 200 - 100;
      this.y = -50;
      this.z = index - total / 2;
      this.vx = 0;
      this.vy = 0;
      this.vz = 0;
      this.targetX = target.x;
      this.targetY = target.y;
      this.targetZ = this.z;
      this.sprite = pointerSprite;
      this.age = 0;
      this.randomDelay = Math.random() * 500;
      this.nextSpriteAt = 0;
    }

    setTarget(target, index, total) {
      this.targetX = target.x;
      this.targetY = target.y;
      this.targetZ = index - total / 2;
    }

    tick(delta) {
      this.age += delta;
      if (this.age < this.randomDelay) return;

      const seconds = delta / 1000;
      const targetX = pointer.down ? pointer.x : this.targetX;
      const targetY = pointer.down ? pointer.y : this.targetY;
      const targetZ = pointer.down ? 0 : this.targetZ;
      const damping = pointer.down ? 0.9 : 0.25;
      const acceleration = pointer.down ? 150 : 400;
      const falloff = pointer.down ? 1 : Math.min(Math.hypot(this.x - targetX, this.y - targetY, this.z - targetZ) / 300, 1);
      const distance = Math.hypot(this.x - targetX, this.y - targetY, this.z - targetZ) || 1;

      this.vx += ((targetX - this.x) / distance) * acceleration * seconds * falloff;
      this.vy += ((targetY - this.y) / distance) * acceleration * seconds * falloff;
      this.vz += ((targetZ - this.z) / distance) * acceleration * seconds * falloff;
      this.vx *= Math.pow(damping, seconds);
      this.vy *= Math.pow(damping, seconds);
      this.vz *= Math.pow(damping, seconds);
      this.x += this.vx * seconds;
      this.y += this.vy * seconds;
      this.z += this.vz * seconds;

      this.nextSpriteAt -= seconds;
      if (this.nextSpriteAt < 0) {
        this.nextSpriteAt = Math.random() * 2 + 0.1;
        this.sprite = pointer.down ? activeSprites[Math.floor(Math.random() * activeSprites.length)] : pointerSprite;
      }
    }
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    canvasTop = rect.top;
    resetWaves(rect.height);
  }

  function tick(delta) {
    elapsed += delta / 1000;
    context.clearRect(0, 0, canvas.width, canvas.height);

    const wave = [];
    const first = makeWave(waveA);
    const second = makeWave(waveB, 7.5);
    for (let index = 0; index < first.length; index += 1) {
      wave[index * 2] = first[index];
    }
    for (let index = 0; index < second.length; index += 1) {
      wave[index * 2 + 1] = second[index];
    }

    while (particles.length < wave.length) {
      particles.push(new Particle(wave[particles.length], particles.length, wave.length));
    }
    if (particles.length > wave.length) particles.splice(wave.length);

    particles.forEach((particle, index) => {
      particle.setTarget(wave[index], index, wave.length);
      particle.tick(delta);
    });

    particles.sort((left, right) => left.z - right.z);
    particles.forEach((particle) => drawSprite(particle.sprite, particle.x, particle.y));
  }

  canvas.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer = { ...pointer, active: true, x: (event.clientX - rect.left) / scale, y: (event.clientY - canvasTop) / scale };
  });
  canvas.addEventListener("pointerleave", () => {
    pointer.active = false;
    pointer.down = false;
  });
  canvas.addEventListener("pointerdown", (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer = { active: true, down: true, x: (event.clientX - rect.left) / scale, y: (event.clientY - canvasTop) / scale };
  });
  window.addEventListener("pointerup", () => {
    pointer.down = false;
  });
  window.addEventListener("resize", resizeCanvas);

  resizeCanvas();
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    new Ticker(tick).start();
  }
}

function setPanelFocus(activePanel) {
  panels.forEach((panel) => {
    const isActive = panel === activePanel;
    panel.classList.toggle("foregrounded", isActive);
    panel.classList.toggle("backgrounded", !isActive);
  });
}

panels.forEach((panel) => {
  panel.addEventListener("mouseenter", () => setPanelFocus(panel));
  panel.addEventListener("focusin", () => setPanelFocus(panel));
  panel.addEventListener("mouseleave", () => panels.forEach((item) => item.classList.remove("foregrounded", "backgrounded")));
  panel.addEventListener("focusout", () => panels.forEach((item) => item.classList.remove("foregrounded", "backgrounded")));
});

transition.className = "page-transition";
document.body.append(transition);

document.querySelectorAll('a[href]').forEach((link) => {
  link.addEventListener("click", () => {
    const href = link.getAttribute("href") || "";
    if (href.startsWith("http") || href.startsWith("#")) return;
    transition.classList.add("show");
  });
});

startHeroCanvas().catch((error) => {
  console.warn("Hero canvas failed to load", error);
});
