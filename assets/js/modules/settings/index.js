/**
 * Hospital IT Desk — Module 14: Settings, Audit Log & System Administration
 * Hospital profile configuration, JSON backup export/import, demo reset, and local activity log.
 */

import { repository } from '../../core/repository.js';
import { STORES, SCHEMA_VERSION } from '../../data/schema.js';
import { t } from '../../core/i18n.js';
import { formatDate, escapeHtml } from '../../core/formatters.js';
import { modal } from '../../components/modal.js';
import { utils } from '../../core/utils.js';
import { getStorageEstimate } from '../../core/database.js';
import { notifications } from '../../core/notifications.js';

let appSettings = null;
let activityLogs = [];
let storeCounts = {};

export const settingsModule = {
  async render() {
    const contentArea = document.getElementById('content-area');
    if (!contentArea) return;

    // Load settings, activities and store counts
    const settingsList = await repository.getAll(STORES.SETTINGS);
    appSettings = settingsList[0] || {};
    activityLogs = await repository.getAll(STORES.ACTIVITY_LOGS);
    activityLogs.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

    // Calculate record counts for each store
    for (const [key, storeName] of Object.entries(STORES)) {
      storeCounts[storeName] = await repository.count(storeName);
    }

    const estimate = await getStorageEstimate();

    contentArea.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title"><i class="bi bi-gear-fill text-primary"></i> ${t('navSettings')}</h1>
          <p class="page-subtitle">হাসপাতালের তথ্য কনফিগারেশন, IndexedDB লোকাল ব্যাকআপ এক্সপোর্ট/ইমপোর্ট ও অডিট ট্রেইল</p>
        </div>
      </div>

      <!-- Storage & Portability Control Center -->
      <div class="card-custom mb-4">
        <div class="card-custom-header">
          <h5 class="card-custom-title"><i class="bi bi-cloud-arrow-down-fill text-primary"></i> লোকাল ডেটা ব্যাকআপ ও রিস্টোর ম্যানেজমেন্ট</h5>
          <span class="badge bg-primary">Schema ${SCHEMA_VERSION}</span>
        </div>
        <div class="card-custom-body">
          <div class="row g-3 align-items-center">
            <div class="col-12 col-md-7">
              <h6 class="fw-bold mb-1">ব্রাউজার ডেটা স্থায়িত্ব ও ব্যাকআপ নীতিমালা:</h6>
              <p class="small text-muted mb-2">
                এই অ্যাপ্লিকেশনটি সম্পূর্ণভাবে আপনার বর্তমান ব্রাউজারের IndexedDB তে তথ্য সংরক্ষণ করে। 
                ব্রাউজারের হিস্ট্রি বা সাইট ডেটা ক্লিয়ার করলে তথ্য মুছে যেতে পারে। ডেটা সুরক্ষিত রাখতে নিয়মিত সম্পূর্ণ ডেটাবেজের JSON ব্যাকআপ ডাউনলোড করে সংরক্ষণ করুন।
              </p>
              <div class="d-flex align-items-center gap-2 small text-muted">
                <span><i class="bi bi-hdd-fill me-1"></i> আনুমানিক স্টোরেজ ব্যবহার: <strong>${(estimate.usage / (1024 * 1024)).toFixed(2)} MB</strong></span>
              </div>
            </div>

            <div class="col-12 col-md-5 text-md-end d-flex flex-wrap gap-2 justify-content-md-end">
              <button type="button" class="btn btn-primary btn-sm" id="btn-export-json-backup">
                <i class="bi bi-download me-1"></i> সম্পূর্ণ JSON ব্যাকআপ ডাউনলোড
              </button>

              <label class="btn btn-outline-primary btn-sm mb-0">
                <i class="bi bi-upload me-1"></i> ব্যাকআপ রিস্টোর (Import)
                <input type="file" id="input-import-json-backup" accept=".json" style="display: none;">
              </label>

              <button type="button" class="btn btn-outline-warning btn-sm" id="btn-reset-demo-dataset">
                <i class="bi bi-arrow-counterclockwise me-1"></i> ডেমো ডেটা রিসেট
              </button>

              <button type="button" class="btn btn-outline-danger btn-sm" id="btn-clear-all-database">
                <i class="bi bi-trash3 me-1"></i> সকল ডেটা মুছুন
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Hospital Information Configuration -->
      <div class="card-custom mb-4">
        <div class="card-custom-header">
          <h5 class="card-custom-title"><i class="bi bi-hospital text-navy"></i> হাসপাতাল ও প্রতিষ্ঠানের পরিচিতি সেটিংস</h5>
        </div>
        <div class="card-custom-body">
          <form id="hospital-settings-form">
            <div class="row g-3">
              <div class="col-12 col-md-6">
                <label class="form-label small fw-semibold">হাসপাতালের নাম (বাংলা)</label>
                <input type="text" class="form-control form-control-sm" id="cfg-hosp-namebn" value="${escapeHtml(appSettings.hospitalNameBn || 'ঢাকা সেন্ট্রাল হসপিটাল (ডেমো)')}">
              </div>

              <div class="col-12 col-md-6">
                <label class="form-label small fw-semibold">হাসপাতালের নাম (English)</label>
                <input type="text" class="form-control form-control-sm" id="cfg-hosp-nameen" value="${escapeHtml(appSettings.hospitalNameEn || 'Dhaka Central Hospital (Demo)')}">
              </div>

              <div class="col-12 col-md-6">
                <label class="form-label small fw-semibold">পোর্টাল সাবটাইটেল (বাংলা)</label>
                <input type="text" class="form-control form-control-sm" id="cfg-hosp-subbn" value="${escapeHtml(appSettings.subtitleBn || 'হাসপাতাল আইটি ম্যানেজমেন্ট অ্যান্ড সাপোর্ট পোর্টাল')}">
              </div>

              <div class="col-12 col-md-6">
                <label class="form-label small fw-semibold">পোর্টাল সাবটাইটেল (English)</label>
                <input type="text" class="form-control form-control-sm" id="cfg-hosp-suben" value="${escapeHtml(appSettings.subtitleEn || 'Hospital IT Management & Support Portal')}">
              </div>

              <div class="col-12 col-md-4">
                <label class="form-label small fw-semibold">ঠিকানা</label>
                <input type="text" class="form-control form-control-sm" id="cfg-hosp-address" value="${escapeHtml(appSettings.address || 'Green Road, Dhanmondi, Dhaka')}">
              </div>

              <div class="col-12 col-md-4">
                <label class="form-label small fw-semibold">আইটি সাপোর্ট হেল্পলাইন ফোন</label>
                <input type="text" class="form-control form-control-sm" id="cfg-hosp-phone" value="${escapeHtml(appSettings.contactPhone || '+880 2-9660000')}">
              </div>

              <div class="col-12 col-md-4">
                <label class="form-label small fw-semibold">আইটি সাপোর্ট ইমেইল</label>
                <input type="email" class="form-control form-control-sm" id="cfg-hosp-email" value="${escapeHtml(appSettings.contactEmail || 'it-support@dhakacentralhosp.demo')}">
              </div>

              <div class="col-12 text-end">
                <button type="button" class="btn btn-primary btn-sm" id="btn-save-hospital-settings">
                  <i class="bi bi-save me-1"></i> সেটিংস পরিবর্তন সংরক্ষণ
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- IndexedDB Store Statistics Card -->
      <div class="card-custom mb-4">
        <div class="card-custom-header">
          <h5 class="card-custom-title"><i class="bi bi-pie-chart text-teal"></i> IndexedDB অবজেক্ট স্টোর রেকর্ড পরিসংখ্যান</h5>
        </div>
        <div class="card-custom-body">
          <div class="row g-2">
            ${
              Object.entries(storeCounts).map(([storeName, count]) => `
                <div class="col-6 col-sm-4 col-md-3">
                  <div class="p-2 border rounded bg-light d-flex justify-content-between align-items-center">
                    <span class="small font-monospace text-truncate" title="${escapeHtml(storeName)}">${escapeHtml(storeName)}</span>
                    <span class="badge bg-primary rounded-pill">${count}</span>
                  </div>
                </div>
              `).join('')
            }
          </div>
        </div>
      </div>

      <!-- Local Activity History Log Table Card -->
      <div class="card-custom">
        <div class="card-custom-header">
          <h5 class="card-custom-title"><i class="bi bi-clock-history text-secondary"></i> লোকাল অ্যাক্টিভিটি হিস্টোরি (Local Activity Log)</h5>
          <span class="badge bg-light text-muted border">সর্বশেষ ${activityLogs.length} টি অ্যাকশন</span>
        </div>
        <div class="card-custom-body p-0">
          <div class="table-responsive-custom">
            <table class="table-custom">
              <thead>
                <tr>
                  <th>সময় ও তারিখ</th>
                  <th>ইউজার / এক্টর</th>
                  <th>মডিউল</th>
                  <th>অ্যাকশন</th>
                  <th>বিবরণ ও রেফারেন্স</th>
                </tr>
              </thead>
              <tbody>
                ${
                  activityLogs.map((act) => `
                    <tr>
                      <td class="small text-muted font-monospace">${formatDate(act.timestamp, true)}</td>
                      <td><strong>${escapeHtml(act.actor || 'System User')}</strong></td>
                      <td><span class="badge bg-secondary">${escapeHtml(act.module)}</span></td>
                      <td><code>${escapeHtml(act.action)}</code></td>
                      <td>${escapeHtml(act.details)}</td>
                    </tr>
                  `).join('') || '<tr><td colspan="5" class="text-center py-4 text-muted">কোনো অডিট লগ নেই</td></tr>'
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
    // Save Hospital Info Settings
    const saveSettingsBtn = document.getElementById('btn-save-hospital-settings');
    if (saveSettingsBtn) {
      saveSettingsBtn.addEventListener('click', async () => {
        appSettings.hospitalNameBn = document.getElementById('cfg-hosp-namebn').value.trim();
        appSettings.hospitalNameEn = document.getElementById('cfg-hosp-nameen').value.trim();
        appSettings.subtitleBn = document.getElementById('cfg-hosp-subbn').value.trim();
        appSettings.subtitleEn = document.getElementById('cfg-hosp-suben').value.trim();
        appSettings.address = document.getElementById('cfg-hosp-address').value.trim();
        appSettings.contactPhone = document.getElementById('cfg-hosp-phone').value.trim();
        appSettings.contactEmail = document.getElementById('cfg-hosp-email').value.trim();
        appSettings.updatedAt = new Date().toISOString();

        await repository.update(STORES.SETTINGS, appSettings);
        await repository.logActivity('UPDATE_SETTINGS', 'Settings', 'hospital_info', 'Hospital details updated');

        notifications.showToast('সেটিংস সংরক্ষিত', 'হাসপাতালের পরিচিতি তথ্য সফলভাবে আপডেট হয়েছে।', 'success');
      });
    }

    // Export JSON Backup
    const exportBtn = document.getElementById('btn-export-json-backup');
    if (exportBtn) {
      exportBtn.addEventListener('click', async () => {
        const payload = await repository.exportAllData();
        const dateTag = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `Hospital_IT_Desk_Backup_${dateTag}.json`;
        utils.downloadJson(filename, payload);
        notifications.showToast('ব্যাকআপ ডাউনলোড সফল', `সম্পূর্ণ ডাটাবেজ ব্যাকআপ ফাইল (${filename}) সংরক্ষিত হয়েছে।`, 'success');
      });
    }

    // Import JSON Backup
    const importInput = document.getElementById('input-import-json-backup');
    if (importInput) {
      importInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
          const json = await utils.readJsonFile(file);

          if (!json || !json.data || !json.meta) {
            notifications.showToast('ত্রুটিপূর্ণ ব্যাকআপ ফাইল', 'ফাইলটিতে সঠিক ডেটাবেজ স্কিমা নেই।', 'danger');
            return;
          }

          // Generate preview of counts
          let previewHtml = `<div class="mb-3">
            <h6 class="fw-bold text-navy mb-1">ব্যাকআপ ফাইল তথ্য:</h6>
            <div class="small text-muted mb-2">এক্সপোর্ট সময়: <strong>${formatDate(json.meta.exportedAt, true)}</strong> | স্কিমা: <strong>${escapeHtml(json.meta.schemaVersion || 'v3.0')}</strong></div>
            <h6 class="fw-bold text-navy mb-1">রেকর্ড প্রিভিউ:</h6>
            <div class="row g-2 mb-3">
          `;

          for (const [storeName, items] of Object.entries(json.data)) {
            if (Array.isArray(items)) {
              previewHtml += `
                <div class="col-6 col-sm-4">
                  <div class="p-1 border rounded bg-light small d-flex justify-content-between">
                    <span class="text-truncate">${escapeHtml(storeName)}</span>
                    <strong class="text-primary">${items.length}</strong>
                  </div>
                </div>
              `;
            }
          }
          previewHtml += `</div>
            <div class="alert alert-warning py-2 small mb-0">
              <i class="bi bi-exclamation-triangle-fill me-1"></i>
              <strong>সতর্কতা:</strong> রিস্টোর সম্পন্ন করলে বর্তমান ব্রাউজারের সকল ডেটা এই ব্যাকআপ ফাইলের ডেটা দিয়ে প্রতিস্থাপিত হবে।
            </div>
          </div>`;

          modal.show({
            title: '<i class="bi bi-upload text-primary"></i> ব্যাকআপ প্রিভিউ ও রিস্টোর নিশ্চিতকরণ',
            body: previewHtml,
            size: 'md',
            confirmText: 'হ্যাঁ, রিস্টোর নিশ্চিত করুন',
            confirmClass: 'btn-danger',
            onConfirm: async () => {
              await repository.importAllData(json, true);
              modal.hide();
              notifications.showToast('রিস্টোর সম্পন্ন', 'ব্যাকআপ ফাইল থেকে সকল তথ্য সফলভাবে পুনরুদ্ধার হয়েছে।', 'success');
              setTimeout(() => window.location.reload(), 1000);
            }
          });
        } catch (err) {
          notifications.showToast('ইমপোর্ট ব্যর্থ', err.message, 'danger');
        }
        importInput.value = '';
      });
    }

    // Reset Demo Data
    const resetBtn = document.getElementById('btn-reset-demo-dataset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        modal.confirm({
          title: 'ডেমো ডেটা রিসেট',
          message: 'আপনি কি নিশ্চিত যে সকল রেকর্ড মুছে ডিফল্ট ডেমো ডেটাসেটে ফিরে যেতে চান? আপনার তৈরি কোনো নতুন তথ্য থাকলে তা মুছে যাবে।',
          confirmText: 'হ্যাঁ, রিসেট করুন',
          confirmClass: 'btn-warning text-dark',
          onConfirm: async () => {
            await repository.initDatabaseWithDemoData(true);
            notifications.showToast('ডেমো রিসেট সম্পন্ন', 'ডিফল্ট হাসপাতাল ডেমো রেকর্ডসমূহ পুনরায় লোড করা হয়েছে।', 'success');
            setTimeout(() => window.location.reload(), 800);
          }
        });
      });
    }

    // Clear All Database
    const clearBtn = document.getElementById('btn-clear-all-database');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        modal.confirm({
          title: 'সকল ডেটা সম্পূর্ণ মুছে ফেলা',
          message: 'আপনি কি নিশ্চিত যে এই ব্রাউজারের IndexedDB তে সংরক্ষিত সকল তথ্য সম্পূর্ণ মুছে ফেলতে চান? এটি অপরিবর্তনযোগ্য।',
          confirmText: 'হ্যাঁ, সম্পূর্ণ মুছুন',
          confirmClass: 'btn-danger',
          onConfirm: async () => {
            for (const storeName of Object.values(STORES)) {
              await repository.clearStore(storeName);
            }
            notifications.showToast('ডাটাবেজ শূন্য', 'সকল রেকর্ড মুছে ফেলা হয়েছে।', 'info');
            setTimeout(() => window.location.reload(), 800);
          }
        });
      });
    }
  }
};

