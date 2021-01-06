"use strict";
// executa após carregar DOM
function onDOMLoaded(cb) {
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    cb();
  } else {
    document.addEventListener("DOMContentLoaded", cb);
  }
}

onDOMLoaded(() => {
  const size = 800;
  let circles = [];
  const canvas = document.getElementById("my-canvas");
  const ctx = canvas.getContext("2d");
  const defaultColor = "#2AC1A6";

  function random(min, max) {
    return Math.random() * (max - min + 1) + min; // random [min, max]
  }

  function getRandomColor() {
    const letters = "0123456789ABCDEF".split("");

    let color = "#";

    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  }

  function drawCircle(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }

  function dist(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }

  let timer;
  const btnStart = document.getElementById("btn-1");
  const btnReset = document.getElementById("btn-2");
  const btnDownload = document.getElementById("btn-3");
  const circleInfo = document.getElementById("circle-info");
  const circleColorInfo = document.getElementById("circle-color");

  btnDownload.addEventListener("click", () => {
    const aElem = document.createElement("a");
    aElem.download = "canvas.png";
    aElem.href = canvas.toDataURL();
    aElem.click();
  });

  btnReset.addEventListener("click", () => {
    clearTimeout(timer);
    btnStart.textContent = "Iniciar";
    ctx.clearRect(0, 0, size, size);
    circles = [];
  });

  // retorna círculo (i) que contém o ponto
  function foundCircle(x, y) {
    for (let i = circles.length - 1; i >= 0; --i) {
      const circle = circles[i];
      if (dist(x, y, circle.x, circle.y) <= circle.r) {
        return i;
      }
    }
    return -1;
  }

  function redrawCircles() {
    ctx.clearRect(0, 0, size, size);
    for (let i = circles.length - 1; i >= 0; --i) {
      const circle = circles[i];
      drawCircle(circle.x, circle.y, circle.r, circle.color);
    }
  }

  canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const i = foundCircle(x, y);

    if (i !== -1) {
      circles.splice(i, 1);
      redrawCircles();
    }
  });

  canvas.addEventListener("mousemove", (e) => {
    circleInfo.style.display = "";
    circleColorInfo.style.display = "none";

    const rect = canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let text = ` (Posição: x: ${x.toFixed(0)}, y: ${y.toFixed(0)})`;

    let i = foundCircle(x, y);

    if (i !== -1) {
      const circle = circles[i];
      text += ` | Círculo (x: ${circle.x.toFixed(0)}, y: ${circle.y.toFixed(
        0
      )}, r: ${circle.r.toFixed(0)}, cor: ${circle.color})`;
      circleColorInfo.style = `background-color: ${circle.color}`;
    }

    circleInfo.textContent = text;
  });

  canvas.addEventListener("mouseout", () => {
    circleColorInfo.style.display = "none";
    circleInfo.style.display = "none";
  });

  btnStart.addEventListener("click", () => {
    if (
      btnStart.textContent === "Iniciar" ||
      btnStart.textContent === "Resumir"
    ) {
      btnStart.textContent = "Pausar";
      timer = setInterval(() => {
        const r = random(2, 30);
        const x = random(0 + r, size - r);
        const y = random(0 + r, size - r);
        let overlapping = false;

        for (let i = circles.length - 1; i >= 0; --i) {
          const circle = circles[i];
          const d = dist(x, y, circle.x, circle.y);
          if (d < circle.r + r) {
            overlapping = true;
            break;
          }
        }
        if (!overlapping) {
          const color = colored.checked ? getRandomColor() : defaultColor;
          drawCircle(x, y, r, color);
          circles.push({ x, y, r, color });
        }
      }, 300);
    } else {
      clearTimeout(timer);
      timer = 0;
      btnStart.textContent = "Resumir";
    }
  });
});
