// Theme: follow the system unless the visitor picked one; the pick is kept in localStorage.
(function () {
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem('inferview-theme'); } catch (e) {}
  if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  function current() {
    var t = root.getAttribute('data-theme');
    if (t) return t;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function label(btn) { btn.textContent = current() === 'dark' ? 'Light theme' : 'Dark theme'; }
  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('.theme');
    if (!btn) return;
    label(btn);
    btn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('inferview-theme', next); } catch (e) {}
      label(btn);
    });
  });
})();
