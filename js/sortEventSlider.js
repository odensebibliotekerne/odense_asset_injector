(function () {
  const container = document.querySelector('.swiper-wrapper');
  if (!container) return;

  const items = Array.from(container.querySelectorAll('.slider__item'));

  function parseDate(str) {
    // Trim because your datetime contains newline/spaces
    return new Date(str.trim());
  }

  function getDurationDays(start, end) {
    const ms = parseDate(end) - parseDate(start);
    return Math.ceil(ms / (1000 * 60 * 60 * 24));
  }

  const sorted = items
    .map((el, index) => {
      const time = el.querySelector('time');
      if (!time) return { el, duration: 0, index };

      const datetime = time.getAttribute('datetime') || '';
      const [start, end] = datetime.split('/');

      const duration = start && end ? getDurationDays(start, end) : 0;

      return { el, duration, index };
    })
    .sort((a, b) => {
      const aLong = a.duration > 8;
      const bLong = b.duration > 8;
      // Sort short events first, long events last
      if (aLong !== bLong) {
        return aLong ? 1 : -1;
      }

      // Otherwise keep original DOM order
      return a.index - b.index;
    });

  // Re-append in new order (stable visual update)
  sorted.forEach(item => container.appendChild(item.el));
})();