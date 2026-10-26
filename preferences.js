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

  const accentInput = document.getElementById('accent-color');
  const accentOutput = document.getElementById('accent-color-value');
  const resetAccent = document.getElementById('reset-accent-color');
  const accentKey = 'jamir-portfolio-accent-color';
  const defaultAccent = '#3f654e';

  const relativeLuminance = (red, green, blue) => {
    const channel = (value) => {
      const normalized = value / 255;
      return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue);
  };

  const applyAccent = (color) => {
    if (!/^#[0-9a-f]{6}$/i.test(color)) return;
    const parseHex = (hex) => hex.slice(1).match(/.{2}/g).map((part) => Number.parseInt(part, 16));
    const toHex = (rgb) => `#${rgb.map((value) => value.toString(16).padStart(2, '0')).join('')}`;
    const values = parseHex(color);
    const mix = (base, amount, tint = values) => {
      const baseValues = parseHex(base);
      return toHex(baseValues.map((value, index) => Math.round(value * (1 - amount) + tint[index] * amount)));
    };
    const blend = (amount, target) => values.map((value) => Math.round(value * (1 - amount) + target * amount));
    const darkAccent = toHex(blend(0.48, 0));
    const lightAccent = toHex(blend(0.42, 255));
    const foreground = relativeLuminance(...values) > 0.179 ? '#292d29' : '#fff8e9';
    const lightValues = parseHex(lightAccent);
    const darkForeground = relativeLuminance(...lightValues) > 0.179 ? '#292d29' : '#fff8e9';
    const palette = {
      '--user-accent': color,
      '--user-accent-dark': darkAccent,
      '--user-accent-light': lightAccent,
      '--user-accent-foreground': foreground,
      '--user-accent-foreground-dark': darkForeground,
      '--user-paper': mix('#f5e8cc', 0.1),
      '--user-paper-light': mix('#fff8e9', 0.06),
      '--user-paper-warm': mix('#e7d6ad', 0.14),
      '--user-paper-overlay': `${mix('#fff8e9', 0.08)}80`,
      '--user-rose': mix('#d8a18a', 0.2),
      '--user-red': mix('#bc5a43', 0.2),
      '--user-yellow': mix('#e8b852', 0.2),
      '--user-line': mix('#343c32', 0.2),
      '--user-line-soft': `${mix('#59604e', 0.2)}9c`,
      '--user-muted': mix('#5b6259', 0.12),
      '--user-copy': mix('#414840', 0.08),
      '--user-portrait-bg': mix('#d9bd83', 0.12),
      '--user-portrait-ground': mix('#b8955e', 0.14),
      '--user-dot': `${mix('#755a35', 0.08)}17`,
      '--user-dark-paper': mix('#202821', 0.12, lightValues),
      '--user-dark-paper-light': mix('#2c372f', 0.15, lightValues),
      '--user-dark-muted': mix('#c2c7b8', 0.12, lightValues),
      '--user-dark-copy': mix('#ded8c5', 0.1, lightValues),
      '--user-dark-red': mix('#e18a6d', 0.18, lightValues),
      '--user-dark-yellow': mix('#d0a44c', 0.2, lightValues),
      '--user-dark-line': mix('#d3cbb4', 0.18, lightValues),
      '--user-dark-line-soft': `${mix('#b6b09b', 0.18, lightValues)}99`,
      '--user-dark-paper-warm': mix('#3b473a', 0.16, lightValues),
      '--user-dark-paper-overlay': mix('#2b342d', 0.16, lightValues),
      '--user-dark-rose': mix('#885c4d', 0.2, lightValues),
      '--user-dark-portrait': mix('#564b38', 0.18, lightValues),
      '--user-dark-portrait-ground': mix('#564b38', 0.18, lightValues),
      '--user-dark-dot': `${mix('#ffffff', 0.08, lightValues)}12`
    };
    Object.entries(palette).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });
    if (accentOutput) accentOutput.textContent = color.toUpperCase();
  };

  const accentProperties = [
    '--user-accent', '--user-accent-dark', '--user-accent-light',
    '--user-accent-foreground', '--user-accent-foreground-dark',
    '--user-paper', '--user-paper-light', '--user-paper-warm', '--user-paper-overlay',
    '--user-rose', '--user-red', '--user-yellow', '--user-line', '--user-line-soft',
    '--user-muted', '--user-copy', '--user-portrait-bg', '--user-portrait-ground', '--user-dot',
    '--user-dark-paper', '--user-dark-paper-light', '--user-dark-muted', '--user-dark-copy',
    '--user-dark-red', '--user-dark-yellow', '--user-dark-line', '--user-dark-line-soft',
    '--user-dark-paper-warm', '--user-dark-paper-overlay', '--user-dark-rose',
    '--user-dark-portrait', '--user-dark-portrait-ground', '--user-dark-dot'
  ];
  const clearAccent = () => {
    accentProperties.forEach((property) => document.documentElement.style.removeProperty(property));
    if (accentInput) accentInput.value = defaultAccent;
    if (accentOutput) accentOutput.textContent = defaultAccent.toUpperCase();
  };

  let savedAccent = '';
  try {
    savedAccent = localStorage.getItem(accentKey) || '';
  } catch {
    // Use the default palette when browser storage is unavailable.
  }
  const initialAccent = /^#[0-9a-f]{6}$/i.test(savedAccent) ? savedAccent : defaultAccent;
  if (accentInput) accentInput.value = initialAccent;
  if (savedAccent) applyAccent(initialAccent);

  if (accentInput) {
    accentInput.addEventListener('input', () => {
      applyAccent(accentInput.value);
      try {
        localStorage.setItem(accentKey, accentInput.value);
      } catch {
        // The selected color still applies until this page is closed.
      }
    });

    resetAccent?.addEventListener('click', () => {
      try {
        localStorage.removeItem(accentKey);
      } catch {
        // The default color still applies until this page is closed.
      }
      clearAccent();
    });
  }

  window.addEventListener('storage', (event) => {
    const preference = preferences.find(({ key }) => key === event.key);
    if (preference) {
      const enabled = event.newValue === 'true';
      preference.target.classList.toggle(preference.className, enabled);
      const toggle = document.getElementById(preference.id);
      if (toggle) toggle.checked = enabled;
    }

    if (event.key === accentKey) {
      const color = event.newValue || '';
      if (/^#[0-9a-f]{6}$/i.test(color)) {
        applyAccent(color);
        if (accentInput) accentInput.value = color;
      } else {
        clearAccent();
      }
    }
  });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
