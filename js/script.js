const menus = document.querySelector("nav ul");
const header = document.querySelector("header");
const menuBtn = document.querySelector(".menu-btn");
const closeBtn = document.querySelector(".close-btn");
const menuLinks = document.querySelectorAll("nav ul li a");

// Load decorative background images only when their section is close to the viewport.
const counterSection = document.querySelector("#static-counter");
if (counterSection && "IntersectionObserver" in window) {
    const backgroundObserver = new IntersectionObserver((entries, observer) => {
        if (!entries[0].isIntersecting) return;

        counterSection.classList.add("background-loaded");
        observer.unobserve(counterSection);
    }, { rootMargin: "300px 0px" });

    backgroundObserver.observe(counterSection);
} else if (counterSection) {
    counterSection.classList.add("background-loaded");
}

menuBtn.addEventListener("click", () => {
    menus.classList.add("display");
});

closeBtn.addEventListener("click", () => {
    menus.classList.remove("display");
});

menuLinks.forEach(link => {
    link.addEventListener("click", () => {
        menus.classList.remove("display");
    });
});


//  scroll navbar
window.addEventListener("scroll",() => {
    if(document.documentElement.scrollTop > 20) {
        header.classList.add("sticky");
    }else {
        header.classList.remove("sticky");
    }
})


// static numbers
const countersEL = document.querySelectorAll(".numbers");
countersEL.forEach((counters) => {
    counters.textContent = 0;

    incrementCounters();

    function incrementCounters() {
        let currentNum = +counters.textContent;
        const dataCeil = counters.getAttribute("data-ceil");

        const increment = dataCeil / 25;

        currentNum = Math.ceil(currentNum + increment);

        if (currentNum < dataCeil) {
            counters.textContent = currentNum;
            setTimeout(incrementCounters, 70);
        } else {
            counters.textContent = dataCeil;
        }
    }
});

const bookingConfig = {
    whatsappNumber: "923473371276",
    email: "kmr967474@gmail.com",
};

const tourSearch = document.querySelector("#tour-search");
const tourCards = [...document.querySelectorAll("#choose-place .lg-img[data-destination]")];
const bookableCards = [
    ...tourCards,
    ...document.querySelectorAll("#top-destination .carousel, #travel-countries .carousel"),
];
const searchMessage = document.querySelector("#search-message");

const durationMatches = (days, filter) => {
    if (!filter) return true;
    if (filter === "short") return days <= 9;
    if (filter === "medium") return days >= 10 && days <= 13;
    return days >= 14;
};

if (tourSearch) {
    tourSearch.addEventListener("submit", (event) => {
        event.preventDefault();
        const query = document.querySelector("#tour-query").value.trim().toLowerCase();
        const destination = document.querySelector("#destination-filter").value;
        const duration = document.querySelector("#duration-filter").value;
        let results = 0;

        tourCards.forEach((card) => {
            const matchesQuery = !query || card.dataset.destination.includes(query);
            const matchesDestination = !destination || card.dataset.destination === destination;
            const matchesDuration = durationMatches(Number(card.dataset.duration), duration);
            const matches = matchesQuery && matchesDestination && matchesDuration;
            card.closest(".img-left-side, .img-right-side")?.style.setProperty("display", matches ? "" : "none");
            card.style.display = matches ? "" : "none";
            if (matches) results += 1;
        });

        searchMessage.textContent = results
            ? `${results} tour${results === 1 ? "" : "s"} found. Select a card to see details.`
            : "No tour matches these filters. Try another destination or duration.";
        document.querySelector("#choose-place").scrollIntoView({ behavior: "smooth", block: "start" });
    });
}

const tourModal = document.querySelector("#tour-modal");
const modalTitle = document.querySelector("#tour-modal-title");
const modalImage = document.querySelector("#tour-modal-image");
const modalDetails = document.querySelector("#tour-modal-details");
const modalPrice = document.querySelector("#tour-modal-price");
const modalBook = document.querySelector("#tour-modal-book");

const closeTourModal = () => {
    tourModal.classList.remove("is-open");
    tourModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    bookingForm.hidden = true;
    bookingSuccess.hidden = true;
};

if (tourModal) {
    bookableCards.forEach((card) => {
        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "button");
        card.setAttribute("aria-label", "View tour details");

        const openModal = () => {
            const title = card.querySelector("h2").textContent;
            selectedTour = title;
            const details = [...card.querySelectorAll(".hidden-content span, .hidden-content-carousel span")]
                .map((item) => item.textContent.trim())
                .join(" · ");
            const price = card.dataset.price || card.querySelector(".price-label")?.textContent.trim();
            modalTitle.textContent = title;
            modalImage.src = card.querySelector("img").src;
            modalImage.alt = card.querySelector("img").alt;
            modalDetails.textContent = details;
            modalPrice.textContent = price
                ? (price.startsWith("$") ? `From ${price} per person` : `${price} available`)
                : "Contact us for pricing";
            bookingForm.hidden = true;
            bookingSuccess.hidden = true;
            bookingSuccess.textContent = "";
            bookingForm.reset();
            tourModal.classList.add("is-open");
            tourModal.setAttribute("aria-hidden", "false");
            document.body.classList.add("modal-open");
        };

        card.addEventListener("click", openModal);
        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openModal();
            }
        });
    });

    tourModal.querySelectorAll("[data-modal-close]").forEach((element) => {
        element.addEventListener("click", closeTourModal);
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && tourModal.classList.contains("is-open")) closeTourModal();
    });
}

