// التحقق من الرمز السري عبر استدعاء API من الخادم
document.getElementById("secret-submit").addEventListener("click", function () {
  var code = document.getElementById("secret-code").value.trim();
  fetch('/api/verify', {
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
  "أ",
  "ب",
  "ت",
  "ث",
  "ج",
  "ح",
  "خ",
  "د",
  "ذ",
  "ر",
  "ز",
  "س",
  "ش",
  "ص",
  "ض",
  "ط",
  "ظ",
  "ع",
  "غ",
  "ف",
  "ق",
  "ك",
  "ل",
  "م",
  "ن",
  "ه",
  "و",
  "ي",
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
  const layout = [
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
  ];

  layout.forEach((row, rowIndex) => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "row";
    row.forEach((letter, colIndex) => {
      const hex = document.createElement("div");
      hex.className = "hexagon";
      if (rowIndex === 0) {
        if (colIndex === 0 || colIndex === 6) {
          hex.classList.add("green-fixed");
          if (colIndex === 0) {
            hex.classList.add("outer-fixed-top-left");
          } else {
            hex.classList.add("outer-fixed-top");
          }
        } else {
          hex.classList.add("red-fixed");
          hex.classList.add("outer-fixed-top");
        }
      } else if (rowIndex === 6) {
        if (colIndex === 0 || colIndex === 6) {
          hex.classList.add("green-fixed");
          if (colIndex === 0) {
            hex.classList.add("outer-fixed-bottom-left");
          } else {
            hex.classList.add("outer-fixed-bottom");
          }
        } else {
          hex.classList.add("red-fixed");
          hex.classList.add("outer-fixed-bottom");
        }
      } else if (colIndex === 0 || colIndex === 6) {
        hex.classList.add("green-fixed");
        if (colIndex === 6 && (rowIndex === 1 || rowIndex === 3 || rowIndex === 5)) {
          hex.classList.add("outer-fixed-odd-right");
        } else if (colIndex === 0 && (rowIndex === 2 || rowIndex === 4)) {
          hex.classList.add("outer-fixed-even-left");
        }
      } else {
        hex.classList.add("changeable");
      }
      rowDiv.appendChild(hex);
    });
    grid.appendChild(rowDiv);
  });
}

function shuffleLetters() {
  const hexagons = document.querySelectorAll(".changeable");
  const availableLetters = [...letters];
  const shuffled = [];

  for (let i = 0; i < hexagons.length; i++) {
    const randomIndex = Math.floor(Math.random() * availableLetters.length);
    shuffled.push(availableLetters[randomIndex]);
    availableLetters.splice(randomIndex, 1);
  }

  hexagons.forEach((hex, index) => {
    hex.classList.add("fade");
    setTimeout(() => {
      hex.textContent = shuffled[index];
      hex.dataset.letter = shuffled[index];
      hex.style.backgroundColor = "#ffffe0";
      hex.classList.remove("fade");
    }, 50 * index);
  });
  stopPartyMode();
}

function swapColors() {
  const redHexagons = document.querySelectorAll(".red-fixed");
  const greenHexagons = document.querySelectorAll(".green-fixed");
  const changeableHexagons = document.querySelectorAll(".changeable");
  const currentSet = colorSets[currentColorSetIndex];

  redHexagons.forEach((hex) => {
    hex.classList.remove("red-fixed");
    hex.classList.add("green-fixed");
    hex.style.backgroundColor = currentSet.green;
  });

  greenHexagons.forEach((hex) => {
    hex.classList.remove("green-fixed");
    hex.classList.add("red-fixed");
    hex.style.backgroundColor = currentSet.red;
  });

  changeableHexagons.forEach((hex) => {
    const currentColor = rgbToHex(hex.style.backgroundColor);
    if (currentColor === currentSet.red) {
      hex.style.backgroundColor = currentSet.green;
    } else if (currentColor === currentSet.green) {
      hex.style.backgroundColor = currentSet.red;
    }
  });
}

function changeColorSet() {
  const oldSet = colorSets[currentColorSetIndex];
  currentColorSetIndex = (currentColorSetIndex + 1) % colorSets.length;
  const currentSet = colorSets[currentColorSetIndex];
  const redHexagons = document.querySelectorAll(".red-fixed");
  const greenHexagons = document.querySelectorAll(".green-fixed");
  const changeableHexagons = document.querySelectorAll(".changeable");

  redHexagons.forEach((hex) => {
    hex.classList.add("color-transition");
    hex.style.backgroundColor = currentSet.red;
  });

  greenHexagons.forEach((hex) => {
    hex.classList.add("color-transition");
    hex.style.backgroundColor = currentSet.green;
  });

  changeableHexagons.forEach((hex) => {
    hex.classList.add("color-transition");
    const currentColor = rgbToHex(hex.style.backgroundColor);
    if (currentColor === oldSet.red) {
      hex.style.backgroundColor = currentSet.red;
    } else if (currentColor === oldSet.green) {
      hex.style.backgroundColor = currentSet.green;
    }
  });

  setTimeout(() => {
    document.querySelectorAll(".color-transition").forEach((hex) => {
      hex.classList.remove("color-transition");
    });
  }, 500);
  stopPartyMode();
}

function partyMode() {
  if (partyInterval) return;
  const partyText = document.getElementById("partyText");
  const body = document.body;

  // تشغيل الصوت
  partySound.currentTime = 0;
  partySound
    .play()
    .catch((err) => console.error("فشل تشغيل الصوت:", err));

  partyText.style.display = "block";
  body.classList.add("active");
  document.querySelectorAll(".hexagon").forEach((hex) => {
    hex.classList.add("color-transition");
  });

  partyInterval = setInterval(() => {
    swapColors();
    const currentSet = colorSets[currentColorSetIndex];
    const currentTextColor = rgbToHex(partyText.style.color);
    partyText.style.color =
      currentTextColor === "#ffd700" ? currentSet.red : "#ffd700";
  }, 300);

  setTimeout(() => {
    stopPartyMode();
  }, 5000);
}

function stopPartyMode() {
  if (partyInterval) {
    clearInterval(partyInterval);
    partyInterval = null;
    document.querySelectorAll(".hexagon").forEach((hex) => {
      hex.classList.remove("color-transition");
    });
    document.getElementById("partyText").style.display = "none";
    document.body.classList.remove("active");
    partySound.pause();
    partySound.currentTime = 0;
  }
}

document.addEventListener("click", (e) => {
  const hex = e.target;
  if (hex.classList.contains("changeable")) {
    const currentColor = rgbToHex(hex.style.backgroundColor);
    const currentSet = colorSets[currentColorSetIndex];
    let newColor;

    if (currentColor === "#ffffe0") {
      newColor = "#ffa500";
    } else if (currentColor === "#ffa500") {
      newColor = currentSet.green;
    } else if (currentColor === currentSet.green) {
      newColor = currentSet.red;
    } else if (currentColor === currentSet.red) {
      newColor = "#ffffe0";
    } else {
      newColor = "#ffffe0";
    }
    hex.style.backgroundColor = newColor;
  }
});

function copyLetters() {
  const changeableHexagons = document.querySelectorAll(".changeable");
  let letterText = "";
  changeableHexagons.forEach((hex) => {
    letterText += hex.textContent + " ";
  });
  navigator.clipboard
    .writeText(letterText.trim())
    .then(() => {
      alert("تم نسخ الحروف بنجاح!");
    })
    .catch((err) => {
      console.error("فشل في النسخ: ", err);
      alert("حدث خطأ أثناء النسخ.");
    });
}

document.getElementById("shuffleButton").addEventListener("click", shuffleLetters);
document.getElementById("swapColorsButton").addEventListener("click", swapColors);
document.getElementById("changeColorsButton").addEventListener("click", changeColorSet);
document.getElementById("partyButton").addEventListener("click", partyMode);
document.getElementById("copyLettersButton").addEventListener("click", copyLetters);
document.getElementById("resizeSlider").addEventListener("input", function (e) {
  const scale = e.target.value;
  document.documentElement.style.setProperty("--scale", scale);
});

window.onload = function () {
  createHexGrid();
  shuffleLetters();
};

/* الكود الخاص بتهيئة إطار تحدي Cloudflare - تركه كما هو */
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
