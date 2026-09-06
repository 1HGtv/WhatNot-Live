(function () {
  var DATA_URL = "https://1hgtv.github.io/WhatNot-Live/live.json?t=" + Date.now();
  var GO_BASE = "https://1hgtv.github.io/WhatNot-Live/go.html?to=";

  var stage = document.getElementById("wn-mini-stage");
  var dotsEl = document.getElementById("wn-mini-dots");
  if (!stage) return;

  var lives = [];
  var index = 0;
  var timer = null;

  function exitUrl(url) {
    return GO_BASE + encodeURIComponent(url);
  }

  function slideHtml(live, i) {
    var img = live.thumbnail
      ? '<img src="' + live.thumbnail + '" alt="" loading="lazy" onerror="this.style.display=\'none\'">'
      : "";
    return (
      '<a class="wnm-slide' + (i === 0 ? " active" : "") + '" href="' + exitUrl(live.url) + '" target="_top" rel="noopener noreferrer">' +
        img +
        '<div class="wnm-body">' +
          '<div class="wnm-badge">' + (live.type || "Show") + "</div>" +
          "<h4>" + (live.user || "") + "</h4>" +
          '<p class="wnm-title">' + (live.title || "") + "</p>" +
        "</div>" +
      "</a>"
    );
  }

  function show(i) {
    var slides = stage.querySelectorAll(".wnm-slide");
    var dots = dotsEl ? dotsEl.querySelectorAll("button") : [];
    if (!slides.length) return;
    index = (i + slides.length) % slides.length;
    for (var n = 0; n < slides.length; n++) {
      slides[n].classList.toggle("active", n === index);
    }
    for (var d = 0; d < dots.length; d++) {
      dots[d].classList.toggle("active", d === index);
    }
  }

  function start() {
    stop();
    if (lives.length < 2) return;
    timer = setInterval(function () {
      show(index + 1);
    }, 4500);
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function render() {
    if (!lives.length) {
      stage.innerHTML = '<div class="wnm-empty">No one live right now</div>';
      if (dotsEl) dotsEl.innerHTML = "";
      return;
    }
    stage.innerHTML = lives.map(slideHtml).join("");
    if (dotsEl) {
      dotsEl.innerHTML = lives
        .map(function (_, i) {
          return '<button type="button" class="' + (i === 0 ? "active" : "") + '" data-i="' + i + '"></button>';
        })
        .join("");
      dotsEl.onclick = function (e) {
        var b = e.target.closest("button[data-i]");
        if (!b) return;
        show(+b.dataset.i);
        start();
      };
    }
    index = 0;
    start();
  }

  fetch(DATA_URL)
    .then(function (r) {
      if (!r.ok) throw new Error("bad");
      return r.json();
    })
    .then(function (data) {
      lives = Array.isArray(data.lives) ? data.lives : [];
      render();
    })
    .catch(function () {
      stage.innerHTML =
        '<div class="wnm-empty"><a href="/live-board" target="_top" style="color:#fcba03">Open live board</a></div>';
    });
})();
