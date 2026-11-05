/* Homepage-only profile link placeholders and marquee accessibility helpers. */
(() => {
  const buttons = document.querySelectorAll('[data-profile-action]');
  if (!buttons.length) return;
  let note;
  const showNote = (label) => {
    if (!note) {
      note = document.createElement('div');
      note.className = 'profile-link-note';
      note.setAttribute('role', 'status');
      note.setAttribute('aria-live', 'polite');
      document.body.appendChild(note);
    }
    note.textContent = `${label} profile link will be added here.`;
    note.classList.add('is-active');
    window.clearTimeout(showNote.timer);
    showNote.timer = window.setTimeout(() => note.classList.remove('is-active'), 2200);
  };
  buttons.forEach((button) => button.addEventListener('click', () => showNote(button.dataset.profileAction)));
})();
