class DataManager {
  constructor() {
    this.storageKey = 'jobSearchApp';
    this.data = this.loadAll() || {};
  }

  // Load all data from localStorage
  loadAll() {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : {};
  }

  // Persist current data object to localStorage
  saveAll() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
  }

  // Save a specific key/value to data and persist
  save(key, value) {
    this.data[key] = value;
    this.saveAll();
  }

  // Load a specific key from data
  load(key) {
    return this.data[key] || null;
  }

  // Export data as JSON string
  export() {
    return JSON.stringify(this.data);
  }

  // Import data from JSON string
  import(jsonData) {
    try {
      const obj = JSON.parse(jsonData);
      this.data = obj;
      this.saveAll();
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }

  // Clear all stored data
  clear() {
    localStorage.removeItem(this.storageKey);
    this.data = {};
  }
}

// Create a global instance for easy access
window.dataManager = new DataManager();
