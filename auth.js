// Tab switching
document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs and forms
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding form
        tab.classList.add('active');
        document.getElementById(`${tab.dataset.tab}Form`).classList.add('active');
    });
});

// Form validation
function showError(input, message) {
    const formGroup = input.parentElement;
    const errorDiv = formGroup.querySelector('.error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    input.style.borderColor = '#e74c3c';
}

function clearError(input) {
    const formGroup = input.parentElement;
    const errorDiv = formGroup.querySelector('.error-message');
    errorDiv.style.display = 'none';
    input.style.borderColor = '#ddd';
}

// Registration form handling
const registerForm = document.getElementById('registerForm');
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('registerName');
    const email = document.getElementById('registerEmail');
    const phone = document.getElementById('registerPhone');
    const password = document.getElementById('registerPassword');
    const confirmPassword = document.getElementById('registerConfirmPassword');
    const role = document.getElementById('registerRole');
    
    // Clear previous errors
    [name, email, phone, password, confirmPassword, role].forEach(clearError);
    
    // Validation
    let isValid = true;
    
    if (password.value !== confirmPassword.value) {
        showError(confirmPassword, 'Passwords do not match');
        isValid = false;
    }
    
    if (password.value.length < 6) {
        showError(password, 'Password must be at least 6 characters long');
        isValid = false;
    }
    
    if (!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!phone.value.match(/^[0-9]{10}$/)) {
        showError(phone, 'Please enter a valid 10-digit phone number');
        isValid = false;
    }
    if (!role.value) {
        showError(role, 'Please select a role');
        isValid = false;
    }
    
    if (isValid) {
        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const pendingAdmins = JSON.parse(localStorage.getItem('pendingAdmins') || '[]');
            // Check if registering as admin
            if (role.value === 'admin') {
                // Check if an administrator exists
                const hasAdministrator = users.some(u => u.role === 'administrator');
                if (!hasAdministrator) {
                    // First admin becomes administrator
                    const userData = {
                        name: name.value,
                        email: email.value,
                        phone: phone.value,
                        password: password.value,
                        role: 'administrator'
                    };
                    users.push(userData);
                    localStorage.setItem('users', JSON.stringify(users));
                    alert('Registration successful! You are the administrator. Please login.');
                    document.querySelector('[data-tab="login"]').click();
                } else {
                    // Store as pending admin
                    const pendingData = {
                        name: name.value,
                        email: email.value,
                        phone: phone.value,
                        password: password.value,
                        role: 'admin',
                        requestedAt: new Date().toISOString()
                    };
                    pendingAdmins.push(pendingData);
                    localStorage.setItem('pendingAdmins', JSON.stringify(pendingAdmins));
                    alert('Your admin registration request has been sent for approval by the administrator.');
                    document.querySelector('[data-tab="login"]').click();
                }
            } else {
                // Register client as usual
                const userData = {
                    name: name.value,
                    email: email.value,
                    phone: phone.value,
                    password: password.value,
                    role: 'client'
                };
                users.push(userData);
                localStorage.setItem('users', JSON.stringify(users));
                alert('Registration successful! Please login.');
                document.querySelector('[data-tab="login"]').click();
            }
        } catch (error) {
            alert('Registration failed. Please try again.');
        }
    }
});

// CAPTCHA logic
function generateCaptcha() {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    document.getElementById('captchaQuestion').textContent = `What is ${a} + ${b}?`;
    document.getElementById('loginCaptcha').dataset.answer = (a + b).toString();
}
if (document.getElementById('captchaQuestion')) generateCaptcha();

// Login form handling
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail');
    const password = document.getElementById('loginPassword');
    const captcha = document.getElementById('loginCaptcha');
    const captchaAnswer = captcha.dataset.answer;
    
    // Clear previous errors
    [email, password, captcha].forEach(clearError);
    
    // Check CAPTCHA
    if (captcha.value.trim() !== captchaAnswer) {
        showError(captcha, 'Incorrect answer to CAPTCHA.');
        generateCaptcha();
        return;
    }
    
    try {
        // For demo purposes, we'll check against localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email.value && u.password === password.value);
        
        if (user) {
            // Store logged in user (including role)
            localStorage.setItem('currentUser', JSON.stringify(user));
            // If permanent admin, redirect to dashboard (quotation making window)
            if (user.email === 'aagam@tts.com') {
                window.location.href = 'dashboard.html';
            } else {
                window.location.href = 'dashboard.html';
            }
        } else {
            showError(email, 'Invalid email or password');
            showError(password, 'Invalid email or password');
            generateCaptcha();
        }
    } catch (error) {
        alert('Login failed. Please try again.');
        generateCaptcha();
    }
}); 