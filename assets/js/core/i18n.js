/**
 * Hospital IT Desk — Internationalization (i18n) Engine
 * Primary language: Bangla (bn), Secondary language: English (en)
 */

import { state } from './state.js';

const translations = {
  bn: {
    // App info
    appName: 'হসপিটাল আইটি ডেস্ক',
    appSubtitle: 'হাসপাতাল আইটি ম্যানেজমেন্ট অ্যান্ড সাপোর্ট পোর্টাল',
    demoNotice: 'ডেমো মোড: ডেটা শুধুমাত্র এই ব্রাউজারে সংরক্ষিত (IndexedDB)',
    savedInBrowser: 'এই ব্রাউজারে সংরক্ষিত',
    resetDemoData: 'ডেমো ডেটা রিসেট',
    exportBackup: 'ব্যাকআপ ডাউনলোড',
    importBackup: 'ব্যাকআপ রিস্টোর',

    // Global Actions & UI
    search: 'অনুসন্ধান করুন...',
    filter: 'ফিল্টার',
    all: 'সবগুলো',
    status: 'অবস্থা',
    priority: 'অগ্রাধিকার',
    department: 'বিভাগ',
    category: 'ক্যাটাগরি',
    actions: 'অ্যাকশন',
    save: 'সংরক্ষণ করুন',
    cancel: 'বাতিল',
    close: 'বন্ধ করুন',
    confirm: 'নিশ্চিত করুন',
    delete: 'মুছে ফেলুন',
    edit: 'সম্পাদনা',
    viewDetails: 'বিস্তারিত দেখুন',
    print: 'প্রিন্ট করুন',
    exportCsv: 'CSV এক্সপোর্ট',
    noRecords: 'কোনো রেকর্ড পাওয়া যায়নি',
    loading: 'লোড হচ্ছে...',
    success: 'সফলভাবে সম্পন্ন হয়েছে',
    error: 'একটি ত্রুটি ঘটেছে',
    requiredField: 'এই তথ্যটি পূরণ করা আবশ্যক',

    // Nav Items
    navDashboard: 'ড্যাশবোর্ড',
    navTickets: 'আইটি সাপোর্ট টিকিট',
    navAssets: 'আইটি অ্যাসেট ম্যানেজমেন্ট',
    navAllAssets: 'সকল সরঞ্জাম',
    navComputers: 'কম্পিউটার ও ল্যাপটপ',
    navPrinters: 'প্রিন্টার ও স্ক্যানার',
    navNetwork: 'নেটওয়ার্ক ও ইন্টারনেট',
    navCctv: 'সিসিটিভি ও সিকিউরিটি',
    navSoftware: 'সফটওয়্যার ও লাইসেন্স',
    navBackups: 'ব্যাকআপ রেজিস্টার',
    navMaintenance: 'রক্ষণাবেক্ষণ শিডিউল',
    navStaff: 'স্টাফ, বিভাগ ও অ্যাক্সেস',
    navKnowledgeBase: 'নলেজ বেস ও এসওপি',
    navProcurement: 'খরচ, ক্রয় ও ভেন্ডর',
    navReports: 'রিপোর্ট ও অ্যানালিটিক্স',
    navNotifications: 'নোটিফিকেশন সেন্টার',
    navSettings: 'সেটিংস ও অডিট লগ',

    // Statuses
    statusNew: 'নতুন',
    statusAssigned: 'বরাদ্দকৃত',
    statusInProgress: 'চলমান',
    statusWaitingUser: 'ব্যবহারকারীর অপেক্ষায়',
    statusWaitingVendor: 'ভেন্ডরের অপেক্ষায়',
    statusResolved: 'সমাধানকৃত',
    statusClosed: 'বন্ধ',
    statusReopened: 'পুনরায় খোলা',
    statusCancelled: 'বাতিলকৃত',
    statusActive: 'সক্রিয়',
    statusInactive: 'নিষ্ক্রিয়',
    statusInRepair: 'মেরামতাধীন',
    statusRetired: 'অবসরপ্রাপ্ত',
    statusSuccessful: 'সফল',
    statusFailed: 'ব্যর্থ',
    statusPartial: 'আংশিক',
    statusVerified: 'যাচাইকৃত',
    statusPendingVerification: 'যাচাই অপেক্ষমাণ',
    statusUpcoming: 'আসন্ন',
    statusDue: 'সময় হয়েছে',
    statusOverdue: 'বিলম্বিত',
    statusCompleted: 'সম্পন্ন',

    // Priorities
    priorityLow: 'নিম্ন',
    priorityMedium: 'সাধারণ',
    priorityHigh: 'জরুরি',
    priorityCritical: 'মারাত্মক জরুরি',

    // Roles
    roleSuperAdmin: 'সুপার অ্যাডমিন',
    roleItOfficer: 'আইটি অফিসার',
    roleItAssistant: 'আইটি সহকারী',
    roleDeptHead: 'বিভাগীয় প্রধান',
    roleHospStaff: 'হাসপাতাল স্টাফ',
    roleManagement: 'ম্যানেজমেন্ট ভিউয়ার',

    // Tickets
    ticketTitle: 'সমস্যার বিবরণ বা শিরোনাম',
    ticketNumber: 'টিকিট নং',
    reportedBy: 'রিপোর্টকারী',
    assignedTo: 'দায়িত্বপ্রাপ্ত',
    location: 'স্থান / কক্ষ নং',
    resolutionSummary: 'সমাধানের সারসংক্ষেপ',
    addComment: 'মন্তব্য যুক্ত করুন',
    internalNote: 'অভ্যন্তরীণ নোট (শুধুমাত্র আইটি)',
    reopenTicket: 'টিকিট পুনরায় খুলুন',
    resolveTicket: 'টিকিট সমাধান করুন',
    assignTicket: 'টিকিট এসাইন করুন',

    // Assets
    assetCode: 'অ্যাসেট কোড',
    assetName: 'সরঞ্জামের নাম',
    brandModel: 'ব্র্যান্ড ও মডেল',
    serialNo: 'সিরিয়াল নম্বর',
    condition: 'অবস্থা',
    purchaseDate: 'ক্রয়ের তারিখ',
    purchaseCost: 'ক্রয়মূল্য',
    warrantyExpiry: 'ওয়ারেন্টি মেয়াদ',
    transferAsset: 'অ্যাসেট স্থানান্তর করুন',
    printQrBadge: 'প্রিন্ট / কিউআর কোড',

    // Network & CCTV
    ipAddress: 'আইপি অ্যাড্রেস',
    macAddress: 'ম্যাক অ্যাড্রেস',
    subnet: 'সাবনেট / ভিএলএএন',
    ispName: 'আইএসপি নাম',
    bandwidth: 'ব্যান্ডউইথ',
    cameraName: 'ক্যামেরার নাম',
    storageInfo: 'স্টোরেজ ও এনভিআর তথ্য',

    // Backups
    backupSource: 'সিস্টেম বা ডাটাবেজ',
    backupType: 'ব্যাকআপের ধরন',
    fileSize: 'ফাইলের আকার',
    operator: 'অপারেটর',
    verification: 'ভেরিফিকেশন অবস্থা',

    // Maintenance
    taskTitle: 'কাজের শিরোনাম',
    taskType: 'ধরন',
    dueDate: 'নির্ধারিত তারিখ',
    checklist: 'চেকলিস্টের ধাপসমূহ',
    completeTask: 'কাজ সম্পন্ন করুন',

    // Procurement & Expenses
    amount: 'পরিমাণ (টাকা)',
    vendor: 'ভেন্ডর বা সরবরাহকারী',
    expenseCategory: 'খরচের খাত',
    purchaseItem: 'ক্রয়ের জন্য প্রস্তাবিত সামগ্রী',
    approvalStatus: 'অনুমোদনের অবস্থা'
  },

  en: {
    // App info
    appName: 'Hospital IT Desk',
    appSubtitle: 'Hospital IT Management & Support Portal',
    demoNotice: 'Demo Mode: Data saved only in this browser (IndexedDB)',
    savedInBrowser: 'Saved in this browser',
    resetDemoData: 'Reset Demo Data',
    exportBackup: 'Download Backup',
    importBackup: 'Restore Backup',

    // Global Actions & UI
    search: 'Search records...',
    filter: 'Filter',
    all: 'All',
    status: 'Status',
    priority: 'Priority',
    department: 'Department',
    category: 'Category',
    actions: 'Actions',
    save: 'Save Changes',
    cancel: 'Cancel',
    close: 'Close',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    viewDetails: 'View Details',
    print: 'Print',
    exportCsv: 'Export CSV',
    noRecords: 'No records found',
    loading: 'Loading...',
    success: 'Operation completed successfully',
    error: 'An error occurred',
    requiredField: 'This field is required',

    // Nav Items
    navDashboard: 'Dashboard',
    navTickets: 'IT Support Tickets',
    navAssets: 'IT Asset Management',
    navAllAssets: 'All Assets',
    navComputers: 'Computers & Laptops',
    navPrinters: 'Printers & Scanners',
    navNetwork: 'Network & Internet',
    navCctv: 'CCTV & Security',
    navSoftware: 'Software & Licenses',
    navBackups: 'Backup Register',
    navMaintenance: 'Maintenance Schedule',
    navStaff: 'Staff, Depts & Access',
    navKnowledgeBase: 'Knowledge Base & SOP',
    navProcurement: 'Expenses & Vendors',
    navReports: 'Reports & Analytics',
    navNotifications: 'Notification Center',
    navSettings: 'Settings & Audit Log',

    // Statuses
    statusNew: 'New',
    statusAssigned: 'Assigned',
    statusInProgress: 'In Progress',
    statusWaitingUser: 'Waiting for User',
    statusWaitingVendor: 'Waiting for Vendor',
    statusResolved: 'Resolved',
    statusClosed: 'Closed',
    statusReopened: 'Reopened',
    statusCancelled: 'Cancelled',
    statusActive: 'Active',
    statusInactive: 'Inactive',
    statusInRepair: 'In Repair',
    statusRetired: 'Retired',
    statusSuccessful: 'Successful',
    statusFailed: 'Failed',
    statusPartial: 'Partial',
    statusVerified: 'Verified',
    statusPendingVerification: 'Pending Verification',
    statusUpcoming: 'Upcoming',
    statusDue: 'Due',
    statusOverdue: 'Overdue',
    statusCompleted: 'Completed',

    // Priorities
    priorityLow: 'Low',
    priorityMedium: 'Medium',
    priorityHigh: 'High',
    priorityCritical: 'Critical',

    // Roles
    roleSuperAdmin: 'Super Admin',
    roleItOfficer: 'IT Officer',
    roleItAssistant: 'IT Assistant',
    roleDeptHead: 'Department Head',
    roleHospStaff: 'Hospital Staff',
    roleManagement: 'Management Viewer',

    // Tickets
    ticketTitle: 'Issue Title & Description',
    ticketNumber: 'Ticket #',
    reportedBy: 'Reported By',
    assignedTo: 'Assigned To',
    location: 'Location / Room #',
    resolutionSummary: 'Resolution Summary',
    addComment: 'Add Comment',
    internalNote: 'Internal Note (IT Only)',
    reopenTicket: 'Reopen Ticket',
    resolveTicket: 'Resolve Ticket',
    assignTicket: 'Assign Ticket',

    // Assets
    assetCode: 'Asset Code',
    assetName: 'Asset Name',
    brandModel: 'Brand & Model',
    serialNo: 'Serial Number',
    condition: 'Condition',
    purchaseDate: 'Purchase Date',
    purchaseCost: 'Purchase Cost',
    warrantyExpiry: 'Warranty Expiry',
    transferAsset: 'Transfer Asset',
    printQrBadge: 'Print / QR Badge',

    // Network & CCTV
    ipAddress: 'IP Address',
    macAddress: 'MAC Address',
    subnet: 'Subnet / VLAN',
    ispName: 'ISP Name',
    bandwidth: 'Bandwidth',
    cameraName: 'Camera Name',
    storageInfo: 'Storage & NVR Info',

    // Backups
    backupSource: 'System / Source',
    backupType: 'Backup Type',
    fileSize: 'File Size',
    operator: 'Operator',
    verification: 'Verification Status',

    // Maintenance
    taskTitle: 'Task Title',
    taskType: 'Type',
    dueDate: 'Due Date',
    checklist: 'Checklist Items',
    completeTask: 'Complete Task',

    // Procurement & Expenses
    amount: 'Amount (BDT)',
    vendor: 'Vendor / Supplier',
    expenseCategory: 'Expense Category',
    purchaseItem: 'Requested Item',
    approvalStatus: 'Approval Status'
  }
};

/**
 * Get translated text for a key
 * @param {string} key
 * @returns {string}
 */
export function t(key) {
  const lang = state.getLanguage();
  if (translations[lang] && translations[lang][key]) {
    return translations[lang][key];
  }
  if (translations.bn && translations.bn[key]) {
    return translations.bn[key];
  }
  return key;
}

/**
 * Helper to get bilingual name for object with nameBn/nameEn
 * @param {object} item
 * @returns {string}
 */
export function getLocalizedName(item) {
  if (!item) return '';
  const lang = state.getLanguage();
  if (lang === 'en' && item.nameEn) return item.nameEn;
  if (item.nameBn) return item.nameBn;
  return item.name || item.title || '';
}

