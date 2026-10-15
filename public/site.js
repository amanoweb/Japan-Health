(function () {
  var search = document.querySelector("[data-agency-search]");
  var cards = Array.from(document.querySelectorAll("[data-agency-card]"));
  if (search && cards.length) {
    search.addEventListener("input", function () {
      var q = search.value.trim().toLowerCase();
      var matches = 0;
      cards.forEach(function (card) {
        var show = !q || (card.getAttribute("data-keywords") || "").includes(q);
        card.hidden = !show;
        if (show) matches += 1;
      });
      var count = document.querySelector("[data-result-count]");
      if (count) count.textContent = matches + " agenc" + (matches === 1 ? "y" : "ies") + " shown";
    });
  }
  document.addEventListener("click", function (event) {
    var link = event.target.closest("a[data-partner]");
    if (!link) return;
    // Analytics is privacy-conscious and off until a GA4 integration is configured.
    if (typeof window.gtag === "function") {
      window.gtag("event", "partner_outbound_click", {
        partner_id: link.dataset.partner,
        partner_kind: link.dataset.kind || "agency",
        transport_type: "beacon"
      });
    }
  });
})();
