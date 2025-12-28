/**
 * WineCalc PWA Installation Handler
 * Manages service worker registration and app installation prompt
 */

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('✅ Service Worker registered successfully:', registration.scope);

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000); // Check every hour

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available
              showUpdateNotification();
            }
          });
        });
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error);
      });
  });
}

// Handle PWA install prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
  console.log('💾 beforeinstallprompt event fired');

  // Prevent the default prompt
  event.preventDefault();

  // Store the event for later use
  deferredPrompt = event;

  // Show custom install button
  showInstallButton();
});

// Show install button
function showInstallButton() {
  const installButton = document.getElementById('pwa-install-button');

  if (installButton) {
    installButton.style.display = 'block';

    installButton.addEventListener('click', async () => {
      if (!deferredPrompt) return;

      // Show the install prompt
      deferredPrompt.prompt();

      // Wait for user response
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to install prompt: ${outcome}`);

      // Clear the deferred prompt
      deferredPrompt = null;

      // Hide the install button
      installButton.style.display = 'none';
    });
  }
}

// Show update notification
function showUpdateNotification() {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'alert alert-info alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
  notification.style.zIndex = '9999';
  notification.innerHTML = `
    <i class="bi bi-arrow-clockwise me-2"></i>
    <strong>Aggiornamento disponibile!</strong> Una nuova versione di WineCalc è pronta.
    <button type="button" class="btn btn-sm btn-primary ms-3" id="update-app-btn">
      Aggiorna ora
    </button>
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;

  document.body.appendChild(notification);

  // Handle update button
  document.getElementById('update-app-btn')?.addEventListener('click', () => {
    // Tell the service worker to skip waiting
    navigator.serviceWorker.controller?.postMessage({ type: 'SKIP_WAITING' });

    // Reload the page
    window.location.reload();
  });
}

// Detect if running as installed PWA
function isPWA() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
}

// Track PWA usage
window.addEventListener('load', () => {
  if (isPWA()) {
    console.log('📱 Running as installed PWA');

    // Add PWA-specific class to body
    document.body.classList.add('pwa-mode');

    // Track analytics (if you add analytics later)
    // trackEvent('pwa', 'launch');
  }
});

// Handle app installed event
window.addEventListener('appinstalled', (event) => {
  console.log('✅ PWA installed successfully');

  // Hide install button
  const installButton = document.getElementById('pwa-install-button');
  if (installButton) {
    installButton.style.display = 'none';
  }

  // Clear the deferred prompt
  deferredPrompt = null;

  // Track analytics
  // trackEvent('pwa', 'install');
});

// Expose utility functions globally
window.WineCalcPWA = {
  isPWA,
  clearCache: () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
      console.log('🗑️ Cache cleared');
    }
  },
  checkForUpdates: () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          registration.update();
          console.log('🔄 Checking for updates...');
        }
      });
    }
  }
};
