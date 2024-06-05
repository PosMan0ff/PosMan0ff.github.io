document.querySelectorAll('.banner-left, .banner-right').forEach(banner => {
    banner.addEventListener('mouseenter', () => {
      banner.style.transition = 'transform 0.3s ease-in-out';
      banner.style.transform = 'translateX(0)';
    });
  
    banner.addEventListener('mouseleave', () => {
      banner.style.transition = 'transform 0.3s ease-in-out';
      banner.style.transform = 'translateX(100%)';
    });
  });