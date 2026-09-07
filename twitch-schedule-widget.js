(function () {
  var DATA_URL = "https://1hgtv.github.io/WhatNot-Live/twitch_schedule.json?t=" + Date.now();
  var listEl = document.getElementById("tw-sched-list");
  var statusEl = document.getElementById("tw-sched-status");
  if (!listEl) return;

  function formatWhen(iso) {
    if (!iso) return "Time TBA";
    try {
      var d = new Date(iso);
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
    var cat = show.category ? '<div class="tws-cat">' + show.category + "</div>" : "";
    return (
      '<a class="tws-card" href="' + (show.url || "https://www.twitch.tv/1HGtv") + '" target="_top" rel="noopener noreferrer">' +
        '<div class="tws-body">' +
          '<div class="tws-badge">Twitch</div>' +
          '<div class="tws-when">' + formatWhen(show.startTime) + "</div>" +
          "<h3>" + (show.title || "Stream") + "</h3>" +
          cat +
          '<div class="tws-cta">Open Twitch</div>' +
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
          '<div class="tws-empty">No upcoming Twitch streams scheduled.<br>Check back soon.</div>';
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
      listEl.innerHTML = '<div class="tws-empty">Could not load Twitch schedule.</div>';
    });
})();
