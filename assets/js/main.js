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
  const clearFiltersButton = document.querySelector("#clear-filters");
  const filters = {
    query: "",
    tag: "all",
    year: "all",
  };

  const applyFilters = () => {
    let visible = 0;
    items.forEach((item) => {
      const searchableText = `${item.innerText} ${item.dataset.search || ""}`.toLowerCase();
      const tags = (item.dataset.tags || "").split(/\s+/).filter(Boolean);
      const matchesQuery = searchableText.includes(filters.query);
      const matchesTag = filters.tag === "all" || tags.includes(filters.tag);
      const matchesYear = filters.year === "all" || item.dataset.year === filters.year;
      const show = matchesQuery && matchesTag && matchesYear;
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

  if (clearFiltersButton) {
    clearFiltersButton.addEventListener("click", () => {
      filters.query = "";
      filters.tag = "all";
      filters.year = "all";
      search.value = "";
      filterButtons.forEach((button) => {
        const isDefault =
          (button.dataset.filterGroup === "tag" && button.dataset.filterValue === "all") ||
          (button.dataset.filterGroup === "year" && button.dataset.filterValue === "all");
        button.classList.toggle("is-active", isDefault);
      });
      applyFilters();
    });
  }
}
