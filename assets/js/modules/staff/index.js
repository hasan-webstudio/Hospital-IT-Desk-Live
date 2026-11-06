/**
 * Hospital IT Desk — Module 9: Staff, Department & Demo Access Management
 * Department directory, IT employee directory, and mock access-request workflows.
 */

import { repository } from '../../core/repository.js';
import { STORES } from '../../data/schema.js';
import { t } from '../../core/i18n.js';
import { renderStatusBadge, escapeHtml } from '../../core/formatters.js';
import { modal } from '../../components/modal.js';
import { notifications } from '../../core/notifications.js';

let departments = [];
let employees = [];
let demoUsers = [];

export const staffModule = {
  async render() {
    const contentArea = document.getElementById('content-area');
    if (!contentArea) return;

    [departments, employees, demoUsers] = await Promise.all([
      repository.getAll(STORES.DEPARTMENTS),
      repository.getAll(STORES.EMPLOYEES),
      repository.getAll(STORES.DEMO_USERS)
    ]);

    contentArea.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title"><i class="bi bi-people-fill text-primary"></i> ${t('navStaff')}</h1>
          <p class="page-subtitle">হাসপাতালের সাংগঠনিক বিভাগ, কর্মকর্তা-কর্মচারী ডিরেক্টরি ও সিস্টেম অ্যাক্সেস ম্যানেজমেন্ট</p>
        </div>
        <div class="action-buttons">
          <button type="button" class="btn btn-primary btn-sm" id="btn-add-employee">
            <i class="bi bi-person-plus me-1"></i> নতুন কর্মী যুক্ত করুন
          </button>
        </div>
      </div>

      <!-- Scope Notice -->
      <div class="alert alert-info py-2 small mb-4">
        <i class="bi bi-info-circle-fill me-1"></i>
        <strong>ডিরেক্টরি ও রোল নীতিমালা:</strong> এটি হাসপাতাল আইটি সাপোর্টের জন্য বিভাগ ও স্টাফদের যোগাযোগের ডিরেক্টরি। কোনো সংবেদনশীল রোগী বা চিকিৎসাগত তথ্য এখানে সংরক্ষণ করা হয় না।
      </div>

      <!-- Departments Grid -->
      <div class="card-custom mb-4">
        <div class="card-custom-header">
          <h5 class="card-custom-title"><i class="bi bi-building text-navy"></i> হাসপাতালের স্বীকৃত বিভাগসমূহ (Departments)</h5>
          <span class="badge bg-light text-muted border">মোট ${departments.length} টি বিভাগ</span>
        </div>
        <div class="card-custom-body">
          <div class="row g-3">
            ${
              departments.map((d) => `
                <div class="col-12 col-sm-6 col-lg-4">
                  <div class="p-3 bg-light rounded border h-100">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                      <h6 class="fw-bold text-navy mb-0">${escapeHtml(d.nameBn)}</h6>
                      <span class="badge bg-primary">${escapeHtml(d.code)}</span>
                    </div>
                    <div class="small text-muted mb-2">${escapeHtml(d.nameEn || '')}</div>
                    <div class="small text-muted"><i class="bi bi-geo-alt me-1"></i> ${escapeHtml(d.location)}</div>
                  </div>
                </div>
              `).join('')
            }
          </div>
        </div>
      </div>

      <!-- Employee Directory Table Card -->
      <div class="card-custom">
        <div class="card-custom-header">
          <h5 class="card-custom-title"><i class="bi bi-person-badge text-primary"></i> হাসপাতাল কর্মী ও আইটি ফোকাল পয়েন্ট ডিরেক্টরি</h5>
          <span class="badge bg-light text-muted border">মোট ${employees.length} জন</span>
        </div>
        <div class="card-custom-body p-0">
          <div class="table-responsive-custom">
            <table class="table-custom">
              <thead>
                <tr>
                  <th>আইডি কোড</th>
                  <th>কর্মীর নাম</th>
                  <th>বিভাগ (Department)</th>
                  <th>পদবি (Designation)</th>
                  <th>যোগাযোগ নম্বর</th>
                  <th>ইমেইল এড্রেস</th>
                  <th>অবস্থা</th>
                </tr>
              </thead>
              <tbody>
                ${
                  employees.map((emp) => {
                    const dept = departments.find((d) => d.id === emp.departmentId);
                    return `
                      <tr>
                        <td><strong class="text-primary font-monospace">${escapeHtml(emp.employeeCode)}</strong></td>
                        <td>
                          <strong>${escapeHtml(emp.nameBn)}</strong><br>
                          <small class="text-muted">${escapeHtml(emp.nameEn || '')}</small>
                        </td>
                        <td><span class="badge bg-light text-dark border">${escapeHtml(dept ? dept.nameBn : '—')}</span></td>
                        <td>${escapeHtml(emp.designation)}</td>
                        <td><code>${escapeHtml(emp.phone || '—')}</code></td>
                        <td><small class="text-muted">${escapeHtml(emp.email || '—')}</small></td>
                        <td>${renderStatusBadge(emp.isActive ? 'Active' : 'Inactive')}</td>
                      </tr>
                    `;
                  }).join('') || '<tr><td colspan="7" class="text-center py-4 text-muted">কোনো রেকর্ড নেই</td></tr>'
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
    const addBtn = document.getElementById('btn-add-employee');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.showAddEmployeeModal());
    }
  },

  showAddEmployeeModal() {
    const nextCode = `EMP-${1000 + employees.length + 1}`;

    const formHtml = `
      <form id="add-employee-form">
        <div class="row g-2">
          <div class="col-12 col-md-4">
            <label class="form-label small fw-semibold">কর্মী কোড</label>
            <input type="text" class="form-control form-control-sm" id="form-emp-code" value="${nextCode}" readonly>
          </div>
          <div class="col-12 col-md-8">
            <label class="form-label small fw-semibold">নাম (বাংলা) <span class="text-danger">*</span></label>
            <input type="text" class="form-control form-control-sm" id="form-emp-namebn" placeholder="যেমন: ডাঃ রফিকুল হক" required>
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">নাম (English)</label>
            <input type="text" class="form-control form-control-sm" id="form-emp-nameen" placeholder="Dr. Rafiqul Haque">
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">বিভাগ <span class="text-danger">*</span></label>
            <select class="form-select form-select-sm" id="form-emp-dept" required>
              ${departments.map((d) => `<option value="${d.id}">${escapeHtml(d.nameBn)}</option>`).join('')}
            </select>
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">পদবি</label>
            <input type="text" class="form-control form-control-sm" id="form-emp-designation" placeholder="যেমন: মেডিকেল অফিসার">
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">ফোন নম্বর</label>
            <input type="text" class="form-control form-control-sm" id="form-emp-phone" placeholder="01711-XXXXXX">
          </div>
          <div class="col-12">
            <label class="form-label small fw-semibold">ইমেইল এড্রেস</label>
            <input type="email" class="form-control form-control-sm" id="form-emp-email" placeholder="doctor@dhakacentralhosp.demo">
          </div>
        </div>
      </form>
    `;

    modal.show({
      title: '<i class="bi bi-person-plus text-primary"></i> নতুন কর্মী নিবন্ধন',
      body: formHtml,
      size: 'md',
      confirmText: 'সংরক্ষণ করুন',
      onConfirm: async () => {
        const nameBn = document.getElementById('form-emp-namebn').value.trim();
        const nameEn = document.getElementById('form-emp-nameen').value.trim();
        const deptId = document.getElementById('form-emp-dept').value;
        const desig = document.getElementById('form-emp-designation').value.trim();
        const phone = document.getElementById('form-emp-phone').value.trim();
        const email = document.getElementById('form-emp-email').value.trim();

        if (!nameBn) {
          notifications.showToast('ভ্যালিডেশন এরর', 'কর্মীর নাম প্রদান বাধ্যতামূলক।', 'danger');
          return;
        }

        await repository.add(STORES.EMPLOYEES, {
          employeeCode: nextCode,
          nameBn,
          nameEn,
          departmentId: deptId,
          designation: desig,
          phone,
          email,
          isActive: true
        });

        modal.hide();
        notifications.showToast('কর্মী সংরক্ষিত', `${nameBn} সফলভাবে তালিকায় যোগ করা হয়েছে।`, 'success');
        await this.render();
      }
    });
  }
};

