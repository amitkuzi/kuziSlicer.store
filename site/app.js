const catalogRoot = document.querySelector('#catalog');
const status = document.querySelector('#status');
const search = document.querySelector('#search');
const type = document.querySelector('#type');
const template = document.querySelector('#plugin-card');

let plugins = [];

function render() {
  const query = search.value.trim().toLowerCase();
  const selectedType = type.value;
  const visible = plugins.filter((plugin) => {
    const searchable = [plugin.name, plugin.summary, ...plugin.tags].join(' ').toLowerCase();
    return (!query || searchable.includes(query)) && (!selectedType || plugin.type === selectedType);
  });

  catalogRoot.replaceChildren(...visible.map((plugin) => {
    const card = template.content.cloneNode(true);
    card.querySelector('h2').textContent = plugin.name;
    card.querySelector('.version').textContent = `v${plugin.version}`;
    card.querySelector('.type').textContent = plugin.type.replaceAll('-', ' ');
    card.querySelector('.summary').textContent = plugin.summary;
    card.querySelector('.tags').replaceChildren(...plugin.tags.map((tag) => {
      const item = document.createElement('li');
      item.textContent = tag;
      return item;
    }));
    card.querySelector('.repository').href = plugin.repository;
    card.querySelector('.manifest').href = plugin.manifest;
    return card;
  }));
  status.textContent = `${visible.length} of ${plugins.length} plugins`;
}

try {
  const response = await fetch('./catalog/plugins.json');
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  ({ plugins } = await response.json());
  const types = [...new Set(plugins.map((plugin) => plugin.type))].sort();
  type.append(...types.map((value) => new Option(value.replaceAll('-', ' '), value)));
  render();
} catch (error) {
  status.textContent = `Could not load the catalog: ${error.message}`;
}

search.addEventListener('input', render);
type.addEventListener('change', render);
