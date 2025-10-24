document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname === '/events/add/default') {
    const checkbox = document.querySelector('#edit-field-relevant-ticket-manager-value');
    if (checkbox) {
      checkbox.checked = false;
    }
  }
});