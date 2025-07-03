 window.addEventListener('load', () => {
      const splash = document.getElementById('splash');
      const login = document.getElementById('login');

      splash.addEventListener('click', () => {
        const docEl = document.documentElement;
        if (docEl.requestFullscreen) {
          docEl.requestFullscreen().catch(() => {});
        }
      }, { once: true });
      setTimeout(() => {
        splash.classList.add('fade-out');
        setTimeout(() => {
          splash.style.display = 'none';
          login.style.display = 'flex';
          login.classList.add('fade-in');
        }, 1000);
      }, 3000);
    });