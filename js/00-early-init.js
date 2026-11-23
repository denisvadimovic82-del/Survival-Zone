try {
    if (sessionStorage.getItem('zona_start_loading') === '1') {
      document.documentElement.classList.add('zona-starting');
    }
  } catch (e) {}
