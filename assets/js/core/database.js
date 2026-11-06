/**
 * Hospital IT Desk — IndexedDB Database Layer
 * Manages object stores, versioning, migrations and low-level transactions.
 * Hardened with connection timeouts, version change listeners, and blocked recovery.
 */

import { DB_NAME, DB_VERSION, STORES } from '../data/schema.js';

let dbInstance = null;
const DB_TIMEOUT_MS = 6000;

/**
 * Open and initialize the IndexedDB instance
 * @returns {Promise<IDBDatabase>}
 */
export async function openDatabase() {
  if (dbInstance) {
    return dbInstance;
  }

  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('IndexedDB is not supported in this browser environment.'));
      return;
    }

    let isSettled = false;

    // Timeout guard to prevent permanent hanging
    const timer = setTimeout(() => {
      if (!isSettled) {
        isSettled = true;
        reject(new Error('IndexedDB connection timed out. Another tab may hold a lock.'));
      }
    }, DB_TIMEOUT_MS);

    let request;
    try {
      request = indexedDB.open(DB_NAME, DB_VERSION);
    } catch (err) {
      clearTimeout(timer);
      isSettled = true;
      reject(err);
      return;
    }

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Define stores and their indexes
      Object.values(STORES).forEach((storeName) => {
        if (!db.objectStoreNames.contains(storeName)) {
          const store = db.createObjectStore(storeName, { keyPath: 'id' });

          // Helpful indexes based on store type
          if (storeName === STORES.TICKETS) {
            store.createIndex('by_status', 'status', { unique: false });
            store.createIndex('by_priority', 'priority', { unique: false });
            store.createIndex('by_department', 'departmentId', { unique: false });
            store.createIndex('by_ticketNumber', 'ticketNumber', { unique: true });
            store.createIndex('by_assignedTo', 'assignedToId', { unique: false });
          } else if (storeName === STORES.ASSETS) {
            store.createIndex('by_assetCode', 'assetCode', { unique: true });
            store.createIndex('by_category', 'categoryId', { unique: false });
            store.createIndex('by_department', 'departmentId', { unique: false });
            store.createIndex('by_status', 'status', { unique: false });
          } else if (storeName === STORES.MAINTENANCE_TASKS) {
            store.createIndex('by_status', 'status', { unique: false });
            store.createIndex('by_dueDate', 'dueDate', { unique: false });
          } else if (storeName === STORES.BACKUP_LOGS) {
            store.createIndex('by_result', 'result', { unique: false });
            store.createIndex('by_verification', 'verificationStatus', { unique: false });
          } else if (storeName === STORES.IP_ALLOCATIONS) {
            store.createIndex('by_ip', 'ipAddress', { unique: false });
            store.createIndex('by_status', 'status', { unique: false });
          } else if (storeName === STORES.KNOWLEDGE_ARTICLES) {
            store.createIndex('by_category', 'category', { unique: false });
          } else if (storeName === STORES.EXPENSES) {
            store.createIndex('by_category', 'category', { unique: false });
            store.createIndex('by_date', 'date', { unique: false });
          }
        }
      });
    };

    request.onsuccess = (event) => {
      clearTimeout(timer);
      if (isSettled) return;
      isSettled = true;

      dbInstance = event.target.result;

      // Close stale connection on versionchange from another tab
      dbInstance.onversionchange = () => {
        console.warn('IndexedDB database version changed in another tab. Closing connection.');
        dbInstance.close();
        dbInstance = null;
      };

      dbInstance.onerror = (e) => {
        console.warn('IndexedDB database error:', e.target?.error);
      };

      resolve(dbInstance);
    };

    request.onerror = (event) => {
      clearTimeout(timer);
      if (isSettled) return;
      isSettled = true;
      console.error('IndexedDB open error:', event.target.error);
      reject(event.target.error || new Error('Failed to open IndexedDB.'));
    };

    request.onblocked = () => {
      console.warn('IndexedDB upgrade blocked by an open tab.');
      setTimeout(() => {
        if (!isSettled && !dbInstance) {
          isSettled = true;
          clearTimeout(timer);
          reject(new Error('IndexedDB upgrade is blocked by another open tab. Please close other tabs of Hospital IT Desk and reload.'));
        }
      }, 2500);
    };
  });
}

/**
 * Execute a transaction on specified stores with safety wrapper
 * @param {string|string[]} storeNames
 * @param {'readonly'|'readwrite'} mode
 * @param {(transaction: IDBTransaction) => any} callback
 */
export async function withTransaction(storeNames, mode, callback) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    let tx;
    try {
      tx = db.transaction(storeNames, mode);
    } catch (err) {
      reject(err);
      return;
    }

    let result;
    tx.oncomplete = () => resolve(result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(new Error('Transaction aborted'));

    try {
      result = callback(tx);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Estimate storage usage
 * @returns {Promise<{usage: number, quota: number, percentUsed: number}>}
 */
export async function getStorageEstimate() {
  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage || 0;
      const quota = estimate.quota || 0;
      const percentUsed = quota > 0 ? ((usage / quota) * 100).toFixed(2) : 0;
      return { usage, quota, percentUsed };
    } catch (e) {
      return { usage: 0, quota: 0, percentUsed: 0 };
    }
  }
  return { usage: 0, quota: 0, percentUsed: 0 };
}
