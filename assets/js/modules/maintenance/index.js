/**
 * Hospital IT Desk — Module 8: IT Maintenance & Task Schedule
 * Routine preventive maintenance checklists, task execution, and overdue tracking.
 */

import { repository } from '../../core/repository.js';
import { STORES } from '../../data/schema.js';
import { t } from '../../core/i18n.js';
import { formatDate, renderStatusBadge, renderPriorityBadge, escapeHtml, generateSequentialCode } from '../../core/formatters.js';
import { modal } from '../../components/modal.js';
import { notifications } from '../../core/notifications.js';

let maintenanceTasks = [];
let maintenanceTemplates = [];
let employees = [];

export const maintenanceModule = {
  async render() {
    const contentArea = document.getElementById('content-area');
    if (!contentArea) return;

    [maintenanceTasks, maintenanceTemplates, employees] = await Promise.all([
      repository.getAll(STORES.MAINTENANCE_TASKS),
      repository.getAll(STORES.MAINTENANCE_TEMPLATES),
      repository.getAll(STORES.EMPLOYEES)
    ]);

    // Check for overdue tasks based on current date
    const todayStr = new Date().toISOString().split('T')[0];
    maintenanceTasks.forEach((tsk) => {
      if (tsk.status !== 'Completed' && tsk.status !== 'Cancelled' && tsk.dueDate) {
        if (tsk.dueDate < todayStr) {
          tsk.status = 'Overdue';
        }
      }
    });

    const pendingCount = maintenanceTasks.filter((t) => t.status !== 'Completed').length;
    const completedCount = maintenanceTasks.filter((t) => t.status === 'Completed').length;
    const overdueCount = maintenanceTasks.filter((t) => t.status === 'Overdue').length;

    contentArea.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title"><i class="bi bi-calendar-check-fill text-primary"></i> ${t('navMaintenance')}</h1>
          <p class="page-subtitle">হাসপাতালের আইটি অবকাঠামোর নিয়মিত প্রতিরোধমূলক রক্ষণাবেক্ষণ (Preventive Maintenance) ও চেকলিস্ট শিডিউল</p>
        </div>
        <div class="action-buttons">
          <button type="button" class="btn btn-primary btn-sm" id="btn-schedule-task">
            <i class="bi bi-plus-lg me-1"></i> নতুন কাজ শিডিউল করুন
          </button>
        </div>
      </div>

      <!-- Quick KPI Metrics -->
      <div class="row g-3 mb-4">
        <div class="col-12 col-sm-4">
          <div class="kpi-card">
            <div class="kpi-icon-wrapper kpi-icon-purple">
              <i class="bi bi-list-task"></i>
            </div>
            <div class="kpi-info">
              <div class="kpi-value">${maintenanceTasks.length}</div>
              <div class="kpi-label">মোট শিডিউলকৃত কাজ</div>
              <div class="kpi-subtext text-muted">${maintenanceTemplates.length} টি স্ট্যান্ডার্ড টেমপ্লেট</div>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-4">
          <div class="kpi-card">
            <div class="kpi-icon-wrapper kpi-icon-teal">
              <i class="bi bi-check2-all"></i>
            </div>
            <div class="kpi-info">
              <div class="kpi-value text-success">${completedCount}</div>
              <div class="kpi-label">সম্পন্ন কাজ (Completed)</div>
              <div class="kpi-subtext text-success">চেকলিস্ট নিরীক্ষিত</div>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-4">
          <div class="kpi-card">
            <div class="kpi-icon-wrapper kpi-icon-amber">
              <i class="bi bi-clock-history"></i>
            </div>
            <div class="kpi-info">
              <div class="kpi-value ${overdueCount > 0 ? 'text-danger' : 'text-warning'}">${pendingCount}</div>
              <div class="kpi-label">চলমান ও পেন্ডিং কাজ</div>
              <div class="kpi-subtext ${overdueCount > 0 ? 'text-danger fw-bold' : 'text-muted'}">
                ${overdueCount} টি সময়সীমা অতিক্রান্ত (Overdue)
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tasks List Table Card -->
      <div class="card-custom">
        <div class="card-custom-header">
          <h5 class="card-custom-title"><i class="bi bi-calendar3 text-navy"></i> রক্ষণাবেক্ষণ কাজের তালিকা ও চেকলিস্টের অগ্রগতি</h5>
        </div>
        <div class="card-custom-body p-0">
          <div class="table-responsive-custom">
            <table class="table-custom">
              <thead>
                <tr>
                  <th>টাস্ক কোড</th>
                  <th>কাজের শিরোনাম</th>
                  <th>ফ্রিকোয়েন্সি (ধরন)</th>
                  <th>নির্ধারিত তারিখ (Due Date)</th>
                  <th>অগ্রাধিকার</th>
                  <th>দায়িত্বপ্রাপ্ত কর্মী</th>
                  <th>চেকলিস্ট অগ্রগতি</th>
                  <th>অবস্থা (Status)</th>
                  <th style="width: 130px;">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody>
                ${
                  maintenanceTasks.map((tsk) => {
                    const totalItems = tsk.checklistItems ? tsk.checklistItems.length : 0;
                    const doneItems = tsk.checklistItems ? tsk.checklistItems.filter((i) => i.completed).length : 0;
                    const percent = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

                    return `
                      <tr>
                        <td><strong class="text-primary font-monospace">${escapeHtml(tsk.taskCode || 'MNT-000')}</strong></td>
                        <td>
                          <strong>${escapeHtml(tsk.title)}</strong><br>
                          <small class="text-muted"><i class="bi bi-geo-alt me-1"></i>${escapeHtml(tsk.location || 'Hospital-wide')}</small>
                        </td>
                        <td><span class="badge bg-light text-dark border">${escapeHtml(tsk.taskType)}</span></td>
                        <td><small class="fw-medium">${formatDate(tsk.dueDate)}</small></td>
                        <td>${renderPriorityBadge(tsk.priority)}</td>
                        <td><small>${escapeHtml(tsk.assignedToName || 'আইটি টিম')}</small></td>
                        <td>
                          <div class="d-flex align-items-center gap-2" style="min-width: 100px;">
                            <div class="progress flex-grow-1" style="height: 6px;">
                              <div class="progress-bar ${percent === 100 ? 'bg-success' : 'bg-primary'}" role="progressbar" style="width: ${percent}%;"></div>
                            </div>
                            <small class="text-muted">${doneItems}/${totalItems}</small>
                          </div>
                        </td>
                        <td>${renderStatusBadge(tsk.status)}</td>
                        <td>
                          <button type="button" class="btn btn-sm ${tsk.status === 'Completed' ? 'btn-outline-secondary' : 'btn-outline-primary'} btn-manage-task" data-id="${tsk.id}">
                            <i class="bi ${tsk.status === 'Completed' ? 'bi-eye' : 'bi-check2-circle'} me-1"></i> ${tsk.status === 'Completed' ? 'রিভিউ' : 'সম্পাদন'}
                          </button>
                        </td>
                      </tr>
                    `;
                  }).join('') || '<tr><td colspan="9" class="text-center py-4 text-muted">কোনো টাস্ক নেই</td></tr>'
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
    const scheduleBtn = document.getElementById('btn-schedule-task');
    if (scheduleBtn) {
      scheduleBtn.addEventListener('click', () => this.showScheduleTaskModal());
    }

    const manageBtns = document.querySelectorAll('.btn-manage-task');
    manageBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.showManageTaskModal(id);
      });
    });
  },

  showScheduleTaskModal() {
    const nextCode = generateSequentialCode('MNT-2026-', maintenanceTasks, 'taskCode');
    const itStaff = employees.filter((e) => e.departmentId === 'dept-10');

    const formHtml = `
      <form id="schedule-task-form">
        <div class="row g-2">
          <div class="col-12 col-md-4">
            <label class="form-label small fw-semibold">টাস্ক কোড</label>
            <input type="text" class="form-control form-control-sm" id="form-tsk-code" value="${nextCode}" readonly>
          </div>
          <div class="col-12 col-md-8">
            <label class="form-label small fw-semibold">কাজের শিরোনাম <span class="text-danger">*</span></label>
            <input type="text" class="form-control form-control-sm" id="form-tsk-title" placeholder="যেমন: আইসিইউ পিসি ও ইউপিএস হেলথ অডিট" required>
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">রক্ষণাবেক্ষণের ধরন (ফ্রিকোয়েন্সি)</label>
            <select class="form-select form-select-sm" id="form-tsk-type">
              <option value="Daily">Daily (দৈনিক)</option>
              <option value="Weekly" selected>Weekly (সাপ্তাহিক)</option>
              <option value="Monthly">Monthly (মাসিক)</option>
              <option value="Quarterly">Quarterly (ত্রৈমাসিক)</option>
              <option value="One-time">One-time (এককালীন)</option>
            </select>
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">নির্ধারিত সমাপ্তির তারিখ (Due Date) <span class="text-danger">*</span></label>
            <input type="date" class="form-control form-control-sm" id="form-tsk-duedate" value="${new Date().toISOString().split('T')[0]}" required>
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">দায়িত্বপ্রাপ্ত কর্মী</label>
            <select class="form-select form-select-sm" id="form-tsk-assignee">
              ${itStaff.map((s) => `<option value="${s.id}">${escapeHtml(s.nameBn)}</option>`).join('')}
            </select>
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">অগ্রাধিকার</label>
            <select class="form-select form-select-sm" id="form-tsk-priority">
              <option value="Medium" selected>সাধারণ (Medium)</option>
              <option value="High">জরুরি (High)</option>
              <option value="Critical">মারাত্মক জরুরি (Critical)</option>
            </select>
          </div>
          <div class="col-12">
            <label class="form-label small fw-semibold">অবস্থান / বিভাগ</label>
            <input type="text" class="form-control form-control-sm" id="form-tsk-location" placeholder="যেমন: ৩য় তলা আইসিইউ রুম">
          </div>
          <div class="col-12">
            <label class="form-label small fw-semibold">চেকলিস্টের ধাপসমূহ (প্রতি লাইনে একটি)</label>
            <textarea class="form-control form-control-sm" id="form-tsk-checklist" rows="3" placeholder="১. পিসির ধুলাবালি পরিষ্কার&#10;২. অ্যান্টিভাইরাস স্ক্যান&#10;৩. ইউপিএস ডিসচার্জ ব্যাকআপ পরীক্ষা"></textarea>
          </div>
        </div>
      </form>
    `;

    modal.show({
      title: '<i class="bi bi-calendar-check text-primary"></i> নতুন রক্ষণাবেক্ষণ কাজ শিডিউল করুন',
      body: formHtml,
      size: 'md',
      confirmText: 'শিডিউল সংরক্ষণ',
      onConfirm: async () => {
        const title = document.getElementById('form-tsk-title').value.trim();
        const type = document.getElementById('form-tsk-type').value;
        const dueDate = document.getElementById('form-tsk-duedate').value;
        const assigneeId = document.getElementById('form-tsk-assignee').value;
        const priority = document.getElementById('form-tsk-priority').value;
        const location = document.getElementById('form-tsk-location').value.trim();
        const checklistRaw = document.getElementById('form-tsk-checklist').value.trim();

        if (!title || !dueDate) {
          notifications.showToast('ভ্যালিডেশন এরর', 'কাজের শিরোনাম ও তারিখ দেওয়া আবশ্যক।', 'danger');
          return;
        }

        const assigneeObj = itStaff.find((s) => s.id === assigneeId);

        const items = checklistRaw
          ? checklistRaw.split('\n').filter((l) => l.trim().length > 0).map((l) => ({ label: l.trim(), completed: false }))
          : [{ label: 'প্রাথমিক পরীক্ষা ও সার্ভিসিং সম্পন্ন', completed: false }];

        const newTask = {
          taskCode: nextCode,
          title,
          taskType: type,
          dueDate,
          priority,
          location,
          assignedToId: assigneeId,
          assignedToName: assigneeObj ? assigneeObj.nameBn : 'আইটি টিম',
          status: 'Upcoming',
          checklistItems: items,
          completionNotes: ''
        };

        await repository.add(STORES.MAINTENANCE_TASKS, newTask);
        await repository.logActivity('SCHEDULE_MAINTENANCE', 'Maintenance', nextCode, `Scheduled maintenance: ${title}`);

        modal.hide();
        notifications.showToast('শিডিউল সংরক্ষিত', `টাস্ক ${nextCode} সফলভাবে ক্যালেন্ডারে যুক্ত হয়েছে।`, 'success');
        await this.render();
      }
    });
  },

  async showManageTaskModal(taskId) {
    const task = await repository.getById(STORES.MAINTENANCE_TASKS, taskId);
    if (!task) return;

    const bodyHtml = `
      <div>
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 class="fw-bold mb-0 text-primary">${escapeHtml(task.title)}</h5>
            <small class="text-muted">${escapeHtml(task.taskCode)} | নির্ধারিত তারিখ: <strong>${formatDate(task.dueDate)}</strong></small>
          </div>
          <div>
            ${renderStatusBadge(task.status)}
          </div>
        </div>

        <h6 class="fw-bold small text-navy mb-2"><i class="bi bi-ui-checks me-1"></i> চেকলিস্ট আইটেমসমূহ সম্পন্ন করুন:</h6>
        <div class="list-group mb-3" id="task-checklist-group">
          ${
            (task.checklistItems || []).map((item, idx) => `
              <label class="list-group-item d-flex gap-2 align-items-center py-2">
                <input class="form-check-input flex-shrink-0 checklist-item-checkbox" type="checkbox" data-index="${idx}" ${item.completed ? 'checked' : ''}>
                <span class="${item.completed ? 'text-decoration-line-through text-muted' : ''}">${escapeHtml(item.label)}</span>
              </label>
            `).join('') || '<div class="text-muted small">কোনো নির্দিষ্ট চেকলিস্ট নেই</div>'
          }
        </div>

        <div class="mb-3">
          <label class="form-label small fw-semibold">সার্ভিসিং / সম্পাদন রিপোর্ট নোট</label>
          <textarea class="form-control form-control-sm" id="manage-task-notes" rows="2" placeholder="কাজের ফলাফল, কোনো ত্রুটি শনাক্ত বা মেরামতের বিবরণ...">${escapeHtml(task.completionNotes || '')}</textarea>
        </div>

        <div class="d-flex justify-content-between align-items-center border-top pt-2">
          <span class="small text-muted">দায়িত্বপ্রাপ্ত: <strong>${escapeHtml(task.assignedToName || 'আইটি টিম')}</strong></span>
          <button type="button" class="btn btn-success btn-sm" id="btn-mark-task-complete">
            <i class="bi bi-check2-all me-1"></i> কাজ সম্পন্ন হিসেবে চিহ্নিত করুন
          </button>
        </div>
      </div>
    `;

    modal.show({
      title: `<i class="bi bi-tools text-primary"></i> রক্ষণাবেক্ষণ চেকলিস্ট সম্পাদন`,
      body: bodyHtml,
      size: 'md',
      showConfirm: false,
      cancelText: 'বন্ধ করুন'
    });

    // Checkbox toggle
    const checkboxes = document.querySelectorAll('.checklist-item-checkbox');
    checkboxes.forEach((cb) => {
      cb.addEventListener('change', async () => {
        const idx = parseInt(cb.getAttribute('data-index'), 10);
        if (task.checklistItems && task.checklistItems[idx]) {
          task.checklistItems[idx].completed = cb.checked;
          await repository.update(STORES.MAINTENANCE_TASKS, task);
        }
      });
    });

    // Complete button
    const completeBtn = document.getElementById('btn-mark-task-complete');
    if (completeBtn) {
      completeBtn.addEventListener('click', async () => {
        const notes = document.getElementById('manage-task-notes').value.trim();

        // Mark all checklist items complete if completing
        if (task.checklistItems) {
          task.checklistItems.forEach((i) => { i.completed = true; });
        }
        task.status = 'Completed';
        task.completionNotes = notes;
        task.completedAt = new Date().toISOString();
        task.completedBy = task.assignedToName || 'মোঃ কামরুল হাসান';

        await repository.update(STORES.MAINTENANCE_TASKS, task);
        await repository.logActivity('COMPLETE_MAINTENANCE', 'Maintenance', task.taskCode, `Completed task: ${task.title}`);

        modal.hide();
        notifications.showToast('কাজ সম্পন্ন', `টাস্ক ${task.taskCode} সফলভাবে সম্পন্ন হয়েছে।`, 'success');
        await this.render();
      });
    }
  }
};

