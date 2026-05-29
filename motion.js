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
const typingTargets = document.querySelectorAll("[data-typing-text]");

const isAlreadyInView = (target) => {
	const rect = target.getBoundingClientRect();

	return rect.top < window.innerHeight - 70 && rect.bottom > 0;
};

typingTargets.forEach((typingTarget) => {
	const typingText = typingTarget.querySelector(".typing-text");
	const waveHand = typingTarget.querySelector(".wave-hand");

	if (!typingText) return;

	const fullText = typingTarget.dataset.typingText || typingText.textContent.trim();

	if (prefersReducedMotion) {
		typingText.textContent = fullText;
		typingTarget.classList.add("is-typing-complete");
		waveHand?.classList.add("is-visible");
	} else {
		let index = 0;

		typingText.textContent = "";

		const typeNextCharacter = () => {
			typingText.textContent = fullText.slice(0, index);
			index += 1;

			if (index <= fullText.length) {
				window.setTimeout(typeNextCharacter, 55);
				return;
			}

			window.setTimeout(() => {
				typingTarget.classList.add("is-typing-complete");
				waveHand?.classList.add("is-visible");
			}, 90);
		};

		window.setTimeout(typeNextCharacter, 520);
	}
});

document.querySelectorAll("[data-project-slider]").forEach((slider) => {
	const slides = Array.from(slider.querySelectorAll(".project-slide"));
	const previousButton = slider.querySelector(".project-slider-prev");
	const nextButton = slider.querySelector(".project-slider-next");
	const counter = slider.querySelector(".project-slider-count");
	let activeIndex = 0;

	if (!slides.length || !previousButton || !nextButton || !counter) return;

	const showSlide = (index) => {
		activeIndex = (index + slides.length) % slides.length;

		slides.forEach((slide, slideIndex) => {
			slide.classList.toggle("is-active", slideIndex === activeIndex);
		});

		counter.textContent = `${activeIndex + 1} / ${slides.length}`;
	};

	previousButton.addEventListener("click", () => showSlide(activeIndex - 1));
	nextButton.addEventListener("click", () => showSlide(activeIndex + 1));
	showSlide(0);
});

const creativeGallery = document.querySelector("#creative-gallery");
const creativeFilterButtons = document.querySelectorAll(".creative-filter-btn");
const creativeFilterButtonWrap = document.querySelector(".creative-filter-buttons");
const creativeFilterIndicator = document.querySelector(".creative-filter-indicator");

if (creativeGallery && creativeFilterButtons.length && creativeFilterButtonWrap && creativeFilterIndicator) {
	const creativeCards = Array.from(creativeGallery.querySelectorAll(".photo-card, .video-card"));
	const imageGroup = document.createElement("div");
	const videoGroup = document.createElement("div");

	imageGroup.className = "creative-project-group creative-image-group";
	videoGroup.className = "creative-project-group creative-video-group";

	creativeCards.forEach((card) => {
		if (card.classList.contains("photo-card")) {
			imageGroup.appendChild(card);
			return;
		}

		videoGroup.appendChild(card);
	});

	creativeGallery.append(imageGroup, videoGroup);

	const counts = {
		all: creativeCards.length,
		image: creativeCards.filter((card) => card.classList.contains("photo-card")).length,
		video: creativeCards.filter((card) => card.classList.contains("video-card")).length
	};

	const filterLabels = {
		all: "projects",
		image: "visual design projects",
		video: "multimedia production projects"
	};
	let activeCreativeFilter = "";

	const updateFilterPill = (activeButton) => {
		const wrapRect = creativeFilterButtonWrap.getBoundingClientRect();
		const buttonRect = activeButton.getBoundingClientRect();

		creativeFilterButtonWrap.style.setProperty("--filter-pill-left", `${buttonRect.left - wrapRect.left}px`);
		creativeFilterButtonWrap.style.setProperty("--filter-pill-width", `${buttonRect.width}px`);
	};

	const updateFilterIndicator = (text, animate) => {
		if (!animate) {
			creativeFilterIndicator.textContent = text;
			return;
		}

		creativeFilterIndicator.classList.add("is-changing");

		window.setTimeout(() => {
			creativeFilterIndicator.textContent = text;
			creativeFilterIndicator.classList.remove("is-changing");
		}, 140);
	};

	const setCreativeGroupVisibility = (group, shouldHide, animate) => {
		if (!animate) {
			group.classList.toggle("is-filtered-out", shouldHide);
			group.style.maxHeight = shouldHide ? "0px" : "";
			return;
		}

		group.classList.add("is-filter-transitioning");

		if (shouldHide) {
			group.style.maxHeight = `${group.scrollHeight}px`;
			window.requestAnimationFrame(() => {
				group.classList.add("is-filtered-out");
				group.style.maxHeight = "0px";
			});
			return;
		}

		group.classList.remove("is-filtered-out");
		group.style.maxHeight = "0px";
		window.requestAnimationFrame(() => {
			group.style.maxHeight = `${group.scrollHeight}px`;
		});
	};

	[imageGroup, videoGroup].forEach((group) => {
		group.addEventListener("transitionend", (event) => {
			if (event.target !== group || event.propertyName !== "max-height") return;

			group.style.maxHeight = group.classList.contains("is-filtered-out") ? "0px" : "";
			group.classList.remove("is-filter-transitioning");
		});
	});

	const applyCreativeFilter = (filter, animate = true) => {
		if (filter === activeCreativeFilter) return;

		activeCreativeFilter = filter;
		creativeGallery.classList.toggle("is-showing-visual-design", filter === "image");
		creativeGallery.classList.toggle("is-showing-multimedia-production", filter === "video");
		setCreativeGroupVisibility(imageGroup, filter === "video", animate);
		setCreativeGroupVisibility(videoGroup, filter === "image", animate);

		creativeFilterButtons.forEach((button) => {
			const isActive = button.dataset.filter === filter;
			button.classList.toggle("is-active", isActive);
			button.setAttribute("aria-pressed", String(isActive));

			if (isActive) {
				updateFilterPill(button);
			}
		});

		updateFilterIndicator(`${counts[filter]} ${filterLabels[filter]}`, animate);
	};

	creativeFilterButtons.forEach((button) => {
		button.addEventListener("click", () => {
			applyCreativeFilter(button.dataset.filter || "all");
		});
	});

	applyCreativeFilter("all", false);

	window.addEventListener("resize", () => {
		const activeButton = Array.from(creativeFilterButtons).find((button) => button.classList.contains("is-active"));
		if (activeButton) updateFilterPill(activeButton);
	});
}

targets.forEach((target) => {
	if (isAlreadyInView(target)) {
		target.classList.add("motion-reveal", "is-visible");
		return;
	}

	target.classList.add("motion-reveal");
});

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
