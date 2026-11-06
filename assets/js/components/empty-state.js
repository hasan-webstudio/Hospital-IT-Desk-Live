/**
 * Hospital IT Desk — Reusable Empty State Component
 */

import { escapeHtml } from '../core/formatters.js';

export const emptyState = {
  render({
    icon = 'bi-inbox',
    title = 'কোনো তথ্য নেই',
    description = 'বর্তমানে প্রদর্শনের জন্য কোনো রেকর্ড সংরক্ষিত নেই।',
    actionButtonText = '',
    actionButtonId = ''
  }) {
    return `
      <div class="empty-state">
        <div class="empty-state-icon">
          <i class="bi ${escapeHtml(icon)}"></i>
        </div>
        <h5 class="empty-state-title">${escapeHtml(title)}</h5>
        <p class="empty-state-desc">${escapeHtml(description)}</p>
        ${
          actionButtonText && actionButtonId
            ? `<button type="button" class="btn btn-primary btn-sm" id="${escapeHtml(actionButtonId)}">
                <i class="bi bi-plus-lg me-1"></i> ${escapeHtml(actionButtonText)}
              </button>`
            : ''
        }
      </div>
    `;
  }
};

