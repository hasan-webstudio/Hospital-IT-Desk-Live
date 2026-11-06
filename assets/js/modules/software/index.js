/**
 * Hospital IT Desk — Module 6: Hospital Software & License Management
 * Records software applications, licensing agreements, seat counts, and expiry reminders.
 */

import { repository } from '../../core/repository.js';
import { STORES } from '../../data/schema.js';
import { t } from '../../core/i18n.js';
import { formatDate, renderStatusBadge, escapeHtml } from '../../core/formatters.js';
import { modal } from '../../components/modal.js';
import { notifications } from '../../core/notifications.js';

let softwareList = [];
let licenseList = [];

export const softwareModule = {
  async render() {
    const contentArea = document.getElementById('content-area');
    if (!contentArea) return;

    [softwareList, licenseList] = await Promise.all([
      repository.getAll(STORES.SOFTWARE_PRODUCTS),
      repository.getAll(STORES.SOFTWARE_LICENSES)
    ]);

    const now = new Date();

    contentArea.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title"><i class="bi bi-window-stack text-primary"></i> ${t('navSoftware')}</h1>
          <p class="page-subtitle">হাসপাতাল এইচএমএস, ডাটাবেজ, অ্যান্টিভাইরাস ও অপারেটিং সিস্টেম লাইসেন্স ট্র্যাকিং</p>
        </div>
        <div class="action-buttons">
          <button type="button" class="btn btn-primary btn-sm" id="btn-add-software">
            <i class="bi bi-plus-lg me-1"></i> নতুন সফটওয়্যার নিবন্ধন
          </button>
        </div>
      </div>

      <!-- Expiry Alert Banner if any software expiring within 30 days -->
      ${this.renderExpiryAlertsHtml(now)}

      <!-- Software Inventory Table Card -->
      <div class="card-custom mb-4">
        <div class="card-custom-header">
          <h5 class="card-custom-title"><i class="bi bi-box-seam text-navy"></i> অনুমোদিত সফটওয়্যার ও অ্যাপ্লিকেশন তালিকা</h5>
          <span class="badge bg-light text-muted border">মোট ${softwareList.length} টি</span>
        </div>
        <div class="card-custom-body p-0">
          <div class="table-responsive-custom">
            <table class="table-custom">
              <thead>
                <tr>
                  <th>সফটওয়্যারের নাম ও ভার্সন</th>
                  <th>ক্যাটাগরি</th>
                  <th>ভেন্ডর / সরবরাহকারী</th>
                  <th>ব্যবহারকারী বিভাগসমূহ</th>
                  <th>লাইসেন্সের ধরন ও সিট</th>
                  <th>মেয়াদ সমাপ্তি</th>
                  <th>অবস্থা (Status)</th>
                  <th style="width: 100px;">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody>
                ${
                  softwareList.map((soft) => {
                    const daysRemaining = soft.expiryDate
                      ? Math.ceil((new Date(soft.expiryDate) - now) / (1000 * 60 * 60 * 24))
                      : null;

                    let expiryBadge = `<small class="text-muted">${formatDate(soft.expiryDate)}</small>`;
                    if (daysRemaining !== null) {
                      if (daysRemaining < 0) {
                        expiryBadge = `<span class="badge bg-danger">মেয়াদোত্তীর্ণ (${formatDate(soft.expiryDate)})</span>`;
                      } else if (daysRemaining <= 30) {
                        expiryBadge = `<span class="badge bg-warning text-dark"><i class="bi bi-hourglass-split"></i> ${daysRemaining} দিন বাকি</span>`;
                      }
                    }

                    return `
                      <tr>
                        <td>
                          <strong>${escapeHtml(soft.name)}</strong><br>
                          <small class="badge bg-light text-primary border">${escapeHtml(soft.currentVersion || 'v1.0')}</small>
                        </td>
                        <td><span class="badge bg-light text-dark border">${escapeHtml(soft.category)}</span></td>
                        <td>${escapeHtml(soft.vendor)}</td>
                        <td><small class="text-muted">${escapeHtml(soft.departmentsUsing || 'All')}</small></td>
                        <td>
                          <div>${escapeHtml(soft.licenseType)}</div>
                          <small class="text-muted">${soft.seatCount ? `${soft.seatCount} Seats` : '—'}</small>
                        </td>
                        <td>${expiryBadge}</td>
                        <td>${renderStatusBadge(soft.status)}</td>
                        <td>
                          <button type="button" class="btn btn-sm btn-outline-primary btn-view-software" data-id="${soft.id}">
                            <i class="bi bi-eye"></i> বিস্তারিত
                          </button>
                        </td>
                      </tr>
                    `;
                  }).join('') || '<tr><td colspan="8" class="text-center py-4 text-muted">কোনো রেকর্ড নেই</td></tr>'
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Masked License Keys Table Card -->
      <div class="card-custom">
        <div class="card-custom-header">
          <h5 class="card-custom-title"><i class="bi bi-key-fill text-warning"></i> সফটওয়্যার লাইসেন্স চুক্তি ও মাস্কড কি (Masked Keys)</h5>
        </div>
        <div class="card-custom-body p-0">
          <div class="table-responsive-custom">
            <table class="table-custom">
              <thead>
                <tr>
                  <th>সফটওয়্যার</th>
                  <th>মাস্কড লাইসেন্স কোড (Masked Ref)</th>
                  <th>বরাদ্দ সিট</th>
                  <th>ইস্যুর তারিখ</th>
                  <th>মেয়াদ শেষ</th>
                  <th>নোট ও এসএলএ</th>
                </tr>
              </thead>
              <tbody>
                ${
                  licenseList.map((lic) => {
                    const soft = softwareList.find((s) => s.id === lic.softwareId);
                    return `
                      <tr>
                        <td><strong>${escapeHtml(soft ? soft.name : '—')}</strong></td>
                        <td><code>${escapeHtml(lic.licenseKeyMasked || 'XXXX-XXXX-XXXX')}</code></td>
                        <td>${lic.seatCount ? `${lic.seatCount} Devices` : '—'}</td>
                        <td class="small text-muted">${formatDate(lic.issuedDate)}</td>
                        <td class="small">${formatDate(lic.expiryDate)}</td>
                        <td><small class="text-muted">${escapeHtml(lic.notes || '—')}</small></td>
                      </tr>
                    `;
                  }).join('') || '<tr><td colspan="6" class="text-center py-3 text-muted">কোনো লাইসেন্স চুক্তি নেই</td></tr>'
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  },

  renderExpiryAlertsHtml(now) {
    const expiring = softwareList.filter((s) => {
      if (!s.expiryDate) return false;
      const days = Math.ceil((new Date(s.expiryDate) - now) / (1000 * 60 * 60 * 24));
      return days >= 0 && days <= 60;
    });

    if (expiring.length === 0) return '';

    return `
      <div class="alert alert-warning py-2 mb-4 d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <i class="bi bi-exclamation-triangle-fill text-warning me-2"></i>
          <strong>লাইসেন্স রিনিউয়াল সতর্কতা:</strong> আগামী ৬০ দিনের মধ্যে <strong>${expiring.length}টি</strong> সফটওয়্যারের লাইসেন্স বা সাবস্ক্রিপশন শেষ হবে।
          <span class="ms-1">(${expiring.map((e) => e.name).join(', ')})</span>
        </div>
        <a href="#/procurement" class="btn btn-sm btn-dark">পারচেজ প্রপোজাল তৈরি করুন</a>
      </div>
    `;
  },

  bindEvents() {
    const addBtn = document.getElementById('btn-add-software');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.showAddSoftwareModal());
    }

    const viewBtns = document.querySelectorAll('.btn-view-software');
    viewBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.showSoftwareDetailModal(id);
      });
    });
  },

  showAddSoftwareModal() {
    const formHtml = `
      <form id="add-software-form">
        <div class="row g-2">
          <div class="col-12 col-md-8">
            <label class="form-label small fw-semibold">সফটওয়্যারের নাম <span class="text-danger">*</span></label>
            <input type="text" class="form-control form-control-sm" id="form-soft-name" placeholder="যেমন: Meditech HMS 4.5" required>
          </div>
          <div class="col-12 col-md-4">
            <label class="form-label small fw-semibold">ক্যাটাগরি</label>
            <select class="form-select form-select-sm" id="form-soft-cat">
              <option value="HMS">হাসপাতাল ইআরপি / HMS</option>
              <option value="Antivirus">অ্যান্টিভাইরাস ও এন্ডপয়েন্ট</option>
              <option value="Database Server">ডাটাবেজ সার্ভার</option>
              <option value="Operating System">অপারেটিং সিস্টেম</option>
              <option value="Office Software">অফিস সুইট</option>
              <option value="PACS/Radiology">PACS রেডিওলজি সফটওয়্যার</option>
            </select>
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">ভেন্ডর / ডেভেলপমেন্ট কোম্পানি</label>
            <input type="text" class="form-control form-control-sm" id="form-soft-vendor" placeholder="Meditech BD">
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">ভার্সন</label>
            <input type="text" class="form-control form-control-sm" id="form-soft-ver" placeholder="v4.5.2">
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">লাইসেন্স টাইপ</label>
            <select class="form-select form-select-sm" id="form-soft-type">
              <option value="Annual Subscription">বাৎসরিক সাবস্ক্রিপশন (Annual)</option>
              <option value="Perpetual Enterprise">লাইফটাইম / পারপেচুয়াল (Perpetual)</option>
              <option value="Free / Open Source">ফ্রি / ওপেন সোর্স</option>
              <option value="OEM">ওএমএম (OEM Hardware Tied)</option>
            </select>
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">সিট সংখ্যা (Seats)</label>
            <input type="number" class="form-control form-control-sm" id="form-soft-seats" placeholder="50">
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">মেয়াদ শুরুর তারিখ</label>
            <input type="date" class="form-control form-control-sm" id="form-soft-start">
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">মেয়াদ সমাপ্তির তারিখ</label>
            <input type="date" class="form-control form-control-sm" id="form-soft-end">
          </div>
          <div class="col-12">
            <label class="form-label small fw-semibold">সাপোর্ট কন্টাক্ট / এসএলএ</label>
            <input type="text" class="form-control form-control-sm" id="form-soft-contact" placeholder="support@meditech.demo / 01700-000000">
          </div>
          <div class="col-12">
            <label class="form-label small fw-semibold">মাস্কড লাইসেন্স কি (গোপন কি সংরক্ষণ করবেন না)</label>
            <input type="text" class="form-control form-control-sm" id="form-soft-key" placeholder="KASP-XXXX-YYYY-ZZ01">
          </div>
        </div>
      </form>
    `;

    modal.show({
      title: '<i class="bi bi-window-stack text-primary"></i> সফটওয়্যার ও লাইসেন্স নিবন্ধন',
      body: formHtml,
      size: 'md',
      confirmText: 'সংরক্ষণ করুন',
      onConfirm: async () => {
        const name = document.getElementById('form-soft-name').value.trim();
        const cat = document.getElementById('form-soft-cat').value;
        const vendor = document.getElementById('form-soft-vendor').value.trim();
        const ver = document.getElementById('form-soft-ver').value.trim();
        const type = document.getElementById('form-soft-type').value;
        const seats = Number(document.getElementById('form-soft-seats').value) || 0;
        const start = document.getElementById('form-soft-start').value;
        const end = document.getElementById('form-soft-end').value;
        const contact = document.getElementById('form-soft-contact').value.trim();
        const maskedKey = document.getElementById('form-soft-key').value.trim();

        if (!name) {
          notifications.showToast('ভ্যালিডেশন এরর', 'সফটওয়্যারের নাম প্রদান আবশ্যক।', 'danger');
          return;
        }

        const savedSoft = await repository.add(STORES.SOFTWARE_PRODUCTS, {
          name,
          category: cat,
          vendor,
          currentVersion: ver,
          licenseType: type,
          seatCount: seats,
          startDate: start,
          expiryDate: end,
          supportContact: contact,
          status: 'Active'
        });

        if (maskedKey) {
          await repository.add(STORES.SOFTWARE_LICENSES, {
            softwareId: savedSoft.id,
            licenseKeyMasked: maskedKey,
            seatCount: seats,
            issuedDate: start,
            expiryDate: end,
            status: 'Active',
            notes: 'Registered via portal'
          });
        }

        await repository.logActivity('ADD_SOFTWARE', 'Software', savedSoft.name, `Added software: ${savedSoft.name}`);

        modal.hide();
        notifications.showToast('সফটওয়্যার সংরক্ষিত', `${name} সফলভাবে সিস্টেমে যুক্ত হয়েছে।`, 'success');
        await this.render();
      }
    });
  },

  async showSoftwareDetailModal(softwareId) {
    const soft = await repository.getById(STORES.SOFTWARE_PRODUCTS, softwareId);
    if (!soft) return;

    const licenses = await repository.find(STORES.SOFTWARE_LICENSES, (l) => l.softwareId === softwareId);

    const bodyHtml = `
      <div>
        <h4 class="text-primary fw-bold mb-1">${escapeHtml(soft.name)}</h4>
        <div class="mb-3">
          <span class="badge bg-secondary me-1">${escapeHtml(soft.category)}</span>
          <span class="badge bg-info text-dark">${escapeHtml(soft.currentVersion || 'v1.0')}</span>
          ${renderStatusBadge(soft.status)}
        </div>

        <table class="table table-sm table-bordered">
          <tbody>
            <tr><th style="width: 35%;">ভেন্ডর / প্রস্তুতকারক</th><td>${escapeHtml(soft.vendor || '—')}</td></tr>
            <tr><th>লাইসেন্স ক্যাটাগরি</th><td>${escapeHtml(soft.licenseType || '—')}</td></tr>
            <tr><th>বরাদ্দকৃত সিট সংখ্যা</th><td>${soft.seatCount ? `${soft.seatCount} Users` : 'Unlimited'}</td></tr>
            <tr><th>ব্যবহারকারী ডিপার্টমেন্ট</th><td>${escapeHtml(soft.departmentsUsing || 'All')}</td></tr>
            <tr><th>শুরু ও মেয়াদের তারিখ</th><td>${formatDate(soft.startDate)} থেকে <strong>${formatDate(soft.expiryDate)}</strong></td></tr>
            <tr><th>ভেন্ডর সাপোর্ট কন্টাক্ট</th><td><code>${escapeHtml(soft.supportContact || '—')}</code></td></tr>
            <tr><th>নোট / কাজের ক্ষেত্র</th><td>${escapeHtml(soft.notes || '—')}</td></tr>
          </tbody>
        </table>

        <h6 class="fw-bold mt-3 mb-2 small text-navy"><i class="bi bi-key me-1"></i> লাইসেন্স চুক্তি তথ্য:</h6>
        ${
          licenses.map((l) => `
            <div class="p-2 border rounded bg-light small mb-2">
              <div><strong>রেফারেন্স কি:</strong> <code>${escapeHtml(l.licenseKeyMasked)}</code></div>
              <div><strong>মেয়াদ:</strong> ${formatDate(l.expiryDate)} | <strong>সিট:</strong> ${l.seatCount}</div>
            </div>
          `).join('') || '<div class="text-muted small">কোনো নির্দিষ্ট চুক্তি কি নেই</div>'
        }
      </div>
    `;

    modal.show({
      title: `<i class="bi bi-window-stack text-primary"></i> সফটওয়্যার বিস্তারিত`,
      body: bodyHtml,
      size: 'md',
      showConfirm: false,
      cancelText: 'বন্ধ করুন'
    });
  }
};

