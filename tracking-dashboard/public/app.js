// Base API URL
const API_BASE = '/api';

// DOM Elements
const systemStatusEl = document.getElementById('system-status');
const trackingForm = document.getElementById('tracking-form');
const eventsBody = document.getElementById('events-body');
const emptyState = document.getElementById('empty-state');
const loadingIndicator = document.getElementById('loading-indicator');
const globalErrorEl = document.getElementById('global-error');
const formErrorEl = document.getElementById('form-error');
const submitBtn = document.getElementById('submit-btn');

// State
let events = [];
let isLoading = false;

// Utility: Show Error
const showError = (element, message) => {
  element.textContent = message;
  element.classList.remove('hidden');
  setTimeout(() => element.classList.add('hidden'), 5000); // Auto-hide
};

// Check System Health
const checkHealth = async () => {
  try {
    const res = await fetch(`${API_BASE}/health`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'health_ping' })
    });
    if (res.ok) {
      systemStatusEl.textContent = 'System Status: Online';
      systemStatusEl.classList.add('online');
    } else {
      throw new Error('Health check failed');
    }
  } catch (err) {
    systemStatusEl.textContent = 'System Status: Offline / Error';
    systemStatusEl.classList.add('offline');
    console.error('System health error:', err);
  }
};

// Fetch all events
const fetchEvents = async () => {
  isLoading = true;
  loadingIndicator.classList.remove('hidden');
  
  try {
    const res = await fetch(`${API_BASE}/items`);
    if (!res.ok) throw new Error('Failed to load tracking data from server.');
    
    events = await res.json();
    renderEvents();
  } catch (err) {
    showError(globalErrorEl, err.message);
  } finally {
    isLoading = false;
    loadingIndicator.classList.add('hidden');
  }
};

// Create a new event
const createEvent = async (payload) => {
  submitBtn.disabled = true;
  submitBtn.textContent = 'Recording...';
  
  try {
    const res = await fetch(`${API_BASE}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to record event.');
    }
    
    const newEvent = await res.json();
    events.push(newEvent);
    renderEvents();
    trackingForm.reset();
  } catch (err) {
    showError(formErrorEl, err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Record Event';
  }
};

// Delete an event
const deleteEvent = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/items/${id}`, {
      method: 'DELETE'
    });
    
    if (!res.ok) throw new Error('Failed to delete event.');
    
    events = events.filter(e => e.id !== id);
    renderEvents();
  } catch (err) {
    showError(globalErrorEl, err.message);
  }
};

// Render state to DOM
const renderEvents = () => {
  eventsBody.innerHTML = '';
  
  if (events.length === 0) {
    emptyState.style.display = 'block';
    return;
  }
  
  emptyState.style.display = 'none';
  
  events.forEach(event => {
    const row = document.createElement('tr');
    
    const dateStr = new Date(event.createdAt).toLocaleString();
    const valueDisplay = event.value !== undefined ? event.value : '-';
    
    row.innerHTML = `
      <td>${event.id}</td>
      <td><strong>${event.eventName}</strong></td>
      <td>${valueDisplay}</td>
      <td>${dateStr}</td>
      <td>
        <button class="delete-btn" data-id="${event.id}">Delete</button>
      </td>
    `;
    
    eventsBody.appendChild(row);
  });

  // Attach delete handlers
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'), 10);
      deleteEvent(id);
    });
  });
};

// Form submit handler
trackingForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const eventName = document.getElementById('event-name').value.trim();
  const valueInput = document.getElementById('event-value').value;
  
  const payload = { eventName };
  if (valueInput !== '') {
    payload.value = parseFloat(valueInput);
  }
  
  createEvent(payload);
});

// Initialize
const init = () => {
  checkHealth();
  fetchEvents();
};

document.addEventListener('DOMContentLoaded', init);
