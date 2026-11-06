/**
 * Hospital IT Desk — Reusable Data Table Component
 */

import { escapeHtml } from '../core/formatters.js';

export const dataTable = {
  /**
   * Render a data table HTML string
   * @param {object} options
   * @param {Array<{key: string, label: string, render?: (val: any, row: any) => string, width?: string}>} options.columns
   * @param {any[]} options.data
   * @param {string} [options.emptyText]
   * @returns {string}
   */
  render({ columns, data, emptyText = 'কোনো রেকর্ড পাওয়া যায়নি।' }) {
    if (!data || data.length === 0) {
      return `
        <div class="empty-state py-4 text-center">
          <i class="bi bi-inbox fs-1 text-muted"></i>
          <p class="text-muted mt-2 mb-0">${escapeHtml(emptyText)}</p>
        </div>
      `;
    }

    const headerHtml = columns
      .map((col) => `<th scope="col" ${col.width ? `style="width:${col.width};"` : ''}>${escapeHtml(col.label)}</th>`)
      .join('');

    const rowsHtml = data
      .map((row) => {
        const cellsHtml = columns
          .map((col) => {
            const val = row[col.key];
            const rendered = col.render ? col.render(val, row) : escapeHtml(val !== undefined && val !== null ? val : '—');
            return `<td>${rendered}</td>`;
          })
          .join('');
        return `<tr>${cellsHtml}</tr>`;
      })
      .join('');

    return `
      <div class="table-responsive-custom">
        <table class="table-custom">
          <thead>
            <tr>${headerHtml}</tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
  }
};

