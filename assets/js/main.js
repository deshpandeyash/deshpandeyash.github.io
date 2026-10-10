const toggle = document.querySelector('.menu-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    links.classList.toggle('open', !open);
  });
}
document.querySelectorAll('#year').forEach(el => el.textContent = new Date().getFullYear());

const search = document.querySelector('#pub-search');
if (search) {
  const items = [...document.querySelectorAll('.publication')];
  const empty = document.querySelector('#empty-state');
  search.addEventListener('input', () => {
    const q = search.value.trim().toLowerCase();
    let visible = 0;
    items.forEach(item => {
      const match = (item.innerText + ' ' + (item.dataset.search || '')).toLowerCase().includes(q);
      item.hidden = !match;
      if (match) visible++;
    });
    if (empty) empty.hidden = visible !== 0;
  });
}
document.querySelectorAll('.placeholder-link').forEach(link => {
  link.addEventListener('click', event => {
    if (link.getAttribute('href') === '#') {
      event.preventDefault();
      alert('Replace this placeholder with the correct public URL before publishing.');
    }
  });
});
