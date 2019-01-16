if (navigator.serviceWorker) {

  // register teach service worker
  navigator.serviceWorker.register('/static/public/sw.js').then(function (registration) {
    // console.log('ServiceWorker registration successful with scope:',  registration.scope);
  }).catch(function (error) {
    console.log('ServiceWorker registration failed:', error);
  });

}
