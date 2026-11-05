/* DTA Insights interactions: topic filters and lightweight video-category tabs. */
(() => {
  const page = document.querySelector('.insights-page');
  if (!page) return;

  const topicButtons = [...page.querySelectorAll('.insights-filter')];
  const topicCards = [...page.querySelectorAll('.insights-topic-card')];
  const emptyState = page.querySelector('.insights-empty-state');
  topicButtons.forEach((button) => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    topicButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    let visible = 0;
    topicCards.forEach((card) => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (emptyState) emptyState.hidden = visible > 0;
  }));

  const videoButtons = [...page.querySelectorAll('.insights-video-tab')];
  const videoCards = [...page.querySelectorAll('.insights-video-card')];
  videoButtons.forEach((button) => button.addEventListener('click', () => {
    const filter = button.dataset.videoFilter;
    videoButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    videoCards.forEach((card) => {
      card.hidden = filter !== 'all' && card.dataset.videoCategory !== filter;
    });
  }));

  // Prevent placeholder thumbnails from opening a generic YouTube page before URLs are added.
  page.querySelectorAll('[data-video-placeholder="true"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      link.classList.add('video-link-needed');
      const title = link.querySelector('.video-thumb-title');
      if (title) {
        const original = title.textContent;
        title.textContent = 'YouTube link to be added';
        window.setTimeout(() => { title.textContent = original; }, 1800);
      }
    });
  });
})();
