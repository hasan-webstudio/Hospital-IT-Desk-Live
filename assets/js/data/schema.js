/**
 * Hospital IT Desk — Database Schema Definitions & Store Names
 */

export const DB_NAME = 'hospital_it_desk_db';
export const DB_VERSION = 1;
export const SCHEMA_VERSION = '3.0.0';

export const STORES = {
  SETTINGS: 'appSettings',
  DEPARTMENTS: 'departments',
  EMPLOYEES: 'employees',
  DEMO_USERS: 'demoUsers',
  ROLES: 'roles',
  ACCESS_REQUESTS: 'accessRequests',
  ASSET_CATEGORIES: 'assetCategories',
  ASSETS: 'assets',
  ASSET_ASSIGNMENTS: 'assetAssignments',
  ASSET_SERVICE_RECORDS: 'assetServiceRecords',
  TICKETS: 'tickets',
  TICKET_COMMENTS: 'ticketComments',
  TICKET_ATTACHMENTS: 'ticketAttachments',
  TICKET_STATUS_HISTORY: 'ticketStatusHistory',
  NETWORK_DEVICES: 'networkDevices',
  IP_ALLOCATIONS: 'ipAllocations',
  ISP_CONNECTIONS: 'ispConnections',
  CCTV_DEVICES: 'cctvDevices',
  SOFTWARE_PRODUCTS: 'softwareProducts',
  SOFTWARE_LICENSES: 'softwareLicenses',
  BACKUP_SOURCES: 'backupSources',
  BACKUP_LOGS: 'backupLogs',
  BACKUP_RESTORE_TESTS: 'backupRestoreTests',
  MAINTENANCE_TEMPLATES: 'maintenanceTemplates',
  MAINTENANCE_TASKS: 'maintenanceTasks',
  KNOWLEDGE_ARTICLES: 'knowledgeArticles',
  VENDORS: 'vendors',
  PURCHASE_REQUESTS: 'purchaseRequests',
  EXPENSES: 'expenses',
  NOTIFICATIONS: 'localNotifications',
  ACTIVITY_LOGS: 'localActivityLogs'
};

export const DEFAULT_APP_SETTINGS = {
  id: 'hospital_info',
  hospitalNameBn: 'ঢাকা সেন্ট্রাল হসপিটাল (ডেমো)',
  hospitalNameEn: 'Dhaka Central Hospital (Demo)',
  subtitleBn: 'হাসপাতাল আইটি ম্যানেজমেন্ট অ্যান্ড সাপোর্ট পোর্টাল',
  subtitleEn: 'Hospital IT Management & Support Portal',
  address: 'Green Road, Dhanmondi, Dhaka-1205',
  contactPhone: '+880 2-9660000',
  contactEmail: 'it-support@dhakacentralhosp.demo',
  currency: 'BDT',
  timezone: 'Asia/Dhaka',
  retentionNoticeBn: 'এই অ্যাপটি ব্রাউজারের IndexedDB তে ডেটা সংরক্ষণ করে। ব্রাউজার ক্যাশ ক্লিয়ার করলে ডেটা মুছে যেতে পারে। নিয়মিত JSON ব্যাকআপ সংরক্ষণ করুন।',
  retentionNoticeEn: 'This portal stores data in browser IndexedDB. Clearing browser cache may remove data. Export regular JSON backups.',
  schemaVersion: SCHEMA_VERSION,
  updatedAt: new Date().toISOString()
};

