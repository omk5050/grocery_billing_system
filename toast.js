// Toast Notification Utility
// Overrides window.alert with professional toast messages

function getToastContainer() {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
}

function showToast(message, type = 'success') {
  const container = getToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  // Icon emoji helper
  let icon = '✅';
  if (type === 'error') icon = '❌';
  if (type === 'warning') icon = '⚠️';
  if (type === 'info') icon = 'ℹ️';

  toast.innerHTML = `
    <span style="font-size: 1.2rem; display: flex; align-items: center;">${icon}</span>
    <div class="toast-message">${message}</div>
    <span class="toast-close" onclick="this.parentElement.remove()">&times;</span>
  `;

  container.appendChild(toast);

  // Automatically remove from DOM after the animation runs (3.3s total)
  setTimeout(() => {
    toast.remove();
  }, 3300);
}

// Override window.alert
window.alert = function(message) {
  if (!message) return;
  
  let type = 'success';
  const msgLower = message.toLowerCase();
  
  if (
    msgLower.includes('fail') || 
    msgLower.includes('error') || 
    msgLower.includes('invalid') || 
    msgLower.includes('not match') ||
    msgLower.includes('please fill')
  ) {
    type = 'error';
  } else if (
    msgLower.includes('warning') || 
    msgLower.includes('sure') || 
    msgLower.includes('limit')
  ) {
    type = 'warning';
  } else if (
    msgLower.includes('loading') || 
    msgLower.includes('ready')
  ) {
    type = 'info';
  }
  
  showToast(message, type);
};

// Global custom confirm dialog
window.showConfirm = function(message) {
  return new Promise((resolve) => {
    // 1. Create modal element
    let modal = document.createElement('div');
    modal.className = 'custom-confirm-modal';
    
    // Check keywords to determine colors and button labels
    const msgLower = message.toLowerCase();
    let btnText = 'Confirm';
    let btnColor = 'var(--primary)';
    
    if (msgLower.includes('delete') || msgLower.includes('remove') || msgLower.includes('clear')) {
      btnText = 'Delete';
      btnColor = '#ef4444';
    } else if (msgLower.includes('logout')) {
      btnText = 'Logout';
      btnColor = 'var(--primary)';
    }

    modal.innerHTML = `
      <div class="custom-confirm-content">
        <h3 style="margin-bottom: 0.75rem; font-size: 1.15rem; font-weight: 600;">Confirm Action</h3>
        <p style="margin-bottom: 1.5rem; color: var(--text-muted); font-size: 0.95rem; line-height: 1.4;">${message}</p>
        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <button id="confirm-cancel-btn" style="background: transparent; color: var(--text-main); border: 1px solid var(--border); padding: 0.5rem 1rem; font-size: 0.9rem;">Cancel</button>
          <button id="confirm-ok-btn" style="background: ${btnColor}; border-color: ${btnColor}; padding: 0.5rem 1rem; font-size: 0.9rem; color: #fff;">${btnText}</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // 2. Add event listeners
    modal.querySelector('#confirm-ok-btn').onclick = () => {
      modal.remove();
      resolve(true);
    };

    modal.querySelector('#confirm-cancel-btn').onclick = () => {
      modal.remove();
      resolve(false);
    };
    
    // Close on click outside content
    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.remove();
        resolve(false);
      }
    };
  });
};
