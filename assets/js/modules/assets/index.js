/**
 * Hospital IT Desk — Module 3: IT Asset Management
 * Central equipment inventory, printer/scanner tracking, transfers, service logs & QR badges.
 */

import { repository } from '../../core/repository.js';
import { STORES } from '../../data/schema.js';
import { t } from '../../core/i18n.js';
import {
  formatDate,
  formatCurrency,
  renderStatusBadge,
  escapeHtml,
  generateSequentialCode
} from '../../core/formatters.js';
import { modal } from '../../components/modal.js';
import { pagination } from '../../components/pagination.js';
import { notifications } from '../../core/notifications.js';
import { utils } from '../../core/utils.js';

let allAssets = [];
let allCategories = [];
let allDepartments = [];
let allEmployees = [];
let allAssignments = [];

let assetFilter = {
  view: 'all', // 'all' | 'computers' | 'printers' | 'transfers'
  search: '',
  categoryId: '',
  departmentId: '',
  status: '',
  page: 1,
  pageSize: 8
};

export const assetsModule = {
  async render({ query } = {}) {
    const contentArea = document.getElementById('content-area');
    if (!contentArea) return;

    if (query && query.view) {
      assetFilter.view = query.view;
    }

    [allAssets, allCategories, allDepartments, allEmployees, allAssignments] = await Promise.all([
      repository.getAll(STORES.ASSETS),
      repository.getAll(STORES.ASSET_CATEGORIES),
      repository.getAll(STORES.DEPARTMENTS),
      repository.getAll(STORES.EMPLOYEES),
      repository.getAll(STORES.ASSET_ASSIGNMENTS)
    ]);

    allAssets.sort((a, b) => (a.assetCode > b.assetCode ? 1 : -1));

    this.renderView();
  },

  renderView() {
    const contentArea = document.getElementById('content-area');

    contentArea.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title"><i class="bi bi-pc-display-horizontal text-primary"></i> ${t('navAssets')}</h1>
          <p class="page-subtitle">হাসপাতালের কম্পিউটার, ল্যাপটপ, প্রিন্টার, স্ক্যানার ও অন্যান্য আইটি সরঞ্জামের কেন্দ্রীয় ইনভেন্টরি</p>
        </div>
        <div class="action-buttons">
          <button type="button" class="btn btn-primary btn-sm" id="btn-add-asset">
            <i class="bi bi-plus-lg me-1"></i> নতুন সরঞ্জাম যুক্ত করুন
          </button>
          <button type="button" class="btn btn-outline-secondary btn-sm" id="btn-export-assets-csv">
            <i class="bi bi-file-earmark-excel me-1"></i> CSV এক্সপোর্ট
          </button>
        </div>
      </div>

      <!-- Navigation Tabs for Views -->
      <ul class="nav nav-pills mb-3 gap-2">
        <li class="nav-item">
          <a class="nav-link ${assetFilter.view === 'all' ? 'active' : ''} asset-tab-link" data-view="all" href="#/assets?view=all">
            <i class="bi bi-collection-fill me-1"></i> সকল সরঞ্জাম (${allAssets.length})
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link ${assetFilter.view === 'computers' ? 'active' : ''} asset-tab-link" data-view="computers" href="#/assets?view=computers">
            <i class="bi bi-laptop me-1"></i> কম্পিউটার ও ল্যাপটপ
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link ${assetFilter.view === 'printers' ? 'active' : ''} asset-tab-link" data-view="printers" href="#/assets?view=printers">
            <i class="bi bi-printer me-1"></i> প্রিন্টার ও স্ক্যানার
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link ${assetFilter.view === 'transfers' ? 'active' : ''} asset-tab-link" data-view="transfers" href="#/assets?view=transfers">
            <i class="bi bi-arrow-left-right me-1"></i> অ্যাসেট স্থানান্তর ইতিহাস
          </a>
        </li>
      </ul>

      ${
        assetFilter.view === 'transfers'
          ? this.renderTransfersViewHtml()
          : this.renderInventoryViewHtml()
      }
    `;

    this.bindEvents();
    if (assetFilter.view !== 'transfers') {
      this.renderFilteredRows();
    }
  },

  renderInventoryViewHtml() {
    return `
      <!-- Filter Toolbar -->
      <div class="filter-toolbar">
        <div class="filter-search-input">
          <input type="text" class="form-control form-control-sm" id="asset-search" placeholder="অ্যাসেট কোড, নাম, ব্র্যান্ড, মডেল বা সিরিয়াল নং দিয়ে খুঁজুন..." value="${escapeHtml(assetFilter.search)}">
        </div>

        <select class="form-select form-select-sm" id="filter-asset-category">
          <option value="">সকল ক্যাটাগরি</option>
          ${allCategories.map((c) => `<option value="${c.id}" ${assetFilter.categoryId === c.id ? 'selected' : ''}>${escapeHtml(c.nameBn)}</option>`).join('')}
        </select>

        <select class="form-select form-select-sm" id="filter-asset-dept">
          <option value="">সকল বিভাগ</option>
          ${allDepartments.map((d) => `<option value="${d.id}" ${assetFilter.departmentId === d.id ? 'selected' : ''}>${escapeHtml(d.nameBn)}</option>`).join('')}
        </select>

        <select class="form-select form-select-sm" id="filter-asset-status">
          <option value="">সকল অবস্থা</option>
          <option value="Active" ${assetFilter.status === 'Active' ? 'selected' : ''}>সক্রিয় (Active)</option>
          <option value="In Repair" ${assetFilter.status === 'In Repair' ? 'selected' : ''}>মেরামতাধীন (In Repair)</option>
          <option value="In Storage" ${assetFilter.status === 'In Storage' ? 'selected' : ''}>স্টোরেজে (In Storage)</option>
          <option value="Retired" ${assetFilter.status === 'Retired' ? 'selected' : ''}>অবসরপ্রাপ্ত (Retired)</option>
        </select>

        <button type="button" class="btn btn-sm btn-outline-secondary" id="btn-reset-asset-filter">
          <i class="bi bi-arrow-counterclockwise"></i> রিসেট
        </button>
      </div>

      <!-- Assets Table Card -->
      <div class="card-custom">
        <div class="card-custom-body p-0">
          <div class="table-responsive-custom">
            <table class="table-custom">
              <thead>
                <tr>
                  <th>অ্যাসেট কোড</th>
                  <th>সরঞ্জামের নাম ও মডেল</th>
                  <th>ক্যাটাগরি</th>
                  <th>বিভাগ ও অবস্থান</th>
                  <th>আইপি / সংযোগ</th>
                  <th>অবস্থা (Status)</th>
                  <th>ওয়ারেন্টি মেয়াদ</th>
                  <th style="width: 140px;">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody id="asset-table-body">
                <!-- Rows injected dynamically -->
              </tbody>
            </table>
          </div>
        </div>
        <div class="card-footer bg-surface border-top p-2" id="asset-pagination-container">
          <!-- Pagination injected dynamically -->
        </div>
      </div>
    `;
  },

  renderTransfersViewHtml() {
    return `
      <div class="card-custom">
        <div class="card-custom-header">
          <h5 class="card-custom-title"><i class="bi bi-arrow-left-right text-primary"></i> সরঞ্জাম বরাদ্দ ও স্থানান্তর রেকর্ড ট্র্যাকিং</h5>
        </div>
        <div class="card-custom-body p-0">
          <div class="table-responsive-custom">
            <table class="table-custom">
              <thead>
                <tr>
                  <th>তারিখ</th>
                  <th>অ্যাসেট কোড ও নাম</th>
                  <th>গন্তব্য বিভাগ</th>
                  <th>দায়িত্বপ্রাপ্ত কর্মী</th>
                  <th>হস্তান্তরকারী</th>
                  <th>নোট ও উদ্দেশ্য</th>
                </tr>
              </thead>
              <tbody>
                ${
                  allAssignments.map((asgn) => {
                    const asset = allAssets.find((a) => a.id === asgn.assetId);
                    const dept = allDepartments.find((d) => d.id === asgn.departmentId);
                    const emp = allEmployees.find((e) => e.id === asgn.employeeId);
                    return `
                      <tr>
                        <td class="small text-muted">${formatDate(asgn.assignedDate)}</td>
                        <td>
                          <strong>${escapeHtml(asset ? asset.assetCode : '—')}</strong><br>
                          <small class="text-muted">${escapeHtml(asset ? asset.name : '—')}</small>
                        </td>
                        <td><span class="badge bg-light text-dark border">${escapeHtml(dept ? dept.nameBn : '—')}</span></td>
                        <td>${escapeHtml(emp ? emp.nameBn : '—')}</td>
                        <td><small>${escapeHtml(asgn.assignedBy || 'আইটি অফিসার')}</small></td>
                        <td><small class="text-muted">${escapeHtml(asgn.notes || '—')}</small></td>
                      </tr>
                    `;
                  }).join('') || '<tr><td colspan="6" class="text-center py-4 text-muted">কোনো স্থানান্তর রেকর্ড নেই</td></tr>'
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  bindEvents() {
    const searchInput = document.getElementById('asset-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        assetFilter.search = e.target.value;
        assetFilter.page = 1;
        this.renderFilteredRows();
      });
    }

    const catFilter = document.getElementById('filter-asset-category');
    if (catFilter) {
      catFilter.addEventListener('change', (e) => {
        assetFilter.categoryId = e.target.value;
        assetFilter.page = 1;
        this.renderFilteredRows();
      });
    }

    const deptFilter = document.getElementById('filter-asset-dept');
    if (deptFilter) {
      deptFilter.addEventListener('change', (e) => {
        assetFilter.departmentId = e.target.value;
        assetFilter.page = 1;
        this.renderFilteredRows();
      });
    }

    const statusFilter = document.getElementById('filter-asset-status');
    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        assetFilter.status = e.target.value;
        assetFilter.page = 1;
        this.renderFilteredRows();
      });
    }

    const resetBtn = document.getElementById('btn-reset-asset-filter');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        assetFilter.search = '';
        assetFilter.categoryId = '';
        assetFilter.departmentId = '';
        assetFilter.status = '';
        assetFilter.page = 1;
        this.renderView();
      });
    }

    const addBtn = document.getElementById('btn-add-asset');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.showAddAssetModal());
    }

    const exportBtn = document.getElementById('btn-export-assets-csv');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportCsv());
    }
  },

  renderFilteredRows() {
    const tbody = document.getElementById('asset-table-body');
    if (!tbody) return;

    const filtered = allAssets.filter((a) => {
      // Subview filtering
      if (assetFilter.view === 'computers') {
        if (a.categoryId !== 'cat-desktop' && a.categoryId !== 'cat-laptop') return false;
      } else if (assetFilter.view === 'printers') {
        if (a.categoryId !== 'cat-printer' && a.categoryId !== 'cat-scanner') return false;
      }

      const matchSearch =
        !assetFilter.search ||
        a.assetCode.toLowerCase().includes(assetFilter.search.toLowerCase()) ||
        a.name.toLowerCase().includes(assetFilter.search.toLowerCase()) ||
        (a.brand && a.brand.toLowerCase().includes(assetFilter.search.toLowerCase())) ||
        (a.serialNumber && a.serialNumber.toLowerCase().includes(assetFilter.search.toLowerCase()));

      const matchCat = !assetFilter.categoryId || a.categoryId === assetFilter.categoryId;
      const matchDept = !assetFilter.departmentId || a.departmentId === assetFilter.departmentId;
      const matchStatus = !assetFilter.status || a.status === assetFilter.status;

      return matchSearch && matchCat && matchDept && matchStatus;
    });

    const total = filtered.length;
    const start = (assetFilter.page - 1) * assetFilter.pageSize;
    const paginated = filtered.slice(start, start + assetFilter.pageSize);

    if (paginated.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center py-4 text-muted">
            <i class="bi bi-inbox fs-2 text-muted d-block mb-1"></i> কোনো সরঞ্জাম পাওয়া যায়নি
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = paginated.map((ast) => {
        const cat = allCategories.find((c) => c.id === ast.categoryId);
        const dept = allDepartments.find((d) => d.id === ast.departmentId);

        let connInfo = '—';
        if (ast.ipAddress) connInfo = `<code>${escapeHtml(ast.ipAddress)}</code>`;
        else if (ast.connectionType) connInfo = escapeHtml(ast.connectionType);

        return `
          <tr>
            <td>
              <a href="javascript:void(0)" class="fw-bold text-primary btn-view-asset" data-id="${ast.id}">
                ${escapeHtml(ast.assetCode)}
              </a>
            </td>
            <td>
              <div class="fw-medium text-main">${escapeHtml(ast.name)}</div>
              <small class="text-muted">${escapeHtml(ast.brand || '')} ${escapeHtml(ast.model || '')} | S/N: ${escapeHtml(ast.serialNumber || 'N/A')}</small>
            </td>
            <td><span class="badge bg-light text-dark border">${escapeHtml(cat ? cat.nameBn : 'Other')}</span></td>
            <td>
              <div>${escapeHtml(dept ? dept.nameBn : '—')}</div>
              <small class="text-muted">${escapeHtml(ast.location || '—')}</small>
            </td>
            <td><small>${connInfo}</small></td>
            <td>${renderStatusBadge(ast.status)}</td>
            <td><small class="text-muted">${formatDate(ast.warrantyEnd)}</small></td>
            <td>
              <div class="btn-group btn-group-sm">
                <button type="button" class="btn btn-outline-primary btn-view-asset" data-id="${ast.id}" title="বিস্তারিত ও QR ব্যাজ">
                  <i class="bi bi-eye"></i>
                </button>
                <button type="button" class="btn btn-outline-secondary btn-transfer-asset" data-id="${ast.id}" title="স্থানান্তর করুন">
                  <i class="bi bi-arrow-left-right"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');

      tbody.querySelectorAll('.btn-view-asset').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          this.showAssetDetailModal(id);
        });
      });

      tbody.querySelectorAll('.btn-transfer-asset').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          this.showTransferModal(id);
        });
      });
    }

    pagination.render({
      currentPage: assetFilter.page,
      totalItems: total,
      pageSize: assetFilter.pageSize,
      containerId: 'asset-pagination-container',
      onPageChange: (newPage) => {
        assetFilter.page = newPage;
        this.renderFilteredRows();
      }
    });
  },

  /**
   * Add new asset modal
   */
  async showAddAssetModal() {
    const nextCode = generateSequentialCode('IT-ASSET-', allAssets, 'assetCode');

    const formHtml = `
      <form id="add-asset-form">
        <div class="row g-3">
          <div class="col-12 col-md-4">
            <label class="form-label small fw-semibold">অ্যাসেট কোড <span class="text-danger">*</span></label>
            <input type="text" class="form-control form-control-sm" id="form-asset-code" value="${nextCode}" required>
          </div>

          <div class="col-12 col-md-8">
            <label class="form-label small fw-semibold">সরঞ্জামের নাম <span class="text-danger">*</span></label>
            <input type="text" class="form-control form-control-sm" id="form-asset-name" placeholder="যেমন: Emergency Billing Laser Printer" required>
          </div>

          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">ক্যাটাগরি <span class="text-danger">*</span></label>
            <select class="form-select form-select-sm" id="form-asset-category" required>
              ${allCategories.map((c) => `<option value="${c.id}">${escapeHtml(c.nameBn)} (${escapeHtml(c.nameEn)})</option>`).join('')}
            </select>
          </div>

          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">বিভাগ <span class="text-danger">*</span></label>
            <select class="form-select form-select-sm" id="form-asset-dept" required>
              ${allDepartments.map((d) => `<option value="${d.id}">${escapeHtml(d.nameBn)}</option>`).join('')}
            </select>
          </div>

          <div class="col-12 col-md-4">
            <label class="form-label small fw-semibold">ব্র্যান্ড</label>
            <input type="text" class="form-control form-control-sm" id="form-asset-brand" placeholder="HP, Dell, Cisco ইত্যাদি">
          </div>

          <div class="col-12 col-md-4">
            <label class="form-label small fw-semibold">মডেল নং</label>
            <input type="text" class="form-control form-control-sm" id="form-asset-model" placeholder="LaserJet M428">
          </div>

          <div class="col-12 col-md-4">
            <label class="form-label small fw-semibold">সিরিয়াল নম্বর</label>
            <input type="text" class="form-control form-control-sm" id="form-asset-serial" placeholder="S/N: XXX-1234">
          </div>

          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">নির্দিষ্ট অবস্থান / রুম নং</label>
            <input type="text" class="form-control form-control-sm" id="form-asset-location" placeholder="রিসিপশন কাউন্টার ১">
          </div>

          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">আইপি অ্যাড্রেস (যদি থাকে)</label>
            <input type="text" class="form-control form-control-sm" id="form-asset-ip" placeholder="192.168.20.25">
          </div>

          <div class="col-12 col-md-4">
            <label class="form-label small fw-semibold">ক্রয়মূল্য (টাকা)</label>
            <input type="number" class="form-control form-control-sm" id="form-asset-cost" placeholder="58000">
          </div>

          <div class="col-12 col-md-4">
            <label class="form-label small fw-semibold">ক্রয়ের তারিখ</label>
            <input type="date" class="form-control form-control-sm" id="form-asset-purchasedate">
          </div>

          <div class="col-12 col-md-4">
            <label class="form-label small fw-semibold">ওয়ারেন্টি শেষ তারিখ</label>
            <input type="date" class="form-control form-control-sm" id="form-asset-warrantyend">
          </div>

          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">অবস্থা (Condition)</label>
            <select class="form-select form-select-sm" id="form-asset-condition">
              <option value="New">নতুন (New)</option>
              <option value="Good" selected>ভালো (Good)</option>
              <option value="Fair">চলনসই (Fair)</option>
              <option value="Damaged">ক্ষতিগ্রস্ত (Damaged)</option>
            </select>
          </div>

          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">অপারেশনাল স্ট্যাটাস</label>
            <select class="form-select form-select-sm" id="form-asset-status">
              <option value="Active" selected>সক্রিয় (Active)</option>
              <option value="In Storage">স্টোরেজে সংরক্ষিত (In Storage)</option>
              <option value="In Repair">মেরামতাধীন (In Repair)</option>
            </select>
          </div>

          <div class="col-12">
            <label class="form-label small fw-semibold">অতিরিক্ত বিবরণ বা কনফিগারেশন নোট</label>
            <textarea class="form-control form-control-sm" id="form-asset-notes" rows="2" placeholder="র্যাম, প্রসেসর, টোনার মডেল ইত্যাদি বিবরণ..."></textarea>
          </div>
        </div>
      </form>
    `;

    modal.show({
      title: '<i class="bi bi-pc-display text-primary"></i> নতুন আইটি সরঞ্জাম নিবন্ধন',
      body: formHtml,
      size: 'lg',
      confirmText: 'সংরক্ষণ করুন',
      onConfirm: async () => {
        const code = document.getElementById('form-asset-code').value.trim();
        const name = document.getElementById('form-asset-name').value.trim();
        const categoryId = document.getElementById('form-asset-category').value;
        const departmentId = document.getElementById('form-asset-dept').value;

        if (!code || !name) {
          notifications.showToast('ভ্যালিডেশন এরর', 'অ্যাসেট কোড ও নাম পূরণ করা বাধ্যতামূলক।', 'danger');
          return;
        }

        const newAsset = {
          assetCode: code,
          name,
          categoryId,
          departmentId,
          brand: document.getElementById('form-asset-brand').value.trim(),
          model: document.getElementById('form-asset-model').value.trim(),
          serialNumber: document.getElementById('form-asset-serial').value.trim(),
          location: document.getElementById('form-asset-location').value.trim(),
          ipAddress: document.getElementById('form-asset-ip').value.trim(),
          purchaseCost: Number(document.getElementById('form-asset-cost').value) || 0,
          purchaseDate: document.getElementById('form-asset-purchasedate').value,
          warrantyEnd: document.getElementById('form-asset-warrantyend').value,
          condition: document.getElementById('form-asset-condition').value,
          status: document.getElementById('form-asset-status').value,
          notes: document.getElementById('form-asset-notes').value.trim()
        };

        const saved = await repository.add(STORES.ASSETS, newAsset);
        await repository.logActivity('CREATE_ASSET', 'IT Assets', saved.assetCode, `Added asset: ${saved.name}`);

        modal.hide();
        notifications.showToast('অ্যাসেট সংরক্ষিত', `সরঞ্জাম ${saved.assetCode} সফলভাবে নিবন্ধিত হয়েছে।`, 'success');
        await this.render();
      }
    });
  },

  /**
   * Asset Detail & Printable QR Badge Modal
   * @param {string} assetId
   */
  async showAssetDetailModal(assetId) {
    const asset = await repository.getById(STORES.ASSETS, assetId);
    if (!asset) return;

    const [linkedTickets, serviceRecords] = await Promise.all([
      repository.find(STORES.TICKETS, (t) => t.assetId === assetId),
      repository.find(STORES.ASSET_SERVICE_RECORDS, (s) => s.assetId === assetId)
    ]);

    const cat = allCategories.find((c) => c.id === asset.categoryId);
    const dept = allDepartments.find((d) => d.id === asset.departmentId);
    const qrSvg = utils.generateQrSvg(asset.assetCode);

    const bodyHtml = `
      <div id="printable-asset-badge">
        <div class="row g-3">
          <div class="col-12 col-md-8">
            <h4 class="text-primary fw-bold mb-1">${escapeHtml(asset.assetCode)}: ${escapeHtml(asset.name)}</h4>
            <div class="small text-muted mb-3">
              <span class="badge bg-secondary me-1">${escapeHtml(cat ? cat.nameBn : '—')}</span>
              ${renderStatusBadge(asset.status)}
            </div>

            <div class="table-responsive">
              <table class="table table-sm table-bordered">
                <tbody>
                  <tr><th style="width: 35%;">ব্র্যান্ড ও মডেল</th><td>${escapeHtml(asset.brand || '—')} ${escapeHtml(asset.model || '')}</td></tr>
                  <tr><th>সিরিয়াল নম্বর</th><td><code>${escapeHtml(asset.serialNumber || '—')}</code></td></tr>
                  <tr><th>বর্তমান বিভাগ</th><td><strong>${escapeHtml(dept ? dept.nameBn : '—')}</strong></td></tr>
                  <tr><th>নির্দিষ্ট অবস্থান</th><td>${escapeHtml(asset.location || '—')}</td></tr>
                  <tr><th>আইপি / সংযোগ</th><td>${asset.ipAddress ? `<code>${escapeHtml(asset.ipAddress)}</code>` : escapeHtml(asset.connectionType || '—')}</td></tr>
                  <tr><th>শারীরিক অবস্থা</th><td>${escapeHtml(asset.condition || 'Good')}</td></tr>
                  <tr><th>ক্রয়মূল্য</th><td>${formatCurrency(asset.purchaseCost)}</td></tr>
                  <tr><th>ওয়ারেন্টি সমাপ্তি</th><td>${formatDate(asset.warrantyEnd)}</td></tr>
                  ${asset.tonerModel ? `<tr><th>টোনার / কার্টিজ মডেল</th><td><strong>${escapeHtml(asset.tonerModel)}</strong></td></tr>` : ''}
                  ${asset.pageCount ? `<tr><th>বর্তমান পেজ কাউন্টার</th><td>${Number(asset.pageCount).toLocaleString()} পৃষ্ঠা</td></tr>` : ''}
                  <tr><th>নোট / মন্তব্য</th><td>${escapeHtml(asset.notes || '—')}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Printable QR Code Badge Card -->
          <div class="col-12 col-md-4 text-center">
            <div class="qr-preview-box w-100 p-3 bg-white border rounded">
              <div class="small fw-bold text-navy mb-1">DHAKA CENTRAL HOSPITAL</div>
              <div class="small text-muted mb-2">IT Asset Identifier</div>
              ${qrSvg}
              <div class="qr-code-label mt-2">${escapeHtml(asset.assetCode)}</div>
              <div class="small text-muted mt-1">${escapeHtml(asset.name)}</div>
              <button type="button" class="btn btn-outline-primary btn-sm mt-3 w-100 btn-no-print" id="btn-print-asset-badge">
                <i class="bi bi-printer"></i> কিউআর ব্যাজ প্রিন্ট
              </button>
            </div>
          </div>

          <!-- Linked Tickets & Maintenance History -->
          <div class="col-12 mt-3 btn-no-print">
            <h6 class="fw-bold border-bottom pb-2 mb-2"><i class="bi bi-clock-history me-1"></i> সম্পর্কিত টিকিটের ইতিহাস (${linkedTickets.length})</h6>
            <div class="table-responsive">
              <table class="table table-sm table-striped">
                <thead>
                  <tr>
                    <th>টিকিট নং</th>
                    <th>সমস্যা</th>
                    <th>তারিখ</th>
                    <th>অবস্থা</th>
                  </tr>
                </thead>
                <tbody>
                  ${
                    linkedTickets.map((tkt) => `
                      <tr>
                        <td><strong>${escapeHtml(tkt.ticketNumber)}</strong></td>
                        <td>${escapeHtml(tkt.title)}</td>
                        <td class="small text-muted">${formatDate(tkt.createdAt)}</td>
                        <td>${renderStatusBadge(tkt.status)}</td>
                      </tr>
                    `).join('') || '<tr><td colspan="4" class="text-center py-2 text-muted">কোনো রেকর্ড নেই</td></tr>'
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;

    modal.show({
      title: `<i class="bi bi-pc-display text-primary"></i> সরঞ্জাম বিস্তারিত ও প্রিন্ট`,
      body: bodyHtml,
      size: 'lg',
      showConfirm: false,
      cancelText: 'বন্ধ করুন'
    });

    const printBtn = document.getElementById('btn-print-asset-badge');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }
  },

  /**
   * Transfer asset modal
   */
  async showTransferModal(assetId) {
    const asset = await repository.getById(STORES.ASSETS, assetId);
    if (!asset) return;

    const currentDept = allDepartments.find((d) => d.id === asset.departmentId);

    const formHtml = `
      <form id="transfer-asset-form">
        <div class="alert alert-light border py-2 mb-3">
          <strong>সরঞ্জাম:</strong> ${escapeHtml(asset.assetCode)} — ${escapeHtml(asset.name)}<br>
          <strong>বর্তমান বিভাগ:</strong> ${escapeHtml(currentDept ? currentDept.nameBn : '—')} (${escapeHtml(asset.location || '—')})
        </div>

        <div class="mb-3">
          <label class="form-label small fw-semibold">স্থানান্তরিত নতুন বিভাগ <span class="text-danger">*</span></label>
          <select class="form-select form-select-sm" id="transfer-new-dept" required>
            ${allDepartments.map((d) => `<option value="${d.id}" ${d.id === asset.departmentId ? 'disabled' : ''}>${escapeHtml(d.nameBn)}</option>`).join('')}
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label small fw-semibold">নতুন নির্দিষ্ট অবস্থান / রুম নং <span class="text-danger">*</span></label>
          <input type="text" class="form-control form-control-sm" id="transfer-new-location" placeholder="যেমন: নতুন আইসিইউ বেড ৩" required>
        </div>

        <div class="mb-3">
          <label class="form-label small fw-semibold">দায়িত্বপ্রাপ্ত কর্মী (Custodian)</label>
          <select class="form-select form-select-sm" id="transfer-new-custodian">
            <option value="">নির্বাচন করুন...</option>
            ${allEmployees.map((e) => `<option value="${e.id}">${escapeHtml(e.nameBn)} (${escapeHtml(e.designation)})</option>`).join('')}
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label small fw-semibold">স্থানান্তরের কারণ বা রেফারেন্স নোট</label>
          <textarea class="form-control form-control-sm" id="transfer-notes" rows="2" placeholder="কেন স্থানান্তর করা হলো..."></textarea>
        </div>
      </form>
    `;

    modal.show({
      title: `<i class="bi bi-arrow-left-right text-primary"></i> সরঞ্জাম স্থানান্তর: ${escapeHtml(asset.assetCode)}`,
      body: formHtml,
      size: 'md',
      confirmText: 'স্থানান্তর নিশ্চিত করুন',
      confirmClass: 'btn-primary',
      onConfirm: async () => {
        const newDeptId = document.getElementById('transfer-new-dept').value;
        const newLocation = document.getElementById('transfer-new-location').value.trim();
        const newCustodianId = document.getElementById('transfer-new-custodian').value;
        const transferNotes = document.getElementById('transfer-notes').value.trim();

        if (!newDeptId || !newLocation) {
          notifications.showToast('ভ্যালিডেশন এরর', 'নতুন বিভাগ ও অবস্থান পূরণ আবশ্যক।', 'danger');
          return;
        }

        const oldDeptId = asset.departmentId;
        const oldLocation = asset.location;

        // Update asset
        asset.departmentId = newDeptId;
        asset.location = newLocation;
        asset.custodianId = newCustodianId || null;
        await repository.update(STORES.ASSETS, asset);

        // Record assignment transfer history
        await repository.add(STORES.ASSET_ASSIGNMENTS, {
          assetId: asset.id,
          departmentId: newDeptId,
          employeeId: newCustodianId || null,
          assignedDate: new Date().toISOString().split('T')[0],
          assignedBy: 'আইটি অফিসার',
          notes: `Transferred from previous location (${oldLocation}). Note: ${transferNotes}`
        });

        await repository.logActivity('TRANSFER_ASSET', 'IT Assets', asset.assetCode, `Transferred from dept ${oldDeptId} to ${newDeptId}`);

        modal.hide();
        notifications.showToast('স্থানান্তর সম্পন্ন', `সরঞ্জাম ${asset.assetCode} সফলভাবে নতুন বিভাগে স্থানান্তরিত হয়েছে।`, 'success');
        await this.render();
      }
    });
  },

  /**
   * Export assets list to CSV
   */
  exportCsv() {
    const headers = ['অ্যাসেট কোড', 'নাম', 'ক্যাটাগরি', 'বিভাগ', 'অবস্থান', 'ব্র্যান্ড', 'মডেল', 'সিরিয়াল নম্বর', 'আইপি', 'অবস্থা', 'ক্রয়মূল্য', 'ওয়ারেন্টি শেষ'];
    const rows = allAssets.map((a) => {
      const cat = allCategories.find((c) => c.id === a.categoryId);
      const dept = allDepartments.find((d) => d.id === a.departmentId);
      return [
        a.assetCode,
        a.name,
        cat ? cat.nameBn : '',
        dept ? dept.nameBn : '',
        a.location || '',
        a.brand || '',
        a.model || '',
        a.serialNumber || '',
        a.ipAddress || '',
        a.status,
        a.purchaseCost || 0,
        a.warrantyEnd || ''
      ];
    });

    utils.exportToCsv('hospital_it_assets_inventory.csv', headers, rows);
    notifications.showToast('CSV প্রস্তুত', 'অ্যাসেট ইনভেন্টরি CSV ফাইল ডাউনলোড সম্পন্ন হয়েছে।', 'success');
  }
};

