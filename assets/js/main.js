const toggle = document.querySelector(".menu-toggle");
const links = document.querySelector(".nav-links");

if (toggle && links) {
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    links.classList.toggle("open", !open);
  });
}

document.querySelectorAll("#year").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const search = document.querySelector("#pub-search");

if (search) {
  const items = [...document.querySelectorAll(".publication")];
  const emptyState = document.querySelector("#empty-state");
  const filterButtons = [...document.querySelectorAll("[data-filter-group]")];
  const filters = {
    query: "",
    tag: "all",
  };

  const applyFilters = () => {
    let visible = 0;
    items.forEach((item) => {
      const searchableText = `${item.innerText} ${item.dataset.search || ""}`.toLowerCase();
      const tags = (item.dataset.tags || "").split(/\s+/).filter(Boolean);
      const matchesQuery = searchableText.includes(filters.query);
      const matchesTag = filters.tag === "all" || tags.includes(filters.tag);
      const show = matchesQuery && matchesTag;
      item.hidden = !show;
      if (show) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.hidden = visible !== 0;
    }
  };

  search.addEventListener("input", () => {
    filters.query = search.value.trim().toLowerCase();
    applyFilters();
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const { filterGroup, filterValue } = button.dataset;
      if (!filterGroup || !filterValue) {
        return;
      }

      filters[filterGroup] = filterValue;
      filterButtons
        .filter((candidate) => candidate.dataset.filterGroup === filterGroup)
        .forEach((candidate) => candidate.classList.toggle("is-active", candidate === button));
      applyFilters();
    });
  });
}
