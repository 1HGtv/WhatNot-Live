(function () {
  var DATA_URL = "https://1hgtv.github.io/WhatNot-Live/live.json?t=" + Date.now();
  var GO_BASE = "https://1hgtv.github.io/WhatNot-Live/go.html?to=";

  var row = document.getElementById("wn-mini-row");
  if (!row) return;

  function exitUrl(url) {
    return GO_BASE + encodeURIComponent(url);
  }

  function cardHtml(live) {
    var img = live.thumbnail
      ? '<img src="' + live.thumbnail + '" alt="" loading="lazy" onerror="this.style.display=\'none\'">'
      : "";
    return (
      '<a class="wnm-card" href="' + exitUrl(live.url) + '" target="_top" rel="noopener noreferrer">' +
        img +
        '<div class="wnm-body">' +
          '<div class="wnm-badge">' + (live.type || "Show") + "</div>" +
          "<h4>" + (live.user || "") + "</h4>" +
          '<p class="wnm-title">' + (live.title || "") + "</p>" +
        "</div>" +
      "</a>"
    );
  }

  fetch(DATA_URL)
    .then(function (r) {
      if (!r.ok) throw new Error("bad");
      return r.json();
    })
    .then(function (data) {
      var lives = Array.isArray(data.lives) ? data.lives : [];
      if (!lives.length) {
        row.innerHTML = '<div class="wnm-empty">No one live right now</div>';
        return;
      }
      row.innerHTML = lives.map(cardHtml).join("");
    })
    .catch(function () {
      row.innerHTML =
        '<div class="wnm-empty"><a href="/live-board" target="_top" style="color:#fcba03">Open live board</a></div>';
    });
})();
