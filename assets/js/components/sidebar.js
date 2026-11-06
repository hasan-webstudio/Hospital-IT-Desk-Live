/**
 * Hospital IT Desk — Sidebar Component
 * Grouped navigation with real badge counters and demo role aware items.
 */

import { state } from '../core/state.js';
import { t } from '../core/i18n.js';
import { repository } from '../core/repository.js';
import { STORES } from '../data/schema.js';

export const sidebar = {
  /**
   * Render sidebar navigation inside #app-sidebar synchronously
   */
  render() {
    const container = document.getElementById('app-sidebar');
    if (!container) return;

    const currentHash = window.location.hash || '#/dashboard';
    const lang = state.getLanguage();

    container.innerHTML = `
      <div class="sidebar-brand">
        <img src="./assets/images/logo.svg" alt="Hospital IT Desk Logo">
        <div class="sidebar-brand-text">
          <span class="sidebar-brand-title">${t('appName')}</span>
          <span class="sidebar-brand-subtitle">${t('appSubtitle')}</span>
        </div>
      </div>

      <ul class="sidebar-menu">
        <li class="sidebar-header">Core Operations</li>

        <li class="sidebar-item">
          <a class="sidebar-link ${currentHash.startsWith('#/dashboard') ? 'active' : ''}" href="#/dashboard">
            <i class="bi bi-grid-1x2-fill"></i>
            <span>${t('navDashboard')}</span>
          </a>
        </li>

        <li class="sidebar-item">
          <a class="sidebar-link ${currentHash.startsWith('#/tickets') ? 'active' : ''}" href="#/tickets">
            <i class="bi bi-ticket-perforated-fill"></i>
            <span>${t('navTickets')}</span>
            <span id="sidebar-tickets-badge" class="sidebar-badge bg-danger d-none"></span>
          </a>
        </li>

        <li class="sidebar-item">
          <a class="sidebar-link ${currentHash.startsWith('#/assets') ? 'active' : ''}" href="#/assets">
            <i class="bi bi-pc-display-horizontal"></i>
            <span>${t('navAssets')}</span>
          </a>
          <ul class="sidebar-submenu">
            <li><a class="sidebar-sublink" href="#/assets?view=all">${t('navAllAssets')}</a></li>
            <li><a class="sidebar-sublink" href="#/assets?view=computers">${t('navComputers')}</a></li>
            <li><a class="sidebar-sublink" href="#/assets?view=printers">${t('navPrinters')}</a></li>
            <li><a class="sidebar-sublink" href="#/assets?view=transfers">অ্যাসেট স্থানান্তর ইতিহাস</a></li>
          </ul>
        </li>

        <li class="sidebar-header">Infrastructure</li>

        <li class="sidebar-item">
          <a class="sidebar-link ${currentHash.startsWith('#/network') ? 'active' : ''}" href="#/network">
            <i class="bi bi-diagram-3-fill"></i>
            <span>${t('navNetwork')}</span>
          </a>
        </li>

        <li class="sidebar-item">
          <a class="sidebar-link ${currentHash.startsWith('#/cctv') ? 'active' : ''}" href="#/cctv">
            <i class="bi bi-camera-video-fill"></i>
            <span>${t('navCctv')}</span>
          </a>
        </li>

        <li class="sidebar-item">
          <a class="sidebar-link ${currentHash.startsWith('#/software') ? 'active' : ''}" href="#/software">
            <i class="bi bi-window-stack"></i>
            <span>${t('navSoftware')}</span>
          </a>
        </li>

        <li class="sidebar-item">
          <a class="sidebar-link ${currentHash.startsWith('#/backups') ? 'active' : ''}" href="#/backups">
            <i class="bi bi-database-check"></i>
            <span>${t('navBackups')}</span>
          </a>
        </li>

        <li class="sidebar-item">
          <a class="sidebar-link ${currentHash.startsWith('#/maintenance') ? 'active' : ''}" href="#/maintenance">
            <i class="bi bi-calendar-check-fill"></i>
            <span>${t('navMaintenance')}</span>
            <span id="sidebar-maintenance-badge" class="sidebar-badge bg-warning text-dark d-none"></span>
          </a>
        </li>

        <li class="sidebar-header">Organization & Docs</li>

        <li class="sidebar-item">
          <a class="sidebar-link ${currentHash.startsWith('#/staff') ? 'active' : ''}" href="#/staff">
            <i class="bi bi-people-fill"></i>
            <span>${t('navStaff')}</span>
          </a>
        </li>

        <li class="sidebar-item">
          <a class="sidebar-link ${currentHash.startsWith('#/knowledge-base') ? 'active' : ''}" href="#/knowledge-base">
            <i class="bi bi-book-half"></i>
            <span>${t('navKnowledgeBase')}</span>
          </a>
        </li>

        <li class="sidebar-item">
          <a class="sidebar-link ${currentHash.startsWith('#/procurement') ? 'active' : ''}" href="#/procurement">
            <i class="bi bi-receipt-cutoff"></i>
            <span>${t('navProcurement')}</span>
          </a>
        </li>

        <li class="sidebar-header">Analytics & System</li>

        <li class="sidebar-item">
          <a class="sidebar-link ${currentHash.startsWith('#/reports') ? 'active' : ''}" href="#/reports">
            <i class="bi bi-file-earmark-bar-graph-fill"></i>
            <span>${t('navReports')}</span>
          </a>
        </li>

        <li class="sidebar-item">
          <a class="sidebar-link ${currentHash.startsWith('#/notifications') ? 'active' : ''}" href="#/notifications">
            <i class="bi bi-bell-fill"></i>
            <span>${t('navNotifications')}</span>
          </a>
        </li>

        <li class="sidebar-item">
          <a class="sidebar-link ${currentHash.startsWith('#/settings') ? 'active' : ''}" href="#/settings">
            <i class="bi bi-gear-fill"></i>
            <span>${t('navSettings')}</span>
          </a>
        </li>
      </ul>

      <div class="sidebar-footer">
        <div class="d-flex align-items-center justify-content-between mb-1">
          <span class="badge bg-secondary">Static v3.0</span>
          <span class="text-white-50"><i class="bi bi-shield-lock"></i> Client-Side</span>
        </div>
        <div>Dhaka Central Hospital IT</div>
      </div>
    `;

    // Close sidebar on mobile when link is clicked
    container.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        container.classList.remove('show');
        const backdrop = document.querySelector('.sidebar-backdrop');
        if (backdrop) backdrop.classList.remove('show');
      });
    });

    // Update dynamic badges in background
    this.updateBadges();
  },

  /**
   * Asynchronously update ticket and maintenance badge counts
   */
  async updateBadges() {
    try {
      const ticketBadge = document.getElementById('sidebar-tickets-badge');
      const maintBadge = document.getElementById('sidebar-maintenance-badge');

      const tickets = await repository.getAll(STORES.TICKETS);
      const openTicketsCount = (tickets || []).filter((t) => ['New', 'Assigned', 'In Progress'].includes(t.status)).length;
      if (ticketBadge) {
        if (openTicketsCount > 0) {
          ticketBadge.textContent = openTicketsCount;
          ticketBadge.classList.remove('d-none');
        } else {
          ticketBadge.classList.add('d-none');
        }
      }

      const tasks = await repository.getAll(STORES.MAINTENANCE_TASKS);
      const pendingCount = (tasks || []).filter((m) => m.status !== 'Completed').length;
      if (maintBadge) {
        if (pendingCount > 0) {
          maintBadge.textContent = pendingCount;
          maintBadge.classList.remove('d-none');
        } else {
          maintBadge.classList.add('d-none');
        }
      }
    } catch (e) {
      console.warn('Non-fatal: could not fetch sidebar badge counters:', e);
    }
  }
};

