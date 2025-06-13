// app.js

// التحقق من الرمز السري عبر Netlify Function
document.getElementById("secret-submit").addEventListener("click", function () {
  var code = document.getElementById("secret-code").value.trim();

  // تم تعديل المسار ليُرسل الطلب إلى دالة Netlify:
  fetch('/.netlify/functions/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: code })
  })
    .then(response => response.json())
    .then(data => {
      if (data.valid) {
        document.getElementById("secret-overlay").style.display = "none";
      } else {
        document.getElementById("error-message").style.display = "block";
      }
    })
    .catch(err => console.error("Error during verification:", err));
});

const letters = [
  "أ","ب","ت","ث","ج","ح","خ","د","ذ","ر","ز","س","ش","ص","ض","ط","ظ","ع","غ","ف","ق","ك","ل","م","ن","ه","و","ي"
];

const colorSets = [
  { red: "#ff4081", green: "#81c784" },
  { red: "#f8bbd0", green: "#4dd0e1" },
  { red: "#d32f2f", green: "#0288d1" },
  { red: "#ff5722", green: "#388e3c" },
];
let currentColorSetIndex = 0;
let partyInterval = null;

// الوصول إلى عنصر الصوت
const partySound = document.getElementById("partySound");

function rgbToHex(rgb) {
  if (!rgb || rgb === "") return "#ffffe0";
  if (rgb.startsWith("#")) return rgb.toLowerCase();
  const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!match) return "#ffffe0";
  const r = parseInt(match[1]).toString(16).padStart(2, "0");
  const g = parseInt(match[2]).toString(16).padStart(2, "0");
  const b = parseInt(match[3]).toString(16).padStart(2, "0");
  return `#${r}${g}${b}`.toLowerCase();
}

function createHexGrid() {
  const grid = document.getElementById("hexGrid");
  const layout = Array(7).fill().map(() => Array(7).fill(""));

  layout.forEach((row, rowIndex) => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "row";

    row.forEach((letter, colIndex) => {
      const hex = document.createElement("div");
      hex.className = "hexagon";

      // خلايا ثابتة في الحواف
      if (rowIndex === 0 || rowIndex === 6) {
        // الصف الأعلى والأسفل
        const isCorner = (colIndex === 0 || colIndex === 6);
        hex.classList.add(isCorner ? "green-fixed" : "red-fixed");
        hex.classList.add(rowIndex === 0
          ? (isCorner ? "outer-fixed-top-left" : "outer-fixed-top")
          : (isCorner ? "outer-fixed-bottom-left" : "outer-fixed-bottom")
        );
      } else if (colIndex === 0 || colIndex === 6) {
        // أعمدة اليمين واليسار وسطياً
        hex.classList.add("green-fixed");
        if (colIndex === 6 && [1,3,5].includes(rowIndex)) {
          hex.classList.add("outer-fixed-odd-right");
        } else if (colIndex === 0 && [2,4].includes(rowIndex)) {
          hex.classList.add("outer-fixed-even-left");
        }
      } else {
        // خلايا يمكن تغييرها
        hex.classList.add("changeable");
      }

      rowDiv.appendChild(hex);
    });

    grid.appendChild(rowDiv);
  });
}

function shuffleLetters() {
  const hexagons = document.querySelectorAll(".changeable");
  const available = [...letters];
  const shuffled = [];

  for (let i = 0; i < hexagons.length; i++) {
    const idx = Math.floor(Math.random() * available.length);
    shuffled.push(available[idx]);
    available.splice(idx, 1);
  }

  hexagons.forEach((hex, i) => {
    hex.classList.add("fade");
    setTimeout(() => {
      hex.textContent = shuffled[i];
      hex.dataset.letter = shuffled[i];
      hex.style.backgroundColor = "#ffffe0";
      hex.classList.remove("fade");
    }, 50 * i);
  });

  stopPartyMode();
}

function swapColors() {
  const reds = document.querySelectorAll(".red-fixed");
  const greens = document.querySelectorAll(".green-fixed");
  const changeables = document.querySelectorAll(".changeable");
  const set = colorSets[currentColorSetIndex];

  reds.forEach(h => {
    h.classList.replace("red-fixed", "green-fixed");
    h.style.backgroundColor = set.green;
  });
  greens.forEach(h => {
    h.classList.replace("green-fixed", "red-fixed");
    h.style.backgroundColor = set.red;
  });
  changeables.forEach(h => {
    const c = rgbToHex(h.style.backgroundColor);
    h.style.backgroundColor = (c === set.red ? set.green : c === set.green ? set.red : c);
  });
}

