document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const showRegisterBtn = document.getElementById('show-register');
    const showLoginBtn = document.getElementById('show-login');
    
    // Form Elements
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginUsername = document.getElementById('login-username');
    const loginPassword = document.getElementById('login-password');
    const regUsername = document.getElementById('reg-username');
    const regEmail = document.getElementById('reg-email');
    const regPassword = document.getElementById('reg-password');
    const regPasswordConfirm = document.getElementById('reg-password-confirm');
    const loginSubmitBtn = document.getElementById('login-submit-btn');
    const regSubmitBtn = document.getElementById('reg-submit-btn');

    // Check if already authenticated, redirect to home if so
    if (ApiService.isAuthenticated()) {
        window.location.href = '/';
        return;
    }

    // Toggle Password Visibility
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('bi-eye', 'bi-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('bi-eye-slash', 'bi-eye');
            }
        });
    });

    // Toggle between forms
    showRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginSection.classList.add('hidden');
        setTimeout(() => {
            registerSection.classList.remove('hidden');
        }, 300);
    });

    showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        registerSection.classList.add('hidden');
        setTimeout(() => {
            loginSection.classList.remove('hidden');
        }, 300);
    });

    // Handle Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = loginUsername.value.trim();
        const password = loginPassword.value;
        
        if (!username || !password) {
            showToast('Please enter both username and password.', true);
            return;
        }

        const originalText = loginSubmitBtn.innerHTML;
        loginSubmitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Logging in...';
        loginSubmitBtn.disabled = true;

        try {
            await ApiService.login(username, password);
            showToast('Login successful! Redirecting...');
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } catch (error) {
            showToast(error.message || 'Login failed. Please check your credentials.', true);
            loginSubmitBtn.innerHTML = originalText;
            loginSubmitBtn.disabled = false;
        }
    });

    // Handle Registration
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = regUsername.value.trim();
        const email = regEmail.value.trim();
        const password = regPassword.value;
        const passwordConfirm = regPasswordConfirm.value;
        
        if (!username || !email || !password || !passwordConfirm) {
            showToast('Please fill in all fields.', true);
            return;
        }

        if (password !== passwordConfirm) {
            showToast('Passwords do not match.', true);
            return;
        }

        if (password.length < 8) {
            showToast('Password must be at least 8 characters long.', true);
            return;
        }

        const originalText = regSubmitBtn.innerHTML;
        regSubmitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Registering...';
        regSubmitBtn.disabled = true;

        try {
            await ApiService.register(username, email, password, passwordConfirm);
            showToast('Registration successful! Redirecting...');
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } catch (error) {
            showToast(error.message || 'Registration failed.', true);
            regSubmitBtn.innerHTML = originalText;
            regSubmitBtn.disabled = false;
        }
    });

    // Helper to show toasts
    function showToast(message, isError = false) {
        const toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) return;
        
        const id = 'toast-' + Date.now();
        const toastHtml = `
            <div id="${id}" class="toast align-items-center text-white bg-${isError ? 'danger' : 'success'} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;
        toastContainer.insertAdjacentHTML('beforeend', toastHtml);
        const toastEl = document.getElementById(id);
        const toast = new bootstrap.Toast(toastEl, { autohide: true, delay: 3000 });
        toast.show();
        
        toastEl.addEventListener('hidden.bs.toast', () => {
            toastEl.remove();
        });
    }
});
