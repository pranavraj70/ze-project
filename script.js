const pages = [...document.querySelectorAll(".page-section")];
const navItems = [...document.querySelectorAll(".nav-item")];
const breadcrumb = document.getElementById("breadcrumb-current");
const toast = document.getElementById("toast");
const profileDialog = document.getElementById("profile-dialog");
let toastTimer;

const currentDate = new Intl.DateTimeFormat("en", {
  weekday: "long",
  month: "long",
  day: "numeric",
}).format(new Date()).toUpperCase();
document.getElementById("current-date").textContent = currentDate;

const hour = new Date().getHours();
const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
document.getElementById("greeting").firstChild.textContent = `${greeting}, Pranav `;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

function showPage(name) {
  const page = document.getElementById(`page-${name}`);
  if (!page) return;
  pages.forEach((section) => section.classList.toggle("active", section === page));
  navItems.forEach((item) => item.classList.toggle("active", item.dataset.page === name));
  const label = navItems.find((item) => item.dataset.page === name)?.querySelector(".nav-text")?.textContent;
  breadcrumb.textContent = label || "Discover";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

navItems.forEach((item) => item.addEventListener("click", () => showPage(item.dataset.page)));
document.querySelectorAll("[data-go]").forEach((button) => {
  button.addEventListener("click", () => showPage(button.dataset.go));
});

document.querySelectorAll("[data-toast]").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.classList.contains("row-request")) {
      button.textContent = "✓";
      button.disabled = true;
      button.setAttribute("aria-label", "Swap request sent");
      button.classList.add("sent");
    }
    showToast(button.dataset.toast);
  });
});

document.querySelectorAll("[data-open-profile]").forEach((button) => {
  button.addEventListener("click", () => profileDialog.showModal());
});

document.getElementById("profile-form").addEventListener("submit", (event) => {
  if (event.submitter?.value !== "save") return;
  event.preventDefault();
  const name = document.getElementById("profile-name").value.trim();
  if (!name) {
    document.getElementById("profile-name").focus();
    return;
  }
  document.querySelectorAll(".profile-mini-copy strong").forEach((element) => {
    element.textContent = name;
  });
  const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  document.querySelectorAll(".profile-mini .avatar, .top-actions .avatar").forEach((avatar) => {
    avatar.textContent = initials;
  });
  const teachSkill = document.getElementById("teach-skills").value.split(",")[0].trim();
  const learnSkill = document.getElementById("learn-skills").value.split(",")[0].trim();
  document.querySelector(".teach-side > strong").textContent = teachSkill || "Add a skill";
  document.querySelector(".learn-side > strong").textContent = learnSkill || "Add a skill";
  document.getElementById("greeting").firstChild.textContent = `${greeting}, ${name.split(/\s+/)[0]} `;
  profileDialog.close();
  showToast("Profile saved.");
});

const categoryFilters = [...document.querySelectorAll(".filter")];
const matchCards = [...document.querySelectorAll(".discover-card")];
const matchSearch = document.getElementById("skill-search");
const oneWayToggle = document.getElementById("one-way-toggle");
let activeCategory = "all";

function filterMatches() {
  const query = matchSearch.value.trim().toLowerCase();
  let visibleCount = 0;
  matchCards.forEach((card) => {
    const matchesCategory = activeCategory === "all" || card.dataset.category === activeCategory;
    const matchesQuery = !query || card.dataset.search.includes(query);
    const allowedType = oneWayToggle.checked || !card.classList.contains("one-way-card");
    const visible = matchesCategory && matchesQuery && allowedType;
    card.hidden = !visible;
    if (visible) visibleCount += 1;
  });
  document.getElementById("empty-matches").classList.toggle("visible", visibleCount === 0);
}

categoryFilters.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    categoryFilters.forEach((filter) => filter.classList.toggle("active", filter === button));
    filterMatches();
  });
});
matchSearch.addEventListener("input", filterMatches);
oneWayToggle.addEventListener("change", filterMatches);

document.querySelectorAll(".save-button").forEach((button) => {
  button.addEventListener("click", () => {
    const saved = button.getAttribute("aria-pressed") !== "true";
    button.setAttribute("aria-pressed", String(saved));
    button.classList.toggle("saved", saved);
    button.textContent = saved ? "♥" : "♡";
    showToast(saved ? "Added to your saved matches." : "Removed from your saved matches.");
  });
});

document.querySelectorAll(".request-button").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.disabled) return;
    button.textContent = "Request sent";
    button.disabled = true;
    button.classList.add("secondary");
    showToast("Swap request sent. We’ll let you know when they reply.");
  });
});

document.querySelectorAll(".session-tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".session-tab").forEach((tab) => tab.classList.toggle("active", tab === button));
    const status = button.dataset.status;
    document.querySelectorAll(".session-row").forEach((row) => {
      row.hidden = status !== "all" && row.dataset.sessionStatus !== status;
    });
  });
});

document.querySelectorAll(".session-action:not([data-toast])").forEach((button) => {
  button.addEventListener("click", () => showToast("Session details are up to date."));
});

document.querySelector(".brand").addEventListener("click", (event) => {
  event.preventDefault();
  showPage("discover");
});

filterMatches();