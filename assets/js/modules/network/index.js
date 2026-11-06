/**
 * Hospital IT Desk — Module 4: Network & Internet Management
 * Network devices, IP address allocation tracking, ISP leased lines, and topology records.
 */

import { repository } from '../../core/repository.js';
import { STORES } from '../../data/schema.js';
import { t } from '../../core/i18n.js';
import { formatDate, formatCurrency, renderStatusBadge, escapeHtml } from '../../core/formatters.js';
import { modal } from '../../components/modal.js';
import { validation } from '../../core/validation.js';
import { notifications } from '../../core/notifications.js';

let networkDevices = [];
let ipAllocations = [];
let ispConnections = [];
let departments = [];

export const networkModule = {
  async render() {
    const contentArea = document.getElementById('content-area');
    if (!contentArea) return;

    [networkDevices, ipAllocations, ispConnections, departments] = await Promise.all([
      repository.getAll(STORES.NETWORK_DEVICES),
      repository.getAll(STORES.IP_ALLOCATIONS),
      repository.getAll(STORES.ISP_CONNECTIONS),
      repository.getAll(STORES.DEPARTMENTS)
    ]);

    contentArea.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title"><i class="bi bi-diagram-3-fill text-primary"></i> ${t('navNetwork')}</h1>
          <p class="page-subtitle">হাসপাতালের কোর সুইচ, রাউটার, আইপি অ্যাড্রেস বরাদ্দ ও আইএসপি সংযোগ রেজিস্টার</p>
        </div>
        <div class="action-buttons">
          <button type="button" class="btn btn-primary btn-sm" id="btn-add-ip">
            <i class="bi bi-plus-lg me-1"></i> নতুন আইপি বরাদ্দ
          </button>
          <button type="button" class="btn btn-outline-primary btn-sm" id="btn-add-net-device">
            <i class="bi bi-hdd-network me-1"></i> নেটওয়ার্ক ডিভাইস যুক্ত
          </button>
        </div>
      </div>

      <div class="alert alert-info py-2 small mb-4">
        <i class="bi bi-info-circle-fill me-1"></i>
        <strong>রেকর্ড নীতিমালা:</strong> এটি একটি ম্যানুয়াল আইপি ও নেটওয়ার্ক কনফিগারেশন রেজিস্টার। এখানে প্রদর্শিত স্ট্যাটাস সরাসরি ম্যানুয়াল লগভিত্তিক; কোনো সার্ভারবিহীন ফ্রন্টএন্ডে রিয়েল-টাইম SNMP বা পিং মনিটরিং ফেইক দাবি করা হয় না।
      </div>

      <!-- Quick ISP & Connectivity Summary Cards -->
      <div class="row g-3 mb-4">
        ${
          ispConnections.map((isp) => `
            <div class="col-12 col-md-6">
              <div class="card-custom h-100">
                <div class="card-custom-header">
                  <h6 class="card-custom-title">
                    <i class="bi bi-globe2 text-primary"></i> ${escapeHtml(isp.ispName)}
                  </h6>
                  <span class="badge bg-success">${escapeHtml(isp.status)}</span>
                </div>
                <div class="card-custom-body py-2">
                  <div class="d-flex justify-content-between mb-1 small">
                    <span class="text-muted">সংযোগের ধরন:</span>
                    <strong>${escapeHtml(isp.linkType)}</strong>
                  </div>
                  <div class="d-flex justify-content-between mb-1 small">
                    <span class="text-muted">ব্যান্ডউইথ:</span>
                    <strong>${escapeHtml(isp.bandwidth)}</strong>
                  </div>
                  <div class="d-flex justify-content-between mb-1 small">
                    <span class="text-muted">সাপোর্ট হেল্পডেস্ক:</span>
                    <code>${escapeHtml(isp.supportContact)}</code>
                  </div>
                  <div class="d-flex justify-content-between small">
                    <span class="text-muted">মাসিক বিল:</span>
                    <span class="text-success fw-bold">${formatCurrency(isp.monthlyCost)}</span>
                  </div>
                </div>
              </div>
            </div>
          `).join('')
        }
      </div>

      <!-- Network Devices Table Card -->
      <div class="card-custom mb-4">
        <div class="card-custom-header">
          <h5 class="card-custom-title"><i class="bi bi-hdd-network text-navy"></i> হাসপাতাল কোর ও এক্সেস নেটওয়ার্ক সরঞ্জাম</h5>
        </div>
        <div class="card-custom-body p-0">
          <div class="table-responsive-custom">
            <table class="table-custom">
              <thead>
                <tr>
                  <th>ডিভাইসের নাম ও মডেল</th>
                  <th>ধরন (Type)</th>
                  <th>আইপি অ্যাড্রেস</th>
                  <th>ম্যাক অ্যাড্রেস</th>
                  <th>পোর্ট সংখ্যা</th>
                  <th>অবস্থান</th>
                  <th>ফার্মওয়্যার</th>
                  <th>স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody>
                ${
                  networkDevices.map((dev) => `
                    <tr>
                      <td>
                        <strong>${escapeHtml(dev.name)}</strong><br>
                        <small class="text-muted">${escapeHtml(dev.brand || '')} ${escapeHtml(dev.model || '')}</small>
                      </td>
                      <td><span class="badge bg-light text-dark border">${escapeHtml(dev.deviceType)}</span></td>
                      <td><code>${escapeHtml(dev.ipAddress || '—')}</code></td>
                      <td><small class="text-muted">${escapeHtml(dev.macAddress || '—')}</small></td>
                      <td>${dev.portCount ? `${dev.portCount} Ports` : '—'}</td>
                      <td><small>${escapeHtml(dev.location || '—')}</small></td>
                      <td><small class="text-muted">${escapeHtml(dev.firmwareVersion || '—')}</small></td>
                      <td>${renderStatusBadge(dev.status)}</td>
                    </tr>
                  `).join('') || '<tr><td colspan="8" class="text-center py-3 text-muted">কোনো ডিভাইস নেই</td></tr>'
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- IP Address Allocation Management Table Card -->
      <div class="card-custom mb-4">
        <div class="card-custom-header">
          <h5 class="card-custom-title"><i class="bi bi-ethernet text-primary"></i> আইপি অ্যাড্রেস বরাদ্দ ও সাবনেট ট্র্যাকিং (IPAM)</h5>
          <span class="badge bg-light text-muted border">মোট ${ipAllocations.length} টি এন্ট্রি</span>
        </div>
        <div class="card-custom-body p-0">
          <div class="table-responsive-custom">
            <table class="table-custom">
              <thead>
                <tr>
                  <th>আইপি অ্যাড্রেস</th>
                  <th>সাবনেট / ভিএলএএন (Subnet)</th>
                  <th>বরাদ্দকৃত হোস্ট / ডিভাইস</th>
                  <th>ডিভাইস ক্যাটাগরি</th>
                  <th>বিভাগ</th>
                  <th>বরাদ্দের তারিখ</th>
                  <th>অবস্থা</th>
                </tr>
              </thead>
              <tbody>
                ${
                  ipAllocations.map((ip) => {
                    const dept = departments.find((d) => d.id === ip.departmentId);
                    return `
                      <tr>
                        <td><strong class="text-primary font-monospace">${escapeHtml(ip.ipAddress)}</strong></td>
                        <td><small class="text-muted">${escapeHtml(ip.subnet || '—')}</small></td>
                        <td>${escapeHtml(ip.hostName || '—')}</td>
                        <td><small class="badge bg-secondary">${escapeHtml(ip.deviceType || 'General')}</small></td>
                        <td><small>${escapeHtml(dept ? dept.nameBn : '—')}</small></td>
                        <td class="small text-muted">${formatDate(ip.allocatedDate)}</td>
                        <td>${renderStatusBadge(ip.status)}</td>
                      </tr>
                    `;
                  }).join('') || '<tr><td colspan="7" class="text-center py-3 text-muted">কোনো আইপি রেকর্ড নেই</td></tr>'
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Network Topology Reference Box -->
      <div class="card-custom">
        <div class="card-custom-header">
          <h5 class="card-custom-title"><i class="bi bi-diagram-2 text-teal"></i> হাসপাতাল লোকাল নেটওয়ার্ক আর্কিটেকচার সারসংক্ষেপ</h5>
        </div>
        <div class="card-custom-body">
          <div class="row g-3">
            <div class="col-12 col-md-4">
              <div class="p-3 bg-light rounded border h-100">
                <h6 class="fw-bold text-navy mb-2"><i class="bi bi-router me-1"></i> গেটওয়ে ও কোর লেয়ার</h6>
                <p class="small text-muted mb-0">MikroTik Cloud Core CCR1036 ডুয়াল আইএসপি অপটিক্যাল ফাইবার সংযোগের মাধ্যমে ইন্টারনেট ডিস্ট্রিবিউট করছে। সিসকো ২৯৬০-এক্স কোর সুইচে ১০জি আপলিংক সংযুক্ত।</p>
              </div>
            </div>
            <div class="col-12 col-md-4">
              <div class="p-3 bg-light rounded border h-100">
                <h6 class="fw-bold text-navy mb-2"><i class="bi bi-layers me-1"></i> ভিএলএএন সেগমেন্টেশন</h6>
                <ul class="small text-muted mb-0 ps-3">
                  <li><strong>VLAN 10:</strong> সার্ভার ও কোর অবকাঠামো (192.168.10.x)</li>
                  <li><strong>VLAN 20:</strong> হাসপাতাল ওয়ার্কস্টেশন ও পিসি (192.168.20.x)</li>
                  <li><strong>VLAN 30:</strong> সিসিটিভি ক্যামেরা ও এনভিআর (192.168.30.x)</li>
                  <li><strong>VLAN 40:</strong> স্টাফ ও ভিজিটর ওয়াই-ফাই (192.168.40.x)</li>
                </ul>
              </div>
            </div>
            <div class="col-12 col-md-4">
              <div class="p-3 bg-light rounded border h-100">
                <h6 class="fw-bold text-navy mb-2"><i class="bi bi-shield-check me-1"></i> নিরাপত্তা ও আইএসপি ফেইলওভার</h6>
                <p class="small text-muted mb-0">প্রাইমারি বিটিসিএল লিংকে সমস্যা হলে সেকেন্ডারি অ্যাম্বার আইটি লাইনে অটোমেটিক ফেইলওভার সক্রিয় হয়। সার্ভার রুম র্যাক ১০০% ফিজিক্যাল লক দ্বারা সুরক্ষিত।</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  },

  bindEvents() {
    const addIpBtn = document.getElementById('btn-add-ip');
    if (addIpBtn) {
      addIpBtn.addEventListener('click', () => this.showAddIpModal());
    }

    const addDeviceBtn = document.getElementById('btn-add-net-device');
    if (addDeviceBtn) {
      addDeviceBtn.addEventListener('click', () => this.showAddDeviceModal());
    }
  },

  showAddIpModal() {
    const formHtml = `
      <form id="add-ip-form">
        <div class="mb-3">
          <label class="form-label small fw-semibold">আইপি অ্যাড্রেস (IPv4) <span class="text-danger">*</span></label>
          <input type="text" class="form-control form-control-sm" id="form-ip-address" placeholder="যেমন: 192.168.20.55" required>
        </div>

        <div class="mb-3">
          <label class="form-label small fw-semibold">সাবনেট / ভিএলএএন <span class="text-danger">*</span></label>
          <select class="form-select form-select-sm" id="form-ip-subnet" required>
            <option value="192.168.10.0/24 (VLAN 10 Servers)">192.168.10.0/24 (VLAN 10 Servers)</option>
            <option value="192.168.20.0/24 (VLAN 20 Workstations)" selected>192.168.20.0/24 (VLAN 20 Workstations)</option>
            <option value="192.168.30.0/24 (VLAN 30 CCTV)">192.168.30.0/24 (VLAN 30 CCTV)</option>
            <option value="192.168.40.0/24 (VLAN 40 Wi-Fi)">192.168.40.0/24 (VLAN 40 Wi-Fi)</option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label small fw-semibold">হোস্ট / ডিভাইসের নাম</label>
          <input type="text" class="form-control form-control-sm" id="form-ip-hostname" placeholder="যেমন: pc-accounts-03">
        </div>

        <div class="mb-3">
          <label class="form-label small fw-semibold">ডিভাইস ক্যাটাগরি</label>
          <select class="form-select form-select-sm" id="form-ip-devicetype">
            <option value="Desktop">ডেস্কটপ পিসি</option>
            <option value="Printer">নেটওয়ার্ক প্রিন্টার</option>
            <option value="Server">সার্ভার</option>
            <option value="Switch">নেটওয়ার্ক সুইচ</option>
            <option value="Router">রাউটার / গেটওয়ে</option>
            <option value="CCTV">সিসিটিভি ক্যামেরা</option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label small fw-semibold">হাসপাতাল বিভাগ</label>
          <select class="form-select form-select-sm" id="form-ip-dept">
            <option value="">কোনো নির্দিষ্ট বিভাগ নেই</option>
            ${departments.map((d) => `<option value="${d.id}">${escapeHtml(d.nameBn)}</option>`).join('')}
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label small fw-semibold">বরাদ্দ স্ট্যাটাস</label>
          <select class="form-select form-select-sm" id="form-ip-status">
            <option value="Allocated" selected>বরাদ্দকৃত (Allocated)</option>
            <option value="Reserved">সংরক্ষিত (Reserved)</option>
            <option value="Available">ফ্রি / উন্মুক্ত (Available)</option>
          </select>
        </div>
      </form>
    `;

    modal.show({
      title: '<i class="bi bi-ethernet text-primary"></i> নতুন আইপি অ্যাড্রেস বরাদ্দ রেকর্ড',
      body: formHtml,
      size: 'md',
      confirmText: 'সংরক্ষণ করুন',
      onConfirm: async () => {
        const ip = document.getElementById('form-ip-address').value.trim();
        const subnet = document.getElementById('form-ip-subnet').value;
        const hostName = document.getElementById('form-ip-hostname').value.trim();
        const deviceType = document.getElementById('form-ip-devicetype').value;
        const departmentId = document.getElementById('form-ip-dept').value;
        const status = document.getElementById('form-ip-status').value;

        if (!validation.isValidIpv4(ip)) {
          notifications.showToast('ভুল আইপি ফরম্যাট', 'অনুগ্রহ করে সঠিক IPv4 অ্যাড্রেস লিখুন (যেমন: 192.168.20.55)।', 'danger');
          return;
        }

        // Duplicate IP Check
        const existing = ipAllocations.find((item) => item.ipAddress === ip);
        if (existing) {
          notifications.showToast('আইপি ডুপ্লিকেট কনফ্লিক্ট', `এই আইপি (${ip}) ইতোমধ্যে '${existing.hostName || 'অন্যান্য'}' ডিভাইসের জন্য বরাদ্দ রয়েছে।`, 'danger');
          return;
        }

        const newAllocation = {
          ipAddress: ip,
          subnet,
          hostName,
          deviceType,
          departmentId: departmentId || null,
          status,
          allocatedDate: new Date().toISOString().split('T')[0]
        };

        await repository.add(STORES.IP_ALLOCATIONS, newAllocation);
        await repository.logActivity('ALLOCATE_IP', 'Network', ip, `Allocated IP ${ip} to ${hostName || 'Host'}`);

        modal.hide();
        notifications.showToast('আইপি সংরক্ষিত', `আইপি ${ip} সফলভাবে বরাদ্দ তালিকায় যোগ করা হয়েছে।`, 'success');
        await this.render();
      }
    });
  },

  showAddDeviceModal() {
    const formHtml = `
      <form id="add-net-device-form">
        <div class="row g-2">
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">ডিভাইসের নাম <span class="text-danger">*</span></label>
            <input type="text" class="form-control form-control-sm" id="form-netdev-name" placeholder="যেমন: Floor 2 Switch" required>
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">ধরন <span class="text-danger">*</span></label>
            <select class="form-select form-select-sm" id="form-netdev-type" required>
              <option value="Switch">Switch (সুইচ)</option>
              <option value="Router">Router (রাউটার)</option>
              <option value="Access Point">Access Point (ওয়াই-ফাই)</option>
              <option value="Firewall">Firewall (ফায়ারওয়াল)</option>
            </select>
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">ব্র্যান্ড ও মডেল</label>
            <input type="text" class="form-control form-control-sm" id="form-netdev-model" placeholder="Cisco 2960 / MikroTik">
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">আইপি অ্যাড্রেস</label>
            <input type="text" class="form-control form-control-sm" id="form-netdev-ip" placeholder="192.168.10.5">
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">ম্যাক অ্যাড্রেস</label>
            <input type="text" class="form-control form-control-sm" id="form-netdev-mac" placeholder="00:1A:2B:3C:4D:5E">
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label small fw-semibold">পোর্ট সংখ্যা</label>
            <input type="number" class="form-control form-control-sm" id="form-netdev-ports" placeholder="24">
          </div>
          <div class="col-12">
            <label class="form-label small fw-semibold">অবস্থান / র্যাক নং</label>
            <input type="text" class="form-control form-control-sm" id="form-netdev-location" placeholder="২য় তলা ক্যাবিনেট">
          </div>
        </div>
      </form>
    `;

    modal.show({
      title: '<i class="bi bi-hdd-network text-primary"></i> নেটওয়ার্ক ডিভাইস যুক্ত করুন',
      body: formHtml,
      size: 'md',
      confirmText: 'সংরক্ষণ করুন',
      onConfirm: async () => {
        const name = document.getElementById('form-netdev-name').value.trim();
        const type = document.getElementById('form-netdev-type').value;
        const model = document.getElementById('form-netdev-model').value.trim();
        const ip = document.getElementById('form-netdev-ip').value.trim();
        const mac = document.getElementById('form-netdev-mac').value.trim();
        const ports = Number(document.getElementById('form-netdev-ports').value) || 0;
        const location = document.getElementById('form-netdev-location').value.trim();

        if (!name) {
          notifications.showToast('ভ্যালিডেশন এরর', 'ডিভাইসের নাম দেওয়া বাধ্যতামূলক।', 'danger');
          return;
        }

        await repository.add(STORES.NETWORK_DEVICES, {
          name,
          deviceType: type,
          model,
          ipAddress: ip,
          macAddress: mac,
          portCount: ports,
          location,
          status: 'Active'
        });

        modal.hide();
        notifications.showToast('ডিভাইস সংরক্ষিত', `${name} সফলভাবে যুক্ত হয়েছে।`, 'success');
        await this.render();
      }
    });
  }
};

