// Plugins dropdown in the top navigation: opens on hover (CSS), click/tap and keyboard.
(function () {
  document.querySelectorAll('nav .menu').forEach(function (menu) {
    var toggle = menu.querySelector('.menu-toggle');
    var links = Array.prototype.slice.call(menu.querySelectorAll('.menu-list a'));

    function setOpen(open, focusFirst) {
      if (open) menu.setAttribute('data-open', '');
      else menu.removeAttribute('data-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open && focusFirst && links[0]) links[0].focus();
    }
    function isOpen() { return menu.hasAttribute('data-open'); }

    toggle.addEventListener('click', function () { setOpen(!isOpen()); });
    toggle.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true, true); }
    });
    menu.addEventListener('keydown', function (e) {
      var i = links.indexOf(document.activeElement);
      if (e.key === 'Escape' && isOpen()) { setOpen(false); toggle.focus(); }
      else if (e.key === 'ArrowDown' && i > -1) { e.preventDefault(); links[(i + 1) % links.length].focus(); }
      else if (e.key === 'ArrowUp' && i > -1) { e.preventDefault(); links[(i - 1 + links.length) % links.length].focus(); }
    });
    // Close when focus or a click/tap moves outside the menu.
    menu.addEventListener('focusout', function (e) {
      if (!menu.contains(e.relatedTarget)) setOpen(false);
    });
    document.addEventListener('click', function (e) {
      if (!menu.contains(e.target)) setOpen(false);
    });
  });
})();
