(() => {
  const gallery = document.querySelector(".project-gallery");
  if (!gallery) return;

  const slides = Array.from(gallery.querySelectorAll(".gallery-slide"));
  const previous = document.getElementById("gallery-prev");
  const next = document.getElementById("gallery-next");
  const count = document.getElementById("gallery-count");
  if (!slides.length || !previous || !next || !count) return;

  let active = 0;
  const show = (index) => {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.hidden = slideIndex !== active;
      slide.setAttribute("aria-label", `Image ${slideIndex + 1} of ${slides.length}`);
    });
    count.textContent = `${active + 1} / ${slides.length}`;
    previous.disabled = next.disabled = slides.length < 2;
  };

  previous.addEventListener("click", () => show(active - 1));
  next.addEventListener("click", () => show(active + 1));
  show(0);
})();
