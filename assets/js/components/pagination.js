/**
 * Hospital IT Desk — Reusable Pagination Component
 */

export const pagination = {
  /**
   * Render pagination controls
   * @param {object} params
   * @param {number} params.currentPage
   * @param {number} params.totalItems
   * @param {number} params.pageSize
   * @param {string} params.containerId
   * @param {(page: number) => void} params.onPageChange
   */
  render({ currentPage, totalItems, pageSize, containerId, onPageChange }) {
    const totalPages = Math.ceil(totalItems / pageSize) || 1;
    const container = document.getElementById(containerId);
    if (!container) return;

    if (totalItems <= pageSize) {
      container.innerHTML = `
        <div class="d-flex justify-content-between align-items-center w-100 py-2 small text-muted">
          <span>মোট রেকর্ড: <strong>${totalItems}</strong></span>
          <span>পৃষ্ঠা 1 এর 1</span>
        </div>
      `;
      return;
    }

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    let pageBtns = '';
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pageBtns += `
          <button type="button" class="btn btn-sm ${i === currentPage ? 'btn-primary' : 'btn-outline-secondary'} page-num-btn" data-page="${i}">
            ${i}
          </button>
        `;
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pageBtns += `<span class="px-1 text-muted">...</span>`;
      }
    }

    container.innerHTML = `
      <div class="d-flex justify-content-between align-items-center w-100 py-2 flex-wrap gap-2">
        <span class="small text-muted">
          দেখাচ্ছে <strong>${startItem}</strong> - <strong>${endItem}</strong> (মোট <strong>${totalItems}</strong> টির মধ্যে)
        </span>
        <div class="btn-group" role="group" aria-label="Pagination buttons">
          <button type="button" class="btn btn-sm btn-outline-secondary" id="${containerId}-prev" ${currentPage <= 1 ? 'disabled' : ''}>
            <i class="bi bi-chevron-left"></i> পূর্ববর্তী
          </button>
          ${pageBtns}
          <button type="button" class="btn btn-sm btn-outline-secondary" id="${containerId}-next" ${currentPage >= totalPages ? 'disabled' : ''}>
            পরবর্তী <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    `;

    const prevBtn = container.querySelector(`#${containerId}-prev`);
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
      });
    }

    const nextBtn = container.querySelector(`#${containerId}-next`);
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
      });
    }

    container.querySelectorAll('.page-num-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const p = parseInt(btn.getAttribute('data-page'), 10);
        if (p && p !== currentPage) onPageChange(p);
      });
    });
  }
};