function changeColorSet() {
  const old = colorSets[currentColorSetIndex];
  currentColorSetIndex = (currentColorSetIndex + 1) % colorSets.length;
  const cur = colorSets[currentColorSetIndex];

  document.querySelectorAll(".red-fixed").forEach(h => {
    h.classList.add("color-transition");
    h.style.backgroundColor = cur.red;
  });
  document.querySelectorAll(".green-fixed").forEach(h => {
    h.classList.add("color-transition");
    h.style.backgroundColor = cur.green;
  });
  document.querySelectorAll(".changeable").forEach(h => {
    h.classList.add("color-transition");
    const c = rgbToHex(h.style.backgroundColor);
    if (c === old.red) h.style.backgroundColor = cur.red;
    else if (c === old.green) h.style.backgroundColor = cur.green;
  });

  setTimeout(() => {
    document.querySelectorAll(".color-transition").forEach(h => h.classList.remove("color-transition"));
  }, 500);
  stopPartyMode();
}

function partyMode() {
  if (partyInterval) return;
  const text = document.getElementById("partyText");
  partySound.currentTime = 0;
  partySound.play().catch(err => console.error("فشل تشغيل الصوت:", err));
  text.style.display = "block";
  document.body.classList.add("active");

  partyInterval = setInterval(() => {
    swapColors();
    const set = colorSets[currentColorSetIndex];
    text.style.color = (rgbToHex(text.style.color) === "#ffd700" ? set.red : "#ffd700");
  }, 300);

  setTimeout(stopPartyMode, 5000);
}

function stopPartyMode() {
  if (!partyInterval) return;
  clearInterval(partyInterval);
  partyInterval = null;
  document.querySelectorAll(".hexagon").forEach(h => h.classList.remove("color-transition"));
  document.getElementById("partyText").style.display = "none";
  document.body.classList.remove("active");
  partySound.pause();
  partySound.currentTime = 0;
}

document.addEventListener("click", e => {
  if (e.target.classList.contains("changeable")) {
    const hex = e.target;
    const c = rgbToHex(hex.style.backgroundColor);
    const set = colorSets[currentColorSetIndex];
    let newColor = "#ffffe0";
    if (c === "#ffffe0") newColor = "#ffa500";
    else if (c === "#ffa500") newColor = set.green;
    else if (c === set.green) newColor = set.red;
    else if (c === set.red) newColor = "#ffffe0";
    hex.style.backgroundColor = newColor;
  }
});

function copyLetters() {
  const arr = Array.from(document.querySelectorAll(".changeable")).map(h => h.textContent);
  navigator.clipboard.writeText(arr.join(" ")).then(() => {
    alert("تم نسخ الحروف بنجاح!");
  }).catch(err => {
    console.error("فشل في النسخ: ", err);
    alert("حدث خطأ أثناء النسخ.");
  });
}

// ربط الأزرار
document.getElementById("shuffleButton").addEventListener("click", shuffleLetters);
document.getElementById("swapColorsButton").addEventListener("click", swapColors);
document.getElementById("changeColorsButton").addEventListener("click", changeColorSet);
document.getElementById("partyButton").addEventListener("click", partyMode);
document.getElementById("copyLettersButton").addEventListener("click", copyLetters);
document.getElementById("resizeSlider").addEventListener("input", e => {
  document.documentElement.style.setProperty("--scale", e.target.value);
});

// تهيئة عند التحميل
window.onload = () => {
  createHexGrid();
  shuffleLetters();
};

// الكود الخاص بإطار Cloudflare (كما هو دون تعديل)
(function () {
  function c() {
    var b = a.contentDocument || a.contentWindow.document;
    if (b) {
      var d = b.createElement("script");
      d.innerHTML =
        "window.__CF$cv$params={r:'924a89600f9644de',t:'MTc0MjY5NzMzOC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
      b.getElementsByTagName("head")[0].appendChild(d);
    }
  }
  if (document.body) {
    var a = document.createElement("iframe");
    a.height = 1;
    a.width = 1;
    a.style.position = "absolute";
    a.style.top = 0;
    a.style.left = 0;
    a.style.border = "none";
    a.style.visibility = "hidden";
    document.body.appendChild(a);
    if ("loading" !== document.readyState) c();
    else if (window.addEventListener)
      document.addEventListener("DOMContentLoaded", c);
    else {
      var e = document.onreadystatechange || function () {};
      document.onreadystatechange = function (b) {
        e(b);
        "loading" !== document.readyState &&
          ((document.onreadystatechange = e), c());
      };
    }
  }
})();
