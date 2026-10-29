(() => {
  const gallery = document.querySelector(".project-gallery");
  if (!gallery) return;

  const slides = Array.from(gallery.querySelectorAll(".gallery-slide"));
  const previous = gallery.querySelector("#gallery-prev");
  const next = gallery.querySelector("#gallery-next");
  const count = gallery.querySelector("#gallery-count");
  if (!slides.length || !previous || !next || !count) return;

  let active = 0;
  const show = (index) => {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.hidden = slideIndex !== active;
      slide.setAttribute("aria-label", `Image ${slideIndex + 1} of ${slides.length}`);
    });
    count.textContent = `${active + 1} / ${slides.length}`;
  };

  previous.addEventListener("click", () => show(active - 1));
  next.addEventListener("click", () => show(active + 1));
  show(0);
})();
