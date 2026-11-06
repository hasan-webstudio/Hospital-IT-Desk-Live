/**
 * Hospital IT Desk — Comprehensive Demo Data
 * All records are marked as Demo Data and represent realistic hospital IT operations.
 */

import { DEFAULT_APP_SETTINGS } from './schema.js';

export const DEMO_DATA = {
  appSettings: [DEFAULT_APP_SETTINGS],

  departments: [
    { id: 'dept-01', nameBn: 'জরুরি বিভাগ', nameEn: 'Emergency Department', code: 'EMERG', location: 'Ground Floor, Block A', isActive: true },
    { id: 'dept-02', nameBn: 'আইসিইউ ও সিসিইউ', nameEn: 'ICU & CCU', code: 'ICU', location: '3rd Floor, Block B', isActive: true },
    { id: 'dept-03', nameBn: 'প্যাথলজি ও ল্যাবরেটরি', nameEn: 'Pathology & Lab', code: 'LAB', location: '2nd Floor, Block A', isActive: true },
    { id: 'dept-04', nameBn: 'রেডিওলজি ও ইমেজিং', nameEn: 'Radiology & Imaging', code: 'RAD', location: 'Ground Floor, Block B', isActive: true },
    { id: 'dept-05', nameBn: 'ফার্মেসি (ইনডোর/আউটডোর)', nameEn: 'Hospital Pharmacy', code: 'PHARM', location: 'Ground Floor, Main Lobby', isActive: true },
    { id: 'dept-06', nameBn: 'বিলিং ও অ্যাকাউন্টস', nameEn: 'Billing & Accounts', code: 'BILL', location: '1st Floor, Block A', isActive: true },
    { id: 'dept-07', nameBn: 'রিসেপশন ও ভর্তি ডেস্ক', nameEn: 'Reception & Admission', code: 'RECP', location: 'Ground Floor, Main Entrance', isActive: true },
    { id: 'dept-08', nameBn: 'অপারেশন থিয়েটার (OT)', nameEn: 'Operation Theater', code: 'OT', location: '4th Floor, Block B', isActive: true },
    { id: 'dept-09', nameBn: 'প্রশাসন ও এইচআর', nameEn: 'Administration & HR', code: 'ADMIN', location: '5th Floor, Block A', isActive: true },
    { id: 'dept-10', nameBn: 'আইটি ডিপার্টমেন্ট', nameEn: 'IT Department', code: 'IT', location: 'Basement, Server Room Block', isActive: true }
  ],

  roles: [
    { id: 'role-superadmin', code: 'SUPER_ADMIN', nameBn: 'সুপার অ্যাডমিন', nameEn: 'Super Admin', description: 'Full system and data configuration' },
    { id: 'role-itofficer', code: 'IT_OFFICER', nameBn: 'আইটি অফিসার', nameEn: 'IT Officer', description: 'Full IT operations, assets, tickets and reports' },
    { id: 'role-itassistant', code: 'IT_ASSISTANT', nameBn: 'আইটি সহকারী', nameEn: 'IT Assistant', description: 'Assigned tickets, maintenance, and asset tracking' },
    { id: 'role-depthead', code: 'DEPT_HEAD', nameBn: 'বিভাগীয় প্রধান', nameEn: 'Department Head', description: 'Department tickets, approvals and asset view' },
    { id: 'role-staff', code: 'HOSP_STAFF', nameBn: 'হাসপাতাল স্টাফ', nameEn: 'Hospital Staff', description: 'Create and view own tickets and solutions' },
    { id: 'role-management', code: 'MANAGEMENT', nameBn: 'ম্যানেজমেন্ট ভিউয়ার', nameEn: 'Management Viewer', description: 'Read-only dashboard, summary reports' }
  ],

  employees: [
    { id: 'emp-01', employeeCode: 'EMP-1001', nameBn: 'মোঃ কামরুল হাসান', nameEn: 'Md. Kamrul Hasan', departmentId: 'dept-10', designation: 'Senior IT Officer', phone: '01711-000001', email: 'kamrul.it@dhakacentralhosp.demo', isActive: true },
    { id: 'emp-02', employeeCode: 'EMP-1002', nameBn: 'সোহেল রানা', nameEn: 'Sohel Rana', departmentId: 'dept-10', designation: 'IT Support Assistant', phone: '01811-000002', email: 'sohel.it@dhakacentralhosp.demo', isActive: true },
    { id: 'emp-03', employeeCode: 'EMP-1003', nameBn: 'ডাঃ তারেক মাহমুদ', nameEn: 'Dr. Tarek Mahmud', departmentId: 'dept-01', designation: 'Emergency In-Charge', phone: '01911-000003', email: 'dr.tarek@dhakacentralhosp.demo', isActive: true },
    { id: 'emp-04', employeeCode: 'EMP-1004', nameBn: 'তানিয়া সুলতানা', nameEn: 'Tania Sultana', departmentId: 'dept-06', designation: 'Accounts Manager', phone: '01711-000004', email: 'tania.acc@dhakacentralhosp.demo', isActive: true },
    { id: 'emp-05', employeeCode: 'EMP-1005', nameBn: 'রফিকুল ইসলাম', nameEn: 'Rafiqul Islam', departmentId: 'dept-03', designation: 'Senior Lab Technologist', phone: '01811-000005', email: 'rafiq.lab@dhakacentralhosp.demo', isActive: true },
    { id: 'emp-06', employeeCode: 'EMP-1006', nameBn: 'নাসরিন আক্তার', nameEn: 'Nasrin Akter', departmentId: 'dept-05', designation: 'Chief Pharmacist', phone: '01911-000006', email: 'nasrin.pharm@dhakacentralhosp.demo', isActive: true },
    { id: 'emp-07', employeeCode: 'EMP-1007', nameBn: 'মোহাম্মদ আলী', nameEn: 'Mohammad Ali', departmentId: 'dept-07', designation: 'Senior Receptionist', phone: '01711-000007', email: 'ali.recp@dhakacentralhosp.demo', isActive: true }
  ],

  demoUsers: [
    { id: 'usr-01', username: 'superadmin', roleCode: 'SUPER_ADMIN', nameBn: 'অ্যাডমিনিস্ট্রেটর (সুপার)', nameEn: 'System Administrator', email: 'admin@dhakacentralhosp.demo', departmentId: 'dept-10' },
    { id: 'usr-02', username: 'itofficer', roleCode: 'IT_OFFICER', nameBn: 'মোঃ কামরুল হাসান (আইটি অফিসার)', nameEn: 'Md. Kamrul Hasan (IT Officer)', email: 'kamrul.it@dhakacentralhosp.demo', departmentId: 'dept-10' },
    { id: 'usr-03', username: 'itassistant', roleCode: 'IT_ASSISTANT', nameBn: 'সোহেল রানা (আইটি সহকারী)', nameEn: 'Sohel Rana (IT Assistant)', email: 'sohel.it@dhakacentralhosp.demo', departmentId: 'dept-10' },
    { id: 'usr-04', username: 'depthead', roleCode: 'DEPT_HEAD', nameBn: 'তানিয়া সুলতানা (অ্যাকাউন্টস হেড)', nameEn: 'Tania Sultana (Accounts Head)', email: 'tania.acc@dhakacentralhosp.demo', departmentId: 'dept-06' },
    { id: 'usr-05', username: 'hospstaff', roleCode: 'HOSP_STAFF', nameBn: 'মোহাম্মদ আলী (রিসেপশন স্টাফ)', nameEn: 'Mohammad Ali (Reception Staff)', email: 'ali.recp@dhakacentralhosp.demo', departmentId: 'dept-07' },
    { id: 'usr-06', username: 'management', roleCode: 'MANAGEMENT', nameBn: 'পরিচালনা পর্ষদ (ভিউয়ার)', nameEn: 'Hospital Management', email: 'mgmt@dhakacentralhosp.demo', departmentId: 'dept-09' }
  ],

  assetCategories: [
    { id: 'cat-desktop', code: 'DESKTOP', nameBn: 'ডেস্কটপ কম্পিউটার', nameEn: 'Desktop Computer' },
    { id: 'cat-laptop', code: 'LAPTOP', nameBn: 'ল্যাপটপ', nameEn: 'Laptop' },
    { id: 'cat-monitor', code: 'MONITOR', nameBn: 'মনিটর', nameEn: 'Monitor' },
    { id: 'cat-printer', code: 'PRINTER', nameBn: 'প্রিন্টার', nameEn: 'Printer' },
    { id: 'cat-scanner', code: 'SCANNER', nameBn: 'স্ক্যানার / বারকোড রিডার', nameEn: 'Scanner / Barcode Reader' },
    { id: 'cat-network', code: 'NETWORK', nameBn: 'রাউটার / সুইচ / এক্সেস পয়েন্ট', nameEn: 'Router / Switch / AP' },
    { id: 'cat-server', code: 'SERVER', nameBn: 'সার্ভার ও স্টোরেজ', nameEn: 'Server & Storage' },
    { id: 'cat-ups', code: 'UPS', nameBn: 'ইউপিএস / আইপিএস', nameEn: 'UPS / Online Power' },
    { id: 'cat-cctv', code: 'CCTV', nameBn: 'সিসিটিভি ক্যামেরা ও ডিভিআর/এনভিআর', nameEn: 'CCTV & DVR/NVR' },
    { id: 'cat-other', code: 'OTHER', nameBn: 'অন্যান্য আইটি সরঞ্জাম', nameEn: 'Other Equipment' }
  ],

  assets: [
    {
      id: 'ast-01',
      assetCode: 'IT-ASSET-0001',
      categoryId: 'cat-server',
      name: 'HMS Core Application Server',
      brand: 'Dell',
      model: 'PowerEdge R740 Rack Server',
      serialNumber: 'DELL-R740-9831',
      departmentId: 'dept-10',
      location: 'Server Room Rack 01',
      custodianId: 'emp-01',
      purchaseDate: '2024-03-15',
      vendorName: 'Smart Technologies BD',
      purchaseCost: 650000,
      warrantyStart: '2024-03-15',
      warrantyEnd: '2027-03-14',
      condition: 'Good',
      status: 'Active',
      ipAddress: '192.168.10.10',
      macAddress: '00:14:22:01:23:45',
      hostname: 'srv-hms-core',
      notes: 'Primary database & hospital management server. RAID 10 configuration.',
      isDemo: true
    },
    {
      id: 'ast-02',
      assetCode: 'IT-ASSET-0002',
      categoryId: 'cat-desktop',
      name: 'Emergency Reception Workstation 01',
      brand: 'HP',
      model: 'ProDesk 400 G7 MT (Core i5 10th Gen, 16GB, 512GB SSD)',
      serialNumber: 'HPPD-400-8812',
      departmentId: 'dept-01',
      location: 'Emergency Counter 01',
      custodianId: 'emp-03',
      purchaseDate: '2024-06-10',
      vendorName: 'Flora Systems',
      purchaseCost: 72000,
      warrantyStart: '2024-06-10',
      warrantyEnd: '2027-06-09',
      condition: 'Good',
      status: 'Active',
      ipAddress: '192.168.20.15',
      macAddress: '3C:52:82:11:00:22',
      hostname: 'pc-emerg-01',
      notes: 'Emergency 24/7 patient registration PC.',
      isDemo: true
    },
    {
      id: 'ast-03',
      assetCode: 'IT-ASSET-0003',
      categoryId: 'cat-printer',
      name: 'Accounts Department Network Laser Printer',
      brand: 'HP',
      model: 'LaserJet Pro MFP M428fdn',
      serialNumber: 'HPLJ-428-5521',
      departmentId: 'dept-06',
      location: 'Accounts Room 102',
      custodianId: 'emp-04',
      purchaseDate: '2024-02-01',
      vendorName: 'Star Tech & Engineering',
      purchaseCost: 58000,
      warrantyStart: '2024-02-01',
      warrantyEnd: '2025-01-31', // warranty expiring/expired demo
      condition: 'Good',
      status: 'Active',
      ipAddress: '192.168.20.25',
      connectionType: 'Network IP',
      tonerModel: 'HP 76A (CF276A)',
      pageCount: 38450,
      notes: 'High-volume invoice & billing printing. Dual-sided printing enabled.',
      isDemo: true
    },
    {
      id: 'ast-04',
      assetCode: 'IT-ASSET-0004',
      categoryId: 'cat-scanner',
      name: 'Hospital Pharmacy 2D Barcode Reader',
      brand: 'Honeywell',
      model: 'Voyager 1400g 2D Handheld Scanner',
      serialNumber: 'HON-1400-7744',
      departmentId: 'dept-05',
      location: 'Pharmacy Counter 02',
      custodianId: 'emp-06',
      purchaseDate: '2024-08-20',
      vendorName: 'Flora Systems',
      purchaseCost: 14500,
      warrantyStart: '2024-08-20',
      warrantyEnd: '2025-08-19',
      condition: 'Fair',
      status: 'Active',
      connectionType: 'USB',
      notes: 'Used for medicine batch and serial barcode scanning.',
      isDemo: true
    },
    {
      id: 'ast-05',
      assetCode: 'IT-ASSET-0005',
      categoryId: 'cat-network',
      name: 'Main Hospital Core Switch',
      brand: 'Cisco',
      model: 'Catalyst 2960-X 48 Port Gigabit PoE',
      serialNumber: 'WS-C2960X-48FPS-L-99',
      departmentId: 'dept-10',
      location: 'Server Room Rack 02',
      custodianId: 'emp-01',
      purchaseDate: '2023-11-10',
      vendorName: 'Smart Technologies BD',
      purchaseCost: 185000,
      warrantyStart: '2023-11-10',
      warrantyEnd: '2026-11-09',
      condition: 'Good',
      status: 'Active',
      ipAddress: '192.168.10.2',
      macAddress: 'F4:0F:1B:33:44:55',
      hostname: 'sw-core-01',
      notes: 'VLAN 10: Servers, VLAN 20: Workstations, VLAN 30: CCTV, VLAN 40: Wi-Fi.',
      isDemo: true
    },
    {
      id: 'ast-06',
      assetCode: 'IT-ASSET-0006',
      categoryId: 'cat-cctv',
      name: 'Emergency Main Corridor IP Dome Camera',
      brand: 'Hikvision',
      model: 'DS-2CD2143G2-I 4MP Outdoor Dome',
      serialNumber: 'HIK-CAM-3388',
      departmentId: 'dept-01',
      location: 'Ground Floor Corridor Gate 1',
      custodianId: 'emp-02',
      purchaseDate: '2024-01-10',
      vendorName: 'Smart Technologies BD',
      purchaseCost: 9500,
      warrantyStart: '2024-01-10',
      warrantyEnd: '2026-01-09',
      condition: 'Good',
      status: 'Active',
      ipAddress: '192.168.30.11',
      notes: 'Connected to NVR-01 Port 03. 24/7 motion detection enabled.',
      isDemo: true
    },
    {
      id: 'ast-07',
      assetCode: 'IT-ASSET-0007',
      categoryId: 'cat-ups',
      name: 'Server Room Online UPS 10kVA',
      brand: 'Santak / APC',
      model: 'Smart-UPS On-Line 10000VA (Rack/Tower)',
      serialNumber: 'APC-10KVA-7102',
      departmentId: 'dept-10',
      location: 'Server Room Power Rack',
      custodianId: 'emp-01',
      purchaseDate: '2023-10-01',
      vendorName: 'Flora Systems',
      purchaseCost: 320000,
      warrantyStart: '2023-10-01',
      warrantyEnd: '2025-09-30',
      condition: 'Good',
      status: 'Active',
      ipAddress: '192.168.10.5',
      notes: 'Provides 45 minutes clean backup to core servers and switches.',
      isDemo: true
    },
    {
      id: 'ast-08',
      assetCode: 'IT-ASSET-0008',
      categoryId: 'cat-desktop',
      name: 'Pathology Hematology Analyzer PC',
      brand: 'Dell',
      model: 'OptiPlex 3080 SFF',
      serialNumber: 'DELL-OPT-4411',
      departmentId: 'dept-03',
      location: 'Lab Room 204',
      custodianId: 'emp-05',
      purchaseDate: '2024-04-12',
      vendorName: 'Flora Systems',
      purchaseCost: 68000,
      warrantyStart: '2024-04-12',
      warrantyEnd: '2027-04-11',
      condition: 'Fair',
      status: 'Active',
      ipAddress: '192.168.20.44',
      macAddress: '18:66:DA:55:66:77',
      hostname: 'pc-lab-analyzer',
      notes: 'Connected to Sysmex hematology analyzer via RS-232 serial cable.',
      isDemo: true
    }
  ],

  assetAssignments: [
    { id: 'asgn-01', assetId: 'ast-02', departmentId: 'dept-01', employeeId: 'emp-03', assignedDate: '2024-06-11', assignedBy: 'emp-01', notes: 'Initial deployment to emergency desk' },
    { id: 'asgn-02', assetId: 'ast-03', departmentId: 'dept-06', employeeId: 'emp-04', assignedDate: '2024-02-02', assignedBy: 'emp-01', notes: 'Configured for accounts IP printing' },
    { id: 'asgn-03', assetId: 'ast-04', departmentId: 'dept-05', employeeId: 'emp-06', assignedDate: '2024-08-21', assignedBy: 'emp-02', notes: 'Assigned to pharmacy counter' }
  ],

  assetServiceRecords: [
    { id: 'srv-01', assetId: 'ast-03', serviceDate: '2026-09-15', serviceType: 'Toner Replacement & Roller Cleaning', vendor: 'Star Tech & Engineering', cost: 3500, performedBy: 'emp-02', notes: 'Replaced toner cartridge CF276A and cleaned paper pickup roller.' }
  ],

  tickets: [
    {
      id: 'tkt-01',
      ticketNumber: 'TKT-2026-0001',
      title: 'বিলিং প্রিন্টারে পেপার জ্যাম ও নেটওয়ার্ক সংযোগ বিচ্ছিন্ন',
      description: 'বিলিং কাউন্টার ১ এ অ্যাকাউন্টস প্রিন্টার থেকে ইনভয়েস প্রিন্ট হচ্ছে না। লাইট লাল হয়ে আছে এবং পেপার জ্যাম এর মেসেজ দিচ্ছে। অবিলম্বে ঠিক করা প্রয়োজন।',
      departmentId: 'dept-06',
      reportedBy: 'তানিয়া সুলতানা',
      reportingEmployeeId: 'emp-04',
      location: '1st Floor, Room 102 (Accounts)',
      category: 'Printer',
      assetId: 'ast-03',
      priority: 'High',
      status: 'In Progress',
      assignedToId: 'emp-02',
      assignedToName: 'সোহেল রানা',
      createdAt: '2026-11-04T09:30:00.000Z',
      updatedAt: '2026-11-05T08:15:00.000Z',
      reportedAt: '2026-11-04T09:30:00.000Z',
      assignedAt: '2026-11-04T09:45:00.000Z',
      resolutionSummary: '',
      isDemo: true
    },
    {
      id: 'tkt-02',
      ticketNumber: 'TKT-2026-0002',
      title: 'জরুরি বিভাগে প্যাথলজি রেজাল্ট দেখা যাচ্ছে না (HMS Error)',
      description: 'জরুরি রিসেপশন ডেস্ক থেকে পেশেন্ট আইডি সার্চ করলে ল্যাব রিপোর্ট ফেচ হচ্ছে না। "Connection Timeout to Lab DB" এরর আসছে।',
      departmentId: 'dept-01',
      reportedBy: 'ডাঃ তারেক মাহমুদ',
      reportingEmployeeId: 'emp-03',
      location: 'Emergency Reception Desk 01',
      category: 'HMS/Software',
      assetId: 'ast-02',
      priority: 'Critical',
      status: 'Assigned',
      assignedToId: 'emp-01',
      assignedToName: 'মোঃ কামরুল হাসান',
      createdAt: '2026-11-05T07:15:00.000Z',
      updatedAt: '2026-11-05T07:30:00.000Z',
      reportedAt: '2026-11-05T07:15:00.000Z',
      assignedAt: '2026-11-05T07:30:00.000Z',
      resolutionSummary: '',
      isDemo: true
    },
    {
      id: 'tkt-03',
      ticketNumber: 'TKT-2026-0003',
      title: 'ফার্মেসি বারকোড স্ক্যানার দিয়ে মেডিসিন স্ক্যান হচ্ছে না',
      description: 'ফার্মেসি কাউন্টার ২ এর স্ক্যানারের লাল লেজার লাইট জ্বলছে কিন্তু কম্পিউটারে কোনো ডিজিট ইনপুট নিচ্ছে না।',
      departmentId: 'dept-05',
      reportedBy: 'নাসরিন আক্তার',
      reportingEmployeeId: 'emp-06',
      location: 'Pharmacy Counter 02',
      category: 'Scanner',
      assetId: 'ast-04',
      priority: 'Medium',
      status: 'Resolved',
      assignedToId: 'emp-02',
      assignedToName: 'সোহেল রানা',
      createdAt: '2026-11-03T11:00:00.000Z',
      updatedAt: '2026-11-03T14:20:00.000Z',
      reportedAt: '2026-11-03T11:00:00.000Z',
      assignedAt: '2026-11-03T11:15:00.000Z',
      resolvedAt: '2026-11-03T14:20:00.000Z',
      resolutionSummary: 'USB কেবল লুজ কানেকশন ছিল। ড্রাইভার রিস্টার্ট ও টেস্ট বারকোড কনফিগারেশন শিট স্ক্যান করে রি-ক্যালিব্রেট করা হয়েছে। এখন যথাযথভাবে স্ক্যান হচ্ছে।',
      isDemo: true
    },
    {
      id: 'tkt-04',
      ticketNumber: 'TKT-2026-0004',
      title: 'ল্যাবরেটরি হেমাটোলজি পিসিতে অতিরিক্ত স্লো ও হ্যাং সমস্যা',
      description: 'ল্যাব অ্যানালাইজার সফটওয়্যার ওপেন হতে ৫-১০ মিনিট সময় নিচ্ছে এবং মাঝেমধ্যে ব্লু-স্ক্রিন এরর দেয়। উইন্ডোজ স্টোরেজ ফুল হতে পারে।',
      departmentId: 'dept-03',
      reportedBy: 'রফিকুল ইসলাম',
      reportingEmployeeId: 'emp-05',
      location: 'Pathology Lab 204',
      category: 'Computer',
      assetId: 'ast-08',
      priority: 'High',
      status: 'New',
      assignedToId: '',
      assignedToName: '',
      createdAt: '2026-11-05T10:00:00.000Z',
      updatedAt: '2026-11-05T10:00:00.000Z',
      reportedAt: '2026-11-05T10:00:00.000Z',
      resolutionSummary: '',
      isDemo: true
    }
  ],

  ticketStatusHistory: [
    {
      id: 'tsh-01',
      ticketId: 'tkt-01',
      oldStatus: 'New',
      newStatus: 'Assigned',
      changedBy: 'মোঃ কামরুল হাসান',
      timestamp: '2026-11-04T09:45:00.000Z',
      notes: 'Assigned to IT Assistant Sohel Rana for on-site inspection'
    },
    {
      id: 'tsh-02',
      ticketId: 'tkt-01',
      oldStatus: 'Assigned',
      newStatus: 'In Progress',
      changedBy: 'সোহেল রানা',
      timestamp: '2026-11-04T10:15:00.000Z',
      notes: 'Opened printer back cover, clearing stuck duplex gear.'
    },
    {
      id: 'tsh-03',
      ticketId: 'tkt-02',
      oldStatus: 'New',
      newStatus: 'Assigned',
      changedBy: 'সিস্টেম অ্যাডমিন',
      timestamp: '2026-11-05T07:30:00.000Z',
      notes: 'Critical issue reported in emergency department. Assigned immediately.'
    },
    {
      id: 'tsh-04',
      ticketId: 'tkt-03',
      oldStatus: 'In Progress',
      newStatus: 'Resolved',
      changedBy: 'সোহেল রানা',
      timestamp: '2026-11-03T14:20:00.000Z',
      notes: 'Scanner re-calibrated and verified with pharmacist Nasrin Akter.'
    }
  ],

  ticketComments: [
    {
      id: 'tcm-01',
      ticketId: 'tkt-01',
      author: 'সোহেল রানা (আইটি সহকারী)',
      isInternal: true,
      comment: 'প্রিন্টারের ফিউজার ইউনিটের গিয়ার একটু অতিরিক্ত গরম হচ্ছিল। নতুন টোনার প্রয়োজন হতে পারে।',
      createdAt: '2026-11-04T10:30:00.000Z'
    },
    {
      id: 'tcm-02',
      ticketId: 'tkt-02',
      author: 'মোঃ কামরুল হাসান (আইটি অফিসার)',
      isInternal: false,
      comment: 'ল্যাবরেটরি ডেটাবেজ লিসেনার সার্ভিস রিস্টার্ট দেওয়া হচ্ছে। আগামী ১৫ মিনিটের মধ্যে সমাধান প্রত্যাশিত।',
      createdAt: '2026-11-05T07:45:00.000Z'
    }
  ],

  networkDevices: [
    {
      id: 'net-01',
      assetId: 'ast-05',
      name: 'Core Switch 01 (Cisco Catalyst)',
      deviceType: 'Switch',
      brand: 'Cisco',
      model: '2960-X 48 Port',
      departmentId: 'dept-10',
      location: 'Server Room Rack 02',
      ipAddress: '192.168.10.2',
      macAddress: 'F4:0F:1B:33:44:55',
      portCount: 48,
      status: 'Active',
      firmwareVersion: '15.2(7)E8',
      role: 'Core Distribution Switch',
      notes: 'Manages Trunk links to Block A and Block B edge switches.'
    },
    {
      id: 'net-02',
      assetId: '',
      name: 'Edge Switch Floor 1 (Accounts & Billing)',
      deviceType: 'Switch',
      brand: 'D-Link',
      model: 'DGS-1210-28 24 Port Gigabit',
      departmentId: 'dept-06',
      location: '1st Floor Network Cabinet',
      ipAddress: '192.168.10.3',
      macAddress: 'B0:C5:54:12:33:99',
      portCount: 24,
      status: 'Active',
      firmwareVersion: 'v4.10.024',
      role: 'Edge Access Switch',
      notes: 'Connects all billing desks and network printers.'
    },
    {
      id: 'net-03',
      assetId: '',
      name: 'Main Gateway Router & Firewall',
      deviceType: 'Router',
      brand: 'MikroTik',
      model: 'Cloud Core Router CCR1036-12G-4S',
      departmentId: 'dept-10',
      location: 'Server Room Rack 01',
      ipAddress: '192.168.10.1',
      macAddress: '4C:5E:0C:61:77:88',
      portCount: 16,
      status: 'Active',
      firmwareVersion: 'RouterOS v7.14',
      role: 'Border Gateway & Bandwidth Manager',
      notes: 'Dual WAN failover configured between BTCL and AmberIT.'
    },
    {
      id: 'net-04',
      assetId: '',
      name: 'Doctor Lounge Wi-Fi Access Point',
      deviceType: 'Access Point',
      brand: 'Ubiquiti',
      model: 'UniFi U6 Pro Wi-Fi 6',
      departmentId: 'dept-09',
      location: '3rd Floor Doctor Lounge',
      ipAddress: '192.168.40.15',
      macAddress: '74:83:C2:A1:B2:C3',
      portCount: 1,
      status: 'Active',
      firmwareVersion: 'v6.6.65',
      role: 'Internal Staff Wireless',
      notes: 'SSID: DCH-Staff-Internal. WPA3 Enterprise.'
    }
  ],

  ipAllocations: [
    { id: 'ip-01', ipAddress: '192.168.10.1', subnet: '192.168.10.0/24 (VLAN 10 Infrastructure)', hostName: 'gw-core-router', deviceType: 'Router', status: 'Allocated', departmentId: 'dept-10', allocatedDate: '2024-01-01', notes: 'Default Gateway' },
    { id: 'ip-02', ipAddress: '192.168.10.2', subnet: '192.168.10.0/24 (VLAN 10 Infrastructure)', hostName: 'sw-cisco-core', deviceType: 'Switch', status: 'Allocated', departmentId: 'dept-10', allocatedDate: '2024-01-01', notes: 'Core Switch Management IP' },
    { id: 'ip-03', ipAddress: '192.168.10.10', subnet: '192.168.10.0/24 (VLAN 10 Infrastructure)', hostName: 'srv-hms-core', deviceType: 'Server', status: 'Allocated', departmentId: 'dept-10', allocatedDate: '2024-03-15', notes: 'HMS Application & DB' },
    { id: 'ip-04', ipAddress: '192.168.20.15', subnet: '192.168.20.0/24 (VLAN 20 Workstations)', hostName: 'pc-emerg-01', deviceType: 'Desktop', status: 'Allocated', departmentId: 'dept-01', allocatedDate: '2024-06-11', notes: 'Emergency Counter 1' },
    { id: 'ip-05', ipAddress: '192.168.20.25', subnet: '192.168.20.0/24 (VLAN 20 Workstations)', hostName: 'prn-accounts-hp428', deviceType: 'Printer', status: 'Allocated', departmentId: 'dept-06', allocatedDate: '2024-02-02', notes: 'Accounts LaserJet' },
    { id: 'ip-06', ipAddress: '192.168.30.10', subnet: '192.168.30.0/24 (VLAN 30 CCTV)', hostName: 'nvr-main-32ch', deviceType: 'DVR/NVR', status: 'Allocated', departmentId: 'dept-10', allocatedDate: '2024-01-10', notes: 'Main 32 Channel NVR' },
    { id: 'ip-07', ipAddress: '192.168.10.50', subnet: '192.168.10.0/24 (VLAN 10 Infrastructure)', hostName: '', deviceType: '', status: 'Available', departmentId: '', allocatedDate: '', notes: 'Reserved for New Backup NAS' }
  ],

  ispConnections: [
    {
      id: 'isp-01',
      ispName: 'BTCL Fiber Dedicated',
      linkType: 'Primary Optical Fiber (Leased Line)',
      bandwidth: '50 Mbps Dedicated Full-Duplex',
      ipRange: '103.14.xx.128/29 (Demo Public Pool)',
      contractStart: '2024-01-01',
      contractEnd: '2026-12-31',
      monthlyCost: 35000,
      supportContact: 'BTCL NOC: 16402 / helpdesk@btcl.demo',
      status: 'Active',
      notes: 'Primary internet for HMS cloud backup and hospital communications.'
    },
    {
      id: 'isp-02',
      ispName: 'Amber IT Corporate Backup',
      linkType: 'Secondary Optical Fiber (Auto Failover)',
      bandwidth: '30 Mbps Dedicated',
      ipRange: '118.67.xx.64/29 (Demo Public Pool)',
      contractStart: '2024-05-01',
      contractEnd: '2026-04-30',
      monthlyCost: 22000,
      supportContact: 'AmberIT NOC: 09666-777888',
      status: 'Active',
      notes: 'Automatic failover configured in MikroTik router if BTCL latency > 150ms.'
    }
  ],

  cctvDevices: [
    {
      id: 'cam-01',
      assetId: 'ast-06',
      name: 'Emergency Main Corridor Camera (Cam 01)',
      cameraType: 'IP Camera',
      channelNo: 'CH-01',
      departmentId: 'dept-01',
      location: 'Ground Floor Emergency Gate',
      brand: 'Hikvision',
      model: 'DS-2CD2143G2-I (4MP Dome)',
      resolution: '4 Megapixel (2560x1440)',
      ipAddress: '192.168.30.11',
      nvrStorageInfo: 'Recording to NVR-01 HDD-1 (30 days retention)',
      installationDate: '2024-01-10',
      lastInspectionDate: '2026-10-25',
      status: 'Active',
      notes: 'Infrared night vision working properly.'
    },
    {
      id: 'cam-02',
      assetId: '',
      name: 'Pharmacy Medicine Counter Camera (Cam 02)',
      cameraType: 'IP Camera',
      channelNo: 'CH-02',
      departmentId: 'dept-05',
      location: 'Pharmacy Cash & Delivery Counter',
      brand: 'Hikvision',
      model: 'DS-2CD2043G2-I (4MP Bullet with Audio)',
      resolution: '4 Megapixel with Mic',
      ipAddress: '192.168.30.12',
      nvrStorageInfo: 'Recording to NVR-01 HDD-1',
      installationDate: '2024-01-10',
      lastInspectionDate: '2026-10-25',
      status: 'Active',
      notes: 'Audio recording enabled for transaction dispute audit.'
    },
    {
      id: 'cam-03',
      assetId: '',
      name: 'Server Room Security 360 Camera (Cam 03)',
      cameraType: 'IP Camera',
      channelNo: 'CH-03',
      departmentId: 'dept-10',
      location: 'Basement Server Room Interior',
      brand: 'Hikvision',
      model: 'DS-2CD2955FWD-IS 5MP Fisheye',
      resolution: '5 Megapixel 360 View',
      ipAddress: '192.168.30.15',
      nvrStorageInfo: 'Recording to NVR-01 HDD-2',
      installationDate: '2024-01-10',
      lastInspectionDate: '2026-10-25',
      status: 'Active',
      notes: 'Covers entire rack area and entry door.'
    },
    {
      id: 'cam-04',
      assetId: '',
      name: 'Main Hospital NVR 32-Channel',
      cameraType: 'NVR',
      channelNo: 'NVR-MAIN-01',
      departmentId: 'dept-10',
      location: 'CCTV Monitoring Console Room',
      brand: 'Hikvision',
      model: 'DS-7732NI-I4/16P (4x 8TB Western Digital Purple)',
      resolution: 'Up to 12MP 32 Channel PoE',
      ipAddress: '192.168.30.10',
      nvrStorageInfo: '32TB RAW Storage RAID 5 (approx 24TB usable)',
      installationDate: '2024-01-10',
      lastInspectionDate: '2026-10-25',
      status: 'Active',
      notes: 'Total 22 cameras currently connected. 10 ports free for future expansion.'
    }
  ],

  softwareProducts: [
    {
      id: 'soft-01',
      name: 'Meditech Hospital Management Suite (HMS)',
      category: 'HMS',
      vendor: 'Meditech Solutions BD',
      currentVersion: 'v4.5.2',
      licenseType: 'Perpetual Enterprise (Unlimited Users)',
      seatCount: 150,
      departmentsUsing: 'Emergency, Billing, Pharmacy, Lab, OT, Admission',
      startDate: '2023-01-01',
      expiryDate: '2026-12-31', // Approaching renewal demo
      supportContact: 'support@meditech-bd.demo / 01700-112233',
      status: 'Active',
      notes: 'Hospital ERP covering patient registration, OPD, IPD, lab report and billing.'
    },
    {
      id: 'soft-02',
      name: 'Kaspersky Endpoint Security for Business',
      category: 'Antivirus',
      vendor: 'Smart Technologies BD',
      currentVersion: 'v12.4',
      licenseType: 'Annual Subscription',
      seatCount: 60,
      departmentsUsing: 'All Hospital Workstations & Servers',
      startDate: '2025-12-01',
      expiryDate: '2026-11-30', // Expiring within 25 days demo!
      supportContact: 'antivirus@smartbd.demo',
      status: 'Active',
      notes: 'Central security management server deployed on 192.168.10.15.'
    },
    {
      id: 'soft-03',
      name: 'Oracle Database 19c Standard Edition',
      category: 'Database Server',
      vendor: 'Oracle Partner BD',
      currentVersion: '19c Release 19.3',
      licenseType: 'Named User Plus (Perpetual)',
      seatCount: 50,
      departmentsUsing: 'HMS Backend Database',
      startDate: '2023-01-01',
      expiryDate: '2028-12-31',
      supportContact: 'oracle-support@partner.demo',
      status: 'Active',
      notes: 'Stores all clinical and administrative records. Protected by automated RMAN backup.'
    },
    {
      id: 'soft-04',
      name: 'Microsoft Windows Server 2022 Standard',
      category: 'Operating System',
      vendor: 'Flora Systems',
      currentVersion: 'Build 20348',
      licenseType: '16-Core OEM License',
      seatCount: 2,
      departmentsUsing: 'IT Infrastructure (AD & HMS Host)',
      startDate: '2024-03-15',
      expiryDate: '2034-03-14',
      supportContact: 'support@flora.demo',
      status: 'Active',
      notes: 'Active Directory Domain Controller (dch.local) & Hyper-V host.'
    }
  ],

  softwareLicenses: [
    {
      id: 'lic-01',
      softwareId: 'soft-02',
      licenseKeyMasked: 'KASP-XXXX-YYYY-ZZ88',
      seatCount: 60,
      issuedDate: '2025-12-01',
      expiryDate: '2026-11-30',
      status: 'Active',
      notes: 'Renewal proposal requested from Smart Technologies.'
    },
    {
      id: 'lic-02',
      softwareId: 'soft-01',
      licenseKeyMasked: 'MEDITECH-DCH-ENT-2023',
      seatCount: 150,
      issuedDate: '2023-01-01',
      expiryDate: '2026-12-31',
      status: 'Active',
      notes: 'Yearly SLA and support maintenance contract.'
    }
  ],

  backupSources: [
    { id: 'bs-01', sourceName: 'HMS Core Oracle Database', systemType: 'Database Dump (RMAN + DataPump)', defaultFrequency: 'Daily 02:00 AM', targetLocation: 'Local NAS (192.168.10.60) + Offline External HDD' },
    { id: 'bs-02', sourceName: 'PACS Radiology Imaging Archive', systemType: 'DICOM File Sync', defaultFrequency: 'Daily 04:00 AM', targetLocation: 'Secondary Storage Server' },
    { id: 'bs-03', sourceName: 'Accounts & Billing Data', systemType: 'Encrypted SQL Archive', defaultFrequency: 'Daily 11:30 PM', targetLocation: 'IT Safe Vault Storage' },
    { id: 'bs-04', sourceName: 'MikroTik Router & Switch Configs', systemType: 'Configuration Script (.rsc / .cfg)', defaultFrequency: 'Weekly Saturday', targetLocation: 'IT Admin Drive' }
  ],

  backupLogs: [
    {
      id: 'bkp-01',
      backupCode: 'BKP-2026-1105-01',
      sourceId: 'bs-01',
      sourceName: 'HMS Core Oracle Database',
      backupType: 'Full',
      scheduledDate: '2026-11-05T02:00:00.000Z',
      actualCompletionDate: '2026-11-05T02:45:00.000Z',
      result: 'Successful',
      storageLocation: 'NAS Server 01: /backups/hms/hms_full_20261105.dmp',
      fileReference: 'hms_full_20261105.dmp',
      fileSizeMb: 18450, // 18.4 GB
      checksum: 'sha256:7f83b1657ff1... (Verified)',
      operatorName: 'সিস্টেম অটোমেটেড ক্রোন / মোঃ কামরুল হাসান',
      verificationStatus: 'Verified',
      verifiedDate: '2026-11-05T08:00:00.000Z',
      verifiedBy: 'মোঃ কামরুল হাসান',
      notes: 'Full database export verified without corruption.'
    },
    {
      id: 'bkp-02',
      backupCode: 'BKP-2026-1104-02',
      sourceId: 'bs-02',
      sourceName: 'PACS Radiology Imaging Archive',
      backupType: 'Incremental',
      scheduledDate: '2026-11-04T04:00:00.000Z',
      actualCompletionDate: '2026-11-04T05:10:00.000Z',
      result: 'Partial',
      storageLocation: 'NAS Server 02: /pacs_archive/20261104/',
      fileReference: 'pacs_inc_20261104.tar.gz',
      fileSizeMb: 42100, // 42.1 GB
      checksum: '',
      operatorName: 'সোহেল রানা',
      verificationStatus: 'Pending Verification',
      verifiedDate: '',
      verifiedBy: '',
      notes: 'Network bandwidth throttled during transfer; 12 imaging files skipped retry.'
    },
    {
      id: 'bkp-03',
      backupCode: 'BKP-2026-1104-03',
      sourceId: 'bs-03',
      sourceName: 'Accounts & Billing Data',
      backupType: 'Full',
      scheduledDate: '2026-11-04T23:30:00.000Z',
      actualCompletionDate: '2026-11-04T23:55:00.000Z',
      result: 'Successful',
      storageLocation: 'IT Safe Vault External HDD Drive E:',
      fileReference: 'accounts_dch_20261104.sql.enc',
      fileSizeMb: 3200,
      checksum: 'sha256:99c2d4a1... (Verified)',
      operatorName: 'মোঃ কামরুল হাসান',
      verificationStatus: 'Verified',
      verifiedDate: '2026-11-05T08:30:00.000Z',
      verifiedBy: 'মোঃ কামরুল হাসান',
      notes: 'Offline cold copy safely deposited into IT fireproof safe.'
    }
  ],

  maintenanceTemplates: [
    {
      id: 'mnt-tmpl-01',
      titleBn: 'দৈনিক সকালের আইটি সিস্টেম হেলথ চেক',
      titleEn: 'Daily Morning IT System Health Check',
      frequency: 'Daily',
      checklist: [
        'এইচএমএস সার্ভার সিপিইউ ও র্যাম ইউটিলাইজেশন পর্যবেক্ষণ',
        'রাউটার ও প্রাইমারি/সেকেন্ডারি ইন্টারনেট কানেকশন পিং চেক',
        'জরুরি বিভাগ ও রিসেপশন ডেস্কের কম্পিউটার চালু নিশ্চিতকরণ',
        'বিলিং প্রিন্টারসমূহ টেস্ট প্রিন্ট ও পেপার সরবরাহ নিশ্চিতকরণ',
        'গতরাতের এইচএমএস ডাটাবেজ ব্যাকআপ সম্পন্ন হয়েছে কিনা যাচাই'
      ]
    },
    {
      id: 'mnt-tmpl-02',
      titleBn: 'সাপ্তাহিক অ্যান্টিভাইরাস ও ব্যাকআপ অডিট',
      titleEn: 'Weekly Antivirus & Backup Audit',
      frequency: 'Weekly',
      checklist: [
        'ক্যাসপারস্কি সার্ভার থেকে সব পিসির সিগনেচার ডাটাবেজ আপডেট নিশ্চিতকরণ',
        'ল্যাব ও ফার্মেসি পিসির উইন্ডোজ টেম্প ফাইল ও ডিস্ক ক্লিনআপ',
        'অফলাইন এক্সটারনাল হার্ডডিস্কে ব্যাকআপ কপি স্থানান্তর',
        'সিসিটিভি ক্যামেরা ফুটেজ ড্রপ ও এনভিআর স্টোরেজ স্বাস্থ্য পরীক্ষা'
      ]
    },
    {
      id: 'mnt-tmpl-03',
      titleBn: 'মাসিক সার্ভার রুম ইউপিএস ব্যাটারি লোড টেস্ট',
      titleEn: 'Monthly Server Room UPS Load Test',
      frequency: 'Monthly',
      checklist: [
        '১০ কেভিএ ইউপিএস ব্যাটারি টার্মিনাল ভোল্টেজ মাল্টিমিটার দিয়ে রিডিং নেওয়া',
        'মেইন ইনপুট বন্ধ করে ৫ মিনিট ইনভার্টার ব্যাটারি ডিসচার্জ পরীক্ষা',
        'সার্ভার রুম এসি ফিল্টার ক্লিন ও তাপমাত্রা (১৮-২১ ডিগ্রি) পর্যবেক্ষণ'
      ]
    }
  ],

  maintenanceTasks: [
    {
      id: 'mnt-task-01',
      taskCode: 'MNT-2026-0001',
      title: 'দৈনিক সকালের আইটি সিস্টেম হেলথ চেক',
      taskType: 'Daily',
      departmentId: 'dept-10',
      location: 'Hospital-wide',
      assignedToId: 'emp-02',
      assignedToName: 'সোহেল রানা',
      dueDate: '2026-11-05',
      priority: 'High',
      status: 'Completed',
      checklistItems: [
        { label: 'এইচএমএস সার্ভার সিপিইউ ও র্যাম ইউটিলাইজেশন পর্যবেক্ষণ', completed: true },
        { label: 'রাউটার ও প্রাইমারি/সেকেন্ডারি ইন্টারনেট কানেকশন পিং চেক', completed: true },
        { label: 'জরুরি বিভাগ ও রিসেপশন ডেস্কের কম্পিউটার চালু নিশ্চিতকরণ', completed: true },
        { label: 'বিলিং প্রিন্টারসমূহ টেস্ট প্রিন্ট ও পেপার সরবরাহ নিশ্চিতকরণ', completed: true },
        { label: 'গতরাতের এইচএমএস ডাটাবেজ ব্যাকআপ সম্পন্ন হয়েছে কিনা যাচাই', completed: true }
      ],
      completionNotes: 'All morning checks passed. Server CPU at 18%, RAM 42%. Internet latency 8ms.',
      completedAt: '2026-11-05T08:30:00.000Z',
      completedBy: 'সোহেল রানা'
    },
    {
      id: 'mnt-task-02',
      taskCode: 'MNT-2026-0002',
      title: 'সার্ভার রুম অনলাইন ইউপিএস ও ব্যাটারি লোড টেস্ট',
      taskType: 'Monthly',
      departmentId: 'dept-10',
      location: 'Server Room Power Rack',
      assignedToId: 'emp-01',
      assignedToName: 'মোঃ কামরুল হাসান',
      dueDate: '2026-11-07',
      priority: 'Medium',
      status: 'Upcoming',
      checklistItems: [
        { label: '১০ কেভিএ ইউপিএস ব্যাটারি টার্মিনাল ভোল্টেজ মাল্টিমিটার দিয়ে রিডিং নেওয়া', completed: false },
        { label: 'মেইন ইনপুট বন্ধ করে ৫ মিনিট ইনভার্টার ব্যাটারি ডিসচার্জ পরীক্ষা', completed: false },
        { label: 'সার্ভার রুম এসি ফিল্টার ক্লিন ও তাপমাত্রা পর্যবেক্ষণ', completed: false }
      ],
      completionNotes: '',
      completedAt: '',
      completedBy: ''
    },
    {
      id: 'mnt-task-03',
      taskCode: 'MNT-2026-0003',
      title: 'বিলিং ও রিসেপশন প্রিন্টার রোলার ডিপ ক্লিনিং',
      taskType: 'Weekly',
      departmentId: 'dept-06',
      location: 'Accounts & Reception',
      assignedToId: 'emp-02',
      assignedToName: 'সোহেল রানা',
      dueDate: '2026-11-02',
      priority: 'Medium',
      status: 'Overdue', // Overdue demo task
      checklistItems: [
        { label: 'এইচপি লেজারজেট পেপার ট্রে ও পিকআপ রোলার আইসোপ্রোপাইল অ্যালকোহল দিয়ে পরিষ্কার', completed: false },
        { label: 'কানেকশন কেবল ও ড্রাম ইউনিট চেক', completed: false }
      ],
      completionNotes: '',
      completedAt: '',
      completedBy: ''
    }
  ],

  knowledgeArticles: [
    {
      id: 'kb-01',
      titleBn: 'হাসপাতাল নেটওয়ার্ক প্রিন্টার ইনস্টলেশন ও আইপি কনফিগারেশন নির্দেশিকা',
      titleEn: 'Hospital Network Printer Setup & IP Configuration Guide',
      category: 'Printer',
      categoryLabel: 'প্রিন্টার সেটআপ',
      author: 'মোঃ কামরুল হাসান',
      tags: ['Printer', 'Network', 'HP LaserJet', 'IP Config'],
      status: 'Published',
      summary: 'হাসপাতালের উইন্ডোজ পিসিতে নতুন নেটওয়ার্ক প্রিন্টার যুক্ত করার স্ট্যান্ডার্ড পদ্ধতি।',
      content: `### ১. প্রিন্টার আইপি নিশ্চিতকরণ
প্রিন্টারের কন্ট্রোল প্যানেল থেকে Network Setup বা Configuration Report প্রিন্ট করে বরাদ্দকৃত আইপি (যেমন: 192.168.20.25) দেখে নিন।

### ২. উইন্ডোজ ক্লায়েন্ট পিসিতে সেটআপ
1. স্টার্ট মেনু থেকে **Settings > Devices > Printers & Scanners** এ যান।
2. **Add a printer or scanner** এ ক্লিক করুন।
3. **The printer that I want isn't listed** নির্বাচন করুন।
4. **Add a printer using an IP address or hostname** সিলেক্ট করে Next করুন।
5. Device Type: **TCP/IP Device**, Hostname/IP address এ প্রিন্টারের আইপি টাইপ করুন।
6. উইন্ডোজ অটো-ডিটেক্ট না করলে ড্রাইভার সিডি/শেয়ার ফোল্ডার \\\\192.168.10.10\\Drivers\\HP_M428 থেকে সিলেক্ট করুন।

### ৩. পেপার সাইজ ও টেস্ট প্রিন্ট
- প্রিন্ট প্রিফারেন্সে ডিফল্ট সাইজ **A4** নিশ্চিত করুন।
- **Print a Test Page** দিয়ে আউটপুট চেক করুন।`,
      updatedAt: '2026-10-15'
    },
    {
      id: 'kb-02',
      titleBn: 'ফার্মেসি বারকোড স্ক্যানার রিসেট ও ইউএসবি ট্রাবলশুটিং',
      titleEn: 'Pharmacy Barcode Scanner Reset & USB Troubleshooting SOP',
      category: 'Scanner',
      categoryLabel: 'স্ক্যানার ও পেরিফেরাল',
      author: 'সোহেল রানা',
      tags: ['Scanner', 'Honeywell', 'Pharmacy', 'Troubleshooting'],
      status: 'Published',
      summary: 'বারকোড স্ক্যানার ইনপুট না দিলে বা লাল লাইট জ্বললে সমাধান করার পদক্ষেপ।',
      content: `### সাধারণ সমস্যা ও সমাধান:
1. **স্ক্যানারে লাইট আছে কিন্তু টাইপ হচ্ছে না:**
   - ইউএসবি ক্যাবলটি পিসির পেছনের মাদারবোর্ড পোর্টে সরাসরি লাগান (ফ্রন্ট ইউএসবি হাব এড়িয়ে চলুন)।
   - নোটপ্যাড ওপেন করে টেস্ট বারকোড স্ক্যান করে দেখুন ডাটা আসে কিনা।

2. **ফ্যাক্টরি ডিফল্ট রিসেট:**
   - স্ক্যানার ম্যানুয়ালের **"Recall Factory Defaults"** বারকোডটি স্ক্যান করুন।
   - এরপর **"USB Keyboard PC"** বারকোডটি স্ক্যান করে কনফিগারেশন সেভ করুন।

3. **এন্টার কী (Carriage Return) মিসিং হলে:**
   - "Add CR Suffix" কনফিগারেশন বারকোড স্ক্যান করুন যাতে প্রতিটি স্ক্যানের পর অটোমেটিক কার্সার পরবর্তী ফিল্ডে যায়।`,
      updatedAt: '2026-10-20'
    },
    {
      id: 'kb-03',
      titleBn: 'জরুরি পরিস্থিতিতে ডাটাবেজ ব্যাকআপ রিস্টোর ভেরিফিকেশন এসওপি',
      titleEn: 'Emergency Database Backup Restore Verification SOP',
      category: 'Backup',
      categoryLabel: 'ব্যাকআপ ও নিরাপত্তা',
      author: 'মোঃ কামরুল হাসান',
      tags: ['SOP', 'Backup', 'Oracle', 'Disaster Recovery'],
      status: 'Published',
      summary: 'ত্রৈমাসিক ভিত্তিতে টেস্ট সার্ভারে ব্যাকআপ ডাম্প রিস্টোর করে ভ্যালিডিটি নিশ্চিত করার নিয়ম।',
      content: `### উদ্দেশ্য:
প্রাকৃতিক দুর্যোগ বা র্যানসমওয়্যার বা হার্ডওয়্যার ফেইলিওরের ক্ষেত্রে ব্যাকআপ ডাটা থেকে সিস্টেম পুনরায় সচল করার নিশ্চয়তা যাচাই।

### ধাপসমূহ:
1. টেস্ট সার্ভার (192.168.10.12) প্রস্তুত রাখুন।
2. লেটেস্ট ব্যাকআপ ফাইল (.dmp) এনএএস থেকে টেস্ট সার্ভারে কপি করুন।
3. ওরাকল ডাটাপাম্প ইমপোর্ট ইউটিলিটি চালিয়ে স্কিমা ইমপোর্ট করুন:
   \`impdp system/password DIRECTORY=dmp_dir DUMPFILE=hms_full.dmp LOGFILE=imp_test.log\`
4. ইমপোর্ট সফল হলে রোগীর তালিকা ও বিলিং টেবিলের রেকর্ড কাউন্ট মেইন ডাটাবেজের সাথে মিলিয়ে দেখুন।
5. ফলাফল ব্যাকআপ রেজিস্টারের **Restore Test History** সেকশনে লিপিবদ্ধ করুন।`,
      updatedAt: '2026-10-28'
    }
  ],

  vendors: [
    {
      id: 'vnd-01',
      name: 'Smart Technologies (BD) Ltd.',
      contactPerson: 'জাফর ইকবাল (Enterprise Sales Manager)',
      phone: '01730-001122',
      email: 'enterprise@smartbd.demo',
      address: 'Jahangir Tower, Karwan Bazar, Dhaka',
      servicesOffered: 'Dell Servers, Cisco Networking, Kaspersky Licensing, Hikvision CCTV',
      status: 'Active'
    },
    {
      id: 'vnd-02',
      name: 'Flora Systems Ltd.',
      contactPerson: 'আফজাল হোসেন (Key Account Manager)',
      phone: '01819-223344',
      email: 'corp@florasystems.demo',
      address: 'Adamjee Court, Motijheel, Dhaka',
      servicesOffered: 'HP Desktop, APC Online UPS, Honeywell Scanners, OEM Software',
      status: 'Active'
    },
    {
      id: 'vnd-03',
      name: 'Star Tech & Engineering Ltd.',
      contactPerson: 'মেহেদী হাসান (Support Lead)',
      phone: '01977-334455',
      email: 'hospital-support@startech.demo',
      address: 'Multiplan Center, New Elephant Road, Dhaka',
      servicesOffered: 'Hardware Peripherals, Printers, Toner Supplies & Repair Service',
      status: 'Active'
    }
  ],

  purchaseRequests: [
    {
      id: 'pr-01',
      requestCode: 'PR-2026-0001',
      requestedBy: 'মোঃ কামরুল হাসান',
      departmentId: 'dept-10',
      itemTitle: 'অ্যাকাউন্টস ও রিসেপশনের জন্য এইচপি লেজারজেট ৭৬এ টোনার (৪টি)',
      specifications: 'HP 76A (CF276A) Original LaserJet Toner Cartridge - Black',
      quantity: 4,
      estimatedCost: 38000,
      reason: 'বিলিং এবং রিসেপশন প্রিন্টারের বর্তমান টোনার লো দেখাচ্ছে। জরুরি স্টক প্রয়োজন।',
      priority: 'High',
      approvalStatus: 'Approved',
      createdAt: '2026-11-02T10:00:00.000Z',
      notes: 'Approved by Administration & Accounts Head. Forwarded to purchase officer.'
    },
    {
      id: 'pr-02',
      requestCode: 'PR-2026-0002',
      requestedBy: 'সোহেল রানা',
      departmentId: 'dept-10',
      itemTitle: 'সার্ভার রুম ব্যাকআপের জন্য ৪টি ৪টিবি এক্সটারনাল হার্ডডিস্ক',
      specifications: 'Western Digital My Passport 4TB USB 3.2 Gen 1 with Hardware Encryption',
      quantity: 4,
      estimatedCost: 52000,
      reason: 'অফলাইন উইকলি ও মান্থলি ব্যাকআপ রোটেট করার জন্য নতুন ড্রাইভ প্রয়োজন।',
      priority: 'Medium',
      approvalStatus: 'Submitted',
      createdAt: '2026-11-04T11:30:00.000Z',
      notes: 'Waiting for Director Approval.'
    }
  ],

  expenses: [
    {
      id: 'exp-01',
      expenseCode: 'EXP-2026-0001',
      category: 'Toner/Cartridge',
      description: 'বিলিং ডিপার্টমেন্টের এইচপি ৪২৮ প্রিন্টারের ইমার্জেন্সি টোনার ক্রয়',
      amount: 9500,
      date: '2026-10-18',
      vendorId: 'vnd-03',
      vendorName: 'Star Tech & Engineering Ltd.',
      departmentId: 'dept-06',
      approvalStatus: 'Paid',
      paymentMethod: 'Office Cash / Account Payee Cheque',
      notes: 'Voucher No: VC-8921. Original invoice attached in hard copy file.'
    },
    {
      id: 'exp-02',
      expenseCode: 'EXP-2026-0002',
      category: 'Internet/ISP',
      description: 'অক্টোবর ২০২৬ মাসের বিটিসিএল ৫০ এমবিপিএস ডেডিকেটেড ইন্টারনেট বিল',
      amount: 35000,
      date: '2026-11-01',
      vendorId: 'vnd-01',
      vendorName: 'BTCL Fiber Dedicated',
      departmentId: 'dept-10',
      approvalStatus: 'Paid',
      paymentMethod: 'Bank Transfer / BEFTN',
      notes: 'Monthly fixed corporate optical fiber line rent.'
    },
    {
      id: 'exp-03',
      expenseCode: 'EXP-2026-0003',
      category: 'Repair',
      description: 'প্যথলজি ল্যাব পিসির পাওয়ার সাপ্লাই পরিবর্তন ও সার্ভিসিং',
      amount: 4500,
      date: '2026-10-25',
      vendorId: 'vnd-03',
      vendorName: 'Star Tech & Engineering Ltd.',
      departmentId: 'dept-03',
      approvalStatus: 'Approved',
      paymentMethod: 'Cash',
      notes: 'Replaced faulty 450W PSU with 80+ Bronze certified unit.'
    }
  ],

  localActivityLogs: [
    {
      id: 'act-01',
      actor: 'মোঃ কামরুল হাসান (আইটি অফিসার)',
      action: 'INITIALIZE_SYSTEM',
      module: 'Settings',
      recordId: 'SYSTEM',
      timestamp: '2026-11-01T08:00:00.000Z',
      details: 'Hospital IT Desk portal database initialized with schema v3.0.0.'
    },
    {
      id: 'act-02',
      actor: 'তানিয়া সুলতানা (অ্যাকাউন্টস)',
      action: 'CREATE_TICKET',
      module: 'IT Tickets',
      recordId: 'TKT-2026-0001',
      timestamp: '2026-11-04T09:30:00.000Z',
      details: 'Created ticket TKT-2026-0001 for Accounts Printer Paper Jam.'
    },
    {
      id: 'act-03',
      actor: 'ডাঃ তারেক মাহমুদ (জরুরি বিভাগ)',
      action: 'CREATE_TICKET',
      module: 'IT Tickets',
      recordId: 'TKT-2026-0002',
      timestamp: '2026-11-05T07:15:00.000Z',
      details: 'Reported Critical ticket TKT-2026-0002: HMS Lab Results connection timeout.'
    },
    {
      id: 'act-04',
      actor: 'সোহেল রানা (আইটি সহকারী)',
      action: 'COMPLETE_MAINTENANCE',
      module: 'Maintenance',
      recordId: 'MNT-2026-0001',
      timestamp: '2026-11-05T08:30:00.000Z',
      details: 'Completed Daily Morning IT System Health Check (5/5 items).'
    }
  ]
};

