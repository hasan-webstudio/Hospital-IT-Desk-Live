/**
 * Hospital IT Desk — Main Application Bootstrap
 * Static Single Page Application (SPA) with IndexedDB & Vanilla JavaScript ES Modules.
 */

import { repository } from './core/repository.js';
import { router } from './core/router.js';
import { state } from './core/state.js';
import { storage } from './core/storage.js';
import { sidebar } from './components/sidebar.js';
import { topbar } from './components/topbar.js';
import { modal } from './components/modal.js';

// Module Imports
import { dashboardModule } from './modules/dashboard/index.js';
import { ticketsModule } from './modules/tickets/index.js';
import { assetsModule } from './modules/assets/index.js';
import { networkModule } from './modules/network/index.js';
import { cctvModule } from './modules/cctv/index.js';
import { softwareModule } from './modules/software/index.js';
import { backupsModule } from './modules/backups/index.js';
import { maintenanceModule } from './modules/maintenance/index.js';
import { staffModule } from './modules/staff/index.js';
import { knowledgeBaseModule } from './modules/knowledge-base/index.js';
import { procurementModule } from './modules/procurement/index.js';
import { reportsModule } from './modules/reports/index.js';
import { notificationsModule } from './modules/notifications/index.js';
import { settingsModule } from './modules/settings/index.js';

async function bootstrap() {
  try {
    // 1. Immediately apply theme attribute
    document.documentElement.setAttribute('data-theme', state.getTheme());

    // 2. Render shared shell components immediately (synchronous HTML shell)
    topbar.render();
    sidebar.render();

    // 3. Register all 14 module routes
    router.register('#/dashboard', () => dashboardModule.render());
    router.register('#/tickets', () => ticketsModule.render());
    router.register('#/assets', (ctx) => assetsModule.render(ctx));
    router.register('#/network', () => networkModule.render());
    router.register('#/cctv', () => cctvModule.render());
    router.register('#/software', () => softwareModule.render());
    router.register('#/backups', () => backupsModule.render());
    router.register('#/maintenance', () => maintenanceModule.render());
    router.register('#/staff', () => staffModule.render());
    router.register('#/knowledge-base', () => knowledgeBaseModule.render());
    router.register('#/procurement', () => procurementModule.render());
    router.register('#/reports', () => reportsModule.render());
    router.register('#/notifications', () => notificationsModule.render());
    router.register('#/settings', () => settingsModule.render());

    // 4. Subscribe to reactive state changes
    state.subscribe('languageChanged', () => {
      topbar.render();
      sidebar.render();
      router.handleRoute(); // Re-render active view in new language
    });

    state.subscribe('themeChanged', () => {
      topbar.render();
    });

    state.subscribe('roleChanged', () => {
      topbar.render();
      sidebar.render();
      router.handleRoute();
    });

    state.subscribe('routeChanged', () => {
      sidebar.render(); // Update active link highlighting
    });

    // 5. Initialize IndexedDB & seed demo data if first run (with non-blocking safety)
    try {
      await repository.initDatabaseWithDemoData(false);
    } catch (dbErr) {
      console.warn('Database initialization warning (operating with demo fallback):', dbErr);
    }

    // 6. Update badge counters asynchronously now that DB is ready
    sidebar.updateBadges();
    topbar.updateReminderBadge();

    // 7. Start router to render initial page (e.g. Dashboard)
    router.init();

    // 8. Mark application as successfully initialized and clear watchdog
    window.__HITD_BOOTSTRAP_COMPLETE__ = true;
    if (window.__HITD_WATCHDOG_TIMEOUT__) {
      clearTimeout(window.__HITD_WATCHDOG_TIMEOUT__);
    }

    // 9. First run onboarding modal if not dismissed
    if (!storage.isOnboardingDismissed()) {
      showFirstRunOnboarding();
    }
  } catch (err) {
    console.error('Fatal initialization error:', err);
    window.__HITD_BOOTSTRAP_ERROR__ = err;
    if (window.__HITD_WATCHDOG_TIMEOUT__) {
      clearTimeout(window.__HITD_WATCHDOG_TIMEOUT__);
    }

    const contentArea = document.getElementById('content-area');
    if (contentArea) {
      contentArea.innerHTML = `
        <div class="container-fluid py-4">
          <div class="alert alert-danger p-4 m-4 shadow-sm border-0 rounded-3">
            <h4 class="fw-bold mb-2"><i class="bi bi-exclamation-triangle-fill me-2"></i> সিস্টেম শুরু হতে ত্রুটি ঘটেছে</h4>
            <p class="mb-2">অ্যাপ্লিকেশন ইনিশিয়ালাইজেশনের সময় অপ্রত্যাশিত ত্রুটি দেখা দিয়েছে:</p>
            <pre class="bg-dark text-white p-3 rounded small mb-3 overflow-auto">${err.stack || err.message || err}</pre>
            <div class="d-flex gap-2">
              <button class="btn btn-primary btn-sm" onclick="window.location.reload()">
                <i class="bi bi-arrow-clockwise me-1"></i> পুনরায় চেষ্টা করুন
              </button>
              <button class="btn btn-outline-danger btn-sm" onclick="if(confirm('ডেটাবেজ রিসেট করতে চান?')){ indexedDB.deleteDatabase('HospitalITDeskDB'); window.location.reload(); }">
                <i class="bi bi-trash3 me-1"></i> ডেটাবেজ রিসেট
              </button>
            </div>
          </div>
        </div>
      `;
    }
  }
}

