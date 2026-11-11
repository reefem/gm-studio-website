// Seasonal snowfall. To switch it off, remove the snow.js <script> tag from index.html.
(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: "40", // above the page, below the sticky header
  });
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let w = 0, h = 0, dpr = 1, flakes = [];

  const makeFlake = (y) => {
    const depth = Math.random(); // 0 = far, 1 = near
    return {
      x: Math.random() * w,
      y: y ?? Math.random() * h,
      r: 0.8 + depth * 2.2,
      speed: 0.25 + depth * 0.75,
      drift: Math.random() * Math.PI * 2,
      sway: 0.3 + Math.random() * 0.6,
      alpha: 0.45 + depth * 0.5,
    };
  };

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(110, (w * h) / 12000)); // fewer flakes on phones
    while (flakes.length < count) flakes.push(makeFlake());
    flakes.length = count;
  };

  let last = performance.now();
  let running = true;

  const frame = (now) => {
    if (!running) return;
    const dt = Math.min((now - last) / 16.67, 3);
    last = now;
    ctx.clearRect(0, 0, w, h);
    for (const f of flakes) {
      f.drift += 0.01 * dt;
      f.y += f.speed * dt;
      f.x += Math.sin(f.drift) * f.sway * 0.5 * dt;
      if (f.y > h + 5) Object.assign(f, makeFlake(-5));
      if (f.x > w + 5) f.x = -5;
      if (f.x < -5) f.x = w + 5;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${f.alpha})`;
      ctx.shadowColor = "rgba(0, 0, 0, 0.12)"; // keeps white flakes visible on the light grey
      ctx.shadowBlur = 2;
      ctx.fill();
    }
    requestAnimationFrame(frame);
  };

  // Pause when the tab isn't visible to save battery
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) {
      last = performance.now();
      requestAnimationFrame(frame);
    }
  });

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(frame);
})();
