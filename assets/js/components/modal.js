/**
 * Hospital IT Desk — Reusable Accessible Modal Component
 */

class ModalManager {
  constructor() {
    this.modalEl = null;
    this.backdropEl = null;
    this.currentOnConfirm = null;
    this.init();
  }

  init() {
    // Create modal elements in DOM if not present
    if (!document.getElementById('app-modal-backdrop')) {
      const backdrop = document.createElement('div');
      backdrop.id = 'app-modal-backdrop';
      backdrop.className = 'modal-custom-backdrop';
      backdrop.setAttribute('role', 'dialog');
      backdrop.setAttribute('aria-modal', 'true');

      backdrop.innerHTML = `
        <div class="modal-custom-dialog" id="app-modal-dialog">
          <div class="modal-custom-header">
            <h5 class="modal-custom-title" id="app-modal-title">Modal Title</h5>
            <button type="button" class="modal-custom-close" id="app-modal-close-btn" aria-label="Close dialog">&times;</button>
          </div>
          <div class="modal-custom-body" id="app-modal-body"></div>
          <div class="modal-custom-footer" id="app-modal-footer">
            <button type="button" class="btn btn-secondary btn-sm" id="app-modal-cancel-btn">বন্ধ করুন</button>
            <button type="button" class="btn btn-primary btn-sm" id="app-modal-confirm-btn">সংরক্ষণ করুন</button>
          </div>
        </div>
      `;

      document.body.appendChild(backdrop);
      this.backdropEl = backdrop;
      this.modalEl = backdrop.querySelector('#app-modal-dialog');

      // Bind close events
      backdrop.querySelector('#app-modal-close-btn').addEventListener('click', () => this.hide());
      backdrop.querySelector('#app-modal-cancel-btn').addEventListener('click', () => this.hide());

      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) this.hide();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.backdropEl.classList.contains('show')) {
          this.hide();
        }
      });

      const confirmBtn = backdrop.querySelector('#app-modal-confirm-btn');
      confirmBtn.addEventListener('click', () => {
        if (this.currentOnConfirm) {
          this.currentOnConfirm();
        }
      });
    } else {
      this.backdropEl = document.getElementById('app-modal-backdrop');
      this.modalEl = document.getElementById('app-modal-dialog');
    }
  }

  /**
   * Display the modal
   */
  show({
    title = '',
    body = '',
    size = 'md', // 'md' | 'lg'
    showConfirm = true,
    confirmText = 'সংরক্ষণ করুন',
    confirmClass = 'btn-primary',
    cancelText = 'বন্ধ করুন',
    onConfirm = null
  }) {
    this.init();

    const titleEl = document.getElementById('app-modal-title');
    const bodyEl = document.getElementById('app-modal-body');
    const confirmBtn = document.getElementById('app-modal-confirm-btn');
    const cancelBtn = document.getElementById('app-modal-cancel-btn');

    titleEl.innerHTML = title;

    if (typeof body === 'string') {
      bodyEl.innerHTML = body;
    } else if (body instanceof HTMLElement) {
      bodyEl.innerHTML = '';
      bodyEl.appendChild(body);
    }

    if (size === 'lg') {
      this.modalEl.classList.add('modal-lg');
    } else {
      this.modalEl.classList.remove('modal-lg');
    }

    if (showConfirm) {
      confirmBtn.style.display = 'inline-block';
      confirmBtn.textContent = confirmText;
      confirmBtn.className = `btn btn-sm ${confirmClass}`;
      this.currentOnConfirm = onConfirm;
    } else {
      confirmBtn.style.display = 'none';
      this.currentOnConfirm = null;
    }

    cancelBtn.textContent = cancelText;

    this.backdropEl.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  /**
   * Hide the modal
   */
  hide() {
    if (this.backdropEl) {
      this.backdropEl.classList.remove('show');
      document.body.style.overflow = '';
      this.currentOnConfirm = null;
    }
  }

  /**
   * Quick confirmation dialog
   */
  confirm({
    title = 'নিশ্চিতকরণ',
    message = 'আপনি কি এই কাজটি সম্পন্ন করতে নিশ্চিত?',
    confirmText = 'হ্যাঁ, নিশ্চিত',
    confirmClass = 'btn-danger',
    onConfirm = null
  }) {
    this.show({
      title: `<i class="bi bi-exclamation-triangle-fill text-warning me-2"></i> ${title}`,
      body: `<p class="mb-0 fs-6">${message}</p>`,
      size: 'md',
      showConfirm: true,
      confirmText,
      confirmClass,
      onConfirm: () => {
        this.hide();
        if (onConfirm) onConfirm();
      }
    });
  }
}

export const modal = new ModalManager();

