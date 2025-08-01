function calculate() {
  const input = document.getElementById("input").value;
  const lines = input.trim().split("\n");

  let totalMillis = 0;
  let inTime = null;
  let lastTime = null;

  lines.forEach(line => {
    const parts = line.split("\t");
    const type = parts[2]?.trim();
    const timeStr = parts[6] || parts[5]; // fallback
    const time = new Date(timeStr);

    if (type === "In") {
      inTime = time;
    } else if (type === "Out" && inTime) {
      totalMillis += time - inTime;
      lastTime = time;
      inTime = null;
    }
  });

  const targetMillis = 8.5 * 60 * 60 * 1000;
  const remainingMillis = targetMillis - totalMillis;

  const result = document.getElementById("result");
  const finalOut = document.getElementById("final-out-time");

  const hours = Math.floor(totalMillis / (1000 * 60 * 60));
  const minutes = Math.floor((totalMillis % (1000 * 60 * 60)) / (1000 * 60));

  result.innerHTML = `🕓 Total Worked: <strong>${hours}h ${minutes}m</strong><br>`;

  const now = new Date();
  const isFriday = now.getDay() === 5;

  if (remainingMillis > 0 && lastTime) {
    const finalOutTime = new Date(lastTime.getTime() + remainingMillis);
    finalOut.textContent = "🕒 To complete 8.5 hrs, stay until: " + formatTime(finalOutTime);
    result.innerHTML += getReminderQuote();
  } else {
    finalOut.textContent = "✅ You've completed 8.5 hours!";
    result.innerHTML += getSuccessQuote();
    triggerConfetti();
    if (isFriday) {
      result.innerHTML += "<br>🎉 It's Friday! Happy Weekend!";
    }
  }
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getSuccessQuote() {
  const quotes = [
    "Well done! Time to relax!",
    "You made it! Enjoy the rest of your day!",
    "Hard work pays off – great job!"
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
}

function getReminderQuote() {
  const quotes = [
    "Keep going, you're almost there!",
    "Stay strong! Almost done!",
    "Just a bit more to go. You’ve got this!"
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
}

// --- Confetti (simple version using canvas) ---
function triggerConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");
  const particles = [];

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  for (let i = 0; i < 100; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      speed: Math.random() * 3 + 2,
      radius: Math.random() * 6 + 4,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      p.y += p.speed;
      if (p.y > canvas.height) p.y = -p.radius;
    }
    requestAnimationFrame(draw);
  }

  draw();
}
