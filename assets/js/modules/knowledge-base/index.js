/**
 * Hospital IT Desk — Module 10: IT Documentation & Knowledge Base
 * Searchable internal troubleshooting SOPs, setup manuals, and network diagrams.
 */

import { repository } from '../../core/repository.js';
import { STORES } from '../../data/schema.js';
import { t } from '../../core/i18n.js';
import { formatDate, escapeHtml } from '../../core/formatters.js';
import { modal } from '../../components/modal.js';
import { notifications } from '../../core/notifications.js';

let articles = [];
let searchQuery = '';
let selectedCategory = '';

export const knowledgeBaseModule = {
  async render() {
    const contentArea = document.getElementById('content-area');
    if (!contentArea) return;

    articles = await repository.getAll(STORES.KNOWLEDGE_ARTICLES);

    contentArea.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title"><i class="bi bi-book-half text-primary"></i> ${t('navKnowledgeBase')}</h1>
          <p class="page-subtitle">হাসপাতালের আইটি ট্রাবলশুটিং সমাধান, ইনস্টলেশন নির্দেশিকা ও স্ট্যান্ডার্ড অপারেটিং প্রসিডিউর (SOP)</p>
        </div>
        <div class="action-buttons">
          <button type="button" class="btn btn-primary btn-sm" id="btn-add-article">
            <i class="bi bi-plus-lg me-1"></i> নতুন নির্দেশিকা তৈরি
          </button>
        </div>
      </div>

      <!-- Search & Category Filters -->
      <div class="filter-toolbar mb-4">
        <div class="filter-search-input">
          <input type="text" class="form-control form-control-sm" id="kb-search" placeholder="সমস্যা বা কি-ওয়ার্ড দিয়ে সমাধান খুঁজুন (যেমন: Printer, Barcode, Backup)..." value="${escapeHtml(searchQuery)}">
        </div>

        <select class="form-select form-select-sm" id="kb-category-filter">
          <option value="">সকল ক্যাটাগরি (${t('all')})</option>
          <option value="Printer" ${selectedCategory === 'Printer' ? 'selected' : ''}>প্রিন্টার সেটআপ</option>
          <option value="Scanner" ${selectedCategory === 'Scanner' ? 'selected' : ''}>স্ক্যানার ও বারকোড</option>
          <option value="Backup" ${selectedCategory === 'Backup' ? 'selected' : ''}>ব্যাকআপ ও রিস্টোর</option>
          <option value="Network" ${selectedCategory === 'Network' ? 'selected' : ''}>নেটওয়ার্ক ও রাউটার</option>
          <option value="HMS" ${selectedCategory === 'HMS' ? 'selected' : ''}>হাসপাতাল সফটওয়্যার</option>
        </select>
      </div>

      <!-- Articles Grid -->
      <div class="row g-3" id="kb-articles-grid">
        <!-- Injected dynamically -->
      </div>
    `;

    this.bindEvents();
    this.renderArticlesGrid();
  },

  bindEvents() {
    const searchInput = document.getElementById('kb-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        this.renderArticlesGrid();
      });
    }

    const catFilter = document.getElementById('kb-category-filter');
    if (catFilter) {
      catFilter.addEventListener('change', (e) => {
        selectedCategory = e.target.value;
        this.renderArticlesGrid();
      });
    }

    const addBtn = document.getElementById('btn-add-article');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.showAddArticleModal());
    }
  },

  renderArticlesGrid() {
    const grid = document.getElementById('kb-articles-grid');
    if (!grid) return;

    const filtered = articles.filter((art) => {
      const matchSearch =
        !searchQuery ||
        art.titleBn.toLowerCase().includes(searchQuery) ||
        (art.titleEn && art.titleEn.toLowerCase().includes(searchQuery)) ||
        (art.summary && art.summary.toLowerCase().includes(searchQuery)) ||
        (art.tags && art.tags.some((tag) => tag.toLowerCase().includes(searchQuery)));

      const matchCat = !selectedCategory || art.category === selectedCategory;

      return matchSearch && matchCat;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="bi bi-journal-x fs-1 text-muted"></i>
          <h6 class="mt-2 text-muted">কোনো নলেজ বেস নিবন্ধ পাওয়া যায়নি</h6>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map((art) => `
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card-custom h-100 d-flex flex-column">
          <div class="card-custom-body flex-grow-1">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="badge bg-primary-subtle text-primary border">${escapeHtml(art.categoryLabel || art.category)}</span>
              <small class="text-muted">${formatDate(art.updatedAt)}</small>
            </div>
            <h5 class="fw-bold fs-6 text-main mb-2">${escapeHtml(art.titleBn)}</h5>
            <p class="small text-muted mb-3">${escapeHtml(art.summary || 'কোনো সারসংক্ষেপ নেই')}</p>

            <div class="d-flex flex-wrap gap-1 mb-2">
              ${(art.tags || []).map((t) => `<span class="badge bg-light text-secondary border">#${escapeHtml(t)}</span>`).join('')}
            </div>
          </div>
          <div class="card-footer bg-surface border-top p-3 pt-0">
            <button type="button" class="btn btn-outline-primary btn-sm w-100 btn-read-article" data-id="${art.id}">
              <i class="bi bi-book me-1"></i> সম্পূর্ণ সমাধান পড়ুন
            </button>
          </div>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.btn-read-article').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.showArticleModal(id);
      });
    });
  },

  async showArticleModal(articleId) {
    const art = await repository.getById(STORES.KNOWLEDGE_ARTICLES, articleId);
    if (!art) return;

    // Convert markdown headers/lists into clean safe HTML
    const formattedContent = escapeHtml(art.content || '')
      .replace(/^### (.*$)/gim, '<h6 class="fw-bold text-navy mt-3 mb-2">$1</h6>')
      .replace(/^## (.*$)/gim, '<h5 class="fw-bold text-navy mt-3 mb-2">$1</h5>')
      .replace(/`([^`]+)`/gim, '<code class="bg-light p-1 rounded">$1</code>')
      .replace(/\n\n/gim, '<br><br>')
      .replace(/\n/gim, '<br>');

    const bodyHtml = `
      <div class="article-content">
        <div class="mb-3 border-bottom pb-2">
          <h4 class="text-primary fw-bold mb-1">${escapeHtml(art.titleBn)}</h4>
          <div class="small text-muted">
            <span class="badge bg-secondary me-1">${escapeHtml(art.categoryLabel || art.category)}</span>
            <span>লেখক: <strong>${escapeHtml(art.author || 'আইটি টিম')}</strong></span> |
            <span>সর্বশেষ আপডেট: ${formatDate(art.updatedAt)}</span>
          </div>
        </div>

        <div class="p-3 bg-light rounded border mb-3 small" style="line-height: 1.7;">
          ${formattedContent}
        </div>

        <div class="d-flex justify-content-between align-items-center">
          <div class="small text-muted">
            ট্যাগ: ${(art.tags || []).map((t) => `<code>#${escapeHtml(t)}</code>`).join(' ')}
          </div>
          <button type="button" class="btn btn-sm btn-outline-secondary" onclick="window.print()">
            <i class="bi bi-printer"></i> প্রিন্ট
          </button>
        </div>
      </div>
    `;

    modal.show({
      title: `<i class="bi bi-journal-text text-primary"></i> নলেজ বেস এসওপি`,
      body: bodyHtml,
      size: 'lg',
      showConfirm: false,
      cancelText: 'বন্ধ করুন'
    });
  },

  showAddArticleModal() {
    const formHtml = `
      <form id="add-article-form">
        <div class="mb-3">
          <label class="form-label small fw-semibold">শিরোনাম (বাংলা) <span class="text-danger">*</span></label>
          <input type="text" class="form-control form-control-sm" id="form-kb-title" placeholder="যেমন: ইউপিএস ফল্ট ট্রাবলশুটিং" required>
        </div>

        <div class="row g-2 mb-3">
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">ক্যাটাগরি</label>
            <select class="form-select form-select-sm" id="form-kb-category">
              <option value="Printer">প্রিন্টার সেটআপ</option>
              <option value="Scanner">স্ক্যানার ও বারকোড</option>
              <option value="Network">নেটওয়ার্ক ও রাউটার</option>
              <option value="Backup">ব্যাকআপ ও ডাটাবেজ</option>
              <option value="HMS">হাসপাতাল সফটওয়্যার</option>
              <option value="Other">অন্যান্য</option>
            </select>
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">ট্যাগসমূহ (কমা দিয়ে লিখুন)</label>
            <input type="text" class="form-control form-control-sm" id="form-kb-tags" placeholder="UPS, Power, Battery">
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label small fw-semibold">সারসংক্ষেপ (Summary)</label>
          <input type="text" class="form-control form-control-sm" id="form-kb-summary" placeholder="এক বাক্যে সমস্যার মূল কারণ ও সমাধান...">
        </div>

        <div class="mb-3">
          <label class="form-label small fw-semibold">পদক্ষেপ বা বিস্তারিত সমাধান (Step-by-step) <span class="text-danger">*</span></label>
          <textarea class="form-control form-control-sm" id="form-kb-content" rows="6" placeholder="১. প্রথমে পাওয়ার কেবল চেক করুন&#10;২. ব্যাটারি টার্মিনাল ভোল্টেজ পরিমাপ করুন..." required></textarea>
        </div>
      </form>
    `;

    modal.show({
      title: '<i class="bi bi-pencil-square text-primary"></i> নতুন নলেজ বেস নিবন্ধ যুক্ত করুন',
      body: formHtml,
      size: 'lg',
      confirmText: 'সংরক্ষণ করুন',
      onConfirm: async () => {
        const title = document.getElementById('form-kb-title').value.trim();
        const cat = document.getElementById('form-kb-category').value;
        const tagsRaw = document.getElementById('form-kb-tags').value.trim();
        const summary = document.getElementById('form-kb-summary').value.trim();
        const content = document.getElementById('form-kb-content').value.trim();

        if (!title || !content) {
          notifications.showToast('ভ্যালিডেশন এরর', 'শিরোনাম ও সমাধান প্রদান আবশ্যক।', 'danger');
          return;
        }

        const tags = tagsRaw.split(',').map((t) => t.trim()).filter((t) => t.length > 0);

        await repository.add(STORES.KNOWLEDGE_ARTICLES, {
          titleBn: title,
          category: cat,
          categoryLabel: cat,
          author: 'আইটি অফিসার',
          summary,
          content,
          tags,
          status: 'Published',
          updatedAt: new Date().toISOString().split('T')[0]
        });

        modal.hide();
        notifications.showToast('নিবন্ধ সংরক্ষিত', 'নতুন নির্দেশিকা সফলভাবে নলেজ বেসে যুক্ত হয়েছে।', 'success');
        await this.render();
      }
    });
  }
};

