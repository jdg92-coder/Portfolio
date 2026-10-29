(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const items = document.querySelectorAll("main > :not(:first-child), footer");
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });

  items.forEach((item) => {
    item.classList.add("scroll-reveal");
    observer.observe(item);
  });
})();
