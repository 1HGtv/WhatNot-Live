(function () {
  var DATA_URL = "https://1hgtv.github.io/WhatNot-Live/live.json?t=" + Date.now();
  var GO_BASE = "https://1hgtv.github.io/WhatNot-Live/go.html?to=";

  var gridEl = document.getElementById("wn-grid");
  var slidesEl = document.getElementById("wn-slides");
  var stageEl = document.getElementById("wn-slide-stage");
  var dotsEl = document.getElementById("wn-dots");
  var statusEl = document.getElementById("wn-status");
  var btnGrid = document.getElementById("wn-btn-grid");
  var btnSlides = document.getElementById("wn-btn-slides");
  var btnPrev = document.getElementById("wn-prev");
  var btnNext = document.getElementById("wn-next");

  if (!gridEl || !slidesEl) return;

  var lives = [];
  var slideIndex = 0;
  var timer = null;

  function exitUrl(url) {
    return GO_BASE + encodeURIComponent(url);
  }

  function cardHtml(live) {
    var img = live.thumbnail
      ? '<img src="' + live.thumbnail + '" alt="" loading="lazy" onerror="this.style.display=\'none\'">'
      : "";
    return (
      '<a class="wn-card" href="' + exitUrl(live.url) + '" target="_top" rel="noopener noreferrer">' +
        img +
        '<div class="wn-card-body">' +
          '<div class="wn-badge">' + (live.type || "Show") + "</div>" +
          "<h3>" + (live.user || "") + "</h3>" +
          '<div class="wn-title">' + (live.title || "") + "</div>" +
          '<div class="wn-cta">Watch Live</div>' +
        "</div>" +
      "</a>"
    );
  }

  function slideHtml(live, i) {
    var img = live.thumbnail
      ? '<img src="' + live.thumbnail + '" alt="" loading="lazy" onerror="this.style.display=\'none\'">'
      : "";
    return (
      '<a class="wn-slide' + (i === 0 ? " active" : "") + '" href="' + exitUrl(live.url) + '" target="_top" rel="noopener noreferrer">' +
        img +
        '<div class="wn-slide-body">' +
          '<div class="wn-badge">' + (live.type || "Show") + "</div>" +
          "<h3>" + (live.user || "") + "</h3>" +
          '<div class="wn-title">' + (live.title || "") + "</div>" +
          '<div class="wn-cta">Watch Live</div>' +
        "</div>" +
      "</a>"
    );
  }

  function renderGrid() {
    if (!lives.length) {
      gridEl.innerHTML = '<div class="wn-empty">No one is live right now.<br>Check back soon.</div>';
      return;
    }
    gridEl.innerHTML = lives.map(cardHtml).join("");
  }

  function renderSlides() {
    if (!lives.length) {
      stageEl.innerHTML = '<div class="wn-empty">No one is live right now.</div>';
      dotsEl.innerHTML = "";
      return;
    }
    stageEl.innerHTML = lives.map(slideHtml).join("");
    dotsEl.innerHTML = lives
      .map(function (_, i) {
        return (
          '<button type="button" class="' +
          (i === 0 ? "active" : "") +
          '" data-i="' +
          i +
          '" aria-label="Slide ' +
          (i + 1) +
          '"></button>'
        );
      })
      .join("");
    slideIndex = 0;
    showSlide(0);
    startAuto();
  }

  function showSlide(i) {
    var slides = stageEl.querySelectorAll(".wn-slide");
    var dots = dotsEl.querySelectorAll("button");
    if (!slides.length) return;
    slideIndex = (i + slides.length) % slides.length;
    for (var n = 0; n < slides.length; n++) {
      slides[n].classList.toggle("active", n === slideIndex);
    }
    for (var d = 0; d < dots.length; d++) {
      dots[d].classList.toggle("active", d === slideIndex);
    }
  }

  function startAuto() {
    stopAuto();
    if (lives.length < 2) return;
    timer = setInterval(function () {
      showSlide(slideIndex + 1);
    }, 5500);
  }

  function stopAuto() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function showGrid() {
    btnGrid.classList.add("active");
    btnSlides.classList.remove("active");
    gridEl.style.display = "grid";
    slidesEl.style.display = "none";
    stopAuto();
  }

  function showSlideshow() {
    btnSlides.classList.add("active");
    btnGrid.classList.remove("active");
    gridEl.style.display = "none";
    slidesEl.style.display = "block";
    renderSlides();
  }

  btnGrid.addEventListener("click", showGrid);
  btnSlides.addEventListener("click", showSlideshow);
  btnPrev.addEventListener("click", function () {
    showSlide(slideIndex - 1);
    startAuto();
  });
  btnNext.addEventListener("click", function () {
    showSlide(slideIndex + 1);
    startAuto();
  });
  dotsEl.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-i]");
    if (!b) return;
    showSlide(+b.dataset.i);
    startAuto();
  });

  function load() {
    fetch(DATA_URL)
      .then(function (res) {
        if (!res.ok) throw new Error("bad status");
        return res.json();
      })
      .then(function (data) {
        lives = Array.isArray(data.lives) ? data.lives : [];
        renderGrid();
        if (slidesEl.style.display === "block") renderSlides();
        statusEl.textContent = data.updated
          ? "Updated " + new Date(data.updated).toLocaleString()
          : lives.length
          ? lives.length + " live"
          : "No shows live";
      })
      .catch(function () {
        gridEl.innerHTML =
          '<div class="wn-empty">Couldn\'t load the live list.<br><a href="https://1hgtv.github.io/WhatNot-Live/" target="_top" style="color:#fcba03">Open full board</a></div>';
        statusEl.textContent = "Feed unavailable";
      });
  }

  // default view
  gridEl.style.display = "grid";
  slidesEl.style.display = "none";
  load();
  setInterval(load, 60000);
})();
