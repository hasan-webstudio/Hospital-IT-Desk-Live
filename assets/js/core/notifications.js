/**
 * Hospital IT Desk — Notification & Reminder Engine
 * In-app notifications dynamically generated from current local storage data.
 */

import { repository } from './repository.js';
import { STORES } from '../data/schema.js';

export const notifications = {
  /**
   * Calculate pending local reminders based on actual IndexedDB records
   * @returns {Promise<any[]>}
   */
  async getActiveReminders() {
    const reminders = [];
    const now = new Date();

    // 1. Critical & High open tickets
    const tickets = await repository.getAll(STORES.TICKETS);
    tickets.forEach((t) => {
      if (['New', 'Assigned', 'In Progress'].includes(t.status)) {
        if (t.priority === 'Critical') {
          reminders.push({
            id: `rem-tkt-${t.id}`,
            type: 'critical-ticket',
            title: `জরুরি টিকিট: ${t.ticketNumber}`,
            message: `${t.title} (${t.priority} অগ্রাধিকার)`,
            link: `#/tickets`,
            date: t.createdAt,
            level: 'danger'
          });
        }
      }
    });

    // 2. Overdue or due maintenance tasks
    const tasks = await repository.getAll(STORES.MAINTENANCE_TASKS);
    tasks.forEach((m) => {
      if (m.status !== 'Completed' && m.dueDate) {
        const dueDate = new Date(m.dueDate);
        const isOverdue = dueDate < now;
        if (isOverdue || m.status === 'Overdue') {
          reminders.push({
            id: `rem-mnt-${m.id}`,
            type: 'overdue-maintenance',
            title: `বিলম্বিত রক্ষণাবেক্ষণ কাজ: ${m.taskCode}`,
            message: `${m.title} (তারিখ ছিল: ${m.dueDate})`,
            link: `#/maintenance`,
            date: m.dueDate,
            level: 'warning'
          });
        }
      }
    });

    // 3. Failed or unverified backups
    const backups = await repository.getAll(STORES.BACKUP_LOGS);
    backups.forEach((b) => {
      if (b.result === 'Failed' || b.verificationStatus === 'Pending Verification') {
        reminders.push({
          id: `rem-bkp-${b.id}`,
          type: 'backup-issue',
          title: `ব্যাকআপ সতর্কতা: ${b.sourceName}`,
          message: `ফলাফল: ${b.result}, অবস্থা: ${b.verificationStatus}`,
          link: `#/backups`,
          date: b.scheduledDate,
          level: b.result === 'Failed' ? 'danger' : 'warning'
        });
      }
    });

    // 4. Software license expiry within 30 days
    const softwareList = await repository.getAll(STORES.SOFTWARE_PRODUCTS);
    softwareList.forEach((s) => {
      if (s.expiryDate) {
        const exp = new Date(s.expiryDate);
        const diffDays = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
        if (diffDays <= 30 && diffDays >= 0) {
          reminders.push({
            id: `rem-soft-${s.id}`,
            type: 'license-expiry',
            title: `সফটওয়্যার রিনিউয়াল সতর্কতা: ${s.name}`,
            message: `মেয়াদ শেষ হতে আর ${diffDays} দিন বাকি (তারিখ: ${s.expiryDate})`,
            link: `#/software`,
            date: s.expiryDate,
            level: 'warning'
          });
        }
      }
    });

    return reminders;
  },

  /**
   * Show a temporary floating toast
   * @param {string} title
   * @param {string} message
   * @param {'success'|'danger'|'warning'|'info'} type
   */
  showToast(title, message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-custom';

    let iconClass = 'bi-check-circle-fill text-success';
    if (type === 'danger') iconClass = 'bi-exclamation-triangle-fill text-danger';
    if (type === 'warning') iconClass = 'bi-exclamation-circle-fill text-warning';
    if (type === 'info') iconClass = 'bi-info-circle-fill text-primary';

    toast.innerHTML = `
      <i class="bi ${iconClass} toast-icon"></i>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close">&times;</button>
    `;

    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    });

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      if (toast.parentElement) {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }
    }, 4500);
  }
};

