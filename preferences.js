(() => {
  const preferences = [
    { id: 'dark-mode-toggle', key: 'jamir-portfolio-dark-mode', target: document.body, className: 'dark-mode' },
    { id: 'large-text-toggle', key: 'jamir-portfolio-large-text', target: document.documentElement, className: 'large-text' }
  ];

  preferences.forEach(({ id, key, target, className }) => {
    let enabled = false;
    try {
      enabled = localStorage.getItem(key) === 'true';
    } catch {
      // Use the default appearance when browser storage is unavailable.
    }

    target.classList.toggle(className, enabled);
    const toggle = document.getElementById(id);
    if (!toggle) return;

    toggle.checked = enabled;
    toggle.addEventListener('change', () => {
      target.classList.toggle(className, toggle.checked);
      try {
        localStorage.setItem(key, String(toggle.checked));
      } catch {
        // The setting still applies until this page is closed.
      }
    });
  });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
