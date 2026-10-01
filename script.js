const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-nav");
const navigationLinks = [...document.querySelectorAll("#primary-nav a")];
const mobileNavigation = window.matchMedia("(max-width: 720px)");

function setMenuOpen(isOpen) {
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
    );
    menuButton.classList.toggle("is-open", isOpen);
    navigation.hidden = mobileNavigation.matches && !isOpen;
}

function syncNavigation() {
    menuButton.hidden = !mobileNavigation.matches;
    navigation.hidden = mobileNavigation.matches;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    menuButton.classList.remove("is-open");
}

menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    setMenuOpen(!isOpen);
});

navigationLinks.forEach((link) => {
    link.addEventListener("click", () => {
        if (mobileNavigation.matches) {
            setMenuOpen(false);
        }
    });
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileNavigation.matches) {
        setMenuOpen(false);
        menuButton.focus();
    }
});

document.addEventListener("click", (event) => {
    const clickedInsideMenu =
        navigation.contains(event.target) || menuButton.contains(event.target);

    if (!clickedInsideMenu && mobileNavigation.matches) {
        setMenuOpen(false);
    }
});

mobileNavigation.addEventListener("change", syncNavigation);
syncNavigation();

const sections = document.querySelectorAll("main section[id]");
const activeLinks = new Map(
    navigationLinks.map((link) => [link.hash.slice(1), link])
);

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                navigationLinks.forEach((link) => {
                    link.classList.remove("is-active");
                    link.removeAttribute("aria-current");
                });

                const activeLink = activeLinks.get(entry.target.id);
                if (activeLink) {
                    activeLink.classList.add("is-active");
                    activeLink.setAttribute("aria-current", "location");
                }
            });
        },
        {
            rootMargin: "-25% 0px -62% 0px",
            threshold: 0
        }
    );

    sections.forEach((section) => sectionObserver.observe(section));
}

const year = document.querySelector("#year");
if (year) {
    year.textContent = String(new Date().getFullYear());
}

const evidxLinks = document.querySelectorAll('a[href="#evidx"]');
const evidxTarget = document.querySelector("#evidx");

function clearEvidxHash() {
    window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
    );
}

evidxLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        evidxTarget?.scrollIntoView({ behavior: "smooth", block: "start" });
        clearEvidxHash();
    });
});

if (window.location.hash === "#evidx") {
    clearEvidxHash();
}