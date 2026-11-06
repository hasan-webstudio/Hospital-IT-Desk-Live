/**
 * Hospital IT Desk — Topbar Navigation Component
 */

import { state } from '../core/state.js';
import { t } from '../core/i18n.js';
import { notifications } from '../core/notifications.js';
import { modal } from './modal.js';
import { repository } from '../core/repository.js';

export const topbar = {
  render() {
    const container = document.getElementById('app-topbar');
    if (!container) return;

    const currentLang = state.getLanguage();
    const currentTheme = state.getTheme();
    const activeRole = state.getActiveRole();

    // Map role code to display title
    const roleLabels = {
      SUPER_ADMIN: { bn: 'সুপার অ্যাডমিন', en: 'Super Admin', color: 'bg-primary' },
      IT_OFFICER: { bn: 'আইটি অফিসার', en: 'IT Officer', color: 'bg-success' },
      IT_ASSISTANT: { bn: 'আইটি সহকারী', en: 'IT Assistant', color: 'bg-info text-dark' },
      DEPT_HEAD: { bn: 'বিভাগীয় প্রধান', en: 'Dept Head', color: 'bg-warning text-dark' },
      HOSP_STAFF: { bn: 'হাসপাতাল স্টাফ', en: 'Staff', color: 'bg-secondary' },
      MANAGEMENT: { bn: 'ম্যানেজমেন্ট', en: 'Management', color: 'bg-dark' }
    };

    const roleInfo = roleLabels[activeRole] || roleLabels.IT_OFFICER;
    const roleName = currentLang === 'en' ? roleInfo.en : roleInfo.bn;

    container.innerHTML = `
      <div class="topbar-left">
        <button type="button" class="btn-sidebar-toggle" id="btn-toggle-sidebar" aria-label="Toggle Sidebar Navigation">
          <i class="bi bi-list fs-5"></i>
        </button>

        <div class="storage-badge" title="ডেটা শুধুমাত্র আপনার বর্তমান ব্রাউজারের IndexedDB তে সংরক্ষিত">
          <span class="storage-indicator"></span>
          <span>${t('savedInBrowser')}</span>
        </div>
      </div>

      <div class="topbar-right">
        <!-- Demo Role Switcher Pill -->
        <button type="button" class="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1" id="btn-switch-role" title="ডেমো রোল পরিবর্তন করুন">
          <i class="bi bi-person-badge"></i>
          <span class="badge ${roleInfo.color}">${roleName}</span>
          <i class="bi bi-chevron-down small"></i>
        </button>

        <!-- Notification Bell -->
        <a href="#/notifications" class="btn btn-sm btn-light position-relative" title="নোটিফিকেশন সেন্টার" aria-label="Notifications">
          <i class="bi bi-bell fs-6"></i>
          <span id="topbar-bell-badge" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger d-none"></span>
        </a>

        <!-- Language Switcher -->
        <button type="button" class="btn btn-sm btn-outline-primary fw-bold" id="btn-toggle-lang" title="Switch Language / ভাষা পরিবর্তন">
          ${currentLang === 'bn' ? 'English' : 'বাংলা'}
        </button>

        <!-- Theme Toggle -->
        <button type="button" class="btn btn-sm btn-light text-muted" id="btn-toggle-theme" title="Toggle Theme" aria-label="Toggle Theme">
          <i class="bi ${currentTheme === 'dark' ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill'}"></i>
        </button>
      </div>
    `;

    // Attach event listeners
    const sidebarToggle = container.querySelector('#btn-toggle-sidebar');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => {
        const sidebarEl = document.getElementById('app-sidebar');
        const backdrop = document.querySelector('.sidebar-backdrop');
        if (sidebarEl) sidebarEl.classList.toggle('show');
        if (backdrop) backdrop.classList.toggle('show');
      });
    }

    const langToggle = container.querySelector('#btn-toggle-lang');
    if (langToggle) {
      langToggle.addEventListener('click', () => {
        const newLang = currentLang === 'bn' ? 'en' : 'bn';
        state.setLanguage(newLang);
      });
    }

    const themeToggle = container.querySelector('#btn-toggle-theme');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        state.setTheme(newTheme);
      });
    }

    const roleBtn = container.querySelector('#btn-switch-role');
    if (roleBtn) {
      roleBtn.addEventListener('click', () => this.showRoleSwitcherModal());
    }

    // Asynchronously fetch active reminder badge in background
    this.updateReminderBadge();
  },

  async updateReminderBadge() {
    try {
      const badge = document.getElementById('topbar-bell-badge');
      if (!badge) return;
      const activeReminders = await notifications.getActiveReminders();
      const count = (activeReminders || []).length;
      if (count > 0) {
        badge.textContent = count;
        badge.classList.remove('d-none');
      } else {
        badge.classList.add('d-none');
      }
    } catch (e) {
      console.warn('Non-fatal: could not update topbar reminder badge:', e);
    }
  },

  showRoleSwitcherModal() {
    const roles = [
      { code: 'SUPER_ADMIN', name: 'সুপার অ্যাডমিন (Super Admin)', desc: 'সম্পূর্ণ সিস্টেম কনফিগারেশন, সব ডেটা এডিট ও সেটিংস পরিচালনা।' },
      { code: 'IT_OFFICER', name: 'আইটি অফিসার (IT Officer - Recommended)', desc: 'দৈনন্দিন আইটি অপারেশন, টিকিট সমাধান, অ্যাসেট, ব্যাকআপ ও রিপোর্ট।' },
      { code: 'IT_ASSISTANT', name: 'আইটি সহকারী (IT Assistant)', desc: 'এসাইনকৃত টিকিট সম্পাদন, মেইনটেন্যান্স চেকলিস্ট ও অ্যাসেট ভিউ।' },
      { code: 'DEPT_HEAD', name: 'বিভাগীয় প্রধান (Department Head)', desc: 'বিভাগের টিকিট পর্যবেক্ষণ, পারচেজ রিকোয়েস্ট তৈরি ও অনুমোদন।' },
      { code: 'HOSP_STAFF', name: 'সাধারণ হাসপাতাল স্টাফ (Staff)', desc: 'নতুন সমস্যার অভিযোগ/টিকিট তৈরি ও সমাধান দেখা।' },
      { code: 'MANAGEMENT', name: 'ম্যানেজমেন্ট ভিউয়ার (Management)', desc: 'ড্যাশবোর্ড, খরচ ও কার্যনির্বাহী সারসংক্ষেপ রিড-অনলি ভিউ।' }
    ];

    const currentRole = state.getActiveRole();

    const bodyHtml = `
      <div class="alert alert-info py-2 small mb-3">
        <i class="bi bi-info-circle me-1"></i>
        <strong>সতর্কতা:</strong> এটি ফ্রন্টএন্ড ডেমো রোল প্রিভিউ। এটি কোনো সার্ভার সিকিউরিটি বা পাসওয়ার্ড অথেনটিকেশন নয়।
      </div>
      <div class="list-group">
        ${roles.map((r) => `
          <button type="button" class="list-group-item list-group-item-action ${r.code === currentRole ? 'active' : ''} role-option-btn" data-role="${r.code}">
            <div class="d-flex w-100 justify-content-between align-items-center">
              <h6 class="mb-1">${r.name}</h6>
              ${r.code === currentRole ? '<i class="bi bi-check-circle-fill"></i>' : ''}
            </div>
            <p class="mb-1 small opacity-75">${r.desc}</p>
          </button>
        `).join('')}
      </div>
    `;

    modal.show({
      title: 'ডেমো ইউজার রোল পরিবর্তন করুন',
      body: bodyHtml,
      size: 'md',
      showConfirm: false
    });

    const optionBtns = document.querySelectorAll('.role-option-btn');
    optionBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const selectedRole = btn.getAttribute('data-role');
        state.setActiveRole(selectedRole);
        modal.hide();
        notifications.showToast('রোল পরিবর্তিত হয়েছে', `সফলভাবে ${selectedRole} মোডে সুইচ করা হয়েছে।`, 'info');
      });
    });
  }
};

