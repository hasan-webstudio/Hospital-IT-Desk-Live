/**
 * Hospital IT Desk — Module 13: Local Notifications & Reminders
 * In-app alert center dynamically calculated from local operational data.
 */

import { notifications } from '../../core/notifications.js';
import { t } from '../../core/i18n.js';
import { formatDate, escapeHtml } from '../../core/formatters.js';

let reminders = [];

export const notificationsModule = {
  async render() {
    const contentArea = document.getElementById('content-area');
    if (!contentArea) return;

    reminders = await notifications.getActiveReminders();

    contentArea.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title"><i class="bi bi-bell-fill text-primary"></i> ${t('navNotifications')}</h1>
          <p class="page-subtitle">জরুরি টিকিট, মেয়াদোত্তীর্ণ লাইসেন্স, ব্যাকআপ সতর্কতা ও রক্ষণাবেক্ষণ রিমাইন্ডার</p>
        </div>
        <div class="action-buttons">
          <button type="button" class="btn btn-outline-secondary btn-sm" id="btn-refresh-notifications">
            <i class="bi bi-arrow-clockwise me-1"></i> রিফ্রেশ
          </button>
        </div>
      </div>

      <!-- Scope Notice -->
      <div class="alert alert-light border py-2 small mb-4">
        <i class="bi bi-info-circle me-1"></i>
        <strong>ইন-অ্যাপ রিমাইন্ডার নীতিমালা:</strong> এই সতর্কতাগুলো ব্রাউজারে সংরক্ষিত লোকাল ডাটার তারিখের ওপর ভিত্তি করে ডাইনামিক্যালি প্রস্তুত করা হয়েছে। ব্যাকএন্ড ছাড়া কোনো রিয়েল এসএমএস বা ইমেইল পাঠানোর দাবি করা হয় না।
      </div>

      <!-- Notifications List Card -->
      <div class="card-custom">
        <div class="card-custom-header">
          <h5 class="card-custom-title">
            <i class="bi bi-list-stars text-navy"></i> সক্রিয় নোটিফিকেশন ও সতর্কবার্তা (${reminders.length})
          </h5>
        </div>
        <div class="card-custom-body p-0">
          <div class="list-group list-group-flush" id="notifications-list-group">
            ${
              reminders.map((r) => {
                let iconClass = 'bi-exclamation-circle-fill text-warning';
                if (r.level === 'danger') iconClass = 'bi-exclamation-triangle-fill text-danger';
                if (r.level === 'info') iconClass = 'bi-info-circle-fill text-primary';

                return `
                  <div class="list-group-item d-flex justify-content-between align-items-center py-3">
                    <div class="d-flex align-items-start gap-3">
                      <i class="bi ${iconClass} fs-4 mt-1"></i>
                      <div>
                        <h6 class="mb-1 fw-bold text-main">${escapeHtml(r.title)}</h6>
                        <p class="mb-1 small text-muted">${escapeHtml(r.message)}</p>
                        <small class="text-secondary"><i class="bi bi-calendar me-1"></i>${formatDate(r.date, true)}</small>
                      </div>
                    </div>
                    <div>
                      <a href="${escapeHtml(r.link)}" class="btn btn-sm btn-outline-primary">
                        পদক্ষেপ নিন <i class="bi bi-arrow-right"></i>
                      </a>
                    </div>
                  </div>
                `;
              }).join('') || `
                <div class="empty-state py-5 text-center">
                  <i class="bi bi-bell-slash fs-1 text-muted"></i>
                  <h6 class="mt-2 text-muted">বর্তমানে কোনো নতুন সতর্কবার্তা বা রিমাইন্ডার নেই</h6>
                  <p class="small text-muted mb-0">সকল সিস্টেম ও ব্যাকআপ স্বাভাবিক অবস্থায় রয়েছে।</p>
                </div>
              `
            }
          </div>
        </div>
      </div>
    `;

    const refreshBtn = document.getElementById('btn-refresh-notifications');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.render());
    }
  }
};

