/* Scroll State Store — module-level for perf (no React re-renders) */
export const scrollState = {
  progress: 0,
  currentChapter: 0,
  chapterProgress: 0,
  direction: 1,
};

export function updateScrollState() {
  const scrollY = window.scrollY || window.pageYOffset;
  const docHeight = document.documentElement.scrollHeight;
  const viewportHeight = window.innerHeight;
  const maxScroll = docHeight - viewportHeight;
  scrollState.progress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;
  scrollState.currentChapter = Math.min(Math.floor(scrollState.progress * 8), 7);
  scrollState.chapterProgress = (scrollState.progress * 8) % 1;
}
