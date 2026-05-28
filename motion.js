const motionTargets = [
	".home-focus",
	".home-preview",
	"#demo-reel",
	".focus-card",
	".preview-card",
	".demo-reel-txt",
	".video-section",
	".about-section",
	".timelineBox",
	".skill-card",
	"#project-page",
	".slideshow-container",
	".gallery-section",
	".photo-card",
	".video-card",
	".Contact-top",
	".contact-form",
	".below-contact-box1",
	".below-contact-box2",
	".below-contact-box3",
	".map-container",
	".footer-main"
];

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const targets = document.querySelectorAll(motionTargets.join(","));

targets.forEach((target) => target.classList.add("motion-reveal"));

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
	targets.forEach((target) => target.classList.add("is-visible"));
} else {
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("is-visible");
					observer.unobserve(entry.target);
				}
			});
		},
		{
			threshold: 0.16,
			rootMargin: "0px 0px -70px 0px"
		}
	);

	targets.forEach((target) => observer.observe(target));
}
