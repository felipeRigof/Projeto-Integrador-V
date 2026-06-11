// ── CARROSSEL ──
function scrollCarousel(btn, dir) {
  const track = btn.closest('.carousel-wrapper').querySelector('.carousel-track');
  track.scrollBy({ left: dir * 440, behavior: 'smooth' });
}

// ── WISHLIST TOGGLE ──
document.querySelectorAll('.wishlist-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    btn.textContent = btn.textContent === '🤍' ? '❤️' : '🤍';
    btn.style.transform = 'scale(1.3)';
    setTimeout(() => btn.style.transform = '', 200);
  });
});
