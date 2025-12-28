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

  // Check if dismiss preference has expired
  checkDismissExpiry();

  // Show custom install banner
  showInstallButton();
});

// Show install banner
function showInstallButton() {
  // Check if user previously dismissed the banner
  const dismissed = localStorage.getItem('pwa-install-dismissed');
  if (dismissed === 'true') {
    return;
  }

  const installBanner = document.getElementById('pwa-install-banner');
  const installButton = document.getElementById('pwa-install-button');
  const dismissButton = document.getElementById('pwa-install-dismiss');

  if (installBanner && installButton) {
    // Show the banner with animation
    installBanner.classList.add('show');

    // Handle install button click
    installButton.addEventListener('click', async () => {
      if (!deferredPrompt) return;

      // Show the install prompt
      deferredPrompt.prompt();

      // Wait for user response
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to install prompt: ${outcome}`);

      // Clear the deferred prompt
      deferredPrompt = null;

      // Hide the banner
      installBanner.classList.remove('show');
    });

    // Handle dismiss button click
    if (dismissButton) {
      dismissButton.addEventListener('click', () => {
        // Hide the banner
        installBanner.classList.remove('show');

        // Remember user preference for 7 days
        localStorage.setItem('pwa-install-dismissed', 'true');
        localStorage.setItem('pwa-install-dismissed-date', new Date().toISOString());
      });
    }
  }
}

// Check if dismiss preference has expired (7 days)
function checkDismissExpiry() {
  const dismissDate = localStorage.getItem('pwa-install-dismissed-date');
  if (dismissDate) {
    const daysSinceDismiss = (new Date() - new Date(dismissDate)) / (1000 * 60 * 60 * 24);
    if (daysSinceDismiss > 7) {
      localStorage.removeItem('pwa-install-dismissed');
      localStorage.removeItem('pwa-install-dismissed-date');
    }
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

  // Hide install banner
  const installBanner = document.getElementById('pwa-install-banner');
  if (installBanner) {
    installBanner.classList.remove('show');
  }

  // Clear the deferred prompt
  deferredPrompt = null;

  // Clear dismiss preference
  localStorage.removeItem('pwa-install-dismissed');
  localStorage.removeItem('pwa-install-dismissed-date');

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