const subscribeForm = document.querySelector("#contact");
if (subscribeForm) {
    subscribeForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const email = subscribeForm.querySelector("input").value.trim();
        window.location.href = `mailto:${bookingConfig.email}?subject=${encodeURIComponent("Smart Travel newsletter subscription")}&body=${encodeURIComponent(`Please subscribe ${email} to the Smart Travel newsletter.`)}`;
    });
}

document.querySelector("#current-year").textContent = new Date().getFullYear();

let selectedTour = "your selected tour";
const bookingForm = document.querySelector("#tour-booking-form");
const bookingSuccess = document.querySelector("#booking-success");
modalBook.addEventListener("click", () => {
    bookingForm.hidden = false;
    bookingSuccess.hidden = true;
    bookingSuccess.textContent = "";
    bookingForm.querySelector("#booking-name").focus();
});
if (bookingForm) {
    bookingForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = document.querySelector("#booking-name").value.trim();
        bookingSuccess.textContent = `Thanks ${name}! Your ${selectedTour} request is ready. Use WhatsApp above to send it to our team.`;
        bookingSuccess.hidden = false;
        bookingForm.reset();
    });
}

const galleryItems = document.querySelectorAll(".gallery-item");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");
const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
};
galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
        const image = item.querySelector("img");
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
        lightboxCaption.textContent = item.querySelector("span").textContent;
        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
    });
});
lightbox?.querySelectorAll("[data-lightbox-close]").forEach((element) => element.addEventListener("click", closeLightbox));

const translations = {
    en: { toggle: "اردو", hero: "Explore tours", search: "Search", placeholder: "Where do you want to go?" },
    ur: { toggle: "English", hero: "ٹورز دیکھیں", search: "تلاش کریں", placeholder: "آپ کہاں جانا چاہتے ہیں؟" },
};
const languageToggle = document.querySelector("#language-toggle");
const setLanguage = (language) => {
    const copy = translations[language];
    document.documentElement.lang = language === "ur" ? "ur" : "en";
    document.documentElement.dir = language === "ur" ? "rtl" : "ltr";
    languageToggle.textContent = copy.toggle;
    document.querySelector(".hero-btn").childNodes[0].nodeValue = `${copy.hero} `;
    document.querySelector("#tour-search button").textContent = copy.search;
    document.querySelector("#tour-query").placeholder = copy.placeholder;
    localStorage.setItem("smart-travel-language", language);
};
if (languageToggle) {
    setLanguage(localStorage.getItem("smart-travel-language") || "en");
    languageToggle.addEventListener("click", () => setLanguage(document.documentElement.lang === "ur" ? "en" : "ur"));
}

const themeToggle = document.querySelector("#theme-toggle");
const setTheme = (theme) => {
    document.body.classList.toggle("dark-mode", theme === "dark");
    themeToggle.querySelector("i").className = theme === "dark" ? "fa fa-sun" : "fa fa-moon";
    localStorage.setItem("smart-travel-theme", theme);
};
if (themeToggle) {
    setTheme(localStorage.getItem("smart-travel-theme") || "light");
    themeToggle.addEventListener("click", () => setTheme(document.body.classList.contains("dark-mode") ? "light" : "dark"));
}

const scrollTopButton = document.querySelector("#scroll-top");
window.addEventListener("scroll", () => scrollTopButton.classList.toggle("is-visible", window.scrollY > 500));
scrollTopButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

const legalModal = document.querySelector("#legal-modal");
const legalCopy = {
    privacy: ["Privacy Policy", "We only use the details you enter in this frontend demo to prepare your booking or email request in your own device. This website does not store payment details or personal information."],
    terms: ["Terms & Conditions", "Tour prices, availability and dates are subject to confirmation. A booking is confirmed only after Smart Travel contacts you directly. Please review cancellation terms with our team before making a payment."],
};
document.querySelectorAll("[data-legal]").forEach((button) => button.addEventListener("click", () => {
    const [title, content] = legalCopy[button.dataset.legal];
    document.querySelector("#legal-title").textContent = title;
    document.querySelector("#legal-content").textContent = content;
    legalModal.classList.add("is-open");
    legalModal.setAttribute("aria-hidden", "false");
}));
legalModal?.querySelectorAll("[data-legal-close]").forEach((element) => element.addEventListener("click", () => {
    legalModal.classList.remove("is-open");
    legalModal.setAttribute("aria-hidden", "true");
}));

document.querySelectorAll("img").forEach((image) => {
    const markReady = () => image.classList.add("image-ready");
    image.complete ? markReady() : image.addEventListener("load", markReady, { once: true });
});
window.addEventListener("DOMContentLoaded", () => document.body.classList.remove("is-loading"));

