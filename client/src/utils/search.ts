export type SuggestionItem = { label: string; icon: 'search' | 'clock' | 'popular' | 'product' };

export const buildDynamicSuggestions = (query: string): string[] => {
  const q = query.trim();
  return q.length ? [q, `${q} unisex`, `${q} chính hãng`] : [];
};

export const buildItems = (
  query: string,
  recentSearches: string[],
  popularSearches: string[]
): SuggestionItem[] => {
  const items: SuggestionItem[] = [];
  const q = query.trim();
  if (q.length === 0) {
    for (const r of recentSearches) items.push({ label: r, icon: 'clock' });
    for (const p of popularSearches) items.push({ label: p, icon: 'popular' });
  } else {
    for (const s of buildDynamicSuggestions(q)) items.push({ label: s, icon: 'search' });
  }
  return items;
};
