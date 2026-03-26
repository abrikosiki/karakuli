/**
 * Global Scripts for Karakuli
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('is-active');
      const isExpanded = mobileMenu.classList.contains('is-active');
      hamburger.innerHTML = isExpanded ? '✕' : '☰';
    });
  }

  // FAQ Accordion Logic
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        // Close others
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('is-open');
          }
        });
        // Toggle current
        item.classList.toggle('is-open');
      });
    }
  });

  // Home: weekly classes horizontal carousel — progress bar (mobile)
  const weeklyCarousel = document.getElementById('weekly-classes-carousel');
  const weeklyFill = document.getElementById('weekly-scroll-progress-fill');
  if (weeklyCarousel && weeklyFill) {
    const mq = window.matchMedia('(max-width: 767px)');
    const updateWeeklyCarouselProgress = () => {
      if (!mq.matches) return;
      const el = weeklyCarousel;
      const denom = el.scrollWidth - el.clientWidth;
      if (denom <= 0) {
        weeklyFill.style.width = '100%';
        return;
      }
      const viewed = (el.scrollLeft + el.clientWidth) / el.scrollWidth;
      const pct = Math.min(100, Math.max(0, viewed * 100));
      weeklyFill.style.width = `${pct}%`;
    };
    weeklyCarousel.addEventListener('scroll', updateWeeklyCarouselProgress, { passive: true });
    window.addEventListener('resize', updateWeeklyCarouselProgress);
    mq.addEventListener('change', updateWeeklyCarouselProgress);
    updateWeeklyCarouselProgress();
  }
});
