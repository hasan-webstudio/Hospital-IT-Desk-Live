/**
 * Hospital IT Desk — Client-Side Hash Router
 * Clean, lightweight hash-based routing with parameter and query support.
 */

import { state } from './state.js';

class Router {
  constructor() {
    this.routes = new Map();
    this.currentView = null;
    this.defaultRoute = '#/dashboard';
  }

  /**
   * Register a route handler
   * @param {string} path e.g. '#/dashboard', '#/tickets', '#/assets/:id'
   * @param {() => Promise<any>|any} handler
   */
  register(path, handler) {
    this.routes.set(path, handler);
  }

  /**
   * Initialize router listeners
   */
  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    if (!window.location.hash) {
      window.location.hash = this.defaultRoute;
    } else {
      this.handleRoute();
    }
  }

  /**
   * Navigate to a hash route programmatically
   * @param {string} hash
   */
  navigate(hash) {
    window.location.hash = hash;
  }

  /**
   * Parse hash into path and params
   */
  handleRoute() {
    const rawHash = window.location.hash || this.defaultRoute;
    const [pathPart, queryPart] = rawHash.split('?');

    // Parse query params
    const queryParams = {};
    if (queryPart) {
      new URLSearchParams(queryPart).forEach((val, key) => {
        queryParams[key] = val;
      });
    }

    let matchedHandler = null;
    let routeParams = {};

    // Check exact match first
    if (this.routes.has(pathPart)) {
      matchedHandler = this.routes.get(pathPart);
    } else {
      // Check parameterized routes (e.g. #/tickets/:id)
      for (const [pattern, handler] of this.routes.entries()) {
        if (pattern.includes(':')) {
          const patternParts = pattern.split('/');
          const actualParts = pathPart.split('/');

          if (patternParts.length === actualParts.length) {
            let matches = true;
            const params = {};

            for (let i = 0; i < patternParts.length; i++) {
              if (patternParts[i].startsWith(':')) {
                const paramName = patternParts[i].slice(1);
                params[paramName] = actualParts[i];
              } else if (patternParts[i] !== actualParts[i]) {
                matches = false;
                break;
              }
            }

            if (matches) {
              matchedHandler = handler;
              routeParams = params;
              break;
            }
          }
        }
      }
    }

    if (!matchedHandler) {
      console.warn(`Route not found for: ${pathPart}, redirecting to default.`);
      this.navigate(this.defaultRoute);
      return;
    }

    state.setCurrentRoute({
      raw: rawHash,
      path: pathPart,
      params: routeParams,
      query: queryParams
    });

    try {
      const result = matchedHandler({ params: routeParams, query: queryParams });
      if (result && typeof result.catch === 'function') {
        result.catch((err) => {
          console.error(`Async error rendering route ${pathPart}:`, err);
          this.renderRouteError(pathPart, err);
        });
      }
    } catch (err) {
      console.error(`Sync error rendering route ${pathPart}:`, err);
      this.renderRouteError(pathPart, err);
    }
  }

  /**
   * Render diagnostic error UI inside #content-area if route execution fails
   * @param {string} route
   * @param {Error|any} err
   */
  renderRouteError(route, err) {
    const contentArea = document.getElementById('content-area');
    if (!contentArea) return;

    contentArea.innerHTML = `
      <div class="container-fluid py-4">
        <div class="alert alert-danger shadow-sm border-0 p-4 rounded-3">
          <div class="d-flex align-items-center mb-3">
            <i class="bi bi-exclamation-triangle-fill fs-2 me-3 text-danger"></i>
            <div>
              <h4 class="alert-heading mb-1 fw-bold">পেজ লোড করতে ত্রুটি হয়েছে (Route Render Error)</h4>
              <p class="mb-0 text-muted small">রুট <code>${route}</code> রেন্ডার করার সময় অপ্রত্যাশিত সমস্যা দেখা দিয়েছে।</p>
            </div>
          </div>
          <hr>
          <p class="mb-2 small fw-bold">কারিগরি বিবরণ (Error Details):</p>
          <pre class="bg-dark text-white p-3 rounded small mb-3 overflow-auto" style="max-height: 180px;">${(err && (err.stack || err.message)) || String(err)}</pre>
          <div class="d-flex gap-2">
            <button type="button" class="btn btn-primary btn-sm" onclick="window.location.reload()">
              <i class="bi bi-arrow-clockwise me-1"></i> পেজ রিলোড করুন
            </button>
            <a href="#/dashboard" class="btn btn-outline-secondary btn-sm">
              <i class="bi bi-house-door me-1"></i> ড্যাশবোর্ডে ফিরে যান
            </a>
          </div>
        </div>
      </div>
    `;
  }
}

export const router = new Router();

