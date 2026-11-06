/**
 * Hospital IT Desk — Module 7: Backup Management & Verification Register
 * Registers daily backup activities, offline vault copies, manual verifications, and restore tests.
 */

import { repository } from '../../core/repository.js';
import { STORES } from '../../data/schema.js';
import { t } from '../../core/i18n.js';
import { formatDate, formatFileSize, renderStatusBadge, escapeHtml, generateSequentialCode } from '../../core/formatters.js';
import { modal } from '../../components/modal.js';
import { notifications } from '../../core/notifications.js';

let backupSources = [];
let backupLogs = [];

export const backupsModule = {
  async render() {
    const contentArea = document.getElementById('content-area');
    if (!contentArea) return;

    [backupSources, backupLogs] = await Promise.all([
      repository.getAll(STORES.BACKUP_SOURCES),
      repository.getAll(STORES.BACKUP_LOGS)
    ]);

    // Sort descending by scheduled date
    backupLogs.sort((a, b) => new Date(b.scheduledDate || 0) - new Date(a.scheduledDate || 0));

    const totalBackups = backupLogs.length;
    const verifiedCount = backupLogs.filter((b) => b.verificationStatus === 'Verified').length;
    const failedCount = backupLogs.filter((b) => b.result === 'Failed' || b.result === 'Partial').length;

    contentArea.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title"><i class="bi bi-database-check text-primary"></i> ${t('navBackups')}</h1>
          <p class="page-subtitle">হাসপাতালের কোর ডাটাবেজ, পিএসিএস ও একাউন্টস ব্যাকআপের দৈনিক ম্যানুয়াল রেজিস্টার ও ভেরিফিকেশন লগ</p>
        </div>
        <div class="action-buttons">
          <button type="button" class="btn btn-primary btn-sm" id="btn-add-backup-log">
            <i class="bi bi-plus-lg me-1"></i> নতুন ব্যাকআপ এন্ট্রি
          </button>
        </div>
      </div>

      <!-- Compliance & Scope Notice -->
      <div class="alert alert-info py-2 small mb-4">
        <i class="bi bi-info-circle-fill me-1"></i>
        <strong>অপারেশনাল নীতিমালা:</strong> এটি একটি ব্যাকআপ অ্যাক্টিভিটি ও ভেরিফিকেশন রেজিস্টার। ব্রাউজারে স্বয়ংক্রিয়ভাবে ডাটাবেজ ব্যাকআপ সম্পন্ন হয় না; আইটি ইঞ্জিনিয়ার দ্বারা ব্যাকআপ সম্পন্ন হওয়ার পর এর স্থিতি, ফাইল সাইজ ও অফলাইন ভেরিফিকেশন নিশ্চিত করে এখানে লিপিবদ্ধ করা হয়।
      </div>

      <!-- Quick Summary KPI Cards -->
      <div class="row g-3 mb-4">
        <div class="col-12 col-sm-4">
          <div class="kpi-card">
            <div class="kpi-icon-wrapper kpi-icon-blue">
              <i class="bi bi-archive-fill"></i>
            </div>
            <div class="kpi-info">
              <div class="kpi-value">${totalBackups}</div>
              <div class="kpi-label">মোট রেকর্ডকৃত ব্যাকআপ</div>
              <div class="kpi-subtext text-muted">${backupSources.length} টি নির্ধারিত সোর্স</div>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-4">
          <div class="kpi-card">
            <div class="kpi-icon-wrapper kpi-icon-teal">
              <i class="bi bi-check-all"></i>
            </div>
            <div class="kpi-info">
              <div class="kpi-value">${verifiedCount}</div>
              <div class="kpi-label">যাচাইকৃত ব্যাকআপ (Verified)</div>
              <div class="kpi-subtext text-success">ফাইল সাইজ ও চেকার ভেরিফাইড</div>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-4">
          <div class="kpi-card">
            <div class="kpi-icon-wrapper kpi-icon-amber">
              <i class="bi bi-exclamation-octagon-fill"></i>
            </div>
            <div class="kpi-info">
              <div class="kpi-value text-danger">${failedCount}</div>
              <div class="kpi-label">ব্যর্থ বা অসম্পূর্ণ লগ</div>
              <div class="kpi-subtext text-danger">জরুরি ফলো-আপ আবশ্যক</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Backup Sources Grid -->
      <div class="card-custom mb-4">
        <div class="card-custom-header">
          <h5 class="card-custom-title"><i class="bi bi-hdd-rack text-navy"></i> হাসপাতালের অনুমোদিত ব্যাকআপ উৎস ও শিডিউল পলিসি</h5>
        </div>
        <div class="card-custom-body p-0">
          <div class="table-responsive-custom">
            <table class="table-custom">
              <thead>
                <tr>
                  <th>সিস্টেম / ডাটাবেজ সোর্স</th>
                  <th>ব্যাকআপ মেথড</th>
                  <th>নির্ধারিত সময় ও ফ্রিকোয়েন্সি</th>
                  <th>সংরক্ষণাগার / টার্গেট লোকেশন</th>
                </tr>
              </thead>
              <tbody>
                ${
                  backupSources.map((src) => `
                    <tr>
                      <td><strong class="text-primary">${escapeHtml(src.sourceName)}</strong></td>
                      <td><span class="badge bg-light text-dark border">${escapeHtml(src.systemType)}</span></td>
                      <td><small>${escapeHtml(src.defaultFrequency)}</small></td>
                      <td><small class="text-muted">${escapeHtml(src.targetLocation)}</small></td>
                    </tr>
                  `).join('') || '<tr><td colspan="4" class="text-center py-3 text-muted">কোনো সোর্স কনফিগার করা নেই</td></tr>'
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Backup Logs Table Card -->
      <div class="card-custom">
        <div class="card-custom-header">
          <h5 class="card-custom-title"><i class="bi bi-clock-history text-primary"></i> ব্যাকআপ অ্যাক্টিভিটি ও ভেরিফিকেশন লগ</h5>
        </div>
        <div class="card-custom-body p-0">
          <div class="table-responsive-custom">
            <table class="table-custom">
              <thead>
                <tr>
                  <th>লগ কোড</th>
                  <th>সিস্টেমের নাম</th>
                  <th>ধরন</th>
                  <th>সম্পন্নের তারিখ ও সময়</th>
                  <th>আকার (MB/GB)</th>
                  <th>ফলাফল (Result)</th>
                  <th>ভেরিফিকেশন অবস্থা</th>
                  <th>অপারেটর</th>
                  <th style="width: 120px;">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody>
                ${
                  backupLogs.map((log) => `
                    <tr>
                      <td><strong class="text-navy font-monospace">${escapeHtml(log.backupCode || 'BKP-LOG')}</strong></td>
                      <td><strong>${escapeHtml(log.sourceName)}</strong></td>
                      <td><span class="badge bg-light text-dark border">${escapeHtml(log.backupType)}</span></td>
                      <td class="small text-muted">${formatDate(log.actualCompletionDate, true)}</td>
                      <td>${log.fileSizeMb ? `${(log.fileSizeMb / 1024).toFixed(2)} GB` : '—'}</td>
                      <td>${renderStatusBadge(log.result)}</td>
                      <td>${renderStatusBadge(log.verificationStatus)}</td>
                      <td><small>${escapeHtml(log.operatorName || '—')}</small></td>
                      <td>
                        <div class="btn-group btn-group-sm">
                          <button type="button" class="btn btn-outline-primary btn-view-backup" data-id="${log.id}" title="বিস্তারিত দেখুন">
                            <i class="bi bi-eye"></i>
                          </button>
                          ${
                            log.verificationStatus !== 'Verified'
                              ? `<button type="button" class="btn btn-outline-success btn-verify-backup" data-id="${log.id}" title="যাচাই করুন">
                                  <i class="bi bi-check2"></i>
                                </button>`
                              : ''
                          }
                        </div>
                      </td>
                    </tr>
                  `).join('') || '<tr><td colspan="9" class="text-center py-4 text-muted">কোনো ব্যাকআপ রেকর্ড নেই</td></tr>'
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
    const addBtn = document.getElementById('btn-add-backup-log');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.showAddBackupModal());
    }

    const viewBtns = document.querySelectorAll('.btn-view-backup');
    viewBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.showBackupDetailModal(id);
      });
    });

    const verifyBtns = document.querySelectorAll('.btn-verify-backup');
    verifyBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.quickVerifyBackup(id);
      });
    });
  },

  showAddBackupModal() {
    const nextCode = generateSequentialCode('BKP-2026-', backupLogs, 'backupCode');

    const formHtml = `
      <form id="add-backup-form">
        <div class="row g-2">
          <div class="col-12 col-md-4">
            <label class="form-label small fw-semibold">রেকর্ড কোড</label>
            <input type="text" class="form-control form-control-sm" id="form-bkp-code" value="${nextCode}" readonly>
          </div>
          <div class="col-12 col-md-8">
            <label class="form-label small fw-semibold">ব্যাকআপ সোর্স সিস্টেম <span class="text-danger">*</span></label>
            <select class="form-select form-select-sm" id="form-bkp-source" required>
              ${backupSources.map((s) => `<option value="${s.id}">${escapeHtml(s.sourceName)}</option>`).join('')}
            </select>
          </div>
          <div class="col-12 col-md-4">
            <label class="form-label small fw-semibold">ব্যাকআপ ধরন</label>
            <select class="form-select form-select-sm" id="form-bkp-type">
              <option value="Full">Full Database Dump</option>
              <option value="Incremental">Incremental</option>
              <option value="Differential">Differential</option>
            </select>
          </div>
          <div class="col-12 col-md-4">
            <label class="form-label small fw-semibold">সম্পন্নের তারিখ ও সময়</label>
            <input type="datetime-local" class="form-control form-control-sm" id="form-bkp-date" value="${new Date().toISOString().slice(0, 16)}" required>
          </div>
          <div class="col-12 col-md-4">
            <label class="form-label small fw-semibold">ফাইলের আকার (মেগাবাইট)</label>
            <input type="number" class="form-control form-control-sm" id="form-bkp-size" placeholder="18500" required>
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">ফলাফল (Result) <span class="text-danger">*</span></label>
            <select class="form-select form-select-sm" id="form-bkp-result" required>
              <option value="Successful" selected>Successful (সম্পূর্ণ সফল)</option>
              <option value="Partial">Partial (আংশিক সম্পন্ন / ওয়ার্নিং)</option>
              <option value="Failed">Failed (ব্যর্থ হয়েছে)</option>
            </select>
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">অপারেটর / ইঞ্জিনিয়ার</label>
            <input type="text" class="form-control form-control-sm" id="form-bkp-operator" value="মোঃ কামরুল হাসান (আইটি অফিসার)">
          </div>
          <div class="col-12">
            <label class="form-label small fw-semibold">সংরক্ষণ লোকেশন / ড্রাইভ পাথ</label>
            <input type="text" class="form-control form-control-sm" id="form-bkp-storage" placeholder="যেমন: NAS Server 01: /backups/hms/hms_full.dmp">
          </div>
          <div class="col-12">
            <label class="form-label small fw-semibold">নোট বা পর্যবেক্ষণ</label>
            <textarea class="form-control form-control-sm" id="form-bkp-notes" rows="2" placeholder="কোনো সমস্যা বা ফাইল চেকার ভেরিফিকেশন থাকলে লিখুন..."></textarea>
          </div>
        </div>
      </form>
    `;

    modal.show({
      title: '<i class="bi bi-database-check text-primary"></i> নতুন ব্যাকআপ সম্পন্ন লগ এন্ট্রি',
      body: formHtml,
      size: 'md',
      confirmText: 'সংরক্ষণ করুন',
      onConfirm: async () => {
        const sourceId = document.getElementById('form-bkp-source').value;
        const sourceObj = backupSources.find((s) => s.id === sourceId);
        const type = document.getElementById('form-bkp-type').value;
        const date = document.getElementById('form-bkp-date').value;
        const sizeMb = Number(document.getElementById('form-bkp-size').value) || 0;
        const result = document.getElementById('form-bkp-result').value;
        const operator = document.getElementById('form-bkp-operator').value.trim();
        const storageLoc = document.getElementById('form-bkp-storage').value.trim();
        const notes = document.getElementById('form-bkp-notes').value.trim();

        const newLog = {
          backupCode: nextCode,
          sourceId,
          sourceName: sourceObj ? sourceObj.sourceName : 'Unknown',
          backupType: type,
          scheduledDate: new Date(date).toISOString(),
          actualCompletionDate: new Date(date).toISOString(),
          result,
          fileSizeMb: sizeMb,
          operatorName: operator,
          storageLocation: storageLoc,
          verificationStatus: result === 'Successful' ? 'Verified' : 'Pending Verification',
          verifiedDate: result === 'Successful' ? new Date().toISOString() : null,
          verifiedBy: result === 'Successful' ? operator : null,
          notes
        };

        await repository.add(STORES.BACKUP_LOGS, newLog);
        await repository.logActivity('LOG_BACKUP', 'Backups', nextCode, `Backup recorded: ${newLog.sourceName} - ${result}`);

        // If backup failed, ask to generate follow-up ticket
        if (result === 'Failed' || result === 'Partial') {
          notifications.showToast('সতর্কতা: ব্যাকআপ ত্রুটি', 'ব্যর্থ ব্যাকআপের জন্য অবিলম্বে ফলো-আপ টিকিট তৈরি করুন।', 'danger');
        } else {
          notifications.showToast('ব্যাকআপ সংরক্ষিত', 'ব্যাকআপ এন্ট্রি সফলভাবে সম্পন্ন হয়েছে।', 'success');
        }

        modal.hide();
        await this.render();
      }
    });
  },

  async quickVerifyBackup(id) {
    const log = await repository.getById(STORES.BACKUP_LOGS, id);
    if (!log) return;

    log.verificationStatus = 'Verified';
    log.verifiedDate = new Date().toISOString();
    log.verifiedBy = 'মোঃ কামরুল হাসান (আইটি অফিসার)';
    await repository.update(STORES.BACKUP_LOGS, log);

    await repository.logActivity('VERIFY_BACKUP', 'Backups', log.backupCode, `Backup verified by ${log.verifiedBy}`);

    notifications.showToast('যাচাই সম্পন্ন', `${log.sourceName} ব্যাকআপটি সফলভাবে যাচাইকৃত (Verified) হিসেবে চিহ্নিত হয়েছে।`, 'success');
    await this.render();
  },

  async showBackupDetailModal(id) {
    const log = await repository.getById(STORES.BACKUP_LOGS, id);
    if (!log) return;

    const bodyHtml = `
      <div>
        <h4 class="text-primary fw-bold mb-1">${escapeHtml(log.sourceName)}</h4>
        <div class="mb-3">
          <span class="badge bg-secondary me-1 font-monospace">${escapeHtml(log.backupCode)}</span>
          ${renderStatusBadge(log.result)}
          ${renderStatusBadge(log.verificationStatus)}
        </div>

        <table class="table table-sm table-bordered">
          <tbody>
            <tr><th style="width: 35%;">ব্যাকআপের ধরন</th><td>${escapeHtml(log.backupType)}</td></tr>
            <tr><th>সম্পন্নের সময়</th><td>${formatDate(log.actualCompletionDate, true)}</td></tr>
            <tr><th>ফাইলের আকার</th><td>${log.fileSizeMb ? `${(log.fileSizeMb / 1024).toFixed(2)} GB (${log.fileSizeMb} MB)` : '—'}</td></tr>
            <tr><th>সংরক্ষণ ড্রাইভ / লোকেশন</th><td><code>${escapeHtml(log.storageLocation || '—')}</code></td></tr>
            <tr><th>ফাইল রেফারেন্স</th><td><code>${escapeHtml(log.fileReference || '—')}</code></td></tr>
            <tr><th>অপারেটর</th><td>${escapeHtml(log.operatorName || '—')}</td></tr>
            <tr><th>যাচাইকারী ও সময়</th><td>${escapeHtml(log.verifiedBy || '—')} (${formatDate(log.verifiedDate, true)})</td></tr>
            <tr><th>চেকসাম (SHA-256)</th><td><small><code>${escapeHtml(log.checksum || 'N/A')}</code></small></td></tr>
            <tr><th>মন্তব্য</th><td>${escapeHtml(log.notes || '—')}</td></tr>
          </tbody>
        </table>
      </div>
    `;

    modal.show({
      title: `<i class="bi bi-database-check text-primary"></i> ব্যাকআপ বিস্তারিত`,
      body: bodyHtml,
      size: 'md',
      showConfirm: false,
      cancelText: 'বন্ধ করুন'
    });
  }
};

