/**
 * Hospital IT Desk — Module 1: Dashboard / Overview
 * Displays live KPI metrics, Chart.js visual charts, recent activity, and quick actions.
 */

import { repository } from '../../core/repository.js';
import { STORES } from '../../data/schema.js';
import { t } from '../../core/i18n.js';
import { formatCurrency, formatDate, renderPriorityBadge, renderStatusBadge, escapeHtml } from '../../core/formatters.js';
import { permissions } from '../../core/permissions.js';

let chartInstances = [];

export const dashboardModule = {
  async render() {
    const contentArea = document.getElementById('content-area');
    if (!contentArea) return;

    // Clean up previous charts if any
    chartInstances.forEach((c) => {
      try { c.destroy(); } catch (e) {}
    });
    chartInstances = [];

    // Fetch actual records from IndexedDB
    const [assets, tickets, tasks, backups, software, expenses, activities, departments] = await Promise.all([
      repository.getAll(STORES.ASSETS),
      repository.getAll(STORES.TICKETS),
      repository.getAll(STORES.MAINTENANCE_TASKS),
      repository.getAll(STORES.BACKUP_LOGS),
      repository.getAll(STORES.SOFTWARE_PRODUCTS),
      repository.getAll(STORES.EXPENSES),
      repository.getAll(STORES.ACTIVITY_LOGS),
      repository.getAll(STORES.DEPARTMENTS)
    ]);

    // Calculate live KPI metrics
    const totalAssets = assets.length;
    const activeAssets = assets.filter((a) => a.status === 'Active').length;

    const openTickets = tickets.filter((t) => ['New', 'Assigned', 'In Progress'].includes(t.status));
    const criticalTickets = tickets.filter((t) => t.priority === 'Critical' && t.status !== 'Closed' && t.status !== 'Resolved');
    const resolvedTickets = tickets.filter((t) => t.status === 'Resolved' || t.status === 'Closed');

    const pendingTasks = tasks.filter((t) => t.status !== 'Completed');
    const overdueTasks = tasks.filter((t) => t.status === 'Overdue');

    // Latest backup
    const sortedBackups = [...backups].sort((a, b) => new Date(b.scheduledDate || 0) - new Date(a.scheduledDate || 0));
    const latestBackup = sortedBackups[0] || null;

    // Software/warranty approaching expiry (within 60 days)
    const now = new Date();
    const expiringSoftware = software.filter((s) => {
      if (!s.expiryDate) return false;
      const exp = new Date(s.expiryDate);
      const days = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
      return days >= 0 && days <= 60;
    });

    contentArea.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title"><i class="bi bi-grid-1x2-fill text-primary"></i> ${t('navDashboard')}</h1>
          <p class="page-subtitle">হাসপাতালের আইটি অপারেশন, টিকিট, সরঞ্জাম ও রক্ষণাবেক্ষণের সার্বিক চিত্র</p>
        </div>
        <div class="action-buttons">
          <a href="#/tickets" class="btn btn-primary btn-sm">
            <i class="bi bi-plus-lg me-1"></i> নতুন টিকিট তৈরি
          </a>
          <a href="#/assets" class="btn btn-outline-primary btn-sm">
            <i class="bi bi-pc-display me-1"></i> নতুন অ্যাসেট যুক্ত
          </a>
          <a href="#/backups" class="btn btn-outline-secondary btn-sm">
            <i class="bi bi-database me-1"></i> ব্যাকআপ রেজিস্টার
          </a>
        </div>
      </div>

      <!-- KPI Metrics Row -->
      <div class="row g-3 mb-4">
        <div class="col-12 col-sm-6 col-xl-3">
          <div class="kpi-card">
            <div class="kpi-icon-wrapper kpi-icon-blue">
              <i class="bi bi-pc-display-horizontal"></i>
            </div>
            <div class="kpi-info">
              <div class="kpi-value">${totalAssets}</div>
              <div class="kpi-label">মোট আইটি অ্যাসেট</div>
              <div class="kpi-subtext text-success">
                <i class="bi bi-check-circle-fill"></i> ${activeAssets} টি সক্রিয় সরঞ্জাম
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-xl-3">
          <div class="kpi-card">
            <div class="kpi-icon-wrapper kpi-icon-amber">
              <i class="bi bi-ticket-detailed-fill"></i>
            </div>
            <div class="kpi-info">
              <div class="kpi-value">${openTickets.length}</div>
              <div class="kpi-label">চলমান ও পেন্ডিং টিকিট</div>
              <div class="kpi-subtext ${criticalTickets.length > 0 ? 'text-danger fw-bold' : 'text-muted'}">
                <i class="bi bi-exclamation-triangle-fill"></i> ${criticalTickets.length} টি ক্রিটিকাল ইস্যু
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-xl-3">
          <div class="kpi-card">
            <div class="kpi-icon-wrapper kpi-icon-purple">
              <i class="bi bi-calendar-check-fill"></i>
            </div>
            <div class="kpi-info">
              <div class="kpi-value">${pendingTasks.length}</div>
              <div class="kpi-label">রক্ষণাবেক্ষণ শিডিউল</div>
              <div class="kpi-subtext ${overdueTasks.length > 0 ? 'text-danger' : 'text-muted'}">
                <i class="bi bi-clock-history"></i> ${overdueTasks.length} টি বিলম্বিত কাজ
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-xl-3">
          <div class="kpi-card">
            <div class="kpi-icon-wrapper kpi-icon-teal">
              <i class="bi bi-shield-check"></i>
            </div>
            <div class="kpi-info">
              <div class="kpi-value">${latestBackup ? escapeHtml(latestBackup.result) : 'কোনো লগ নেই'}</div>
              <div class="kpi-label">সর্বশেষ ব্যাকআপ লগ</div>
              <div class="kpi-subtext text-muted">
                <i class="bi bi-calendar"></i> ${latestBackup ? formatDate(latestBackup.scheduledDate, true) : '—'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="row g-3 mb-4">
        <div class="col-12 col-lg-7">
          <div class="card-custom h-100">
            <div class="card-custom-header">
              <h5 class="card-custom-title">
                <i class="bi bi-bar-chart-fill text-primary"></i> বিভাগভিত্তিক আইটি সমস্যার পরিসংখ্যান
              </h5>
              <span class="badge bg-light text-muted border">প্রকৃত IndexedDB রেকর্ড</span>
            </div>
            <div class="card-custom-body">
              <div style="height: 270px; position: relative;">
                <canvas id="chart-tickets-dept"></canvas>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-5">
          <div class="card-custom h-100">
            <div class="card-custom-header">
              <h5 class="card-custom-title">
                <i class="bi bi-pie-chart-fill text-teal"></i> সরঞ্জামের ক্যাটাগরি বিশ্লেষণ
              </h5>
              <span class="badge bg-light text-muted border">মোট ${totalAssets} টি</span>
            </div>
            <div class="card-custom-body">
              <div style="height: 270px; position: relative;">
                <canvas id="chart-assets-category"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Operational Tables Row -->
      <div class="row g-3 mb-4">
        <!-- Recent Tickets -->
        <div class="col-12 col-lg-7">
          <div class="card-custom h-100">
            <div class="card-custom-header">
              <h5 class="card-custom-title">
                <i class="bi bi-ticket-perforated text-danger"></i> সম্প্রতি রিপোর্টকৃত আইটি টিকিট
              </h5>
              <a href="#/tickets" class="btn btn-sm btn-link">সবগুলো দেখুন <i class="bi bi-arrow-right"></i></a>
            </div>
            <div class="card-custom-body p-0">
              <div class="table-responsive-custom">
                <table class="table-custom">
                  <thead>
                    <tr>
                      <th>টিকিট নং</th>
                      <th>সমস্যার বিবরণ</th>
                      <th>বিভাগ</th>
                      <th>অগ্রাধিকার</th>
                      <th>অবস্থা</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${
                      tickets.slice(0, 5).map((tkt) => {
                        const dept = departments.find((d) => d.id === tkt.departmentId);
                        return `
                          <tr>
                            <td><strong class="text-primary">${escapeHtml(tkt.ticketNumber)}</strong></td>
                            <td>${escapeHtml(tkt.title)}</td>
                            <td><span class="badge bg-light text-dark border">${escapeHtml(dept ? dept.nameBn : '—')}</span></td>
                            <td>${renderPriorityBadge(tkt.priority)}</td>
                            <td>${renderStatusBadge(tkt.status)}</td>
                          </tr>
                        `;
                      }).join('') || '<tr><td colspan="5" class="text-center py-3 text-muted">কোনো টিকিট নেই</td></tr>'
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Upcoming & Overdue Maintenance -->
        <div class="col-12 col-lg-5">
          <div class="card-custom h-100">
            <div class="card-custom-header">
              <h5 class="card-custom-title">
                <i class="bi bi-tools text-warning"></i> রক্ষণাবেক্ষণ শিডিউল সতর্কতা
              </h5>
              <a href="#/maintenance" class="btn btn-sm btn-link">শিডিউল দেখুন <i class="bi bi-arrow-right"></i></a>
            </div>
            <div class="card-custom-body p-0">
              <div class="list-group list-group-flush">
                ${
                  tasks.slice(0, 4).map((tsk) => `
                    <div class="list-group-item d-flex justify-content-between align-items-center py-3">
                      <div>
                        <div class="fw-semibold text-main mb-1">${escapeHtml(tsk.title)}</div>
                        <div class="small text-muted">
                          <i class="bi bi-calendar me-1"></i> নির্ধারিত: ${escapeHtml(tsk.dueDate || '—')} | 
                          <i class="bi bi-person me-1"></i> ${escapeHtml(tsk.assignedToName || 'আইটি টিম')}
                        </div>
                      </div>
                      <div>
                        ${renderStatusBadge(tsk.status)}
                      </div>
                    </div>
                  `).join('') || '<div class="p-3 text-center text-muted">কোনো টাস্ক নেই</div>'
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent System Activity Log -->
      <div class="card-custom">
        <div class="card-custom-header">
          <h5 class="card-custom-title">
            <i class="bi bi-clock-history text-secondary"></i> সাম্প্রতিক আইটি কার্যক্রম ও অডিট ট্রেইল
          </h5>
          <a href="#/settings" class="btn btn-sm btn-link">সম্পূর্ণ লগ <i class="bi bi-arrow-right"></i></a>
        </div>
        <div class="card-custom-body p-0">
          <div class="table-responsive-custom">
            <table class="table-custom">
              <thead>
                <tr>
                  <th>সময়</th>
                  <th>ইউজার / অপারেটর</th>
                  <th>মডিউল</th>
                  <th>অ্যাকশন</th>
                  <th>বিবরণ</th>
                </tr>
              </thead>
              <tbody>
                ${
                  activities.slice(-5).reverse().map((act) => `
                    <tr>
                      <td class="small text-muted">${formatDate(act.timestamp, true)}</td>
                      <td><strong>${escapeHtml(act.actor || 'System')}</strong></td>
                      <td><span class="badge bg-secondary">${escapeHtml(act.module)}</span></td>
                      <td><code>${escapeHtml(act.action)}</code></td>
                      <td>${escapeHtml(act.details)}</td>
                    </tr>
                  `).join('') || '<tr><td colspan="5" class="text-center py-3 text-muted">কোনো লগ পাওয়া যায়নি</td></tr>'
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    // Render Chart.js charts
    this.renderCharts(tickets, assets, departments);
  },

  renderCharts(tickets, assets, departments) {
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js is not loaded. Skipping chart rendering.');
      return;
    }

    // Chart 1: Tickets by Department
    const deptCtx = document.getElementById('chart-tickets-dept');
    if (deptCtx) {
      const deptCounts = {};
      departments.forEach((d) => { deptCounts[d.nameBn] = 0; });
      tickets.forEach((t) => {
        const d = departments.find((dep) => dep.id === t.departmentId);
        const name = d ? d.nameBn : 'অন্যান্য';
        deptCounts[name] = (deptCounts[name] || 0) + 1;
      });

      const labels = Object.keys(deptCounts);
      const values = Object.values(deptCounts);

      const chart1 = new Chart(deptCtx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'টিকিট সংখ্যা',
            data: values,
            backgroundColor: '#2563EB',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { stepSize: 1 }
            },
            x: {
              ticks: {
                maxRotation: 45,
                minRotation: 20,
                font: { size: 11 }
              }
            }
          }
        }
      });
      chartInstances.push(chart1);
    }

    // Chart 2: Assets by Category
    const catCtx = document.getElementById('chart-assets-category');
    if (catCtx) {
      const catCounts = {};
      assets.forEach((a) => {
        const cat = a.categoryId ? a.categoryId.replace('cat-', '').toUpperCase() : 'OTHER';
        catCounts[cat] = (catCounts[cat] || 0) + 1;
      });

      const labels = Object.keys(catCounts);
      const values = Object.values(catCounts);

      const chart2 = new Chart(catCtx, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            data: values,
            backgroundColor: [
              '#2563EB', '#0F766E', '#16A34A', '#D97706', '#DC2626',
              '#7C3AED', '#0284C7', '#475569', '#E11D48', '#0D9488'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: { boxWidth: 12, font: { size: 11 } }
            }
          }
        }
      });
      chartInstances.push(chart2);
    }
  }
};

