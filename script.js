function parseTime(str) {
  const date = new Date("2000-01-01 " + str);
  return isNaN(date) ? null : date;
}

function showMessage(msg) {
  document.getElementById("output").innerHTML = msg;
}

function showConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const confettiCount = 150;
  const confetti = Array.from({ length: confettiCount }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    r: Math.random() * 6 + 4,
    d: Math.random() * confettiCount,
    color: `hsl(${Math.random() * 360}, 100%, 50%)`
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetti.forEach(c => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2, false);
      ctx.fillStyle = c.color;
      ctx.fill();
    });
    update();
  }

  function update() {
    confetti.forEach(c => {
      c.y += Math.cos(c.d) + 1 + c.r / 2;
      c.x += Math.sin(c.d);

      if (c.y > canvas.height) {
        c.y = -10;
        c.x = Math.random() * canvas.width;
      }
    });
  }

  setInterval(draw, 20);
}

function processData() {
  const raw = document.getElementById("input").value.trim();
  const lines = raw.split("\n").map(l => l.trim()).filter(l => l);
  const entries = [];

  for (let line of lines) {
    const parts = line.split(/\t+/);
    const timeStr = parts[1];
    const type = parts[2];
    if (type === "In" || type === "Out") {
      entries.push({ time: timeStr, type });
    }
  }

  if (entries.length === 0) {
    showMessage("No valid entries found.");
    return;
  }

  let totalMinutes = 0;
  let stack = [];

  for (let entry of entries) {
    const time = parseTime(entry.time);
    if (!time) continue;
    if (entry.type === "In") {
      stack.push(time);
    } else if (entry.type === "Out" && stack.length) {
      const inTime = stack.pop();
      totalMinutes += (time - inTime) / 60000;
    }
  }

  if (stack.length) {
    const inTime = stack.pop();
    const now = new Date();
    now.setFullYear(2000, 0, 1);
    totalMinutes += (now - inTime) / 60000;
  }

  const targetMinutes = 510;
  const hrs = Math.floor(totalMinutes / 60);
  const mins = Math.round(totalMinutes % 60);
  const today = new Date().getDay(); // 5 = Friday

  if (totalMinutes >= targetMinutes) {
    showConfetti();
    if (today === 5) {
      showMessage(`🎉 It's Friday! Happy Weekend! You worked ${hrs} hr ${mins} min 🎊`);
    } else {
      showMessage(`✅ Great job! Total worked time: ${hrs} hr ${mins} min 🎉`);
    }
  } else {
    const remain = targetMinutes - totalMinutes;
    const rh = Math.floor(remain / 60);
    const rm = Math.round(remain % 60);
    showMessage(`⏳ Total worked time: ${hrs} hr ${mins} min<br>⌛ Still need ${rh} hr ${rm} min<br><i>Keep pushing – you're almost there!</i>`);
  }
}