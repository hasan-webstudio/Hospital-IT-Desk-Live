/**
 * Hospital IT Desk — Demo Role UI Permissions
 * NOTE: This is client-side UI visibility demonstration only.
 * It is NOT server-enforced security.
 */

import { state } from './state.js';

export const PERMISSION_MATRIX = {
  SUPER_ADMIN: {
    canManageSettings: true,
    canResetDemo: true,
    canDeleteRecords: true,
    canEditAllTickets: true,
    canAssignTickets: true,
    canManageAssets: true,
    canManageNetwork: true,
    canManageBackups: true,
    canManageMaintenance: true,
    canApprovePurchases: true,
    canViewFinancials: true
  },
  IT_OFFICER: {
    canManageSettings: false,
    canResetDemo: true,
    canDeleteRecords: true,
    canEditAllTickets: true,
    canAssignTickets: true,
    canManageAssets: true,
    canManageNetwork: true,
    canManageBackups: true,
    canManageMaintenance: true,
    canApprovePurchases: true,
    canViewFinancials: true
  },
  IT_ASSISTANT: {
    canManageSettings: false,
    canResetDemo: false,
    canDeleteRecords: false,
    canEditAllTickets: true,
    canAssignTickets: false,
    canManageAssets: true,
    canManageNetwork: false,
    canManageBackups: true,
    canManageMaintenance: true,
    canApprovePurchases: false,
    canViewFinancials: false
  },
  DEPT_HEAD: {
    canManageSettings: false,
    canResetDemo: false,
    canDeleteRecords: false,
    canEditAllTickets: false,
    canAssignTickets: false,
    canManageAssets: false,
    canManageNetwork: false,
    canManageBackups: false,
    canManageMaintenance: false,
    canApprovePurchases: true,
    canViewFinancials: true
  },
  HOSP_STAFF: {
    canManageSettings: false,
    canResetDemo: false,
    canDeleteRecords: false,
    canEditAllTickets: false,
    canAssignTickets: false,
    canManageAssets: false,
    canManageNetwork: false,
    canManageBackups: false,
    canManageMaintenance: false,
    canApprovePurchases: false,
    canViewFinancials: false
  },
  MANAGEMENT: {
    canManageSettings: false,
    canResetDemo: false,
    canDeleteRecords: false,
    canEditAllTickets: false,
    canAssignTickets: false,
    canManageAssets: false,
    canManageNetwork: false,
    canManageBackups: false,
    canManageMaintenance: false,
    canApprovePurchases: false,
    canViewFinancials: true
  }
};

export const permissions = {
  /**
   * Check if current demo role has a capability
   * @param {string} capability
   * @returns {boolean}
   */
  can(capability) {
    const role = state.getActiveRole() || 'IT_OFFICER';
    const roleRules = PERMISSION_MATRIX[role] || PERMISSION_MATRIX.IT_OFFICER;
    return Boolean(roleRules[capability]);
  },

  getCurrentRoleCode() {
    return state.getActiveRole() || 'IT_OFFICER';
  }
};

