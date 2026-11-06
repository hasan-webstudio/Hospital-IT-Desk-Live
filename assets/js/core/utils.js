/**
 * Hospital IT Desk — Common Utilities
 * CSV export with Excel-compatible UTF-8 BOM, JSON export/import, and SVG QR matrix.
 */

export const utils = {
  /**
   * Export structured data to CSV file with UTF-8 BOM for proper Bangla rendering in Excel
   * @param {string} filename
   * @param {string[]} headers
   * @param {any[][]} rows
   */
  exportToCsv(filename, headers, rows) {
    const escapeCell = (cell) => {
      if (cell === null || cell === undefined) return '""';
      const str = String(cell).replace(/"/g, '""');
      return `"${str}"`;
    };

    let csvContent = '\uFEFF'; // UTF-8 Byte Order Mark for Excel
    csvContent += headers.map(escapeCell).join(',') + '\r\n';

    rows.forEach((row) => {
      csvContent += row.map(escapeCell).join(',') + '\r\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * Trigger download of JSON backup file
   * @param {string} filename
   * @param {object} dataObj
   */
  downloadJson(filename, dataObj) {
    const jsonStr = JSON.stringify(dataObj, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename.endsWith('.json') ? filename : `${filename}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * Read and parse a selected JSON file
   * @param {File} file
   * @returns {Promise<any>}
   */
  readJsonFile(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file provided'));
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          resolve(json);
        } catch (err) {
          reject(new Error('ফাইলটি সঠিক JSON ফরম্যাটে নেই।'));
        }
      };
      reader.onerror = () => reject(new Error('ফাইল পড়তে ত্রুটি হয়েছে।'));
      reader.readAsText(file);
    });
  },

  /**
   * Simple debounce helper
   */
  debounce(func, wait = 250) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Generate an inline safe SVG QR pattern
   * Creates a deterministic visual 2D matrix representing an internal asset code/URL.
   * @param {string} code
   * @returns {string} SVG string
   */
  generateQrSvg(code = 'IT-ASSET-0001') {
    // Generate a clean 21x21 QR-like matrix grid deterministically from the string hash
    const size = 21;
    let hash = 0;
    for (let i = 0; i < code.length; i++) {
      hash = (hash << 5) - hash + code.charCodeAt(i);
      hash |= 0;
    }

    let rects = '';
    const cellSize = 6;
    const offset = 10;

    // Standard QR finder patterns (corners)
    const isFinder = (r, c) => {
      if (r < 7 && c < 7) return true; // Top-Left
      if (r < 7 && c >= size - 7) return true; // Top-Right
      if (r >= size - 7 && c < 7) return true; // Bottom-Left
      return false;
    };

    // Draw finder pattern borders
    const drawFinder = (startX, startY) => {
      let f = '';
      f += `<rect x="${startX}" y="${startY}" width="${7 * cellSize}" height="${7 * cellSize}" fill="#0B1F3A" rx="2"/>`;
      f += `<rect x="${startX + cellSize}" y="${startY + cellSize}" width="${5 * cellSize}" height="${5 * cellSize}" fill="#FFFFFF"/>`;
      f += `<rect x="${startX + 2 * cellSize}" y="${startY + 2 * cellSize}" width="${3 * cellSize}" height="${3 * cellSize}" fill="#0B1F3A"/>`;
      return f;
    };

    rects += drawFinder(offset, offset);
    rects += drawFinder(offset + (size - 7) * cellSize, offset);
    rects += drawFinder(offset, offset + (size - 7) * cellSize);

    // Fill pseudo-random data cells based on hash
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!isFinder(r, c)) {
          const bit = Math.abs((hash ^ (r * 31 + c * 17))) % 3 !== 0;
          if (bit) {
            rects += `<rect x="${offset + c * cellSize}" y="${offset + r * cellSize}" width="${cellSize - 1}" height="${cellSize - 1}" fill="#0B1F3A" rx="1"/>`;
          }
        }
      }
    }

    const totalWidth = size * cellSize + offset * 2;
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${totalWidth}" viewBox="0 0 ${totalWidth} ${totalWidth}">
        <rect width="${totalWidth}" height="${totalWidth}" fill="#FFFFFF" rx="6"/>
        ${rects}
      </svg>
    `;
  }
};

