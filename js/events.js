(function () {
  document.addEventListener("DOMContentLoaded", function () {
    // enkelt arrangement
    const path = window.location.pathname;
    const pathArray = path.split('/');
    const isEventPage = pathArray.includes('arrangementer') || pathArray.includes('events');

    if (isEventPage) {
      document.querySelectorAll(".list-description--event .list-description__item").forEach(item => {
        const keyEl = item.querySelector('.list-description__key');
        if (!keyEl) return;

        const keyText = keyEl.textContent.trim();
        if (keyText === 'Time' || keyText === 'Tid') {
          const valueEl = item.querySelector('.list-description__value');
          if (!valueEl) return;

          const text = valueEl.textContent.trim();
          const parts = text.split(' - ');
          const allEqual = parts.every(val => val === parts[0]);

          if (allEqual) {
            valueEl.textContent = 'Arrangementet finder sted i bibliotekets åbningstid';
          }
        }
      });
    }

    // arrangement oversigt
    if (window.location.pathname === '/arrangementer') {

      const timeSelectors = [
        '.content-list-item__time',
      ];

      timeSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          const text = el.textContent.trim();
          const parts = text.split(' - ');
          const allEqual = parts.every(val => val === parts[0]);

          if (allEqual) {
            el.textContent = 'Arrangementet finder sted i bibliotekets åbningstid';
            el.style.lineHeight = "1.3em";
          }
        });
      });
    }
  });
})(); 