function showFirstRunOnboarding() {
  const onboardingHtml = `
    <div>
      <div class="text-center mb-3">
        <img src="./assets/images/logo.svg" width="56" height="56" alt="Hospital IT Desk Logo">
        <h5 class="fw-bold text-navy mt-2 mb-1">স্বাগতম! Hospital IT Desk পোর্টালে</h5>
        <div class="small text-muted">Hospital IT Management & Support Portal (Static v3.0)</div>
      </div>

      <div class="p-3 bg-light rounded border mb-3 small">
        <h6 class="fw-bold text-primary mb-2"><i class="bi bi-info-circle-fill me-1"></i> গুরুত্বপূর্ণ নির্দেশিকা ও নীতিমালা:</h6>
        <ul class="mb-0 ps-3">
          <li class="mb-1">এই অ্যাপ্লিকেশনটি <strong>১০০% ফ্রন্টএন্ড স্ট্যাটিক আর্কিটেকচারে</strong> নির্মিত এবং গিটহাব পেজেস (GitHub Pages)-এ হোস্টিংযোগ্য। কোনো পিএইচপি, মাইএসকিউএল বা ব্যাকএন্ড সার্ভার প্রয়োজন নেই।</li>
          <li class="mb-1">সকল টিকিট, অ্যাসেট, আইপি ও ব্যাকআপ রেকর্ড আপনার ব্রাউজারের <strong>IndexedDB</strong>-তে সংরক্ষিত হয়।</li>
          <li class="mb-1"><strong>ডেটা সুরক্ষার জন্য:</strong> ব্রাউজার ক্যাশ ক্লিয়ার করার আগে <strong>Settings</strong> থেকে সম্পূর্ণ ডেটাবেজের JSON ব্যাকআপ ডাউনলোড করে রাখা বাঞ্ছনীয়।</li>
          <li>হাসপাতালের গোপনীয়তা রক্ষায় কোনো আসল রোগীর তথ্য বা পাসওয়ার্ড এখানে প্রবেশ করাবেন না।</li>
        </ul>
      </div>

      <div class="d-flex justify-content-between align-items-center">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="check-dismiss-onboarding" checked>
          <label class="form-check-label small" for="check-dismiss-onboarding">পরবর্তীতে আর দেখাবেন না</label>
        </div>
        <button type="button" class="btn btn-primary btn-sm" id="btn-start-exploring">
          পোর্টালে প্রবেশ করুন <i class="bi bi-arrow-right"></i>
        </button>
      </div>
    </div>
  `;

  modal.show({
    title: '<i class="bi bi-hospital text-primary"></i> সিস্টেম পরিচিতি ও নির্দেশিকা',
    body: onboardingHtml,
    size: 'md',
    showConfirm: false,
    cancelText: 'বন্ধ করুন'
  });

  const startBtn = document.getElementById('btn-start-exploring');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      const checkbox = document.getElementById('check-dismiss-onboarding');
      if (checkbox && checkbox.checked) {
        storage.setOnboardingDismissed(true);
      }
      modal.hide();
    });
  }
}

// Start application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}

