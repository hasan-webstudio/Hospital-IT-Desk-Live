/**
 * Hospital IT Desk — Module 2: IT Support & Complaint Management
 * Complete ticket lifecycle: report, assign, update, resolve, reopen, comment, and print.
 */

import { repository } from '../../core/repository.js';
import { STORES } from '../../data/schema.js';
import { t } from '../../core/i18n.js';
import {
  formatDate,
  renderStatusBadge,
  renderPriorityBadge,
  escapeHtml,
  generateSequentialCode
} from '../../core/formatters.js';
import { modal } from '../../components/modal.js';
import { pagination } from '../../components/pagination.js';
import { notifications } from '../../core/notifications.js';
import { validation } from '../../core/validation.js';
import { permissions } from '../../core/permissions.js';

let currentTickets = [];
let allDepartments = [];
let allEmployees = [];
let allAssets = [];

let currentFilter = {
  search: '',
  status: '',
  priority: '',
  departmentId: '',
  page: 1,
  pageSize: 8
};

export const ticketsModule = {
  async render() {
    const contentArea = document.getElementById('content-area');
    if (!contentArea) return;

    // Load referenced data
    [currentTickets, allDepartments, allEmployees, allAssets] = await Promise.all([
      repository.getAll(STORES.TICKETS),
      repository.getAll(STORES.DEPARTMENTS),
      repository.getAll(STORES.EMPLOYEES),
      repository.getAll(STORES.ASSETS)
    ]);

    // Sort tickets descending by creation time
    currentTickets.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    this.renderView();
  },

  renderView() {
    const contentArea = document.getElementById('content-area');

    contentArea.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title"><i class="bi bi-ticket-perforated-fill text-primary"></i> ${t('navTickets')}</h1>
          <p class="page-subtitle">হাসপাতালের সকল আইটি সমস্যা, অভিযোগ, এসাইনমেন্ট ও রেজোলিউশন ট্র্যাকিং</p>
        </div>
        <div class="action-buttons">
          <button type="button" class="btn btn-primary btn-sm" id="btn-create-ticket">
            <i class="bi bi-plus-lg me-1"></i> নতুন টিকিট তৈরি করুন
          </button>
        </div>
      </div>

      <!-- Filter Toolbar -->
      <div class="filter-toolbar">
        <div class="filter-search-input">
          <input type="text" class="form-control form-control-sm" id="ticket-search" placeholder="টিকিট নং, শিরোনাম বা বিবরণ দিয়ে খুঁজুন..." value="${escapeHtml(currentFilter.search)}">
        </div>

        <select class="form-select form-select-sm" id="filter-ticket-status">
          <option value="">সকল অবস্থা (${t('all')})</option>
          <option value="New" ${currentFilter.status === 'New' ? 'selected' : ''}>নতুন (New)</option>
          <option value="Assigned" ${currentFilter.status === 'Assigned' ? 'selected' : ''}>বরাদ্দকৃত (Assigned)</option>
          <option value="In Progress" ${currentFilter.status === 'In Progress' ? 'selected' : ''}>চলমান (In Progress)</option>
          <option value="Waiting for User" ${currentFilter.status === 'Waiting for User' ? 'selected' : ''}>ইউজারের অপেক্ষায়</option>
          <option value="Waiting for Vendor" ${currentFilter.status === 'Waiting for Vendor' ? 'selected' : ''}>ভেন্ডরের অপেক্ষায়</option>
          <option value="Resolved" ${currentFilter.status === 'Resolved' ? 'selected' : ''}>সমাধানকৃত (Resolved)</option>
          <option value="Closed" ${currentFilter.status === 'Closed' ? 'selected' : ''}>বন্ধ (Closed)</option>
          <option value="Reopened" ${currentFilter.status === 'Reopened' ? 'selected' : ''}>পুনরায় খোলা (Reopened)</option>
        </select>

        <select class="form-select form-select-sm" id="filter-ticket-priority">
          <option value="">সকল অগ্রাধিকার</option>
          <option value="Critical" ${currentFilter.priority === 'Critical' ? 'selected' : ''}>মারাত্মক জরুরি (Critical)</option>
          <option value="High" ${currentFilter.priority === 'High' ? 'selected' : ''}>জরুরি (High)</option>
          <option value="Medium" ${currentFilter.priority === 'Medium' ? 'selected' : ''}>সাধারণ (Medium)</option>
          <option value="Low" ${currentFilter.priority === 'Low' ? 'selected' : ''}>নিম্ন (Low)</option>
        </select>

        <select class="form-select form-select-sm" id="filter-ticket-dept">
          <option value="">সকল বিভাগ</option>
          ${allDepartments.map((d) => `<option value="${d.id}" ${currentFilter.departmentId === d.id ? 'selected' : ''}>${escapeHtml(d.nameBn)}</option>`).join('')}
        </select>

        <button type="button" class="btn btn-sm btn-outline-secondary" id="btn-reset-ticket-filter">
          <i class="bi bi-arrow-counterclockwise"></i> রিসেট
        </button>
      </div>

      <!-- Tickets Table Card -->
      <div class="card-custom">
        <div class="card-custom-body p-0">
          <div class="table-responsive-custom">
            <table class="table-custom">
              <thead>
                <tr>
                  <th>টিকিট নং</th>
                  <th>সমস্যার বিবরণ / শিরোনাম</th>
                  <th>বিভাগ ও স্থান</th>
                  <th>ক্যাটাগরি</th>
                  <th>অগ্রাধিকার</th>
                  <th>অবস্থা</th>
                  <th>দায়িত্বপ্রাপ্ত</th>
                  <th>তারিখ ও সময়</th>
                  <th style="width: 100px;">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody id="ticket-table-body">
                <!-- Rows injected dynamically -->
              </tbody>
            </table>
          </div>
        </div>
        <div class="card-footer bg-surface border-top p-2" id="ticket-pagination-container">
          <!-- Pagination injected dynamically -->
        </div>
      </div>
    `;

    this.bindEvents();
    this.renderFilteredRows();
  },

  bindEvents() {
    const searchInput = document.getElementById('ticket-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentFilter.search = e.target.value;
        currentFilter.page = 1;
        this.renderFilteredRows();
      });
    }

    const statusFilter = document.getElementById('filter-ticket-status');
    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        currentFilter.status = e.target.value;
        currentFilter.page = 1;
        this.renderFilteredRows();
      });
    }

    const priorityFilter = document.getElementById('filter-ticket-priority');
    if (priorityFilter) {
      priorityFilter.addEventListener('change', (e) => {
        currentFilter.priority = e.target.value;
        currentFilter.page = 1;
        this.renderFilteredRows();
      });
    }

    const deptFilter = document.getElementById('filter-ticket-dept');
    if (deptFilter) {
      deptFilter.addEventListener('change', (e) => {
        currentFilter.departmentId = e.target.value;
        currentFilter.page = 1;
        this.renderFilteredRows();
      });
    }

    const resetBtn = document.getElementById('btn-reset-ticket-filter');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        currentFilter = { search: '', status: '', priority: '', departmentId: '', page: 1, pageSize: 8 };
        this.renderView();
      });
    }

    const createBtn = document.getElementById('btn-create-ticket');
    if (createBtn) {
      createBtn.addEventListener('click', () => this.showCreateTicketModal());
    }
  },

  renderFilteredRows() {
    const tbody = document.getElementById('ticket-table-body');
    if (!tbody) return;

    // Filter tickets
    const filtered = currentTickets.filter((t) => {
      const matchSearch =
        !currentFilter.search ||
        t.ticketNumber.toLowerCase().includes(currentFilter.search.toLowerCase()) ||
        t.title.toLowerCase().includes(currentFilter.search.toLowerCase()) ||
        (t.reportedBy && t.reportedBy.toLowerCase().includes(currentFilter.search.toLowerCase()));

      const matchStatus = !currentFilter.status || t.status === currentFilter.status;
      const matchPriority = !currentFilter.priority || t.priority === currentFilter.priority;
      const matchDept = !currentFilter.departmentId || t.departmentId === currentFilter.departmentId;

      return matchSearch && matchStatus && matchPriority && matchDept;
    });

    // Pagination
    const total = filtered.length;
    const start = (currentFilter.page - 1) * currentFilter.pageSize;
    const paginated = filtered.slice(start, start + currentFilter.pageSize);

    if (paginated.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" class="text-center py-4 text-muted">
            <i class="bi bi-inbox fs-2 text-muted d-block mb-1"></i>
            কোনো টিকিট পাওয়া যায়নি
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = paginated.map((tkt) => {
        const dept = allDepartments.find((d) => d.id === tkt.departmentId);
        return `
          <tr>
            <td>
              <a href="javascript:void(0)" class="fw-bold text-primary btn-view-ticket" data-id="${tkt.id}">
                ${escapeHtml(tkt.ticketNumber)}
              </a>
            </td>
            <td>
              <div class="fw-medium text-main text-truncate" style="max-width: 260px;" title="${escapeHtml(tkt.title)}">
                ${escapeHtml(tkt.title)}
              </div>
              <small class="text-muted"><i class="bi bi-person me-1"></i>${escapeHtml(tkt.reportedBy || '—')}</small>
            </td>
            <td>
              <div>${escapeHtml(dept ? dept.nameBn : '—')}</div>
              <small class="text-muted">${escapeHtml(tkt.location || '—')}</small>
            </td>
            <td><span class="badge bg-light text-dark border">${escapeHtml(tkt.category || 'Other')}</span></td>
            <td>${renderPriorityBadge(tkt.priority)}</td>
            <td>${renderStatusBadge(tkt.status)}</td>
            <td><small>${escapeHtml(tkt.assignedToName || 'অন্যাসাইনকৃত')}</small></td>
            <td class="small text-muted">${formatDate(tkt.createdAt, true)}</td>
            <td>
              <button type="button" class="btn btn-sm btn-outline-primary btn-view-ticket" data-id="${tkt.id}" title="বিস্তারিত ও সমাধান">
                <i class="bi bi-eye"></i> বিস্তারিত
              </button>
            </td>
          </tr>
        `;
      }).join('');

      tbody.querySelectorAll('.btn-view-ticket').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          this.showTicketDetailModal(id);
        });
      });
    }

    // Render pagination
    pagination.render({
      currentPage: currentFilter.page,
      totalItems: total,
      pageSize: currentFilter.pageSize,
      containerId: 'ticket-pagination-container',
      onPageChange: (newPage) => {
        currentFilter.page = newPage;
        this.renderFilteredRows();
      }
    });
  },

  /**
   * Show modal to create a new ticket
   */
  async showCreateTicketModal() {
    const nextTicketNumber = generateSequentialCode('TKT-2026-', currentTickets, 'ticketNumber');

    const itStaff = allEmployees.filter((e) => e.departmentId === 'dept-10');

    const bodyHtml = `
      <form id="create-ticket-form">
        <div class="row g-3">
          <div class="col-12 col-md-4">
            <label class="form-label small fw-semibold">টিকিট নং (স্বয়ংক্রিয়)</label>
            <input type="text" class="form-control form-control-sm" id="form-ticket-number" value="${nextTicketNumber}" readonly>
          </div>

          <div class="col-12 col-md-8">
            <label class="form-label small fw-semibold">সমস্যার শিরোনাম <span class="text-danger">*</span></label>
            <input type="text" class="form-control form-control-sm" id="form-ticket-title" placeholder="সংক্ষেপে সমস্যাটি লিখুন (যেমন: প্রিন্টারে পেপার জ্যাম)" required>
          </div>

          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">হাসপাতাল বিভাগ <span class="text-danger">*</span></label>
            <select class="form-select form-select-sm" id="form-ticket-dept" required>
              <option value="">বিভাগ নির্বাচন করুন...</option>
              ${allDepartments.map((d) => `<option value="${d.id}">${escapeHtml(d.nameBn)} (${escapeHtml(d.code)})</option>`).join('')}
            </select>
          </div>

          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">রিপোর্টকারী কর্মীর নাম / পদবি <span class="text-danger">*</span></label>
            <input type="text" class="form-control form-control-sm" id="form-ticket-reporter" placeholder="নাম ও পদবি লিখুন" required>
          </div>

          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">নির্দিষ্ট স্থান / রুম / কাউন্টার নং <span class="text-danger">*</span></label>
            <input type="text" class="form-control form-control-sm" id="form-ticket-location" placeholder="যেমন: নিচতলা, রিসেপশন কাউন্টার ০২" required>
          </div>

          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">ক্যাটাগরি</label>
            <select class="form-select form-select-sm" id="form-ticket-category">
              <option value="Computer">কম্পিউটার / ডেস্কটপ</option>
              <option value="Laptop">ল্যাপটপ</option>
              <option value="Monitor">মনিটর</option>
              <option value="Printer">প্রিন্টার</option>
              <option value="Scanner">বারকোড স্ক্যানার</option>
              <option value="Network">নেটওয়ার্ক ও ল্যান কেবল</option>
              <option value="Internet">ইন্টারনেট সংযোগ</option>
              <option value="CCTV">সিসিটিভি ক্যামেরা</option>
              <option value="HMS/Software">হাসপাতাল সফটওয়্যার (HMS)</option>
              <option value="Access/Login">লগইন বা পাসওয়ার্ড রিসেট</option>
              <option value="Server">সার্ভার ও ইউপিএস</option>
              <option value="Other">অন্যান্য</option>
            </select>
          </div>

          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">সম্পর্কিত অ্যাসেট / সরঞ্জাম (ঐচ্ছিক)</label>
            <select class="form-select form-select-sm" id="form-ticket-asset">
              <option value="">কোনো নির্দিষ্ট অ্যাসেট নেই</option>
              ${allAssets.map((a) => `<option value="${a.id}">${escapeHtml(a.assetCode)} — ${escapeHtml(a.name)}</option>`).join('')}
            </select>
          </div>

          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">অগ্রাধিকার (Priority)</label>
            <select class="form-select form-select-sm" id="form-ticket-priority">
              <option value="Medium" selected>সাধারণ (Medium)</option>
              <option value="High">জরুরি (High)</option>
              <option value="Critical">মারাত্মক জরুরি (Critical - রোগী সেবা ব্যাহত)</option>
              <option value="Low">নিম্ন (Low)</option>
            </select>
          </div>

          <div class="col-12">
            <label class="form-label small fw-semibold">সমস্যার বিস্তারিত বিবরণ <span class="text-danger">*</span></label>
            <textarea class="form-control form-control-sm" id="form-ticket-desc" rows="3" placeholder="সমস্যার লক্ষণ, কোনো এরর কোড বা বার্তা থাকলে বিস্তারিত লিখুন..." required></textarea>
          </div>

          <div class="col-12">
            <label class="form-label small fw-semibold">স্ক্রিনশট বা ছবি সংযুক্ত করুন (ঐচ্ছিক, সর্বোচ্চ ৩MB)</label>
            <input type="file" class="form-control form-control-sm" id="form-ticket-attachment" accept=".png,.jpg,.jpeg,.pdf,.txt">
            <div class="form-text small">নিরাপদ ফাইল: PNG, JPG, PDF। এক্সিকিউটেবল (.exe) ফাইল সম্পূর্ণ নিষিদ্ধ।</div>
          </div>
        </div>
      </form>
    `;

    modal.show({
      title: '<i class="bi bi-ticket-perforated text-primary"></i> নতুন আইটি সাপোর্ট টিকিট তৈরি',
      body: bodyHtml,
      size: 'lg',
      confirmText: 'টিকিট সাবমিট করুন',
      confirmClass: 'btn-primary',
      onConfirm: async () => {
        const title = document.getElementById('form-ticket-title').value.trim();
        const deptId = document.getElementById('form-ticket-dept').value;
        const reporter = document.getElementById('form-ticket-reporter').value.trim();
        const location = document.getElementById('form-ticket-location').value.trim();
        const desc = document.getElementById('form-ticket-desc').value.trim();
        const category = document.getElementById('form-ticket-category').value;
        const assetId = document.getElementById('form-ticket-asset').value;
        const priority = document.getElementById('form-ticket-priority').value;
        const fileInput = document.getElementById('form-ticket-attachment');

        if (!title || !deptId || !reporter || !desc) {
          notifications.showToast('ভ্যালিডেশন এরর', 'অনুগ্রহ করে আবশ্যকীয় সকল তথ্য পূরণ করুন।', 'danger');
          return;
        }

        let attachmentMeta = null;
        if (fileInput.files && fileInput.files[0]) {
          const file = fileInput.files[0];
          const check = validation.validateAttachment(file);
          if (!check.isValid) {
            notifications.showToast('ফাইল বাতিল', check.error, 'danger');
            return;
          }
          attachmentMeta = {
            name: file.name,
            size: file.size,
            type: file.type
          };
        }

        const newTicket = {
          ticketNumber: nextTicketNumber,
          title,
          description: desc,
          departmentId: deptId,
          reportedBy: reporter,
          location,
          category,
          assetId: assetId || null,
          priority,
          status: 'New',
          assignedToId: null,
          assignedToName: '',
          attachment: attachmentMeta,
          reportedAt: new Date().toISOString(),
          resolutionSummary: ''
        };

        const saved = await repository.add(STORES.TICKETS, newTicket);

        // Add to status history
        await repository.add(STORES.TICKET_STATUS_HISTORY, {
          ticketId: saved.id,
          oldStatus: 'None',
          newStatus: 'New',
          changedBy: reporter,
          timestamp: new Date().toISOString(),
          notes: 'Ticket submitted into portal'
        });

        // Add to activity logs
        await repository.logActivity('CREATE_TICKET', 'IT Tickets', saved.ticketNumber, `Ticket created: ${saved.title}`, reporter);

        modal.hide();
        notifications.showToast('টিকিট তৈরি হয়েছে', `টিকিট নং ${saved.ticketNumber} সফলভাবে নিবন্ধিত হয়েছে।`, 'success');

        await this.render();
      }
    });
  },

  /**
   * Show full details, workflow status change, assignment, comments & print
   * @param {string} ticketId
   */
  async showTicketDetailModal(ticketId) {
    const ticket = await repository.getById(STORES.TICKETS, ticketId);
    if (!ticket) {
      notifications.showToast('ত্রুটি', 'টিকিটটি খুঁজে পাওয়া যায়নি।', 'danger');
      return;
    }

    const [statusHistory, comments] = await Promise.all([
      repository.find(STORES.TICKET_STATUS_HISTORY, (h) => h.ticketId === ticketId),
      repository.find(STORES.TICKET_COMMENTS, (c) => c.ticketId === ticketId)
    ]);

    statusHistory.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    comments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const dept = allDepartments.find((d) => d.id === ticket.departmentId);
    const linkedAsset = allAssets.find((a) => a.id === ticket.assetId);
    const itStaff = allEmployees.filter((e) => e.departmentId === 'dept-10');

    const detailHtml = `
      <div class="ticket-detail-view" id="printable-ticket-sheet">
        <div class="print-only-header">
          <h3>Dhaka Central Hospital — IT Department Support Ticket</h3>
          <p>Ticket: ${escapeHtml(ticket.ticketNumber)} | Generated: ${formatDate(new Date(), true)}</p>
        </div>

        <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <div>
            <h4 class="mb-1 text-primary fw-bold">${escapeHtml(ticket.ticketNumber)}: ${escapeHtml(ticket.title)}</h4>
            <div class="small text-muted">
              <i class="bi bi-calendar me-1"></i> রিপোর্টকৃত: ${formatDate(ticket.createdAt, true)} |
              <i class="bi bi-geo-alt me-1"></i> ${escapeHtml(dept ? dept.nameBn : '—')} (${escapeHtml(ticket.location || '—')})
            </div>
          </div>
          <div class="d-flex gap-2">
            ${renderPriorityBadge(ticket.priority)}
            ${renderStatusBadge(ticket.status)}
            <button type="button" class="btn btn-sm btn-outline-secondary btn-no-print" id="btn-print-ticket">
              <i class="bi bi-printer"></i> প্রিন্ট
            </button>
          </div>
        </div>

        <!-- Problem Details Box -->
        <div class="card mb-3 border-light-subtle bg-light">
          <div class="card-body py-2 px-3">
            <h6 class="fw-semibold mb-1 small text-muted">সমস্যার বিস্তারিত বিবরণ:</h6>
            <p class="mb-1 text-main" style="white-space: pre-wrap;">${escapeHtml(ticket.description)}</p>
            <div class="d-flex justify-content-between small text-muted mt-2 border-top pt-1">
              <span><strong>রিপোর্টকারী:</strong> ${escapeHtml(ticket.reportedBy || '—')}</span>
              <span><strong>ক্যাটাগরি:</strong> ${escapeHtml(ticket.category)}</span>
              ${linkedAsset ? `<span><strong>সরঞ্জাম:</strong> <a href="#/assets">${escapeHtml(linkedAsset.assetCode)} (${escapeHtml(linkedAsset.name)})</a></span>` : ''}
            </div>
          </div>
        </div>

        ${
          ticket.resolutionSummary
            ? `<div class="alert alert-success py-2 px-3 mb-3">
                <h6 class="fw-bold mb-1"><i class="bi bi-check-circle-fill me-1"></i> সমাধানের সারসংক্ষেপ:</h6>
                <p class="mb-0 small">${escapeHtml(ticket.resolutionSummary)}</p>
                <div class="text-end small opacity-75 mt-1">সমাধানের সময়: ${formatDate(ticket.resolvedAt || ticket.updatedAt, true)}</div>
              </div>`
            : ''
        }

        <!-- Management & Action Controls (IT Operations) -->
        <div class="card mb-3 btn-no-print border">
          <div class="card-header bg-surface py-2">
            <strong class="small text-navy"><i class="bi bi-sliders me-1"></i> টিকিট পরিচালনা ও সমাধান কন্ট্রোল</strong>
          </div>
          <div class="card-body p-3">
            <div class="row g-2 align-items-end">
              <div class="col-12 col-md-4">
                <label class="form-label small fw-semibold">অবস্থা পরিবর্তন (Status)</label>
                <select class="form-select form-select-sm" id="detail-ticket-status">
                  <option value="New" ${ticket.status === 'New' ? 'selected' : ''}>New (নতুন)</option>
                  <option value="Assigned" ${ticket.status === 'Assigned' ? 'selected' : ''}>Assigned (বরাদ্দকৃত)</option>
                  <option value="In Progress" ${ticket.status === 'In Progress' ? 'selected' : ''}>In Progress (চলমান)</option>
                  <option value="Waiting for User" ${ticket.status === 'Waiting for User' ? 'selected' : ''}>Waiting for User</option>
                  <option value="Waiting for Vendor" ${ticket.status === 'Waiting for Vendor' ? 'selected' : ''}>Waiting for Vendor</option>
                  <option value="Resolved" ${ticket.status === 'Resolved' ? 'selected' : ''}>Resolved (সমাধানকৃত)</option>
                  <option value="Closed" ${ticket.status === 'Closed' ? 'selected' : ''}>Closed (সম্পূর্ণ বন্ধ)</option>
                  <option value="Reopened" ${ticket.status === 'Reopened' ? 'selected' : ''}>Reopened (পুনরায় খোলা)</option>
                </select>
              </div>

              <div class="col-12 col-md-4">
                <label class="form-label small fw-semibold">দায়িত্বপ্রাপ্ত আইটি কর্মী (Assignee)</label>
                <select class="form-select form-select-sm" id="detail-ticket-assignee">
                  <option value="">নির্বাচন করুন...</option>
                  ${itStaff.map((staff) => `<option value="${staff.id}" ${ticket.assignedToId === staff.id ? 'selected' : ''}>${escapeHtml(staff.nameBn)} (${escapeHtml(staff.designation)})</option>`).join('')}
                </select>
              </div>

              <div class="col-12 col-md-4">
                <button type="button" class="btn btn-primary btn-sm w-100" id="btn-update-ticket-status">
                  <i class="bi bi-check2-circle me-1"></i> অবস্থা আপডেট করুন
                </button>
              </div>

              <div class="col-12 mt-2" id="resolution-input-container" style="${ticket.status === 'Resolved' ? '' : 'display: none;'}">
                <label class="form-label small fw-semibold text-success">সমাধানের সারসংক্ষেপ ও কাজ (Resolution Summary) <span class="text-danger">*</span></label>
                <textarea class="form-control form-control-sm" id="detail-resolution-summary" rows="2" placeholder="কী পদক্ষেপ নেওয়া হয়েছে এবং সমস্যার সমাধান কীভাবে হলো লিখুন...">${escapeHtml(ticket.resolutionSummary || '')}</textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Comments & Internal Notes Thread -->
        <div class="card mb-3 btn-no-print">
          <div class="card-header bg-surface py-2 d-flex justify-content-between align-items-center">
            <strong class="small"><i class="bi bi-chat-left-text me-1"></i> মন্তব্য ও কাজের অগ্রগতি (${comments.length})</strong>
          </div>
          <div class="card-body p-3">
            <div class="comments-thread mb-3" style="max-height: 200px; overflow-y: auto;">
              ${
                comments.map((c) => `
                  <div class="p-2 mb-2 rounded ${c.isInternal ? 'bg-warning-subtle border-warning' : 'bg-light'} border">
                    <div class="d-flex justify-content-between align-items-center small mb-1">
                      <span class="fw-bold">${escapeHtml(c.author)} ${c.isInternal ? '<span class="badge bg-warning text-dark ms-1">অভ্যন্তরীণ নোট</span>' : ''}</span>
                      <span class="text-muted">${formatDate(c.createdAt, true)}</span>
                    </div>
                    <div class="small">${escapeHtml(c.comment)}</div>
                  </div>
                `).join('') || '<div class="text-muted small text-center py-2">কোনো মন্তব্য নেই</div>'
              }
            </div>

            <!-- Add Comment Form -->
            <div class="input-group input-group-sm">
              <input type="text" class="form-control" id="new-ticket-comment" placeholder="মন্তব্য বা অগ্রগতি লিখুন...">
              <div class="input-group-text">
                <input class="form-check-input mt-0 me-1" type="checkbox" id="comment-is-internal">
                <label class="form-check-label small" for="comment-is-internal">অভ্যন্তরীণ</label>
              </div>
              <button class="btn btn-outline-primary" type="button" id="btn-add-ticket-comment">যোগ করুন</button>
            </div>
          </div>
        </div>

        <!-- Status History Timeline -->
        <div class="card btn-no-print">
          <div class="card-header bg-surface py-2">
            <strong class="small text-muted"><i class="bi bi-clock-history me-1"></i> টিকিট হিস্টোরি ও ট্র্যাকিং লগ</strong>
          </div>
          <div class="card-body p-3">
            <div class="timeline">
              ${
                statusHistory.map((h) => `
                  <div class="timeline-item">
                    <div class="timeline-title">${renderStatusBadge(h.newStatus)} <span class="small text-muted fw-normal ms-1">(পূর্বে: ${escapeHtml(h.oldStatus)})</span></div>
                    <div class="timeline-meta">${formatDate(h.timestamp, true)} — <strong>${escapeHtml(h.changedBy || 'System')}</strong></div>
                    ${h.notes ? `<div class="timeline-body small">${escapeHtml(h.notes)}</div>` : ''}
                  </div>
                `).join('') || '<div class="text-muted small">কোনো হিস্টোরি লগ নেই</div>'
              }
            </div>
          </div>
        </div>
      </div>
    `;

    modal.show({
      title: `<i class="bi bi-ticket-perforated text-primary"></i> টিকিট বিস্তারিত: ${escapeHtml(ticket.ticketNumber)}`,
      body: detailHtml,
      size: 'lg',
      showConfirm: false,
      cancelText: 'বন্ধ করুন'
    });

    // Wire Print Button
    const printBtn = document.getElementById('btn-print-ticket');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Toggle Resolution Summary Visibility on status select
    const statusSelect = document.getElementById('detail-ticket-status');
    const resBox = document.getElementById('resolution-input-container');
    if (statusSelect && resBox) {
      statusSelect.addEventListener('change', (e) => {
        if (e.target.value === 'Resolved') {
          resBox.style.display = 'block';
        } else {
          resBox.style.display = 'none';
        }
      });
    }

    // Update Status Action
    const updateBtn = document.getElementById('btn-update-ticket-status');
    if (updateBtn) {
      updateBtn.addEventListener('click', async () => {
        const newStatus = statusSelect.value;
        const assigneeSelect = document.getElementById('detail-ticket-assignee');
        const assigneeId = assigneeSelect.value;
        const assigneeObj = itStaff.find((s) => s.id === assigneeId);
        const resSummary = document.getElementById('detail-resolution-summary')?.value.trim() || '';

        if (newStatus === 'Resolved' && !resSummary) {
          notifications.showToast('সমাধানের বিবরণ প্রয়োজন', 'টিকিট Resolved করার পূর্বে অনুগ্রহ করে সমাধানের সারসংক্ষেপ লিখুন।', 'warning');
          return;
        }

        const oldStatus = ticket.status;
        ticket.status = newStatus;
        if (assigneeObj) {
          ticket.assignedToId = assigneeObj.id;
          ticket.assignedToName = assigneeObj.nameBn;
        }

        if (newStatus === 'Resolved') {
          ticket.resolutionSummary = resSummary;
          ticket.resolvedAt = new Date().toISOString();
        } else if (newStatus === 'Closed') {
          ticket.closedAt = new Date().toISOString();
        }

        await repository.update(STORES.TICKETS, ticket);

        // Record history
        await repository.add(STORES.TICKET_STATUS_HISTORY, {
          ticketId: ticket.id,
          oldStatus,
          newStatus,
          changedBy: assigneeObj ? assigneeObj.nameBn : 'IT Officer',
          timestamp: new Date().toISOString(),
          notes: newStatus === 'Resolved' ? `Resolved: ${resSummary}` : `Status updated to ${newStatus}`
        });

        await repository.logActivity('UPDATE_TICKET_STATUS', 'IT Tickets', ticket.ticketNumber, `Status changed from ${oldStatus} to ${newStatus}`);

        notifications.showToast('আপডেট সফল', `টিকিট ${ticket.ticketNumber} এর অবস্থা পরিবর্তিত হয়েছে।`, 'success');
        modal.hide();
        await this.render();
      });
    }

    // Add Comment Action
    const addCommentBtn = document.getElementById('btn-add-ticket-comment');
    if (addCommentBtn) {
      addCommentBtn.addEventListener('click', async () => {
        const commentInput = document.getElementById('new-ticket-comment');
        const isInternalCheckbox = document.getElementById('comment-is-internal');
        const text = commentInput.value.trim();

        if (!text) return;

        await repository.add(STORES.TICKET_COMMENTS, {
          ticketId: ticket.id,
          author: 'আইটি সাপোর্ট ডেস্ক',
          comment: text,
          isInternal: isInternalCheckbox.checked,
          createdAt: new Date().toISOString()
        });

        commentInput.value = '';
        notifications.showToast('মন্তব্য যুক্ত হয়েছে', 'অগ্রগতি সফলভাবে সেভ হয়েছে।', 'success');
        this.showTicketDetailModal(ticketId); // refresh modal view
      });
    }
  }
};

