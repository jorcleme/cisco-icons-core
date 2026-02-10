<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';

interface IconEntry {
  name: string;
  pascal_name: string;
  family: 'phosphor' | 'cisco';
  weights: readonly string[];
  tags: readonly string[];
}

const icons = ref<IconEntry[]>([]);
const search = ref('');
const familyFilter = ref<'all' | 'phosphor' | 'cisco'>('all');
const weightFilter = ref('regular');
const svgCache = new Map<string, string>();
const svgHtml = ref<Record<string, string>>({});
const loading = ref(true);
const copied = ref<string | null>(null);
const perPage = 120;
const page = ref(1);
const inputPage = ref('1');

const allWeights = ['thin', 'light', 'regular', 'bold', 'fill', 'duotone'];

const filteredIcons = computed(() => {
  let result = icons.value;

  if (familyFilter.value !== 'all') {
    result = result.filter((i) => i.family === familyFilter.value);
  }

  if (weightFilter.value !== 'regular') {
    result = result.filter((i) => i.weights.includes(weightFilter.value));
  }

  if (search.value.trim()) {
    const q = search.value.toLowerCase().trim();
    result = result.filter(
      (i) =>
        i.name.includes(q) ||
        i.pascal_name.toLowerCase().includes(q) ||
        i.tags.some((t) => t.includes(q))
    );
  }

  return result;
});

const paginatedIcons = computed(() => {
  const start = (page.value - 1) * perPage;
  const end = start + perPage;
  return filteredIcons.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredIcons.value.length / perPage);
});

const hasMore = computed(() => {
  return page.value < totalPages.value;
});

const hasPrevious = computed(() => {
  return page.value > 1;
});

const stats = computed(() => {
  const total = icons.value.length;
  const phosphor = icons.value.filter((i) => i.family === 'phosphor').length;
  const cisco = icons.value.filter((i) => i.family === 'cisco').length;
  return { total, phosphor, cisco };
});

watch([search, familyFilter, weightFilter], () => {
  page.value = 1;
  inputPage.value = '1';
});

watch(page, (newPage) => {
  inputPage.value = String(newPage);
});

function cacheKey(icon: IconEntry, weight: string): string {
  return `${icon.family}/${weight}/${icon.name}`;
}

function resolveWeight(icon: IconEntry): string {
  return icon.weights.includes(weightFilter.value) ? weightFilter.value : icon.weights[0];
}

async function fetchSvg(icon: IconEntry): Promise<string> {
  const weight = resolveWeight(icon);
  const key = cacheKey(icon, weight);

  if (svgCache.has(key)) return svgCache.get(key)!;

  const base = import.meta.env.BASE_URL || '/';
  const url = `${base}assets/${icon.family}/${weight}/${icon.name}.svg`;

  try {
    const res = await fetch(url);
    if (!res.ok) return '';
    const text = await res.text();
    svgCache.set(key, text);
    return text;
  } catch {
    return '';
  }
}

async function loadVisibleIcons() {
  const batch = paginatedIcons.value;
  const results: Record<string, string> = {};

  await Promise.all(
    batch.map(async (icon) => {
      const weight = resolveWeight(icon);
      const key = cacheKey(icon, weight);
      const svg = await fetchSvg(icon);
      results[key] = svg;
    })
  );

  svgHtml.value = { ...svgHtml.value, ...results };
}

function getSvgForIcon(icon: IconEntry): string {
  const weight = resolveWeight(icon);
  return svgHtml.value[cacheKey(icon, weight)] ?? '';
}

watch(
  [paginatedIcons, weightFilter],
  () => {
    loadVisibleIcons();
  },
  { flush: 'post' }
);

onMounted(async () => {
  try {
    const mod = await import('../../../src/icons.ts');
    icons.value = [...mod.icons];
  } catch {
    console.error('Failed to load icon catalog');
  }
  loading.value = false;
  await nextTick();
  loadVisibleIcons();
});

async function copyImport(icon: IconEntry) {
  const weight = weightFilter.value;
  const importPath =
    icon.family === 'cisco'
      ? `@jorcleme/cisco-icons-core/cisco/regular/${icon.name}.svg`
      : `@jorcleme/cisco-icons-core/phosphor/${weight}/${icon.name}.svg`;

  await navigator.clipboard.writeText(`import ${JSON.stringify(importPath)};`);
  copied.value = icon.name;
  setTimeout(() => {
    copied.value = null;
  }, 1500);
}

