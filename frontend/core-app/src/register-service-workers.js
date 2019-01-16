if (navigator.serviceWorker) {
  // register teach service worker
  navigator.serviceWorker.register('/static/core/sw.js').then((registration) => {
    // console.log('ServiceWorker registration successful with scope:',  registration.scope);
  }).catch((error) => {
    console.log('ServiceWorker registration failed:', error); // eslint-disable-line no-console
  });
}
