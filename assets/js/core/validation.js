/**
 * Hospital IT Desk — Input Validation & File Safeguards
 */

export const validation = {
  /**
   * Validate required string
   * @param {string} val
   * @returns {boolean}
   */
  isRequired(val) {
    if (val === null || val === undefined) return false;
    return String(val).trim().length > 0;
  },

  /**
   * Validate standard IPv4 address
   * @param {string} ip
   * @returns {boolean}
   */
  isValidIpv4(ip) {
    if (!ip) return false;
    const parts = ip.trim().split('.');
    if (parts.length !== 4) return false;
    return parts.every((p) => {
      if (!/^\d+$/.test(p)) return false;
      const num = parseInt(p, 10);
      return num >= 0 && num <= 255;
    });
  },

  /**
   * Validate MAC address format
   * @param {string} mac
   * @returns {boolean}
   */
  isValidMac(mac) {
    if (!mac) return true; // Optional field
    const regex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    return regex.test(mac.trim());
  },

  /**
   * Check if uploaded file is safe (disallow executable, scripts, large files)
   * Allowed: image/jpeg, image/png, application/pdf, text/plain. Max 3MB.
   * @param {File} file
   * @returns {{isValid: boolean, error?: string}}
   */
  validateAttachment(file) {
    if (!file) return { isValid: false, error: 'কোনো ফাইল নির্বাচন করা হয়নি।' };

    const maxBytes = 3 * 1024 * 1024; // 3 MB
    if (file.size > maxBytes) {
      return { isValid: false, error: 'ফাইলের আকার সর্বোচ্চ ৩ মেগাবাইট (3MB) হতে পারে।' };
    }

    const allowedMime = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'];
    const forbiddenExts = ['.exe', '.bat', '.sh', '.js', '.vbs', '.msi', '.cmd', '.php', '.py'];

    const fileName = file.name.toLowerCase();
    const hasForbiddenExt = forbiddenExts.some((ext) => fileName.endsWith(ext));

    if (hasForbiddenExt) {
      return { isValid: false, error: 'নিরাপত্তার স্বার্থে এক্সিকিউটেবল (.exe, .bat, ইত্যাদি) ফাইল নিষিদ্ধ।' };
    }

    if (!allowedMime.includes(file.type) && !fileName.endsWith('.log')) {
      return { isValid: false, error: 'শুধুমাত্র PNG, JPG, PDF অথবা TXT ফাইল সমর্থনযোগ্য।' };
    }

    return { isValid: true };
  }
};

