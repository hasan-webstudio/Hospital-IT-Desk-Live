/**
 * Hospital IT Desk — Formatters & Helper Utilities
 * Date (Asia/Dhaka), Currency (BDT), Status Badges, and Code Sequences.
 */

import { t } from './i18n.js';

/**
 * Format ISO date string to Asia/Dhaka localized date
 * @param {string|Date} dateStr
 * @param {boolean} includeTime
 * @returns {string}
 */
export function formatDate(dateStr, includeTime = false) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';

    const options = {
      timeZone: 'Asia/Dhaka',
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    };

    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
      options.hour12 = true;
    }

    return new Intl.DateTimeFormat('en-GB', options).format(d);
  } catch (e) {
    return String(dateStr);
  }
}

/**
 * Format currency to Bangladeshi Taka (৳)
 * @param {number|string} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  const num = Number(amount);
  if (isNaN(num)) return '৳ 0';
  return '৳ ' + num.toLocaleString('en-IN');
}

/**
 * Format file size in KB, MB, GB
 * @param {number} bytes
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Render a styled status badge
 * @param {string} status
 * @returns {string}
 */
export function renderStatusBadge(status) {
  if (!status) return '—';
  const s = String(status).trim();
  let badgeClass = 'badge-secondary';
  let labelKey = 'status' + s.replace(/[\s/_-]+/g, '');

  switch (s.toLowerCase()) {
    case 'new':
      badgeClass = 'badge-new';
      labelKey = 'statusNew';
      break;
    case 'in progress':
      badgeClass = 'badge-in-progress';
      labelKey = 'statusInProgress';
      break;
    case 'assigned':
      badgeClass = 'badge-new';
      labelKey = 'statusAssigned';
      break;
    case 'resolved':
      badgeClass = 'badge-resolved';
      labelKey = 'statusResolved';
      break;
    case 'closed':
      badgeClass = 'badge-closed';
      labelKey = 'statusClosed';
      break;
    case 'critical':
    case 'failed':
      badgeClass = 'badge-critical';
      break;
    case 'active':
    case 'successful':
    case 'verified':
    case 'completed':
    case 'approved':
      badgeClass = 'badge-resolved';
      break;
    case 'pending verification':
    case 'due':
    case 'overdue':
    case 'waiting for user':
    case 'waiting for vendor':
      badgeClass = 'badge-in-progress';
      break;
    case 'retired':
    case 'inactive':
    case 'cancelled':
      badgeClass = 'badge-secondary';
      break;
  }

  const label = t(labelKey) !== labelKey ? t(labelKey) : s;
  return `<span class="badge-status ${badgeClass}"><span class="badge-dot"></span> ${escapeHtml(label)}</span>`;
}

/**
 * Render a priority badge
 * @param {string} priority
 * @returns {string}
 */
export function renderPriorityBadge(priority) {
  if (!priority) return '—';
  const p = String(priority).toLowerCase();
  let badgeClass = 'badge-secondary';
  let labelKey = 'priorityMedium';

  if (p === 'critical') {
    badgeClass = 'badge-critical';
    labelKey = 'priorityCritical';
  } else if (p === 'high') {
    badgeClass = 'badge-in-progress';
    labelKey = 'priorityHigh';
  } else if (p === 'low') {
    badgeClass = 'badge-secondary';
    labelKey = 'priorityLow';
  } else {
    badgeClass = 'badge-new';
    labelKey = 'priorityMedium';
  }

  return `<span class="badge-status ${badgeClass}"><span class="badge-dot"></span> ${escapeHtml(t(labelKey))}</span>`;
}

/**
 * Safe HTML escaping
 * @param {string} text
 * @returns {string}
 */
export function escapeHtml(text) {
  if (text === null || text === undefined) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generate collision-checked sequential code, e.g. TKT-2026-0005
 * @param {string} prefix e.g. 'TKT-2026-'
 * @param {any[]} existingList
 * @param {string} codeField e.g. 'ticketNumber'
 * @returns {string}
 */
export function generateSequentialCode(prefix, existingList, codeField) {
  let maxSeq = 0;
  if (Array.isArray(existingList)) {
    existingList.forEach((item) => {
      const code = item[codeField];
      if (code && typeof code === 'string' && code.startsWith(prefix)) {
        const numPart = parseInt(code.replace(prefix, ''), 10);
        if (!isNaN(numPart) && numPart > maxSeq) {
          maxSeq = numPart;
        }
      }
    });
  }
  const nextSeq = maxSeq + 1;
  return `${prefix}${String(nextSeq).padStart(4, '0')}`;
}

