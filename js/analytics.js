/*
  Basil Pasta Bar — click tracking for Google Analytics.
  The Google tag itself (G-4ZMQPRNVQ9) is pasted in the <head> of every page.
  This file only tags the clicks that matter: delivery-app orders, calls, directions.
*/
(function () {
  var PLATFORMS = [
    ['ubereats.com', 'Uber Eats'],
    ['skipthedishes.com', 'SkipTheDishes'],
    ['doordash.com', 'DoorDash']
  ];

  document.addEventListener('click', function (e) {
    if (typeof window.gtag !== 'function') return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';

    if (href.indexOf('tel:') === 0) {
      window.gtag('event', 'call_click', { transport_type: 'beacon' });
      return;
    }
    if (/google\.[a-z.]+\/maps|maps\.app\.goo\.gl/.test(href)) {
      window.gtag('event', 'directions_click', { transport_type: 'beacon' });
      return;
    }
    for (var i = 0; i < PLATFORMS.length; i++) {
      if (href.indexOf(PLATFORMS[i][0]) !== -1) {
        window.gtag('event', 'order_click', { platform: PLATFORMS[i][1], transport_type: 'beacon' });
        return;
      }
    }
  });
})();
