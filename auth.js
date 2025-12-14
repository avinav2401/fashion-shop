// auth.js - Refactored for Express API

let isRegister = new URLSearchParams(window.location.search).get('type') === 'register';
let selectedRole = null;

// Initialize auth UI
function initializeAuth() {
  document.getElementById('formTitle').textContent = isRegister ? 'Sign Up' : 'Sign In';
  document.getElementById('switchLink').textContent = isRegister ? 'Sign In' : 'Sign Up';
  document.getElementById('switchText').textContent = isRegister ?
    'Already have an account? ' : 'Don\'t have an account? ';

  if (isRegister) {
    document.getElementById('roleSelection').classList.add('active');
  } else {
    document.getElementById('roleSelection').classList.remove('active');
  }

  document.getElementById('submitBtn').textContent = isRegister ? 'Sign Up' : 'Sign In';
}

// Handle role selection
window.selectRole = function (role) {
  selectedRole = role;
  document.querySelectorAll('.role-option').forEach(opt =>
    opt.classList.remove('selected'));
  event.target.classList.add('selected');
  document.getElementById('businessNameField').style.display =
    role === 'seller' ? 'block' : 'none';
}

// Switch between login/register
window.switchMode = function () {
  isRegister = !isRegister;
  window.history.replaceState({}, '', `auth.html?type=${isRegister ? 'register' : 'login'}`);
  initializeAuth();
  selectedRole = null;
  document.getElementById('authForm').reset();
  document.querySelectorAll('.role-option').forEach(opt => opt.classList.remove('selected'));
  document.getElementById('businessNameField').style.display = 'none';
}

// Handle Form Submit
window.handleAuth = async function (e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const businessName = document.getElementById('businessName').value;

  if (isRegister && !selectedRole) {
    alert('Please select a role (Customer or Seller)');
    return;
  }

  const API_BASE = 'http://localhost:3000';
  const endpoint = isRegister ? `${API_BASE}/api/register` : `${API_BASE}/api/login`;
  const body = {
    email,
    password,
    ...(isRegister && { role: selectedRole, businessName })
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Authentication failed');
    }

    // Success - Store token
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('userId', data.userId);

    // Redirect
    if (data.role === 'seller') {
      window.location.href = 'seller-dashboard.html';
    } else {
      window.location.href = 'index.html';
    }

  } catch (error) {
    console.error('Auth Error:', error);
    alert(error.message);
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initializeAuth);