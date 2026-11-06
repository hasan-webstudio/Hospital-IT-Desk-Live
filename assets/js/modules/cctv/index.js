/**
 * Hospital IT Desk — Module 5: CCTV & Security Equipment Management
 * Surveillance equipment inventory, periodic physical inspection logs, and maintenance tracking.
 */

import { repository } from '../../core/repository.js';
import { STORES } from '../../data/schema.js';
import { t } from '../../core/i18n.js';
import { formatDate, renderStatusBadge, escapeHtml } from '../../core/formatters.js';
import { modal } from '../../components/modal.js';
import { notifications } from '../../core/notifications.js';

let cctvDevices = [];
let departments = [];

export const cctvModule = {
  async render() {
    const contentArea = document.getElementById('content-area');
    if (!contentArea) return;

    [cctvDevices, departments] = await Promise.all([
      repository.getAll(STORES.CCTV_DEVICES),
      repository.getAll(STORES.DEPARTMENTS)
    ]);

    const activeCameras = cctvDevices.filter((c) => c.status === 'Active').length;

    contentArea.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title"><i class="bi bi-camera-video-fill text-primary"></i> ${t('navCctv')}</h1>
          <p class="page-subtitle">হাসপাতালের সিসিটিভি ক্যামেরা, এনভিআর রেকর্ডার ও সিকিউরিটি সরঞ্জামের ইনভেন্টরি ও পরিদর্শন লগ</p>
        </div>
        <div class="action-buttons">
          <button type="button" class="btn btn-primary btn-sm" id="btn-add-cctv">
            <i class="bi bi-plus-lg me-1"></i> নতুন ক্যামেরা / এনভিআর যুক্ত
          </button>
        </div>
      </div>

      <!-- Scope & Limitation Notice -->
      <div class="alert alert-warning py-2 small mb-4">
        <i class="bi bi-shield-exclamation me-1"></i>
        <strong>সিকিউরিটি ও প্রাইভেসি প্রটোকল:</strong> এটি হাসপাতাল সিসিটিভি সরঞ্জামের শারীরিক ইনভেন্টরি ও পরিদর্শন রেজিস্টার। রোগীর ও হাসপাতালের গোপনীয়তা রক্ষায় ব্রাউজারে কোনো লাইভ ভিডিও স্ট্রিম বা গোপন ক্যামেরার পাসওয়ার্ড সংরক্ষণ করা হয় না।
      </div>

      <!-- Quick Summary Cards -->
      <div class="row g-3 mb-4">
        <div class="col-12 col-sm-6 col-md-4">
          <div class="kpi-card">
            <div class="kpi-icon-wrapper kpi-icon-blue">
              <i class="bi bi-camera-video"></i>
            </div>
            <div class="kpi-info">
              <div class="kpi-value">${cctvDevices.length}</div>
              <div class="kpi-label">মোট নজরদারি সরঞ্জাম</div>
              <div class="kpi-subtext text-success">${activeCameras} টি সচল ডিভাইস</div>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-md-4">
          <div class="kpi-card">
            <div class="kpi-icon-wrapper kpi-icon-teal">
              <i class="bi bi-hdd-stack"></i>
            </div>
            <div class="kpi-info">
              <div class="kpi-value">32 Channel</div>
              <div class="kpi-label">প্রধান এনভিআর ক্ষমতা</div>
              <div class="kpi-subtext text-muted">RAID 5 (30 Days Retention)</div>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-md-4">
          <div class="kpi-card">
            <div class="kpi-icon-wrapper kpi-icon-amber">
              <i class="bi bi-clipboard-check"></i>
            </div>
            <div class="kpi-info">
              <div class="kpi-value">সাপ্তাহিক</div>
              <div class="kpi-label">পরিদর্শন শিডিউল</div>
              <div class="kpi-subtext text-muted">লেন্স ক্লিনিং ও ফুটেজ অডিট</div>
            </div>
          </div>
        </div>
      </div>

      <!-- CCTV Devices Table Card -->
      <div class="card-custom">
        <div class="card-custom-header">
          <h5 class="card-custom-title"><i class="bi bi-camera-fill text-navy"></i> ইনস্টলকৃত সিসিটিভি ক্যামেরা ও এনভিআর তালিকা</h5>
        </div>
        <div class="card-custom-body p-0">
          <div class="table-responsive-custom">
            <table class="table-custom">
              <thead>
                <tr>
                  <th>চ্যানেল / আইডি</th>
                  <th>ক্যামেরা / সরঞ্জামের নাম</th>
                  <th>ধরন (Type)</th>
                  <th>বিভাগ ও কাভারেজ এলাকা</th>
                  <th>আইপি অ্যাড্রেস</th>
                  <th>স্টোরেজ ও রেকর্ডিং</th>
                  <th>সর্বশেষ পরিদর্শন</th>
                  <th>স্ট্যাটাস</th>
                  <th style="width: 100px;">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody>
                ${
                  cctvDevices.map((cam) => {
                    const dept = departments.find((d) => d.id === cam.departmentId);
                    return `
                      <tr>
                        <td><strong class="text-primary">${escapeHtml(cam.channelNo || '—')}</strong></td>
                        <td>
                          <strong>${escapeHtml(cam.name)}</strong><br>
                          <small class="text-muted">${escapeHtml(cam.brand || '')} ${escapeHtml(cam.model || '')} (${escapeHtml(cam.resolution || '')})</small>
                        </td>
                        <td><span class="badge bg-light text-dark border">${escapeHtml(cam.cameraType)}</span></td>
                        <td>
                          <div>${escapeHtml(dept ? dept.nameBn : '—')}</div>
                          <small class="text-muted">${escapeHtml(cam.location || '—')}</small>
                        </td>
                        <td><code>${escapeHtml(cam.ipAddress || '—')}</code></td>
                        <td><small class="text-muted">${escapeHtml(cam.nvrStorageInfo || '—')}</small></td>
                        <td class="small text-muted">${formatDate(cam.lastInspectionDate)}</td>
                        <td>${renderStatusBadge(cam.status)}</td>
                        <td>
                          <button type="button" class="btn btn-sm btn-outline-primary btn-inspect-cctv" data-id="${cam.id}" title="পরিদর্শন লগ আপডেট">
                            <i class="bi bi-check2-square"></i>
                          </button>
                        </td>
                      </tr>
                    `;
                  }).join('') || '<tr><td colspan="9" class="text-center py-4 text-muted">কোনো সিসিটিভি রেকর্ড নেই</td></tr>'
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
    const addBtn = document.getElementById('btn-add-cctv');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.showAddCctvModal());
    }

    const inspectBtns = document.querySelectorAll('.btn-inspect-cctv');
    inspectBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.showInspectionModal(id);
      });
    });
  },

  showAddCctvModal() {
    const formHtml = `
      <form id="add-cctv-form">
        <div class="row g-2">
          <div class="col-12 col-md-4">
            <label class="form-label small fw-semibold">চ্যানেল / ডিভাইস কোড <span class="text-danger">*</span></label>
            <input type="text" class="form-control form-control-sm" id="form-cctv-channel" placeholder="CH-05" required>
          </div>
          <div class="col-12 col-md-8">
            <label class="form-label small fw-semibold">ক্যামেরার নাম <span class="text-danger">*</span></label>
            <input type="text" class="form-control form-control-sm" id="form-cctv-name" placeholder="যেমন: OT Corridor Fixed Dome" required>
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">ক্যামেরার ধরন</label>
            <select class="form-select form-select-sm" id="form-cctv-type">
              <option value="IP Camera">IP Camera (PoE Dome/Bullet)</option>
              <option value="Analog Camera">Analog Camera</option>
              <option value="PTZ Camera">PTZ 360 Speed Dome</option>
              <option value="NVR">NVR / DVR Storage</option>
            </select>
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">বিভাগ</label>
            <select class="form-select form-select-sm" id="form-cctv-dept">
              ${departments.map((d) => `<option value="${d.id}">${escapeHtml(d.nameBn)}</option>`).join('')}
            </select>
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">অবস্থান / কাভারেজ এরিয়া</label>
            <input type="text" class="form-control form-control-sm" id="form-cctv-location" placeholder="৪র্থ তলা ওটি করিডোর">
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">আইপি অ্যাড্রেস (VLAN 30)</label>
            <input type="text" class="form-control form-control-sm" id="form-cctv-ip" placeholder="192.168.30.20">
          </div>
          <div class="col-12">
            <label class="form-label small fw-semibold">স্টোরেজ ও এনভিআর তথ্য</label>
            <input type="text" class="form-control form-control-sm" id="form-cctv-storage" placeholder="Recording to NVR-01 Port 05 (30 days retention)">
          </div>
        </div>
      </form>
    `;

    modal.show({
      title: '<i class="bi bi-camera-video text-primary"></i> সিসিটিভি ক্যামেরা বা সরঞ্জাম যুক্ত করুন',
      body: formHtml,
      size: 'md',
      confirmText: 'সংরক্ষণ করুন',
      onConfirm: async () => {
        const channel = document.getElementById('form-cctv-channel').value.trim();
        const name = document.getElementById('form-cctv-name').value.trim();
        const type = document.getElementById('form-cctv-type').value;
        const deptId = document.getElementById('form-cctv-dept').value;
        const location = document.getElementById('form-cctv-location').value.trim();
        const ip = document.getElementById('form-cctv-ip').value.trim();
        const storageInfo = document.getElementById('form-cctv-storage').value.trim();

        if (!channel || !name) {
          notifications.showToast('ভ্যালিডেশন এরর', 'চ্যানেল ও নাম প্রদান আবশ্যক।', 'danger');
          return;
        }

        await repository.add(STORES.CCTV_DEVICES, {
          channelNo: channel,
          name,
          cameraType: type,
          departmentId: deptId,
          location,
          ipAddress: ip,
          nvrStorageInfo: storageInfo,
          brand: 'Hikvision',
          status: 'Active',
          lastInspectionDate: new Date().toISOString().split('T')[0]
        });

        modal.hide();
        notifications.showToast('ক্যামেরা সংরক্ষিত', `${name} সফলভাবে যুক্ত হয়েছে।`, 'success');
        await this.render();
      }
    });
  },

  async showInspectionModal(cctvId) {
    const cam = await repository.getById(STORES.CCTV_DEVICES, cctvId);
    if (!cam) return;

    const bodyHtml = `
      <form id="cctv-inspection-form">
        <div class="alert alert-light border py-2 mb-3">
          <strong>ক্যামেরা:</strong> ${escapeHtml(cam.channelNo)} — ${escapeHtml(cam.name)}<br>
          <strong>অবস্থান:</strong> ${escapeHtml(cam.location || '—')} | <code>${escapeHtml(cam.ipAddress || '')}</code>
        </div>

        <div class="mb-3">
          <label class="form-label small fw-semibold">পরিদর্শনের তারিখ</label>
          <input type="date" class="form-control form-control-sm" id="inspect-date" value="${new Date().toISOString().split('T')[0]}" required>
        </div>

        <div class="mb-3">
          <label class="form-label small fw-semibold">পরিদর্শনকারী টেকনিশিয়ান</label>
          <input type="text" class="form-control form-control-sm" id="inspect-technician" value="সোহেল রানা (আইটি সহকারী)" required>
        </div>

        <div class="mb-3">
          <label class="form-label small fw-semibold">শারীরিক ও ভিডিও অবস্থা</label>
          <select class="form-select form-select-sm" id="inspect-status">
            <option value="Active" selected>সচল ও পরিষ্কার (Active - Clean View)</option>
            <option value="In Repair">লেন্স ঝাপসা বা পাওয়ার সমস্যা (Needs Repair)</option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label small fw-semibold">পরিদর্শন মন্তব্য / কাজ</label>
          <textarea class="form-control form-control-sm" id="inspect-notes" rows="2" placeholder="ক্যামেরা গ্লাস পরিষ্কার করা হয়েছে, ইনফ্রারেড নাইট ভিশন টেস্ট করা হয়েছে..."></textarea>
        </div>
      </form>
    `;

    modal.show({
      title: `<i class="bi bi-clipboard-check text-primary"></i> সিসিটিভি নিয়মিত পরিদর্শন লগ`,
      body: bodyHtml,
      size: 'md',
      confirmText: 'পরিদর্শন লগ সেভ করুন',
      confirmClass: 'btn-primary',
      onConfirm: async () => {
        const date = document.getElementById('inspect-date').value;
        const status = document.getElementById('inspect-status').value;
        const notes = document.getElementById('inspect-notes').value.trim();

        cam.lastInspectionDate = date;
        cam.status = status;
        cam.problemNotes = notes;

        await repository.update(STORES.CCTV_DEVICES, cam);
        await repository.logActivity('INSPECT_CCTV', 'CCTV', cam.channelNo, `CCTV inspected: ${notes}`);

        modal.hide();
        notifications.showToast('পরিদর্শন সংরক্ষিত', `ক্যামেরা ${cam.channelNo} এর পরিদর্শন রেকর্ড সফলভাবে সেভ হয়েছে।`, 'success');
        await this.render();
      }
    });
  }
};

