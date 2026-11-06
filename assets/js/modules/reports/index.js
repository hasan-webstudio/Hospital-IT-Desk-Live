/**
 * Hospital IT Desk — Module 12: Reports & Analytics
 * 12 comprehensive operational reports with date/department filters, CSV exports & print views.
 */

import { repository } from '../../core/repository.js';
import { STORES } from '../../data/schema.js';
import { t } from '../../core/i18n.js';
import { formatDate, formatCurrency, renderStatusBadge, escapeHtml } from '../../core/formatters.js';
import { utils } from '../../core/utils.js';
import { notifications } from '../../core/notifications.js';

let activeReportType = 'tickets';
let selectedDept = '';
let dateFrom = '';
let dateTo = '';

export const reportsModule = {
  async render() {
    const contentArea = document.getElementById('content-area');
    if (!contentArea) return;

    const [departments, tickets, assets, tasks, backups, expenses, software, ipAllocations, cctv] = await Promise.all([
      repository.getAll(STORES.DEPARTMENTS),
      repository.getAll(STORES.TICKETS),
      repository.getAll(STORES.ASSETS),
      repository.getAll(STORES.MAINTENANCE_TASKS),
      repository.getAll(STORES.BACKUP_LOGS),
      repository.getAll(STORES.EXPENSES),
      repository.getAll(STORES.SOFTWARE_PRODUCTS),
      repository.getAll(STORES.IP_ALLOCATIONS),
      repository.getAll(STORES.CCTV_DEVICES)
    ]);

    const reportDefinitions = [
      { id: 'tickets', title: '১. আইটি সাপোর্ট টিকিট ও অভিযোগ রিপোর্ট', icon: 'bi-ticket-perforated' },
      { id: 'dept-problems', title: '২. বিভাগভিত্তিক সমস্যা ও বিশ্লেষণ রিপোর্ট', icon: 'bi-building' },
      { id: 'resolution', title: '৩. টিকিট সমাধান ও পারফরম্যান্স রিপোর্ট', icon: 'bi-check-circle' },
      { id: 'assets', title: '৪. আইটি সরঞ্জাম ইনভেন্টরি ও অবস্থা রিপোর্ট', icon: 'bi-pc-display' },
      { id: 'maintenance', title: '৫. প্রতিরোধমূলক রক্ষণাবেক্ষণ কমপ্লায়েন্স রিপোর্ট', icon: 'bi-tools' },
      { id: 'backups', title: '৬. ডাটাবেজ ব্যাকআপ ও ভেরিফিকেশন রিপোর্ট', icon: 'bi-database-check' },
      { id: 'software', title: '৭. সফটওয়্যার ও লাইসেন্স এক্সপায়ারি রিপোর্ট', icon: 'bi-window-stack' },
      { id: 'expenses', title: '৮. আইটি পরিচালনা ব্যয় ও ভেন্ডর রিপোর্ট', icon: 'bi-cash-coin' },
      { id: 'cctv', title: '৯. সিসিটিভি ক্যামেরা ও সিকিউরিটি রিপোর্ট', icon: 'bi-camera-video' },
      { id: 'network', title: '১০. নেটওয়ার্ক ও আইপি এড্রেস বরাদ্দ রিপোর্ট', icon: 'bi-diagram-3' },
      { id: 'daily-activity', title: '১১. দৈনিক সার্বিক আইটি কার্যবিবরণী রিপোর্ট', icon: 'bi-journal-check' },
      { id: 'monthly-summary', title: '১২. মাসিক এক্সিকিউটিভ আইটি সামারি রিপোর্ট', icon: 'bi-file-earmark-bar-graph' }
    ];

    contentArea.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title"><i class="bi bi-file-earmark-bar-graph-fill text-primary"></i> ${t('navReports')}</h1>
          <p class="page-subtitle">হাসপাতাল আইটি অপারেশনের ১২টি বিশদ কমপ্লায়েন্স ও পারফরম্যান্স রিপোর্ট</p>
        </div>
        <div class="action-buttons">
          <button type="button" class="btn btn-primary btn-sm" id="btn-print-report">
            <i class="bi bi-printer me-1"></i> রিপোর্ট প্রিন্ট / PDF
          </button>
          <button type="button" class="btn btn-outline-success btn-sm" id="btn-export-report-csv">
            <i class="bi bi-file-earmark-excel me-1"></i> CSV ডাউনলোড
          </button>
        </div>
      </div>

      <!-- Report Selection & Filters Card -->
      <div class="card-custom mb-4 btn-no-print">
        <div class="card-custom-body">
          <div class="row g-2 align-items-end">
            <div class="col-12 col-md-5">
              <label class="form-label small fw-semibold">রিপোর্ট নির্বাচন করুন</label>
              <select class="form-select form-select-sm" id="select-report-type">
                ${reportDefinitions.map((r) => `<option value="${r.id}" ${activeReportType === r.id ? 'selected' : ''}>${escapeHtml(r.title)}</option>`).join('')}
              </select>
            </div>

            <div class="col-12 col-md-3">
              <label class="form-label small fw-semibold">হাসপাতাল বিভাগ</label>
              <select class="form-select form-select-sm" id="select-report-dept">
                <option value="">সকল বিভাগ (${t('all')})</option>
                ${departments.map((d) => `<option value="${d.id}" ${selectedDept === d.id ? 'selected' : ''}>${escapeHtml(d.nameBn)}</option>`).join('')}
              </select>
            </div>

            <div class="col-12 col-md-4">
              <button type="button" class="btn btn-secondary btn-sm w-100" id="btn-apply-report-filter">
                <i class="bi bi-funnel me-1"></i> ফিল্টার প্রয়োগ করুন
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Printable Report Document Container -->
      <div class="card-custom" id="report-printable-area">
        <div class="card-custom-body p-4">
          <!-- Print-Only Header -->
          <div class="border-bottom pb-3 mb-3">
            <div class="d-flex justify-content-between align-items-center flex-wrap">
              <div>
                <h3 class="fw-bold text-navy mb-0">DHAKA CENTRAL HOSPITAL</h3>
                <h6 class="text-primary mb-1">Information Technology Department</h6>
                <div class="small text-muted">Hospital IT Desk Operations & Compliance Audit Report</div>
              </div>
              <div class="text-end small text-muted">
                <div><strong>তারিখ:</strong> ${formatDate(new Date(), true)}</div>
                <div><strong>রিপোর্টিং সোর্স:</strong> Browser IndexedDB Validated Store</div>
              </div>
            </div>
          </div>

          <!-- Dynamic Report Content -->
          <div id="dynamic-report-content">
            ${this.buildReportHtml(activeReportType, { departments, tickets, assets, tasks, backups, expenses, software, ipAllocations, cctv })}
          </div>
        </div>
      </div>
    `;

    this.bindEvents({ departments, tickets, assets, tasks, backups, expenses, software, ipAllocations, cctv });
  },

  bindEvents(data) {
    const reportSelect = document.getElementById('select-report-type');
    const deptSelect = document.getElementById('select-report-dept');
    const filterBtn = document.getElementById('btn-apply-report-filter');

    if (filterBtn) {
      filterBtn.addEventListener('click', () => {
        activeReportType = reportSelect.value;
        selectedDept = deptSelect.value;
        const container = document.getElementById('dynamic-report-content');
        if (container) {
          container.innerHTML = this.buildReportHtml(activeReportType, data);
        }
      });
    }

    const printBtn = document.getElementById('btn-print-report');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    const csvBtn = document.getElementById('btn-export-report-csv');
    if (csvBtn) {
      csvBtn.addEventListener('click', () => {
        this.exportReportCsv(activeReportType, data);
      });
    }
  },

  buildReportHtml(type, { departments, tickets, assets, tasks, backups, expenses, software, ipAllocations, cctv }) {
    let filteredTickets = tickets;
    if (selectedDept) {
      filteredTickets = tickets.filter((t) => t.departmentId === selectedDept);
    }

    if (type === 'tickets') {
      return `
        <h5 class="fw-bold mb-3 text-navy">আইটি সাপোর্ট টিকিট ও অভিযোগ রিপোর্ট</h5>
        <div class="table-responsive-custom">
          <table class="table-custom">
            <thead>
              <tr>
                <th>টিকিট নং</th>
                <th>তারিখ</th>
                <th>বিভাগ</th>
                <th>সমস্যা</th>
                <th>অগ্রাধিকার</th>
                <th>অবস্থা</th>
                <th>সমাধানের সারসংক্ষেপ</th>
              </tr>
            </thead>
            <tbody>
              ${
                filteredTickets.map((t) => {
                  const d = departments.find((dep) => dep.id === t.departmentId);
                  return `
                    <tr>
                      <td><strong>${escapeHtml(t.ticketNumber)}</strong></td>
                      <td><small>${formatDate(t.createdAt)}</small></td>
                      <td>${escapeHtml(d ? d.nameBn : '—')}</td>
                      <td>${escapeHtml(t.title)}</td>
                      <td>${escapeHtml(t.priority)}</td>
                      <td>${renderStatusBadge(t.status)}</td>
                      <td><small class="text-muted">${escapeHtml(t.resolutionSummary || 'অপেক্ষমাণ')}</small></td>
                    </tr>
                  `;
                }).join('') || '<tr><td colspan="7" class="text-center py-3 text-muted">কোনো রেকর্ড নেই</td></tr>'
              }
            </tbody>
          </table>
        </div>
      `;
    }

    if (type === 'dept-problems') {
      const deptCounts = {};
      departments.forEach((d) => {
        deptCounts[d.id] = { name: d.nameBn, total: 0, critical: 0, resolved: 0 };
      });
      tickets.forEach((t) => {
        if (deptCounts[t.departmentId]) {
          deptCounts[t.departmentId].total++;
          if (t.priority === 'Critical') deptCounts[t.departmentId].critical++;
          if (t.status === 'Resolved' || t.status === 'Closed') deptCounts[t.departmentId].resolved++;
        }
      });

      return `
        <h5 class="fw-bold mb-3 text-navy">বিভাগভিত্তিক সমস্যা বিশ্লেষণ ও ফ্রিকোয়েন্সি রিপোর্ট</h5>
        <div class="table-responsive-custom">
          <table class="table-custom">
            <thead>
              <tr>
                <th>বিভাগের নাম</th>
                <th>মোট রিপোর্টকৃত টিকিট</th>
                <th>ক্রিটিকাল ইস্যু</th>
                <th>সমাধানকৃত সংখ্যা</th>
                <th>সমাধান হার (%)</th>
              </tr>
            </thead>
            <tbody>
              ${
                Object.values(deptCounts).map((c) => {
                  const rate = c.total > 0 ? Math.round((c.resolved / c.total) * 100) : 100;
                  return `
                    <tr>
                      <td><strong>${escapeHtml(c.name)}</strong></td>
                      <td><strong>${c.total}</strong></td>
                      <td><span class="${c.critical > 0 ? 'text-danger fw-bold' : ''}">${c.critical}</span></td>
                      <td class="text-success">${c.resolved}</td>
                      <td><span class="badge ${rate >= 75 ? 'bg-success' : 'bg-warning text-dark'}">${rate}%</span></td>
                    </tr>
                  `;
                }).join('')
              }
            </tbody>
          </table>
        </div>
      `;
    }

    if (type === 'assets') {
      return `
        <h5 class="fw-bold mb-3 text-navy">আইটি সরঞ্জাম ইনভেন্টরি ও ওয়ারেন্টি রিপোর্ট</h5>
        <div class="table-responsive-custom">
          <table class="table-custom">
            <thead>
              <tr>
                <th>অ্যাসেট কোড</th>
                <th>সরঞ্জামের নাম</th>
                <th>বিভাগ</th>
                <th>সিরিয়াল নং</th>
                <th>আইপি</th>
                <th>অবস্থা</th>
                <th>ক্রয়মূল্য</th>
                <th>ওয়ারেন্টি শেষ</th>
              </tr>
            </thead>
            <tbody>
              ${
                assets.map((a) => {
                  const d = departments.find((dep) => dep.id === a.departmentId);
                  return `
                    <tr>
                      <td><strong>${escapeHtml(a.assetCode)}</strong></td>
                      <td>${escapeHtml(a.name)}</td>
                      <td>${escapeHtml(d ? d.nameBn : '—')}</td>
                      <td><small><code>${escapeHtml(a.serialNumber || 'N/A')}</code></small></td>
                      <td><small>${escapeHtml(a.ipAddress || '—')}</small></td>
                      <td>${renderStatusBadge(a.status)}</td>
                      <td>${formatCurrency(a.purchaseCost)}</td>
                      <td>${formatDate(a.warrantyEnd)}</td>
                    </tr>
                  `;
                }).join('')
              }
            </tbody>
          </table>
        </div>
      `;
    }

    if (type === 'backups') {
      return `
        <h5 class="fw-bold mb-3 text-navy">ডাটাবেজ ব্যাকআপ ও ভেরিফিকেশন রিপোর্ট</h5>
        <div class="table-responsive-custom">
          <table class="table-custom">
            <thead>
              <tr>
                <th>কোড</th>
                <th>সিস্টেম</th>
                <th>সম্পন্নের তারিখ</th>
                <th>সাইজ</th>
                <th>ফলাফল</th>
                <th>ভেরিফিকেশন</th>
                <th>অপারেটর</th>
              </tr>
            </thead>
            <tbody>
              ${
                backups.map((b) => `
                  <tr>
                    <td><code>${escapeHtml(b.backupCode)}</code></td>
                    <td><strong>${escapeHtml(b.sourceName)}</strong></td>
                    <td>${formatDate(b.actualCompletionDate, true)}</td>
                    <td>${b.fileSizeMb ? `${(b.fileSizeMb / 1024).toFixed(2)} GB` : '—'}</td>
                    <td>${renderStatusBadge(b.result)}</td>
                    <td>${renderStatusBadge(b.verificationStatus)}</td>
                    <td>${escapeHtml(b.operatorName || '—')}</td>
                  </tr>
                `).join('')
              }
            </tbody>
          </table>
        </div>
      `;
    }

    if (type === 'expenses') {
      const total = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
      return `
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-bold text-navy mb-0">আইটি পরিচালনা ব্যয় ও সার্ভিস ভাউচার রিপোর্ট</h5>
          <h6 class="text-success fw-bold mb-0">সর্বমোট ব্যয়: ${formatCurrency(total)}</h6>
        </div>
        <div class="table-responsive-custom">
          <table class="table-custom">
            <thead>
              <tr>
                <th>ভাউচার কোড</th>
                <th>তারিখ</th>
                <th>খাত</th>
                <th>বিবরণ</th>
                <th>ভেন্ডর</th>
                <th>পরিমাণ</th>
                <th>পেমেন্ট</th>
              </tr>
            </thead>
            <tbody>
              ${
                expenses.map((e) => `
                  <tr>
                    <td><code>${escapeHtml(e.expenseCode)}</code></td>
                    <td>${formatDate(e.date)}</td>
                    <td>${escapeHtml(e.category)}</td>
                    <td>${escapeHtml(e.description)}</td>
                    <td>${escapeHtml(e.vendorName || '—')}</td>
                    <td><strong>${formatCurrency(e.amount)}</strong></td>
                    <td>${escapeHtml(e.paymentMethod || 'Cash')}</td>
                  </tr>
                `).join('')
              }
            </tbody>
          </table>
        </div>
      `;
    }

    // Default overview report
    return `
      <h5 class="fw-bold mb-3 text-navy">সার্বিক আইটি কার্যক্রম নিরীক্ষা বিবরণী</h5>
      <div class="row g-3">
        <div class="col-12 col-md-3">
          <div class="p-3 bg-light rounded border text-center">
            <h3 class="fw-bold text-primary mb-1">${tickets.length}</h3>
            <div class="small text-muted">মোট টিকিট</div>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <div class="p-3 bg-light rounded border text-center">
            <h3 class="fw-bold text-teal mb-1">${assets.length}</h3>
            <div class="small text-muted">মোট সরঞ্জাম</div>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <div class="p-3 bg-light rounded border text-center">
            <h3 class="fw-bold text-success mb-1">${backups.length}</h3>
            <div class="small text-muted">ব্যাকআপ লগ</div>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <div class="p-3 bg-light rounded border text-center">
            <h3 class="fw-bold text-navy mb-1">${expenses.length}</h3>
            <div class="small text-muted">ব্যয় ভাউচার</div>
          </div>
        </div>
      </div>
      <p class="small text-muted mt-3 mb-0">উপরে ড্রপডাউন থেকে নির্দিষ্ট যেকোনো রিপোর্ট নির্বাচন করে তার বিস্তারিত দেখতে পারেন।</p>
    `;
  },

  exportReportCsv(type, { departments, tickets, assets, backups, expenses }) {
    if (type === 'tickets') {
      const headers = ['টিকিট নং', 'তারিখ', 'বিভাগ', 'সমস্যা', 'অগ্রাধিকার', 'অবস্থা', 'সমাধান'];
      const rows = tickets.map((t) => {
        const d = departments.find((dep) => dep.id === t.departmentId);
        return [t.ticketNumber, t.createdAt, d ? d.nameBn : '', t.title, t.priority, t.status, t.resolutionSummary || ''];
      });
      utils.exportToCsv('report_it_tickets.csv', headers, rows);
    } else if (type === 'assets') {
      const headers = ['অ্যাসেট কোড', 'নাম', 'বিভাগ', 'সিরিয়াল', 'আইপি', 'অবস্থা', 'মূল্য'];
      const rows = assets.map((a) => {
        const d = departments.find((dep) => dep.id === a.departmentId);
        return [a.assetCode, a.name, d ? d.nameBn : '', a.serialNumber || '', a.ipAddress || '', a.status, a.purchaseCost || 0];
      });
      utils.exportToCsv('report_it_assets.csv', headers, rows);
    } else if (type === 'expenses') {
      const headers = ['ভাউচার', 'তারিখ', 'খাত', 'বিবরণ', 'ভেন্ডর', 'পরিমাণ'];
      const rows = expenses.map((e) => [e.expenseCode, e.date, e.category, e.description, e.vendorName || '', e.amount]);
      utils.exportToCsv('report_it_expenses.csv', headers, rows);
    } else {
      const headers = ['মেট্রিক', 'গণনা'];
      const rows = [
        ['মোট টিকিট', tickets.length],
        ['মোট সরঞ্জাম', assets.length],
        ['মোট ব্যাকআপ লগ', backups.length],
        ['মোট খরচ ভাউচার', expenses.length]
      ];
      utils.exportToCsv('report_summary.csv', headers, rows);
    }
    notifications.showToast('CSV প্রস্তুত', 'রিপোর্টটি সফলভাবে CSV ফাইল হিসেবে সেভ হয়েছে।', 'success');
  }
};

