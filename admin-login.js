document.addEventListener('DOMContentLoaded', () => {
  const loginOverlay = document.getElementById('loginOverlay');
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const loginError = document.getElementById('loginError');
  const logoutBtn = document.getElementById('logoutBtn');
  
  // Credentials
  const VALID_USERNAME = 'admin';
  const VALID_PASSWORD = 'P@ssw0rd768';
  
  // Check if user is already authenticated
  function checkAuthentication() {
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated') === 'true';
    if (isAuthenticated) {
      hideLoginOverlay();
    } else {
      showLoginOverlay();
    }
  }
  
  // Show login overlay
  function showLoginOverlay() {
    loginOverlay.classList.add('active');
    usernameInput.focus();
  }
  
  // Hide login overlay
  function hideLoginOverlay() {
    loginOverlay.classList.remove('active');
  }
  
  // Handle login form submission
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      // Authentication successful
      sessionStorage.setItem('adminAuthenticated', 'true');
      hideLoginOverlay();
      loginError.textContent = '';
    } else {
      // Authentication failed
      loginError.textContent = 'Invalid username or password';
      passwordInput.value = '';
      passwordInput.focus();
    }
  });
  
  // Handle logout button click
  logoutBtn.addEventListener('click', () => {
    // Clear authentication
    sessionStorage.removeItem('adminAuthenticated');
    // Show login overlay
    showLoginOverlay();
  });
  
  // Initialize
  checkAuthentication();
}); 