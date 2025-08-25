class JobTracker {
  constructor() {
    this.applications = (window.dataManager && window.dataManager.load('applications')) || [];
    this.tbody = document.getElementById('applicationTableBody');
  }

  add(app) {
    this.applications.push(app);
    if (window.dataManager) window.dataManager.save('applications', this.applications);
    this.render();
  }

  delete(id) {
    this.applications = this.applications.filter(a => a.id !== id);
    if (window.dataManager) window.dataManager.save('applications', this.applications);
    this.render();
  }

  render() {
    if (!this.tbody) return;
    this.tbody.innerHTML = '';
    this.applications.forEach(app => {
      const tr = document.createElement('tr');
      tr.classList.add('border-b');
      tr.innerHTML = `
        <td class="px-4 py-2">${app.company}</td>
        <td class="px-4 py-2">${app.position}</td>
        <td class="px-4 py-2">${app.status}</td>
        <td class="px-4 py-2"><button data-id="${app.id}" class="del text-red-600">Delete</button></td>
      `;
      this.tbody.appendChild(tr);
    });
    this.tbody.querySelectorAll('.del').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'), 10);
        this.delete(id);
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const tracker = new JobTracker();
  tracker.render();
  const form = document.getElementById('applicationForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const data = new FormData(form);
      const app = {
        id: Date.now(),
        company: data.get('company') || '',
        position: data.get('position') || '',
        status: data.get('status') || ''
      };
      tracker.add(app);
      form.reset();
    });
  }
});
