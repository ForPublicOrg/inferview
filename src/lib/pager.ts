// Pager for lists that are filtered or built in the browser: Previous and Next, the range on screen, and the page
// number in the URL so a filtered page can be shared. Hidden while the list fits on one page.
export type Pager = {
  page: number;
  size: number;
  /** Re-renders the controls for `total` items, clamping the page into range. Returns the clamped page. */
  set(total: number, page?: number): number;
  /** The items of the current page. */
  slice<T>(items: T[]): T[];
};

export function createPager(root: HTMLElement, size: number, onChange: (page: number) => void, param = 'page'): Pager {
  root.classList.add('pager');
  root.innerHTML =
    '<span class="tiny" data-range aria-live="polite"></span>' +
    '<div class="ctrls">' +
    '<button class="btn sm" type="button" data-prev>Previous</button>' +
    '<span class="tiny" data-page></span>' +
    '<button class="btn sm" type="button" data-next>Next</button>' +
    '</div>';
  const range = root.querySelector<HTMLElement>('[data-range]')!;
  const label = root.querySelector<HTMLElement>('[data-page]')!;
  const prev = root.querySelector<HTMLButtonElement>('[data-prev]')!;
  const next = root.querySelector<HTMLButtonElement>('[data-next]')!;

  const fromUrl = Number(new URLSearchParams(location.search).get(param));
  const pager: Pager = {
    page: Number.isInteger(fromUrl) && fromUrl > 0 ? fromUrl : 1,
    size,
    set(total, page = pager.page) {
      const pages = Math.max(1, Math.ceil(total / size));
      pager.page = Math.min(Math.max(1, page), pages);
      root.hidden = total <= size;
      const first = total ? (pager.page - 1) * size + 1 : 0;
      const last = Math.min(total, pager.page * size);
      range.textContent = `Showing ${first} to ${last} of ${total}`;
      label.textContent = `Page ${pager.page} of ${pages}`;
      prev.disabled = pager.page <= 1;
      next.disabled = pager.page >= pages;
      const url = new URL(location.href);
      if (pager.page > 1) url.searchParams.set(param, String(pager.page));
      else url.searchParams.delete(param);
      history.replaceState(history.state, '', url);
      return pager.page;
    },
    slice(items) {
      return items.slice((pager.page - 1) * size, pager.page * size);
    },
  };
  prev.addEventListener('click', () => onChange(pager.page - 1));
  next.addEventListener('click', () => onChange(pager.page + 1));
  return pager;
}