function goToPage(pageNum: number) {
  const target = Math.max(1, Math.min(pageNum, totalPages.value));
  if (target !== page.value) {
    page.value = target;
    // Scroll to top of gallery for better UX
    document.querySelector('.gallery-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function previousPage() {
  if (page.value > 1) {
    goToPage(page.value - 1);
  }
}

function nextPage() {
  if (page.value < totalPages.value) {
    goToPage(page.value + 1);
  }
}

function handlePageInput() {
  const num = parseInt(inputPage.value, 10);
  if (!isNaN(num) && num >= 1 && num <= totalPages.value) {
    goToPage(num);
  } else {
    // Reset to current page if invalid
    inputPage.value = String(page.value);
  }
}
</script>

<template>
  <div class="icon-gallery">
    <div class="gallery-stats">
      <span
        ><strong>{{ stats.total }}</strong> icons</span
      >
      <span class="stat-sep">&middot;</span>
      <span>{{ stats.phosphor }} Phosphor</span>
      <span class="stat-sep">&middot;</span>
      <span>{{ stats.cisco }} Cisco</span>
    </div>

    <div class="gallery-filters">
      <input v-model="search" type="text" placeholder="Search icons..." class="gallery-search" />

      <div class="filter-group">
        <label class="filter-label">Family</label>
        <div class="filter-buttons">
          <button
            :class="['filter-btn', { active: familyFilter === 'all' }]"
            @click="familyFilter = 'all'"
          >
            All
          </button>
          <button
            :class="['filter-btn', { active: familyFilter === 'phosphor' }]"
            @click="familyFilter = 'phosphor'"
          >
            Phosphor
          </button>
          <button
            :class="['filter-btn', { active: familyFilter === 'cisco' }]"
            @click="familyFilter = 'cisco'"
          >
            Cisco
          </button>
        </div>
      </div>

      <div class="filter-group">
        <label class="filter-label">Weight</label>
        <div class="filter-buttons">
          <button
            v-for="w in allWeights"
            :key="w"
            :class="['filter-btn', { active: weightFilter === w }]"
            @click="weightFilter = w"
          >
            {{ w }}
          </button>
        </div>
      </div>
    </div>

    <div class="gallery-count">
      {{ filteredIcons.length }} icon{{ filteredIcons.length === 1 ? '' : 's' }} found
      <span v-if="totalPages > 1" class="page-info"> (Page {{ page }} of {{ totalPages }}) </span>
    </div>

    <div v-if="loading" class="gallery-loading">Loading icon catalog...</div>

    <div v-else class="gallery-grid">
      <div
        v-for="icon in paginatedIcons"
        :key="`${icon.family}-${icon.name}-${weightFilter}`"
        class="icon-cell"
        :title="icon.pascal_name + ' (' + icon.family + ')'"
        @click="copyImport(icon)"
      >
        <div class="icon-preview" v-html="getSvgForIcon(icon)"></div>
        <div class="icon-name">{{ icon.name }}</div>
        <div v-if="copied === icon.name" class="icon-copied">Copied!</div>
      </div>
    </div>

    <div v-if="totalPages > 1" class="pagination-controls">
      <button
        class="pagination-btn"
        :disabled="!hasPrevious"
        @click="previousPage"
        aria-label="Previous page"
      >
        <span aria-hidden="true">←</span> Prev
      </button>

      <div class="pagination-input-group">
        <label for="page-input" class="sr-only">Go to page</label>
        <span class="pagination-label">Page</span>
        <input
          id="page-input"
          v-model="inputPage"
          type="number"
          min="1"
          :max="totalPages"
          class="pagination-input"
          @blur="handlePageInput"
          @keyup.enter="handlePageInput"
        />
        <span class="pagination-label">of {{ totalPages }}</span>
      </div>

      <button class="pagination-btn" :disabled="!hasMore" @click="nextPage" aria-label="Next page">
        Next <span aria-hidden="true">→</span>
      </button>
    </div>

    <div v-if="!loading && filteredIcons.length === 0" class="gallery-empty">
      No icons match your search.
    </div>
  </div>
</template>

<style scoped>
.icon-gallery {
  margin-top: 1rem;
}

.gallery-stats {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  margin-bottom: 1rem;
}

.stat-sep {
  margin: 0 0.4rem;
}

.gallery-filters {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.gallery-search {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}

.gallery-search:focus {
  border-color: var(--vp-c-brand-1);
}

.gallery-search::placeholder {
  color: var(--vp-c-text-3);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  min-width: 50px;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.filter-btn {
  padding: 0.3rem 0.6rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s;
  text-transform: capitalize;
}

.filter-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
}

.filter-btn.active {
  background: var(--vp-c-brand-1);
  color: var(--vp-c-white);
  border-color: var(--vp-c-brand-1);
}

.gallery-count {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  margin-bottom: 1rem;
}

.page-info {
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.gallery-loading {
  text-align: center;
  padding: 3rem;
  color: var(--vp-c-text-3);
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.5rem;
}

.icon-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem 0.25rem;
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
  position: relative;
}

.icon-cell:hover {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-border);
}

.icon-preview {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.4rem;
  background: #fff;
  border-radius: 8px;
}

.icon-preview :deep(svg) {
  width: 100%;
  height: 100%;
  color: #000;
}

.icon-name {
  font-size: 0.65rem;
  color: var(--vp-c-text-3);
  text-align: center;
  word-break: break-all;
  line-height: 1.2;
  max-width: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.icon-copied {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--vp-c-brand-1);
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  pointer-events: none;
}

.gallery-empty {
  text-align: center;
  padding: 3rem;
  color: var(--vp-c-text-3);
}

.pagination-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem 0;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.pagination-btn:hover:not(:disabled) {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.pagination-label {
  font-weight: 500;
}

.pagination-input {
  width: 4rem;
  padding: 0.4rem 0.5rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  text-align: center;
  outline: none;
  transition: border-color 0.2s;
}

.pagination-input:focus {
  border-color: var(--vp-c-brand-1);
}

.pagination-input::-webkit-outer-spin-button,
.pagination-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.pagination-input[type='number'] {
  appearance: textfield;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
