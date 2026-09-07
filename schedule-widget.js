(function () {
  var DATA_URL = "https://1hgtv.github.io/WhatNot-Live/schedule.json?t=" + Date.now();
  var GO_BASE = "https://1hgtv.github.io/WhatNot-Live/go.html?to=";
  var listEl = document.getElementById("wn-sched-list");
  var statusEl = document.getElementById("wn-sched-status");
  var avatarEl = document.getElementById("wn-sched-avatar");
  var nameEl = document.getElementById("wn-sched-name");
  if (!listEl) return;

  function exitUrl(url) {
    return GO_BASE + encodeURIComponent(url);
  }

  function formatWhen(raw) {
    if (raw === null || raw === undefined || raw === "") return "Time TBA";
    try {
      var d;
      if (typeof raw === "number") {
        d = new Date(raw < 1e12 ? raw * 1000 : raw);
      } else if (/^\d+(\.\d+)?$/.test(String(raw).trim())) {
        var n = parseFloat(raw);
        d = new Date(n < 1e12 ? n * 1000 : n);
      } else {
        d = new Date(raw);
      }
      if (isNaN(d.getTime())) return "Time TBA";
      return d.toLocaleString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch (e) {
      return "Time TBA";
    }
  }

  function card(show) {
    var live = String(show.status || "").toUpperCase() === "PLAYING";
    var recurring = !!show.isRecurring;
    var badge = live ? "LIVE" : "Upcoming";
    var whenLabel = recurring
      ? "Next: " + formatWhen(show.startTime)
      : formatWhen(show.startTime);
    var cadence = show.cadence
      ? '<div class="wns-cadence">' + show.cadence + "</div>"
      : "";
    var img = show.thumbnail
      ? '<div class="wns-art"><img src="' + show.thumbnail + '" alt="" loading="lazy" onerror="this.parentNode.style.display=\'none\'"></div>'
      : '<div class="wns-art wns-art-fallback"></div>';

    return (
      '<a class="wns-card' + (live ? " wns-live" : "") + '" href="' + exitUrl(show.url) + '" target="_top" rel="noopener noreferrer">' +
        '<div class="wns-body">' +
          '<div class="wns-top">' +
            '<span class="wns-badge">' + badge + "</span>" +
            (recurring ? '<span class="wns-weekly">Weekly</span>' : "") +
          "</div>" +
          '<div class="wns-when">' + whenLabel + "</div>" +
          cadence +
          "<h3>" + (show.title || "Show") + "</h3>" +
          '<div class="wns-cta">' + (live ? "Watch Live" : "Open Show") + "</div>" +
        "</div>" +
        img +
      "</a>"
    );
  }

  fetch(DATA_URL)
    .then(function (r) {
      if (!r.ok) throw new Error("bad");
      return r.json();
    })
    .then(function (data) {
      if (avatarEl && data.avatar) {
        avatarEl.src = data.avatar;
        avatarEl.style.display = "block";
      }
      if (nameEl) {
        nameEl.textContent = data.username ? data.username : "1hgtv";
      }
      var shows = Array.isArray(data.shows) ? data.shows : [];
      if (!shows.length) {
        listEl.innerHTML =
          '<div class="wns-empty">No upcoming shows right now.<br>Check back soon.</div>';
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
      listEl.innerHTML = '<div class="wns-empty">Could not load schedule.</div>';
    });
})();
