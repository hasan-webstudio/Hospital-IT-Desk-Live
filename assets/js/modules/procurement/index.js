/**
 * Hospital IT Desk — Module 11: IT Expenses, Purchases & Vendor Management
 * Procurement tracking, IT operating expenses (BDT), and vendor SLAs.
 */

import { repository } from '../../core/repository.js';
import { STORES } from '../../data/schema.js';
import { t } from '../../core/i18n.js';
import { formatDate, formatCurrency, renderStatusBadge, renderPriorityBadge, escapeHtml, generateSequentialCode } from '../../core/formatters.js';
import { modal } from '../../components/modal.js';
import { notifications } from '../../core/notifications.js';

let vendors = [];
let purchaseRequests = [];
let expenses = [];
let departments = [];

export const procurementModule = {
  async render() {
    const contentArea = document.getElementById('content-area');
    if (!contentArea) return;

    [vendors, purchaseRequests, expenses, departments] = await Promise.all([
      repository.getAll(STORES.VENDORS),
      repository.getAll(STORES.PURCHASE_REQUESTS),
      repository.getAll(STORES.EXPENSES),
      repository.getAll(STORES.DEPARTMENTS)
    ]);

    // Total expense sum
    const totalExpensesAmount = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const pendingRequestsCount = purchaseRequests.filter((pr) => pr.approvalStatus === 'Submitted').length;

    contentArea.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title"><i class="bi bi-receipt-cutoff text-primary"></i> ${t('navProcurement')}</h1>
          <p class="page-subtitle">আইটি হার্ডওয়্যার ক্রয় রিকোয়েস্ট, অপারেটিং খরচ ও ভেন্ডর সরবরাহকারী রেজিস্টার</p>
        </div>
        <div class="action-buttons">
          <button type="button" class="btn btn-primary btn-sm" id="btn-add-expense">
            <i class="bi bi-plus-lg me-1"></i> নতুন খরচ এন্ট্রি
          </button>
          <button type="button" class="btn btn-outline-primary btn-sm" id="btn-add-purchase-request">
            <i class="bi bi-cart-plus me-1"></i> ক্রয় প্রস্তাবনা তৈরি
          </button>
        </div>
      </div>

      <!-- Quick Metrics -->
      <div class="row g-3 mb-4">
        <div class="col-12 col-sm-4">
          <div class="kpi-card">
            <div class="kpi-icon-wrapper kpi-icon-teal">
              <i class="bi bi-cash-stack"></i>
            </div>
            <div class="kpi-info">
              <div class="kpi-value">${formatCurrency(totalExpensesAmount)}</div>
              <div class="kpi-label">মোট রেকর্ডকৃত আইটি খরচ</div>
              <div class="kpi-subtext text-muted">${expenses.length} টি ভাউচার এন্ট্রি</div>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-4">
          <div class="kpi-card">
            <div class="kpi-icon-wrapper kpi-icon-amber">
              <i class="bi bi-cart-check-fill"></i>
            </div>
            <div class="kpi-info">
              <div class="kpi-value">${purchaseRequests.length}</div>
              <div class="kpi-label">ক্রয় প্রস্তাবনা (Requisitions)</div>
              <div class="kpi-subtext ${pendingRequestsCount > 0 ? 'text-danger' : 'text-muted'}">
                ${pendingRequestsCount} টি অনুমোদনের অপেক্ষমাণ
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-4">
          <div class="kpi-card">
            <div class="kpi-icon-wrapper kpi-icon-blue">
              <i class="bi bi-truck"></i>
            </div>
            <div class="kpi-info">
              <div class="kpi-value">${vendors.length}</div>
              <div class="kpi-label">নিবন্ধিত ভেন্ডর ও সরবরাহকারী</div>
              <div class="kpi-subtext text-success">সক্রিয় কর্পোরেট পার্টনার</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Purchase Requests Table Card -->
      <div class="card-custom mb-4">
        <div class="card-custom-header">
          <h5 class="card-custom-title"><i class="bi bi-cart3 text-navy"></i> আইটি যন্ত্রপাতি ক্রয় রিকোয়েস্ট তালিকা</h5>
        </div>
        <div class="card-custom-body p-0">
          <div class="table-responsive-custom">
            <table class="table-custom">
              <thead>
                <tr>
                  <th>রিকোয়েস্ট কোড</th>
                  <th>প্রস্তাবিত সামগ্রী ও স্পেসিফিকেশন</th>
                  <th>পরিমাণ</th>
                  <th>আনুমানিক মূল্য</th>
                  <th>অনুরোধকারী</th>
                  <th>অগ্রাধিকার</th>
                  <th>অনুমোদনের অবস্থা</th>
                </tr>
              </thead>
              <tbody>
                ${
                  purchaseRequests.map((pr) => `
                    <tr>
                      <td><strong class="text-primary font-monospace">${escapeHtml(pr.requestCode || 'PR-000')}</strong></td>
                      <td>
                        <strong>${escapeHtml(pr.itemTitle)}</strong><br>
                        <small class="text-muted">${escapeHtml(pr.specifications || '')}</small>
                      </td>
                      <td><strong>${pr.quantity}</strong></td>
                      <td><span class="text-navy fw-semibold">${formatCurrency(pr.estimatedCost)}</span></td>
                      <td><small>${escapeHtml(pr.requestedBy)}</small></td>
                      <td>${renderPriorityBadge(pr.priority)}</td>
                      <td>${renderStatusBadge(pr.approvalStatus)}</td>
                    </tr>
                  `).join('') || '<tr><td colspan="7" class="text-center py-4 text-muted">কোনো ক্রয় রিকোয়েস্ট নেই</td></tr>'
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Expenses Table Card -->
      <div class="card-custom mb-4">
        <div class="card-custom-header">
          <h5 class="card-custom-title"><i class="bi bi-wallet2 text-navy"></i> আইটি অপারেশনাল ব্যয় ও সার্ভিস ভাউচার</h5>
        </div>
        <div class="card-custom-body p-0">
          <div class="table-responsive-custom">
            <table class="table-custom">
              <thead>
                <tr>
                  <th>ভাউচার কোড</th>
                  <th>তারিখ</th>
                  <th>খরচের খাত (Category)</th>
                  <th>বিবরণ</th>
                  <th>ভেন্ডর</th>
                  <th>পরিমাণ (টাকা)</th>
                  <th>পেমেন্ট মেথড</th>
                  <th>অবস্থা</th>
                </tr>
              </thead>
              <tbody>
                ${
                  expenses.map((exp) => `
                    <tr>
                      <td><strong class="text-navy font-monospace">${escapeHtml(exp.expenseCode || 'EXP-000')}</strong></td>
                      <td class="small text-muted">${formatDate(exp.date)}</td>
                      <td><span class="badge bg-light text-dark border">${escapeHtml(exp.category)}</span></td>
                      <td>${escapeHtml(exp.description)}</td>
                      <td><small>${escapeHtml(exp.vendorName || '—')}</small></td>
                      <td><strong class="text-success">${formatCurrency(exp.amount)}</strong></td>
                      <td><small class="text-muted">${escapeHtml(exp.paymentMethod || 'Cash')}</small></td>
                      <td>${renderStatusBadge(exp.approvalStatus)}</td>
                    </tr>
                  `).join('') || '<tr><td colspan="8" class="text-center py-4 text-muted">কোনো খরচ রেকর্ড নেই</td></tr>'
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Vendors Table Card -->
      <div class="card-custom">
        <div class="card-custom-header">
          <h5 class="card-custom-title"><i class="bi bi-building text-navy"></i> অনুমোদিত ভেন্ডর ও প্রযুক্তি সরবরাহকারী</h5>
        </div>
        <div class="card-custom-body p-0">
          <div class="table-responsive-custom">
            <table class="table-custom">
              <thead>
                <tr>
                  <th>কোম্পানির নাম</th>
                  <th>যোগাযোগ ব্যক্তি</th>
                  <th>ফোন নম্বর</th>
                  <th>ইমেইল</th>
                  <th>সরবরাহ ও সেবা</th>
                  <th>অবস্থা</th>
                </tr>
              </thead>
              <tbody>
                ${
                  vendors.map((v) => `
                    <tr>
                      <td><strong>${escapeHtml(v.name)}</strong></td>
                      <td>${escapeHtml(v.contactPerson || '—')}</td>
                      <td><code>${escapeHtml(v.phone || '—')}</code></td>
                      <td><small class="text-muted">${escapeHtml(v.email || '—')}</small></td>
                      <td><small>${escapeHtml(v.servicesOffered || '—')}</small></td>
                      <td>${renderStatusBadge(v.status)}</td>
                    </tr>
                  `).join('') || '<tr><td colspan="6" class="text-center py-4 text-muted">কোনো ভেন্ডর নেই</td></tr>'
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  },

  bindEvents() {
    const addExpenseBtn = document.getElementById('btn-add-expense');
    if (addExpenseBtn) {
      addExpenseBtn.addEventListener('click', () => this.showAddExpenseModal());
    }

    const addPrBtn = document.getElementById('btn-add-purchase-request');
    if (addPrBtn) {
      addPrBtn.addEventListener('click', () => this.showAddPurchaseRequestModal());
    }
  },

  showAddExpenseModal() {
    const nextCode = generateSequentialCode('EXP-2026-', expenses, 'expenseCode');

    const formHtml = `
      <form id="add-expense-form">
        <div class="row g-2">
          <div class="col-12 col-md-4">
            <label class="form-label small fw-semibold">ভাউচার কোড</label>
            <input type="text" class="form-control form-control-sm" id="form-exp-code" value="${nextCode}" readonly>
          </div>
          <div class="col-12 col-md-8">
            <label class="form-label small fw-semibold">খরচের বিবরণ <span class="text-danger">*</span></label>
            <input type="text" class="form-control form-control-sm" id="form-exp-desc" placeholder="যেমন: ইমার্জেন্সি প্রিন্টার টোনার ক্রয়" required>
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">খরচের খাত (Category)</label>
            <select class="form-select form-select-sm" id="form-exp-cat">
              <option value="Toner/Cartridge">টোনার / কার্টিজ সরবরাহ</option>
              <option value="Hardware">নতুন হার্ডওয়্যার ও এক্সেসরিজ</option>
              <option value="Internet/ISP">ইন্টারনেট ও ব্যান্ডউইথ বিল</option>
              <option value="Repair">মেরামত ও সার্ভিসিং ফি</option>
              <option value="Software/License">সফটওয়্যার ও লাইসেন্স ফি</option>
              <option value="CCTV">সিসিটিভি ও সিকিউরিটি সামগ্রী</option>
              <option value="Other">অন্যান্য</option>
            </select>
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">পরিমাণ (BDT টাকা) <span class="text-danger">*</span></label>
            <input type="number" class="form-control form-control-sm" id="form-exp-amount" placeholder="9500" required>
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">তারিখ</label>
            <input type="date" class="form-control form-control-sm" id="form-exp-date" value="${new Date().toISOString().split('T')[0]}" required>
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">ভেন্ডর / সরবরাহকারী</label>
            <select class="form-select form-select-sm" id="form-exp-vendor">
              ${vendors.map((v) => `<option value="${v.name}">${escapeHtml(v.name)}</option>`).join('')}
            </select>
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">পেমেন্ট মেথড</label>
            <input type="text" class="form-control form-control-sm" id="form-exp-payment" placeholder="Office Cash / Cheque">
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">অনুমোদন স্ট্যাটাস</label>
            <select class="form-select form-select-sm" id="form-exp-status">
              <option value="Paid" selected>Paid (পরিশোধিত)</option>
              <option value="Approved">Approved (অনুমোদিত)</option>
              <option value="Draft">Draft (খসড়া)</option>
            </select>
          </div>
        </div>
      </form>
    `;

    modal.show({
      title: '<i class="bi bi-receipt text-primary"></i> নতুন আইটি ব্যয় ভাউচার এন্ট্রি',
      body: formHtml,
      size: 'md',
      confirmText: 'সংরক্ষণ করুন',
      onConfirm: async () => {
        const desc = document.getElementById('form-exp-desc').value.trim();
        const cat = document.getElementById('form-exp-cat').value;
        const amount = Number(document.getElementById('form-exp-amount').value) || 0;
        const date = document.getElementById('form-exp-date').value;
        const vendorName = document.getElementById('form-exp-vendor').value;
        const payment = document.getElementById('form-exp-payment').value.trim();
        const status = document.getElementById('form-exp-status').value;

        if (!desc || amount <= 0) {
          notifications.showToast('ভ্যালিডেশন এরর', 'বিবরণ ও সঠিক টাকার অঙ্ক দিন।', 'danger');
          return;
        }

        await repository.add(STORES.EXPENSES, {
          expenseCode: nextCode,
          description: desc,
          category: cat,
          amount,
          date,
          vendorName,
          paymentMethod: payment || 'Cash',
          approvalStatus: status
        });

        await repository.logActivity('ADD_EXPENSE', 'Expenses', nextCode, `Added expense: ${desc} (BDT ${amount})`);

        modal.hide();
        notifications.showToast('খরচ সংরক্ষিত', `ভাউচার ${nextCode} সফলভাবে সেভ হয়েছে।`, 'success');
        await this.render();
      }
    });
  },

  showAddPurchaseRequestModal() {
    const nextCode = generateSequentialCode('PR-2026-', purchaseRequests, 'requestCode');

    const formHtml = `
      <form id="add-pr-form">
        <div class="row g-2">
          <div class="col-12 col-md-4">
            <label class="form-label small fw-semibold">রিকোয়েস্ট কোড</label>
            <input type="text" class="form-control form-control-sm" id="form-pr-code" value="${nextCode}" readonly>
          </div>
          <div class="col-12 col-md-8">
            <label class="form-label small fw-semibold">প্রস্তাবিত সামগ্রী <span class="text-danger">*</span></label>
            <input type="text" class="form-control form-control-sm" id="form-pr-item" placeholder="যেমন: HP 76A Toner Cartridge (4 pcs)" required>
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">পরিমাণ (Quantity) <span class="text-danger">*</span></label>
            <input type="number" class="form-control form-control-sm" id="form-pr-qty" value="1" min="1" required>
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">আনুমানিক মূল্য (BDT) <span class="text-danger">*</span></label>
            <input type="number" class="form-control form-control-sm" id="form-pr-cost" placeholder="38000" required>
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">অনুরোধকারী</label>
            <input type="text" class="form-control form-control-sm" id="form-pr-requester" value="মোঃ কামরুল হাসান (আইটি অফিসার)">
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">অগ্রাধিকার</label>
            <select class="form-select form-select-sm" id="form-pr-priority">
              <option value="Medium">সাধারণ (Medium)</option>
              <option value="High" selected>জরুরি (High)</option>
              <option value="Critical">মারাত্মক জরুরি (Critical)</option>
            </select>
          </div>
          <div class="col-12">
            <label class="form-label small fw-semibold">প্রয়োজনীয়তার কারণ</label>
            <textarea class="form-control form-control-sm" id="form-pr-reason" rows="2" placeholder="কেন এই সামগ্রী ক্রয় করা প্রয়োজন..."></textarea>
          </div>
        </div>
      </form>
    `;

    modal.show({
      title: '<i class="bi bi-cart-plus text-primary"></i> নতুন আইটি ক্রয় প্রস্তাবনা সাবমিট',
      body: formHtml,
      size: 'md',
      confirmText: 'রিকোয়েস্ট সাবমিট',
      onConfirm: async () => {
        const item = document.getElementById('form-pr-item').value.trim();
        const qty = Number(document.getElementById('form-pr-qty').value) || 1;
        const cost = Number(document.getElementById('form-pr-cost').value) || 0;
        const requester = document.getElementById('form-pr-requester').value.trim();
        const priority = document.getElementById('form-pr-priority').value;
        const reason = document.getElementById('form-pr-reason').value.trim();

        if (!item || cost <= 0) {
          notifications.showToast('ভ্যালিডেশন এরর', 'সামগ্রীর নাম ও আনুমানিক মূল্য প্রদান আবশ্যক।', 'danger');
          return;
        }

        await repository.add(STORES.PURCHASE_REQUESTS, {
          requestCode: nextCode,
          itemTitle: item,
          quantity: qty,
          estimatedCost: cost,
          requestedBy: requester,
          priority,
          reason,
          approvalStatus: 'Submitted',
          createdAt: new Date().toISOString()
        });

        await repository.logActivity('CREATE_PURCHASE_REQUEST', 'Procurement', nextCode, `Created purchase request for ${item}`);

        modal.hide();
        notifications.showToast('প্রস্তাবনা সাবমিট সম্পন্ন', `রিকোয়েস্ট ${nextCode} অনুমোদনের জন্য অপেক্ষমাণ রয়েছে।`, 'success');
        await this.render();
      }
    });
  }
};

