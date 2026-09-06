(function () {
  const DATA_URL = "https://1hgtv.github.io/WhatNot-Live/live.json?t=" + Date.now();
  const root = document.getElementById("wn-live-root");
  if (!root) return;

  const gridEl = document.getElementById("wn-grid");
  const slidesEl = document.getElementById("wn-slides");
  const stageEl = document.getElementById("wn-slide-stage");
  const dotsEl = document.getElementById("wn-dots");
  const statusEl = document.getElementById("wn-status");
  const btnGrid = document.getElementById("wn-btn-grid");
  const btnSlides = document.getElementById("wn-btn-slides");
  const btnPrev = document.getElementById("wn-prev");
  const btnNext = document.getElementById("wn-next");

  let lives = [];
  let slideIndex = 0;
  let timer = null;

  function cardHtml(live) {
    const img = live.thumbnail
      ? '<img src="' + live.thumbnail + '" alt="' + (live.user || "") + '" loading="lazy" onerror="this.style.display=\'none\'">'
      : "";
    return (
      '<a class="wn-card" href="' + live.url + '" target="_blank" rel="noopener noreferrer">' +
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
    const img = live.thumbnail
      ? '<img src="' + live.thumbnail + '" alt="' + (live.user || "") + '" loading="lazy" onerror="this.style.display=\'none\'">'
      : "";
    return (
      '<a class="wn-slide' + (i === 0 ? " active" : "") + '" href="' + live.url + '" target="_blank" rel="noopener noreferrer" data-i="' + i + '">' +
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
        return '<button type="button" class="' + (i === 0 ? "active" : "") + '" data-i="' + i + '" aria-label="Go to slide ' + (i + 1) + '"></button>';
      })
      .join("");
    slideIndex = 0;
    startAuto();
  }

  function showSlide(i) {
    var slides = stageEl.querySelectorAll(".wn-slide");
    var dots = dotsEl.querySelectorAll("button");
    if (!slides.length) return;
    slideIndex = (i + slides.length) % slides.length;
    slides.forEach(function (s, n) {
      s.classList.toggle("active", n === slideIndex);
    });
    dots.forEach(function (d, n) {
      d.classList.toggle("active", n === slideIndex);
    });
  }

  function startAuto() {
    stopAuto();
    if (lives.length < 2) return;
    timer = setInterval(function () {
      showSlide(slideIndex + 1);
    }, 5000);
  }

  function stopAuto() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  if (btnGrid) {
    btnGrid.addEventListener("click", function () {
      btnGrid.classList.add("active");
      if (btnSlides) btnSlides.classList.remove("active");
      gridEl.hidden = false;
      slidesEl.hidden = true;
      stopAuto();
    });
  }

  if (btnSlides) {
    btnSlides.addEventListener("click", function () {
      btnSlides.classList.add("active");
      if (btnGrid) btnGrid.classList.remove("active");
      gridEl.hidden = true;
      slidesEl.hidden = false;
      renderSlides();
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener("click", function () {
      showSlide(slideIndex - 1);
      startAuto();
    });
  }
  if (btnNext) {
    btnNext.addEventListener("click", function () {
      showSlide(slideIndex + 1);
      startAuto();
    });
  }
  if (dotsEl) {
    dotsEl.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-i]");
      if (!b) return;
      showSlide(+b.dataset.i);
      startAuto();
    });
  }

  function load() {
    fetch(DATA_URL)
      .then(function (res) {
        if (!res.ok) throw new Error("bad status");
        return res.json();
      })
      .then(function (data) {
        lives = Array.isArray(data.lives) ? data.lives : [];
        renderGrid();
        if (slidesEl && !slidesEl.hidden) renderSlides();
        if (statusEl) {
          statusEl.textContent = data.updated
            ? "Updated " + new Date(data.updated).toLocaleString()
            : lives.length
            ? lives.length + " live"
            : "No shows live";
        }
      })
      .catch(function () {
        if (gridEl) {
          gridEl.innerHTML =
            '<div class="wn-empty">Couldn\'t load the live list.<br><a href="https://1hgtv.github.io/WhatNot-Live/" target="_blank" rel="noopener" style="color:#fcba03">Open full board</a></div>';
        }
        if (statusEl) statusEl.textContent = "Feed unavailable";
      });
  }

  load();
  setInterval(load, 60000);
})();
