(function () {
  var DATA_URL = "https://1hgtv.github.io/WhatNot-Live/schedule.json?t=" + Date.now();
  var GO_BASE = "https://1hgtv.github.io/WhatNot-Live/go.html?to=";
  var listEl = document.getElementById("wn-sched-list");
  var statusEl = document.getElementById("wn-sched-status");
  if (!listEl) return;

  function exitUrl(url) {
    return GO_BASE + encodeURIComponent(url);
  }

  function formatWhen(iso) {
    if (!iso) return "Time TBA";
    try {
      var d = new Date(iso);
      return d.toLocaleString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch (e) {
      return iso;
    }
  }

  function card(show) {
    var live = String(show.status || "").toUpperCase() === "PLAYING";
    var badge = live ? "LIVE" : "Upcoming";
    var img = show.thumbnail
      ? '<img src="' + show.thumbnail + '" alt="" loading="lazy" onerror="this.style.display=\'none\'">'
      : "";
    return (
      '<a class="wns-card' + (live ? " wns-live" : "") + '" href="' + exitUrl(show.url) + '" target="_top" rel="noopener noreferrer">' +
        img +
        '<div class="wns-body">' +
          '<div class="wns-badge">' + badge + "</div>" +
          '<div class="wns-when">' + formatWhen(show.startTime) + "</div>" +
          "<h3>" + (show.title || "Show") + "</h3>" +
          '<div class="wns-cta">' + (live ? "Watch Live" : "Open Show") + "</div>" +
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
      var shows = Array.isArray(data.shows) ? data.shows : [];
      if (!shows.length) {
        listEl.innerHTML =
          '<div class="wns-empty">No upcoming shows scheduled.<br>Check back soon.</div>';
      } else {
        listEl.innerHTML = shows.map(card).join("");
      }
      if (statusEl) {
        statusEl.textContent = data.updated
          ? "Updated " + new Date(data.updated).toLocaleString()
          : "";
      }
    })
    .catch(function () {
      listEl.innerHTML =
        '<div class="wns-empty">Could not load schedule.<br><a href="https://1hgtv.github.io/WhatNot-Live/" target="_top" style="color:#fcba03">Open live board</a></div>';
    });
})();
