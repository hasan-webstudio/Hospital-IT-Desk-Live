/**
 * Hospital IT Desk — Data Repository Layer
 * Abstracted interface over IndexedDB with audit logging and demo seed management.
 * Hardened against unhandled transaction errors and connection locks.
 */

import { openDatabase } from './database.js';
import { STORES, SCHEMA_VERSION } from '../data/schema.js';
import { DEMO_DATA } from '../data/demo-data.js';

export const repository = {
  /**
   * Fetch all records from a given store
   * @param {string} storeName
   * @returns {Promise<any[]>}
   */
  async getAll(storeName) {
    try {
      const db = await openDatabase();
      return new Promise((resolve, reject) => {
        try {
          const tx = db.transaction(storeName, 'readonly');
          const store = tx.objectStore(storeName);
          const request = store.getAll();
          request.onsuccess = () => resolve(request.result || []);
          request.onerror = () => reject(request.error);
        } catch (e) {
          reject(e);
        }
      });
    } catch (err) {
      console.warn(`repository.getAll failed on [${storeName}]:`, err);
      return [];
    }
  },

  /**
   * Fetch a single record by primary key (id)
   * @param {string} storeName
   * @param {string} id
   * @returns {Promise<any|null>}
   */
  async getById(storeName, id) {
    try {
      const db = await openDatabase();
      return new Promise((resolve, reject) => {
        try {
          const tx = db.transaction(storeName, 'readonly');
          const store = tx.objectStore(storeName);
          const request = store.get(id);
          request.onsuccess = () => resolve(request.result || null);
          request.onerror = () => reject(request.error);
        } catch (e) {
          reject(e);
        }
      });
    } catch (err) {
      console.warn(`repository.getById failed on [${storeName}, ${id}]:`, err);
      return null;
    }
  },

  /**
   * Find records matching a condition
   * @param {string} storeName
   * @param {(item: any) => boolean} predicate
   * @returns {Promise<any[]>}
   */
  async find(storeName, predicate) {
    try {
      const all = await this.getAll(storeName);
      return all.filter(predicate);
    } catch (e) {
      return [];
    }
  },

  /**
   * Insert a new record
   * @param {string} storeName
   * @param {any} record
   * @returns {Promise<any>}
   */
  async add(storeName, record) {
    if (!record.id) {
      record.id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    }
    if (!record.createdAt) {
      record.createdAt = new Date().toISOString();
    }
    record.updatedAt = new Date().toISOString();

    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      try {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const request = store.add(record);
        request.onsuccess = () => resolve(record);
        request.onerror = () => reject(request.error);
      } catch (e) {
        reject(e);
      }
    });
  },

  /**
   * Update an existing record
   * @param {string} storeName
   * @param {any} record
   * @returns {Promise<any>}
   */
  async update(storeName, record) {
    record.updatedAt = new Date().toISOString();
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      try {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const request = store.put(record);
        request.onsuccess = () => resolve(record);
        request.onerror = () => reject(request.error);
      } catch (e) {
        reject(e);
      }
    });
  },

  /**
   * Delete a record by id
   * @param {string} storeName
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(storeName, id) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      try {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const request = store.delete(id);
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
      } catch (e) {
        reject(e);
      }
    });
  },

  /**
   * Count total items in store safely
   * @param {string} storeName
   * @returns {Promise<number>}
   */
  async count(storeName) {
    try {
      const db = await openDatabase();
      return new Promise((resolve) => {
        try {
          const tx = db.transaction(storeName, 'readonly');
          const store = tx.objectStore(storeName);
          const request = store.count();
          request.onsuccess = () => resolve(request.result || 0);
          request.onerror = () => resolve(0);
        } catch (e) {
          resolve(0);
        }
      });
    } catch (err) {
      return 0;
    }
  },

  /**
   * Clear an entire store safely
   * @param {string} storeName
   * @returns {Promise<boolean>}
   */
  async clearStore(storeName) {
    try {
      const db = await openDatabase();
      return new Promise((resolve, reject) => {
        try {
          const tx = db.transaction(storeName, 'readwrite');
          const store = tx.objectStore(storeName);
          const request = store.clear();
          request.onsuccess = () => resolve(true);
          request.onerror = () => reject(request.error);
        } catch (e) {
          reject(e);
        }
      });
    } catch (err) {
      console.warn(`clearStore failed on [${storeName}]:`, err);
      return false;
    }
  },

  /**
   * Bulk insert records safely
   * @param {string} storeName
   * @param {any[]} records
   * @returns {Promise<number>}
   */
  async bulkAdd(storeName, records) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      try {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        let count = 0;
        records.forEach((record) => {
          store.put(record);
          count++;
        });
        tx.oncomplete = () => resolve(count);
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(new Error('Transaction aborted in bulkAdd'));
      } catch (e) {
        reject(e);
      }
    });
  },

  /**
   * Log an activity record
   * @param {string} action
   * @param {string} module
   * @param {string} recordId
   * @param {string} details
   * @param {string} [actor]
   */
  async logActivity(action, module, recordId, details, actor = 'System User') {
    try {
      await this.add(STORES.ACTIVITY_LOGS, {
        actor,
        action,
        module,
        recordId,
        details,
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Failed to record activity log:', e);
    }
  },

  /**
   * Initialize database with demo data if empty or forced reset
   * Idempotent: checks existingAssets, safely handles transaction errors.
   * @param {boolean} forceReset
   */
  async initDatabaseWithDemoData(forceReset = false) {
    try {
      const existingAssets = await this.count(STORES.ASSETS);
      if (!forceReset && existingAssets > 0) {
        return false; // Already populated
      }

      await openDatabase();

      // Seed each store from DEMO_DATA safely
      for (const [storeKey, items] of Object.entries(DEMO_DATA)) {
        if (items && Array.isArray(items) && items.length > 0) {
          try {
            await this.clearStore(storeKey);
            await this.bulkAdd(storeKey, items);
          } catch (e) {
            console.warn(`Seeding store [${storeKey}] warning:`, e);
          }
        }
      }

      await this.logActivity(
        forceReset ? 'RESET_DEMO_DATA' : 'SEED_DEMO_DATA',
        'System',
        'ALL_STORES',
        'Initial sample hospital operational data seeded into IndexedDB.'
      );

      return true;
    } catch (err) {
      console.error('initDatabaseWithDemoData caught error:', err);
      return false;
    }
  },

  /**
   * Export all database records to a JSON payload
   * @returns {Promise<object>}
   */
  async exportAllData() {
    const exportPayload = {
      meta: {
        appName: 'Hospital IT Desk',
        schemaVersion: SCHEMA_VERSION,
        exportedAt: new Date().toISOString(),
        format: 'JSON_BACKUP_V3'
      },
      data: {}
    };

    for (const storeName of Object.values(STORES)) {
      exportPayload.data[storeName] = await this.getAll(storeName);
    }

    return exportPayload;
  },

  /**
   * Import records from a validated JSON backup payload
   * @param {object} backupJson
   * @param {boolean} replace
   */
  async importAllData(backupJson, replace = true) {
    if (!backupJson || !backupJson.data) {
      throw new Error('Invalid backup file structure: missing data payload.');
    }

    for (const storeName of Object.values(STORES)) {
      const items = backupJson.data[storeName];
      if (Array.isArray(items)) {
        if (replace) {
          await this.clearStore(storeName);
        }
        await this.bulkAdd(storeName, items);
      }
    }

    await this.logActivity(
      'RESTORE_JSON_BACKUP',
      'Settings',
      'DATABASE',
      `Restored backup timestamped ${backupJson.meta?.exportedAt || 'Unknown'}.`
    );

    return true;
  }
};
